## Author: Niamh Hogan

import mysql.connector
import config as cfg

class GameDAO:

    def __init__(self):
        self.host = cfg.mysql["host"]
        self.user = cfg.mysql["user"]
        self.password = cfg.mysql["password"]
        self.database = cfg.mysql["database"]

    def getcursor(self):
        connection = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )

        cursor = connection.cursor()
        return connection, cursor

#
# Games Table CRUD Operations
#
    
# Get all games
    def getAllGames(self):
        connection, cursor = self.getcursor()

        cursor.execute("SELECT * FROM games")
        results = cursor.fetchall()

        returnArray = []
        for result in results:
            returnArray.append(self.convertToGameDictionary(result))

        cursor.close()
        connection.close()

        return returnArray
    
# Get game by ID
    def getGameByID(self, id):
        connection, cursor = self.getcursor()

        sql = "SELECT * FROM games WHERE id = %s"
        values = (id,)

        cursor.execute(sql, values)
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if result:
            return self.convertToGameDictionary(result)
        return None
    
# Create game
    def createGame(self, game):
        connection, cursor = self.getcursor()

        sql = """
            INSERT INTO games (rawg_id, title, genre, image_url, release_date)
            VALUES (%s, %s, %s, %s, %s)
        """

        values = (
            game.get("rawg_id"),
            game.get("title"),
            game.get("genre"),
            game.get("image_url"),
            game.get("release_date")
        )

        cursor.execute(sql, values)
        connection.commit()

        game["id"] = cursor.lastrowid

        cursor.close()
        connection.close()

        return game
 
 # Update game
    def updateGame(self, id, game):
        connection, cursor = self.getcursor()

        sql = """
            UPDATE games
            SET title=%s, genre=%s, image_url=%s, release_date=%s
            WHERE id=%s
        """

        values = (
            game.get("title"),
            game.get("genre"),
            game.get("image_url"),
            game.get("release_date"),
            id
        )

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()
 
 # Delete game
    def deleteGame(self, id):
        connection, cursor = self.getcursor()

        sql = "DELETE FROM games WHERE id = %s"
        values = (id,)

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()

        print("Game deleted")
 
 # Convert SQL result to dictionary
    def convertToGameDictionary(self, resultLine):
        attkeys = ["id", "rawg_id", "title", "genre", "image_url", "release_date"]
        game = {}
        currentkey = 0
        for attrib in resultLine:
            if attkeys[currentkey] == "release_date" and attrib is not None:
                game[attkeys[currentkey]] = str(attrib)  # convert date to string
            else:
                game[attkeys[currentkey]] = attrib
            currentkey += 1
        return game
    
#
# Reviews Table CRUD Operations
#

# Get all reviews
    def getAllReviews(self):
        connection, cursor = self.getcursor()

        sql = """
            SELECT reviews.id,
                games.title,
                reviews.recommended,
                reviews.comment,
                reviews.date_added
            FROM reviews
            JOIN games ON reviews.game_id = games.id
        """

        cursor.execute(sql)
        results = cursor.fetchall()

        returnArray = []
        for result in results:
            returnArray.append(self.convertToReviewDictionary(result))

        cursor.close()
        connection.close()

        return returnArray

# Get reviews by game ID
    def getReviewByID(self, game_id):
        connection, cursor = self.getcursor()

        sql = """
            SELECT reviews.id,
                games.title,
                reviews.recommended,
                reviews.comment,
                reviews.date_added
            FROM reviews
            JOIN games ON reviews.game_id = games.id
            WHERE reviews.game_id = %s
        """

        values = (game_id,)

        cursor.execute(sql, values)
        results = cursor.fetchall()

        returnArray = []
        for result in results:
            returnArray.append(self.convertToReviewDictionary(result))

        cursor.close()
        connection.close()

        return returnArray
    
# Create review
    def createReview(self, review):
        connection, cursor = self.getcursor()

        sql = """
            INSERT INTO reviews (game_id, recommended, comment, date_added)
            VALUES (%s, %s, %s, %s)
        """

        values = (
            review.get("game_id"),
            review.get("recommended"),
            review.get("comment"),
            review.get("date_added")
        )

        cursor.execute(sql, values)
        connection.commit()

        review["id"] = cursor.lastrowid

        cursor.close()
        connection.close()

        return review

# Update review
    def updateReview(self, id, review):
        connection, cursor = self.getcursor()

        sql = """
            UPDATE reviews
            SET recommended=%s, comment=%s
            WHERE id=%s
        """

        values = (
            review.get("recommended"),
            review.get("comment"),
            id
        )

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()
        
# Delete review
    def deleteReview(self, id):
        connection, cursor = self.getcursor()

        sql = "DELETE FROM reviews WHERE id = %s"
        values = (id,)

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()
 
# Convert SQL result to dictionary
    def convertToReviewDictionary(self, resultLine):
        attkeys = ["id", "title", "recommended", "comment", "date_added"]
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
        connection, cursor = self.getcursor()

        sql = """
            SELECT wishlist.id, games.title, wishlist.priority, 
                wishlist.notes, wishlist.date_added
            FROM wishlist
            JOIN games ON wishlist.game_id = games.id
        """
        cursor.execute(sql)
        results = cursor.fetchall()

        returnArray = []
        for result in results:
            returnArray.append(self.convertToWishlistDictionary(result))

        cursor.close()
        connection.close()

        return returnArray

# Get wishlist entry by ID
    def getWishlistByID(self, id):
        connection, cursor = self.getcursor()

        sql = """
            SELECT wishlist.id, games.title, wishlist.priority,
                wishlist.notes, wishlist.date_added
            FROM wishlist
            JOIN games ON wishlist.game_id = games.id
            WHERE wishlist.id = %s
        """
        values = (id,)

        cursor.execute(sql, values)
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if result:
            return self.convertToWishlistDictionary(result)
        return None

# Create wishlist entry
    def createWishlist(self, wishlist):
        connection, cursor = self.getcursor()

        sql = """
            INSERT INTO wishlist (game_id, priority, notes, date_added)
            VALUES (%s, %s, %s, %s)
        """

        values = (
            wishlist.get("game_id"),
            wishlist.get("priority"),
            wishlist.get("notes"),
            wishlist.get("date_added")
        )

        cursor.execute(sql, values)
        connection.commit()

        wishlist["id"] = cursor.lastrowid

        cursor.close()
        connection.close()

        return wishlist
 
# Update wishlist entry
    def updateWishlist(self, id, wishlist):
        connection, cursor = self.getcursor()

        sql = """
            UPDATE wishlist
            SET priority=%s, notes=%s
            WHERE id=%s
        """

        values = (
            wishlist.get("priority"),
            wishlist.get("notes"),
            id
        )

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()
        
# Delete wishlist entry
    def deleteWishlist(self, id):
        connection, cursor = self.getcursor()

        sql = "DELETE FROM wishlist WHERE id = %s"
        values = (id,)

        cursor.execute(sql, values)
        connection.commit()

        cursor.close()
        connection.close()

        print("Wishlist entry deleted")
 
# Convert SQL result to dictionary
    def convertToWishlistDictionary(self, resultLine):
        attkeys = ["id", "title", "priority", "notes", "date_added"]
        wishlist = {}
        currentkey = 0
        for attrib in resultLine:
            wishlist[attkeys[currentkey]] = attrib
            currentkey += 1
        return wishlist
    
gameDAO = GameDAO()