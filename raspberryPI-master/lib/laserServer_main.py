
# System Imports
import os
import sys
import socket
import signal
from threading import Event
from threading import Thread

# Local Imports
import laserTools          as Tools
import laserServer_message as Message
import laserServer_devices as Devices

# ===============================================================================
# Socket management =============================================================
# ===============================================================================

def create_socket():
    # Socket parameters
    host = '127.0.0.1'
    port = 64845
    # Socket creation
    soc = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    soc.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    # Bind Socket
    try:
        soc.bind((host, port))
    except:
        print("ERROR: Bind failed. Error: " + str(sys.exc_info()))
        return None
    # Return Socket
    return soc

def terminate_socket(soc):
    if (soc != None):
        soc.shutdown(socket.SHUT_RDWR)
        soc.close()

# ===============================================================================
# Server management =============================================================
# ===============================================================================

def server_management(events):
    events["server_management"].wait()
    return True

def add_management_event(events):
    try:
        events["server_management"] = Event()
        return events
    except:
        return None

# ===============================================================================
# Client management =============================================================
# ===============================================================================

def client_management(soc, events, queue):
    # Start listening
    soc.listen(5)
    # Start client loop thread for listening
    try:
        thread = Thread(target=client_listening_loop, args=(soc, events, queue))
        thread.start()
    except:
        sys.exit("ERROR: Not possible to create the client thread loop: " + str(sys.exc_info()))
    return thread

def client_listening_loop(soc, events, queue):
    while True:
        # New message arrives
        try:
            connection, address = soc.accept()
        except:
            return
        # Printing socket receiving message
        Tools.verbose("Reading from socket number:\n" + str(address[1]))
        # Processing result
        receive_input(connection, events, queue)
        connection.close()

def receive_input(connection, events, queue, max_buffer_size = 4096):
    # Receiving and validating reception
    client_input = connection.recv(max_buffer_size)
    # Process message
    message = Message.process(client_input.decode("utf8").rstrip(), events, queue)
    connection.sendall(message.encode("utf8"))

def thread_end_check(thread):
    if (thread != None):
        thread.join(None)
        if thread.isAlive():
            print("ERROR: Management thread alive!")

# ===============================================================================
# Signal handler ================================================================
# ===============================================================================

def signal_handler(soc, events, devices_threads, devices, client_management, success, signal_number, frame):
    print("Signal \"" + signal.Signals(signal_number).name + "\" received, terminating")
    terminate(soc, events, devices_threads, devices, client_management, True)
    sys.exit()

# ===============================================================================
# Termination procedure =========================================================
# ===============================================================================

def terminate(soc, events, devices_threads, devices, client_management, success):
    # Closing socket
    terminate_socket(soc)
    # Cleaning threads
    Devices.terminate_threads(events)
    # Checking devices threads termination
    Devices.threads_end_check(devices_threads)
    # Checking management thread for termination
    thread_end_check(client_management)
    # Closing devices
    Devices.close_communication(devices)
    # Print final message
    if (success):
        print("Good Bye!")
    else:
        print("ERROR: Unexpected termination")
