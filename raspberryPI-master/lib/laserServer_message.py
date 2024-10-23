
# System Imports
import re
import os
import sys
import math
from threading import Event

# Local Imports
import laserServer_main   as Main
import laserServer_config as Config
import laserTools         as Tools

# ===============================================================================
# Client message processing =====================================================
# ===============================================================================

def process(input_str, events, queue):
    Tools.verbose("Requested from client:\n" + input_str.rstrip())
    device = input_str[:3]
    tosend = input_str[4:]
    lock = Event()
    if (device == "LAS") :
        # Send to Laser
        queue["laser"].append({"tosend": tosend, "toreturn": lock})
        events["laser"].set()
        response = "OK - Laser command completed"
    elif (device == "ATT"):
        # Send to attenuator
        queue["atten"].append({"tosend": tosend, "toreturn": lock})
        events["atten"].set()
        response = "OK - Attenuator command completed"
    elif (device == "GEN"):
        # Send to generator
        queue["gener"].append({"tosend": tosend, "toreturn": lock})
        events["gener"].set()
        response = "OK - Generator command completed"
    elif (device == "STA"):
        response = process_internal(tosend, events)
        lock.set()
    else:
        response = "KO - Command NOT Queued. Device \"" + device + "\" NOT recognized"
    lock.wait()
    Tools.verbose(response, level=1)
    sys.stdout.flush()
    return response

def process_internal(command, events):
    # Connecting Database
    try:
        cursor = Config.db.cursor()
    except:
        print("ERROR: Not possible to obtain DB cursor. " + str(sys.exc_info()))
        return
    # Storing command
    query_run(cursor, [query_command("STA " + command)])
    # Processing message
    response = "KO - Internal command not recognized"
    if (command == ""):
        # Get server status
        response = ("OK - laserServer is alive! (PID %d)" % os.getpid())
    elif (command == "EXIT"):
        # Terminate threads
        events["server_management"].set()
        response = "exit"
    else:
        while (True):
            # Processing commands
            m = re.match("^OPE ([0-9])", command)
            if (m):
                # Get current ope
                ope_current = int(query_run(cursor, [querry_operational()])[0][0])
                # Parse requested ope
                ope_request = int(m.group(1))
                # Advancing ope
                if (ope_request == ope_current):
                    response = "OK - Keeping operational state %d" % ope_request
                elif (ope_request - 1 == ope_current):
                    query_run(cursor, [query_current("STA_OPERATIONAL",  "%d" % ope_request)])
                    response = "OK - New operational state %d" % ope_request
                elif (ope_request == 0):
                    query_run(cursor, [query_current("STA_OPERATIONAL",  "0")])
                    response = "OK - Operational reset to 0"
                else:
                    query_run(cursor, [query_current("STA_OPERATIONAL",  "0")])
                    response = "KO - Invalid or unexpected operational state"
                break
            break
    Config.db.commit()
    cursor.close()
    return response

# ===============================================================================
# Command response parsing ======================================================
# ===============================================================================

def parse(command, response, db):
    Tools.verbose("Parsing result")
    Tools.verbose("Command:\n" + repr(command), level=2)
    Tools.verbose("Response:\n" + repr(response), level=2)
    # Initilizing variables
    try:
        cursor = db.cursor()
    except:
        print("ERROR: Not possible to obtain DB cursor. " + str(sys.exc_info()))
        return None
    queries = []
    # Storing command
    queries.append(query_command(command))
    # matching regular expressions
    response_match = True
    while True:
        # For empty response
        if (response == ""):
            m = re.match("^GEN C.:BSWV ", command)
            if (m):
                break
            m = re.match("^GEN C.:OUTP ", command)
            if (m):
                break
        # Processing responses
        m = re.match("^GEMT ([0-9]{5}) ([0-9]{2}) ([0-9]{5}) ([0-9]{2})", response)
        if (m):
            # Current
            queries.append(query_current("LAS_GEMT_SUPPLY",  "%d:%d" % (int(m.group(1)), int(m.group(2)))))
            queries.append(query_current("LAS_GEMT_EMITING", "%d:%d" % (int(m.group(3)), int(m.group(4)))))
            # History
            queries.append(query_history("LAS_GEMT_SUPPLY",  "%d:%d" % (int(m.group(1)), int(m.group(2)))))
            queries.append(query_history("LAS_GEMT_EMITING", "%d:%d" % (int(m.group(3)), int(m.group(4)))))
            break
        m = re.match("^GMTE ([0-9]{4}) ([0-9]{4}) ([0-9]{2}) ([0-9]{2})", response)
        if (m):
            # Current
            queries.append(query_current("LAS_GMTE_DIODE",          "%.2f" % (float(m.group(1))/100)))
            queries.append(query_current("LAS_GMTE_CRYSTAL",        "%.2f" % (float(m.group(2))/100)))
            queries.append(query_current("LAS_GMTE_ELECTRONICSINK", "%.2f" % float(m.group(3))))
            queries.append(query_current("LAS_GMTE_HEATSINK",       "%.2f" % float(m.group(4))))
            # temperatures
            queries.append(query_temperature(m.group(1), m.group(2), m.group(3), m.group(4)))
            break
        m = re.match("^GTCO ([0-9])", response)
        if (m):
            # Current
            queries.append(query_current("LAS_TEC1" , ("ON" if int(m.group(1))&0x1 else "OFF")))
            queries.append(query_current("LAS_TEC2" , ("ON" if int(m.group(1))&0x2 else "OFF")))
            # History
            queries.append(query_history("LAS_GTCO_TEC1" , ("ON" if int(m.group(1))&0x1 else "OFF")))
            queries.append(query_history("LAS_GTCO_TEC2" , ("ON" if int(m.group(1))&0x2 else "OFF")))
            break
        m = re.match("^GSER ([A-F0-9]{2}) ([A-F0-9]{2}) ([A-F0-9]{2}) ([A-F0-9]{2}) ([A-F0-9]{2}) ([A-F0-9]{2})", response)
        if (m):
            # Current
            queries.append(query_current("LAS_GSER_ERROR1", "%d" % int(m.group(1), 16)))
            queries.append(query_current("LAS_GSER_ERROR2", "%d" % int(m.group(2), 16)))
            queries.append(query_current("LAS_GSER_ERROR3", "%d" % int(m.group(3), 16)))
            queries.append(query_current("LAS_GSER_INFO1",  "%d" % int(m.group(4), 16)))
            queries.append(query_current("LAS_GSER_INFO2",  "%d" % int(m.group(5), 16)))
            queries.append(query_current("LAS_GSER_INFO3",  "%d" % int(m.group(6), 16)))
            # History
            queries.append(query_history("LAS_GSER_ERROR1", "%d" % int(m.group(1), 16)))
            queries.append(query_history("LAS_GSER_ERROR2", "%d" % int(m.group(2), 16)))
            queries.append(query_history("LAS_GSER_ERROR3", "%d" % int(m.group(3), 16)))
            queries.append(query_history("LAS_GSER_INFO1",  "%d" % int(m.group(4), 16)))
            queries.append(query_history("LAS_GSER_INFO2",  "%d" % int(m.group(5), 16)))
            queries.append(query_history("LAS_GSER_INFO3",  "%d" % int(m.group(6), 16)))
            break
        m = re.match("^GSSD ([0-1])", response)
        if (m):
            # Current
            queries.append(query_current("LAS_D", ("ON" if int(m.group(1))&0x1 else "OFF")))
            # History
            queries.append(query_history("LAS_GSSD", ("ON" if int(m.group(1))&0x1 else "OFF")))
            break
        m = re.match("^SSSD ([0-1])", response)
        if (m):
            # Current
            queries.append(query_current("LAS_D", ("ON" if int(m.group(1))&0x1 else "OFF")))
            # History
            queries.append(query_history("LAS_SSSD", ("ON" if int(m.group(1))&0x1 else "OFF")))
            break
        m = re.match("^[dD]Pos:([0-9]+)\r\nATTEN:([0-9]+\.[0-9]+)", response)
        if (m):
            # Current
            queries.append(query_current("ATT_POS"     , m.group(1)))
            queries.append(query_current("ATT_DB"      , m.group(2)))
            queries.append(query_current("ATT_PERCENT" , round(math.exp(-float(m.group(2))/4.3425121307373)*100,4)))
            # History
            queries.append(query_history("ATT_POS" , m.group(1)))
            queries.append(query_history("ATT_DB"  , m.group(2)))
            queries.append(query_history("ATT_PERCENT", round(math.exp(-float(m.group(2))/4.3425121307373)*100,4)))
            break
        m = re.match("^[aA]([0-9]+(\.[0-9]+)?)\r\nPos:([0-9]+)", response)
        if (m):
            # Current
            queries.append(query_current("ATT_DB"     , m.group(1)))
            queries.append(query_current("ATT_POS"    , m.group(3)))
            queries.append(query_current("ATT_PERCENT", round(math.exp(-float(m.group(1))/4.3425121307373)*100,4)))
            queries.append(query_current("ATT_LAST"   , 'DB'))
            # History
            queries.append(query_history("ATT_DB"     , m.group(1)))
            queries.append(query_history("ATT_POS"    , m.group(3)))
            queries.append(query_history("ATT_PERCENT", round(math.exp(-float(m.group(1))/4.3425121307373)*100,4)))
            break
        m = re.match("^[sS]([0-9]+)\r\nPos:([0-9]+)", response)
        if (m):
            # Current
            queries.append(query_current("ATT_POS"    , m.group(2)))
            queries.append(query_current("ATT_POS"    , ""))
            queries.append(query_current("ATT_PERCENT", ""))
            queries.append(query_current("ATT_LAST"   , 'STEP'))
            # History
            queries.append(query_history("ATT_POS"    , m.group(2)))
            queries.append(query_history("ATT_POS"    , ""))
            queries.append(query_history("ATT_PERCENT", ""))
            
            break
        m = re.match("^C([12]):OUTP (ON|OFF),LOAD,(HZ|[0-9]+),PLRT,(NOR|INVT)", response)
        if (m):
            # Current
            queries.append(query_current("GE%d_OUT"  % int(m.group(1)), m.group(2)))
            queries.append(query_current("GE%d_LOAD" % int(m.group(1)), m.group(3)))
            queries.append(query_current("GE%d_PLRT" % int(m.group(1)), m.group(4)))
            # History
            queries.append(query_history("GE%d_OUT"  % int(m.group(1)), m.group(2)))
            queries.append(query_history("GE%d_LOAD" % int(m.group(1)), m.group(3)))
            queries.append(query_history("GE%d_PLRT" % int(m.group(1)), m.group(4)))
            break
        m = re.match("^C([12]):BSWV WVTP,([^\W\d]+),FRQ,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)HZ,PERI,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)S,AMP,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)V,AMPVRMS,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)Vrms,OFST,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)V,HLEV,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)V,LLEV,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)V,DUTY,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?),WIDTH,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?),RISE,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)S,FALL,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)S,DLY,((-)?[0-9]+(\.[0-9]+)?(e(-)?[0-9]+)?)", response)
        if (m):
            # Current
            queries.append(query_current("GE%d_WVTP"      % int(m.group(1)), m.group(2)))
            queries.append(query_current("GE%d_FRQ"       % int(m.group(1)), m.group(3)))
            queries.append(query_current("GE%d_PERI"      % int(m.group(1)), m.group(8)))
            queries.append(query_current("GE%d_AMP"       % int(m.group(1)), m.group(13)))
            queries.append(query_current("GE%d_AMPVRMS"   % int(m.group(1)), m.group(18)))
            queries.append(query_current("GE%d_OFST"      % int(m.group(1)), m.group(23)))
            queries.append(query_current("GE%d_HLEV"      % int(m.group(1)), m.group(28)))
            queries.append(query_current("GE%d_LLEV"      % int(m.group(1)), m.group(33)))
            queries.append(query_current("GE%d_DUTY"      % int(m.group(1)), m.group(38)))
            queries.append(query_current("GE%d_WIDTH"     % int(m.group(1)), m.group(43)))
            queries.append(query_current("GE%d_RISE"      % int(m.group(1)), m.group(48)))
            queries.append(query_current("GE%d_FALL"      % int(m.group(1)), m.group(53)))
            queries.append(query_current("GE%d_DLY"       % int(m.group(1)), m.group(58)))
            # History
            queries.append(query_history("GE%d_WVTP"    % int(m.group(1)), m.group(2)))
            queries.append(query_history("GE%d_FRQ"     % int(m.group(1)), m.group(3)))
            queries.append(query_history("GE%d_PERI"    % int(m.group(1)), m.group(8)))
            queries.append(query_history("GE%d_AMP"     % int(m.group(1)), m.group(13)))
            queries.append(query_history("GE%d_AMPVRMS" % int(m.group(1)), m.group(18)))
            queries.append(query_history("GE%d_OFST"    % int(m.group(1)), m.group(23)))
            queries.append(query_history("GE%d_HLEV"    % int(m.group(1)), m.group(28)))
            queries.append(query_history("GE%d_LLEV"    % int(m.group(1)), m.group(33)))
            queries.append(query_history("GE%d_DUTY"    % int(m.group(1)), m.group(38)))
            queries.append(query_history("GE%d_WIDTH"   % int(m.group(1)), m.group(43)))
            queries.append(query_history("GE%d_RISE"    % int(m.group(1)), m.group(48)))
            queries.append(query_history("GE%d_FALL"    % int(m.group(1)), m.group(53)))
            queries.append(query_history("GE%d_DLY"     % int(m.group(1)), m.group(58)))
            break
        response_match = False
        break
    # Reporting not recoginized response
    if (not response_match):
        print("ERROR: Command \"" + command + "\" not recognized")
    # Excuting queries
    query_run(cursor, queries)
    # Clossing db cursor
    db.commit()
    cursor.close()
    Tools.verbose("Parsing finished")
    return True

def query_run(cursor, queries):
    toreturn = []
    Tools.verbose("Running queries:", level=2)
    for query in queries:
        Tools.verbose(query, level=2)
        cursor.execute(query)
        while (True):
            result = cursor.fetchone()
            if (result == None):
                break
            toreturn.append(result)
    return toreturn

def query_current(name, value):
    return ('INSERT INTO `current` (`timestamp`, `name`, `value`) VALUES (CURRENT_TIMESTAMP, \'%s\', \'%s\') ON DUPLICATE KEY UPDATE value = \'%s\', timestamp = CURRENT_TIMESTAMP;' % (name, value, value))

def query_history(name, value):
    return ('INSERT INTO `history` (`id`, `timestamp`, `name`, `value`) VALUES (NULL, CURRENT_TIMESTAMP, \'%s\', \'%s\');' % (name, value))

def query_temperature(diode, crystal, electronicsink, heatsink):
    return ('INSERT INTO `temperatures` (`id`, `timestamp`, `diode`, `crystal`, `electronicsink`, `heatsink`) VALUES (NULL, CURRENT_TIMESTAMP, \'%f\', \'%f\', \'%f\', \'%f\');' % (float(diode)/100, float(crystal)/100, float(electronicsink), float(heatsink)))

def querry_operational():
    return "SELECT `value` FROM `current` WHERE `name` = 'STA_OPERATIONAL';"

def query_command(command):
    return ('INSERT INTO `commands` (`id`, `timestamp`, `command`) VALUES (NULL, CURRENT_TIMESTAMP, \'%s\');' % command)
