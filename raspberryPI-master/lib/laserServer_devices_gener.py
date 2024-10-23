
# System Imports
import sys
import vxi11
import time

# Local Imports
import laserTools as Tools
import laserServer_message as Message

# ===============================================================================

# Generator functions ===========================================================

def start():
    return vxi11.Instrument("192.168.42.11")

def queue_handler(device, queue, trigger, end, db, timeout=0.5):
    trigger.wait()
    while not end.is_set():
        while len(queue) > 0:
            command = queue[0]["tosend"]
            Tools.verbose(f"Sending command: {command}", level=1)

            start_time = time.time()
            try:
                # Send the command without waiting for a response
                device.write(command)

                # Wait for a response with a timeout
                response = run_command_with_timeout(device, command, timeout)

                if response is not None:
                    Tools.verbose("Device response:\n" + response, level=1)
                    parse_result = Message.parse(command, response, db)
                else:
                    Tools.verbose(f"No response for command '{command}', moving on...", level=1)

            except Exception as e:
                Tools.verbose(f"Error sending command '{command}': {e}", level=1)

            # Signal that the command has been processed
            queue[0]["toreturn"].set()
            queue.pop(0)

        trigger.clear()
        trigger.wait()

def run_command_with_timeout(device, command, timeout):
    start_time = time.time()
    while True:
        try:
            # Try to read the response
            response = device.ask(command)
            return response  # Return the response if received
        except Exception as e:
            if time.time() - start_time > timeout:
                Tools.verbose(f"Timeout while waiting for response for command '{command}'", level=1)
                return None  # Return None if timeout occurs
            # Log the error but continue waiting
            Tools.verbose(f"Error reading response for command '{command}': {e}", level=1)

