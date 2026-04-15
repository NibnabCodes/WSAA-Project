import GAMEdao as dao
 
# First create a game to attach reviews to
newGame = dao.gameDAO.createGame({
    "rawg_id": 41494,
    "title": "Elden Ring",
    "genre": "Action",
    "image_url": "https://media.rawg.io/media/games/elden_ring.jpg",
    "release_date": "2022-02-25"
})
game_id = newGame["id"]
 
# Test CREATE
print("\n-- Test createReview --")
newReview = {
    "game_id": game_id,
    "recommended": True,
    "comment": "Amazing game, highly recommended!",
    "date_added": "2024-03-16 10:00:00"
}
result = dao.gameDAO.createReview(newReview)
print("Created:", result)
 
# Test GET ALL REVIEWS
print("\n-- Test getAllReviews --")
reviews = dao.gameDAO.getAllReviews()
print("All reviews:", reviews)

# Test GET BY GAME ID
print("\n-- Test getReviewsByGameID --")
reviews = dao.gameDAO.getReviewsByGameID(game_id)
print("Reviews:", reviews)
 
# Test UPDATE
print("\n-- Test updateReview --")
dao.gameDAO.updateReview(1, {
    "recommended": False,
    "comment": "Actually changed my mind!"
})
print("Updated review with ID 1")
 
# Test DELETE
print("\n-- Test deleteReview --")
dao.gameDAO.deleteReview(1)
print("Deleted review with ID 1")