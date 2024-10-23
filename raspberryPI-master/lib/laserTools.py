
# System Imports
import sys

# ===============================================================================
# Verbosing management ==========================================================
# ===============================================================================

verbosity = 0

def verbose(message, terminator="\n", level=1):
    if (level > verbosity):
        print(message, end = terminator)
        sys.stdout.flush()
