#!/usr/bin/python3

# System Imports
import signal
from functools import partial

# Local Imports
import laserServer_main     as Main
import laserServer_devices  as Devices
import laserServer_database as Database

success = False

while True:
    # ===========================================================================
    # Setting up database communication =========================================
    # ===========================================================================

    db = Database.connect()

    # ===========================================================================
    # Setting up devices ========================================================
    # ===========================================================================

    # Initializing variables
    devices = None
    events = None
    queues = None
    devices_threads = None
    soc = None
    client_management = None
    # Initialize devices communication
    devices = Devices.initialize()
    if (devices == None):
        break
    # Creating thread communication events
    events = Devices.create_events()
    if (events == None):
        break
    # Creating event for controlling management exit
    events = Main.add_management_event(events)
    if (events == None):
        break
    # Create device queues
    queues = Devices.create_queues()
    if (events == None):
        break
    # Creating device queues handling threads
    devices_threads = Devices.create_threads(devices, 
                                             queues, 
                                             events, 
                                             db)
    if (devices_threads == None):
        break
    # Devices threads start
    status = Devices.threads_start(devices_threads)
    if (status == None):
        break

    # ===========================================================================
    # Setting up server communication ===========================================
    # ===========================================================================
    soc = Main.create_socket()
    if (soc == None):
        break

    # ===========================================================================
    # Setting up client management ==============================================
    # ===========================================================================
    client_management = Main.client_management(soc,
                                               events,
                                               queues)

    # ===========================================================================
    # Setting signal catching ===================================================
    # ===========================================================================
    signal.signal(signal.SIGTERM, partial(Main.signal_handler,
                                          soc,
                                          events,
                                          devices_threads,
                                          devices,
                                          client_management,
                                          success))

    # ===========================================================================
    # Setting up server management ==============================================
    # ===========================================================================
    success = Main.server_management(events)
    break

# ===============================================================================
# Termination procedure =========================================================
# ===============================================================================
Main.terminate(soc,
               events,
               devices_threads, 
               devices,
               client_management,
               success)
