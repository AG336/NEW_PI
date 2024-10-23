
# System Imports
import sys
from mysql.connector import errorcode

# Local Imports
import laserServer_config as Config

# ===============================================================================
# Database interactions =========================================================
# ===============================================================================

def connect():
    try:
        db = Config.db
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            sys.exit("ERROR: Something is wrong with your user name or password")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            sys.exit("ERROR: Database does not exist")
        else:
            sys.exit(err)                        
    return db

def rescue_current(parameter, default):
    db = Config.db
    try:
        cursor = db.cursor()
    except:
        print("ERROR: Not possible to obtaining DB cursor, returning default current value for \"%s=%s\"" % (parameter, default))
        return default
    query = "SELECT `value` FROM `current` WHERE `name` = '%s';" % parameter
    cursor.execute(query)
    result = cursor.fetchone()
    cursor.close()
    if (result != None):
        return result[0]
    return default
