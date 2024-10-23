
# System Imports
import sys
from threading import Event
from threading import Thread

# Local Imports
import laserServer_devices_laser as laser
import laserServer_devices_atten as atten
import laserServer_devices_gener as gener

# ===============================================================================
# Devices functions =============================================================
# ===============================================================================

def initialize():
    device = {}
    try:
        device["laser"] = laser.start()
        device["atten"] = atten.start()
        device["gener"] = gener.start()
    except:
        return None
    return device

def create_events():
    events = {}
    try:
        events["laser"] = Event()
        events["atten"] = Event()
        events["gener"] = Event()
        events["laser_end"] = Event()
        events["gener_end"] = Event()
        events["atten_end"] = Event()
    except:
        return None
    return events

def create_queues():
    queue = {}
    try:
        queue["laser"] = []
        queue["atten"] = []
        queue["gener"] = []
    except:
        return None
    return queue

def create_threads(devices, queue, triggers, db):
    threads = {}
    while True:
        try:
            threads["laser"] = Thread(target=laser.queue_handler, args=(devices["laser"], queue["laser"], triggers["laser"], triggers["laser_end"], db))
        except:
            print("ERROR: Not possible to start the Laser device thread. Error: " + str(sys.exc_info()))
            break
        try:
            threads["atten"] = Thread(target=atten.queue_handler, args=(devices["atten"], queue["atten"], triggers["atten"], triggers["atten_end"], db))
        except:
            print("ERROR: Not possible to start the Attenuator device thread. Error: " + str(sys.exc_info()))
            break
        try:
            threads["gener"] = Thread(target=gener.queue_handler, args=(devices["gener"], queue["gener"], triggers["gener"], triggers["gener_end"], db))
        except:
            print("ERROR: Not possible to startthe Generator device thread. Error: " + str(sys.exc_info()))
            break
        return threads
    # Cleaning up on error
    triggers["laser_end"].set()
    triggers["gener_end"].set()
    triggers["atten_end"].set()
    triggers["laser"].set()
    triggers["atten"].set()
    triggers["gener"].set()
    return None

def threads_start(devices):
    try:
        devices["laser"].start()
        devices["atten"].start()
        devices["gener"].start()
    except:
        print("ERROR: Not possible to start the devices threads")
        return None
    return True

def terminate_threads(events):
    if (events != None):
        try:
            events["laser_end"].set()
            events["gener_end"].set()
            events["atten_end"].set()
            events["laser"].set()
            events["atten"].set()
            events["gener"].set()
        except:
            print("ERROR: Not possible to set termination events for threads")

def threads_end_check(threads):
    if (threads != None):
        for name, thread in threads.items():
            thread.join(None)
            if thread.isAlive():
                print("ERROR: Device thread \"%s\" alive!" % name)

def close_communication(devices):
    if (devices != None):
        try:
            devices["laser"].close()
        except:
            print("ERROR: Not possible to close Laser serial commmunication")
        try:
            devices["atten"].close()
        except:
            print("ERROR: Not possible to close Attenuator communication")
