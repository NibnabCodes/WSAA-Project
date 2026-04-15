import GAMEdao as dao
 
print("Testing GAMES")

# Test CREATE
print("\n-- Test createGame --")
newGame = {
    "rawg_id": 41494,
    "title": "Elden Ring",
    "genre": "Action",
    "image_url": "https://media.rawg.io/media/games/elden_ring.jpg",
    "release_date": "2022-02-25"
}
result = dao.gameDAO.createGame(newGame)
print("Created:", result)
 
# Test GET ALL
print("\n-- Test getAllGames --")
games = dao.gameDAO.getAllGames()
print("All games:", games)
 
# Test GET BY ID
print("\n-- Test getGameByID --")
game = dao.gameDAO.getGameByID(1)
print("Game with ID 1:", game)
 
# Test UPDATE
print("\n-- Test updateGame --")
updatedGame = {
    "title": "Elden Ring Updated",
    "genre": "RPG",
    "image_url": "https://media.rawg.io/media/games/elden_ring.jpg",
    "release_date": "2022-02-25"
}
dao.gameDAO.updateGame(1, updatedGame)
print("Updated game with ID 1")
 
# Test DELETE
print("\n-- Test deleteGame --")
dao.gameDAO.deleteGame(1)
print("Deleted game with ID 1")