# all functions that read and write to the MySQL database. Containing SQL queries. The app.py file will call these functions to interact with the database. 
import mysql.connector
import config as cfg
 
class GameDAO:
    connection = ""
    cursor = ""
    host =      ""
    user =      ""
    password =  ""
    database =  ""
 
    def __init__(self):
        self.host =     cfg.mysql["host"]
        self.user =     cfg.mysql["user"]
        self.password = cfg.mysql["password"]
        self.database = cfg.mysql["database"]
 
    def getcursor(self):
        self.connection = mysql.connector.connect(
            host =      self.host,
            user =      self.user,
            password =  self.password,
            database =  self.database,
        )
        self.cursor = self.connection.cursor()
        return self.cursor
 
    def closeAll(self):
        self.connection.close()
        self.cursor.close()
        
    #
    # Operations for the games table
    #    