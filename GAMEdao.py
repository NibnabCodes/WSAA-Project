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
    
# Get all games
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
    
# Get game by ID
    def getGameByID(self, id):
        cursor = self.getcursor()
        sql = "SELECT * FROM games WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        result = cursor.fetchone()
        returnvalue = self.convertToGameDictionary(result)
        self.closeAll()
        return returnvalue
    
# Create game
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
 
 # Update game
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
 
 # Delete game
    def deleteGame(self, id):
        cursor = self.getcursor()
        sql = "DELETE FROM games WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        print("Game deleted")
 
 # Convert SQL result to dictionary
    def convertToGameDictionary(self, resultLine):
        attkeys = ["id", "rawg_id", "title", "genre", "image_url", "release_date"]
        game = {}
        currentkey = 0
        for attrib in resultLine:
            game[attkeys[currentkey]] = attrib
            currentkey = currentkey + 1
        return game
    
#
# Reviews Table CRUD Operations
#

# Get all reviews
    def getAllReviews(self):
        cursor = self.getcursor()
        sql = "SELECT * FROM reviews"
        cursor.execute(sql)
        results = cursor.fetchall()

        returnArray = []
        for result in results:
            returnArray.append(self.convertToReviewDictionary(result))
        self.closeAll()
        return returnArray

# Get reviews by game ID
    def getReviewsByGameID(self, game_id):
        cursor = self.getcursor()
        sql = "SELECT * FROM reviews WHERE game_id = %s"
        values = (game_id,)
        cursor.execute(sql, values)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            returnArray.append(self.convertToReviewDictionary(result)) # Returns a list of dictionaries, each representing a review for the given game_id
        self.closeAll()
        return returnArray
    
# Create review
    def createReview(self, review):
        cursor = self.getcursor()
        sql = "INSERT INTO reviews (game_id, recommended, comment, date_added) VALUES (%s, %s, %s, %s)"
        values = (
            review.get("game_id"),
            review.get("recommended"),
            review.get("comment"),
            review.get("date_added")
        )
        cursor.execute(sql, values)
        self.connection.commit()
        newid = cursor.lastrowid
        review["id"] = newid
        self.closeAll()
        return review

# Update review
    def updateReview(self, id, review):
        cursor = self.getcursor()
        sql = "UPDATE reviews SET recommended=%s, comment=%s WHERE id = %s"
        values = (
            review.get("recommended"),
            review.get("comment"),
            id
        )
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        
# Delete review
    def deleteReview(self, id):
        cursor = self.getcursor()
        sql = "DELETE FROM reviews WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        print("Review deleted")
 
# Convert SQL result to dictionary
    def convertToReviewDictionary(self, resultLine):
        attkeys = ["id", "game_id", "recommended", "comment", "date_added"]
        review = {}
        currentkey = 0
        for attrib in resultLine:
            review[attkeys[currentkey]] = attrib
            currentkey = currentkey + 1
        return review
    
#
# Wishlist Table CRUD Operations
#

# Get all wishlist entries
    def getAllWishlist(self):
        cursor = self.getcursor()
        sql = "SELECT * FROM wishlist"
        cursor.execute(sql)
        results = cursor.fetchall()
        returnArray = []
        for result in results:
            returnArray.append(self.convertToWishlistDictionary(result))
        self.closeAll()
        return returnArray

# Create wishlist entry
    def createWishlist(self, wishlist):
        cursor = self.getcursor()
        sql = "INSERT INTO wishlist (game_id, priority, notes, date_added) VALUES (%s, %s, %s, %s)"
        values = (
            wishlist.get("game_id"),
            wishlist.get("priority"),
            wishlist.get("notes"),
            wishlist.get("date_added")
        )
        cursor.execute(sql, values)
        self.connection.commit()
        newid = cursor.lastrowid
        wishlist["id"] = newid
        self.closeAll()
        return wishlist
 
# Update wishlist entry
    def updateWishlist(self, id, wishlist):
        cursor = self.getcursor()
        sql = "UPDATE wishlist SET priority=%s, notes=%s WHERE id = %s"
        values = (
            wishlist.get("priority"),
            wishlist.get("notes"),
            id
        )
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        
# Delete wishlist entry
    def deleteWishlist(self, id):
        cursor = self.getcursor()
        sql = "DELETE FROM wishlist WHERE id = %s"
        values = (id,)
        cursor.execute(sql, values)
        self.connection.commit()
        self.closeAll()
        print("Wishlist entry deleted")
 
# Convert SQL result to dictionary
    def convertToWishlistDictionary(self, resultLine):
        attkeys = ["id", "game_id", "priority", "notes", "date_added"]
        wishlist = {}
        currentkey = 0
        for attrib in resultLine:
            wishlist[attkeys[currentkey]] = attrib
            currentkey = currentkey + 1
        return wishlist
    
gameDAO = GameDAO()