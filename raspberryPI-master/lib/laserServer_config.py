
# System Imports
import mysql.connector

# ===============================================================================
# Configuration parameters ======================================================
# ===============================================================================

db = mysql.connector.connect(user = 'phpmyadmin',
                             password = 'pi',
                             host = 'localhost',
                             database = 'henlablaser')
