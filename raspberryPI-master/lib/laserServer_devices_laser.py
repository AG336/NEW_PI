
# System Imports
import sys
import serial

# Local Imports
import laserTools          as Tools
import laserServer_message as Message

# ===============================================================================
# Laser functions ===============================================================
# ===============================================================================

def start():
    ser          = serial.Serial()
    ser.port     = "/dev/serial/by-path/platform-3f980000.usb-usb-0:1.4:1.0-port0"
    ser.baudrate = 19200
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
            parse_result = Message.parse("LAS " + command, response, db)
            queue[0]["toreturn"].set()
            queue.pop(0)
        trigger.clear()
        trigger.wait()

def run_command(device, command):
    device.write(str.encode(command + "\r"))
    response = device.read(1024)
    response = response.decode("utf-8").split('\n', 1)[0]
    return response
