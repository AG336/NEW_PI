
# System Imports
import re
import sys
import time
import serial

# Local Imports
import laserServer_database as Db
import laserTools           as Tools
import laserServer_message  as Message

# ===============================================================================
# Attenuator functions ==========================================================
# ===============================================================================

def start():
    ser          = serial.Serial()
    ser.port     = "/dev/serial/by-path/platform-3f980000.usb-usb-0:1.5:1.0-port0"
    ser.baudrate = 9600
    ser.bytesize = serial.EIGHTBITS
    ser.parity   = serial.PARITY_NONE
    ser.stopbits = serial.STOPBITS_ONE
    ser.timeout  = 0.1
    ser.rtscts   = False
    ser.dsrdtr   = False
    ser.open()
    return ser

def queue_handler(device, queue, trigger, end, db):
    trigger.wait()
    while not end.is_set():
        while (len(queue)>0):
            command = queue[0]["tosend"]
            response = run_command(device, command)
            Tools.verbose("Device response:\n" + response, level=1)
            parse_result = Message.parse("ATT " + command, response, db)
            queue[0]["toreturn"].set()
            queue.pop(0)
        trigger.clear()
        trigger.wait()

def run_command(device, command):
    response = device.read(1024) # Clean buffer
    device.write(str.encode(command + "\r"))
    movement_pause(command) # Sleep pause for attenuator movement Lothar: Pending delay for steps
    response = device.read(1024)
    response = response.decode("utf-8")
    return response

def movement_pause(command):
    match = re.match("^[aA]([0-9]+(\.[0-9]+)?)", command)
    if (match):
        current = float(Db.rescue_current("ATT_DB", "0"))
        to_sleep = abs(float(match.group(1))-current)/10
        time.sleep(to_sleep)
    time.sleep(0.25)
