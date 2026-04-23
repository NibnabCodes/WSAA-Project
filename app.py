from flask import Flask, jsonify, request, abort
import requests 
import GAMEdao as dao 
import config as cfg 

app = Flask(__name__, static_url_path='', static_folder='static_pages')

# Serve main page
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Game endpoints

# Get all games
@app.route('/api/games', methods=['GET'])
def get_all_games():
    return jsonify(dao.gameDAO.getAllGames())

# Get game by ID
@app.route('/api/games/<int:id>', methods=['GET'])
def get_game(id):
    return jsonify(dao.gameDAO.getGameByID(id))

# Create a new game
@app.route('/api/games', methods=['POST'])
def create_game():
    game = request.json
    return jsonify(dao.gameDAO.createGame(game))

# Update an existing game
@app.route('/api/games/<int:id>', methods=['PUT'])
def update_game(id):
    game = request.json
    dao.gameDAO.updateGame(id, game)
    return jsonify({"message": "Game updated successfully"})

# Delete a game
@app.route('/api/games/<int:id>', methods=['DELETE'])
def delete_game(id):
    dao.gameDAO.deleteGame(id)
    return jsonify({"message": "Game deleted successfully"})

# RAWG search endpoint
@app.route('/api/search/<string:game_name>', methods=['GET'])
def search_game(game_name):
    response = requests.get(
        'https://api.rawg.io/api/games',
        params={
            'search': game_name,
            'key': cfg.rawg['api_key'],
            'page_size': 5
        }
    )
    data = response.json()
    
    # Filter to only what is needed for the frontend and convert to the same format as the database entries
    games = []
    for game in data['results']:
        games.append({
            'rawg_id': game['id'],
            'title': game['name'],
            'genre': game['genres'][0]['name'] if game['genres'] else 'Unknown',
            'image_url': game['background_image'],
            'release_date': game['released']
        })
    
    return jsonify(games)

# Reviews endpoints

# Get reviews by ID
@app.route('/api/reviews/<int:game_id>', methods=['GET'])
def get_reviews(game_id):
    return jsonify(dao.gameDAO.getReviewsByGameID(game_id))

# Create review
@app.route('/api/reviews', methods=['POST'])
def create_review():
    review = request.json
    return jsonify(dao.gameDAO.createReview(review))

# Update review
@app.route('/api/reviews/<int:id>', methods=['PUT'])
def update_review(id):
    review = request.json
    dao.gameDAO.updateReview(id, review)
    return jsonify({"message": "Review updated successfully"})

# Delete review
@app.route('/api/reviews/<int:id>', methods=['DELETE'])
def delete_review(id):
    dao.gameDAO.deleteReview(id)
    return jsonify({"message": "Review deleted successfully"})

# Wishlist endpoints

# Get all wishlist entries
@app.route('/api/wishlist', methods=['GET'])
def get_wishlist():
    return jsonify(dao.gameDAO.getAllWishlist())

# Create wishlist entry
@app.route('/api/wishlist', methods=['POST'])
def create_wishlist():
    wishlist = request.json
    return jsonify(dao.gameDAO.createWishlist(wishlist))

# Update wishlist entry
@app.route('/api/wishlist/<int:id>', methods=['PUT'])
def update_wishlist(id):
    wishlist = request.json
    dao.gameDAO.updateWishlist(id, wishlist)
    return jsonify({"message": "Wishlist updated successfully"})

# Delete wishlist entry
@app.route('/api/wishlist/<int:id>', methods=['DELETE'])
def delete_wishlist(id):
    dao.gameDAO.deleteWishlist(id)
    return jsonify({"message": "Wishlist entry deleted successfully"})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)