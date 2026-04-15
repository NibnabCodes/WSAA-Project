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
# Games Table CRUD Operations
#
    
    def getAllGames(self):
        cursor = self.getcursor()
        sql = "SELECT * FROM games"
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            returnArray.append(self.convertToGameDictionary(result))
        self.closeAll()
        return returnArray
 
    def getGameByID(self, id):
        cursor = self.getcursor()
        sql = "SELECT * FROM games WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        result = cursor.fetchone()
        returnvalue = self.convertToGameDictionary(result)
        self.closeAll()
        return returnvalue
 
    def createGame(self, game):
        cursor = self.getcursor()
        sql = "INSERT INTO games (rawg_id, title, genre, image_url, release_date) VALUES (%s, %s, %s, %s, %s)"
        values = (
            game.get("rawg_id"),
            game.get("title"),
            game.get("genre"),
            game.get("image_url"),
            game.get("release_date")
        )
        cursor.execute(sql, values)
        self.connection.commit()
        newid = cursor.lastrowid
        game["id"] = newid
        self.closeAll()
        return game
 
    def updateGame(self, id, game):
        cursor = self.getcursor()
        sql = "UPDATE games SET title=%s, genre=%s, image_url=%s, release_date=%s WHERE id = %s"
        values = (
            game.get("title"),
            game.get("genre"),
            game.get("image_url"),
            game.get("release_date"),
            id
        )
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
 
    def deleteGame(self, id):
        cursor = self.getcursor()
        sql = "DELETE FROM games WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        print("Game deleted")
 
    def convertToGameDictionary(self, resultLine):
        attkeys = ["id", "rawg_id", "title", "genre", "image_url", "release_date"]
        game = {}
        currentkey = 0
        for attrib in resultLine:
            game[attkeys[currentkey]] = attrib
            currentkey = currentkey + 1
        return game
    
gameDAO = GameDAO()