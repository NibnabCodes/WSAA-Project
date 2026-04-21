// All JavaScript and AJAX fetch calls that communicate with the Flask API. This file is linked to the index.html file and will be executed when the page loads. 
// It will handle all user interactions and update the UI accordingly.
// Author: Niamh Hogan

// ---- CONFIG ----

const API_BASE_URL = "http://127.0.0.1:5000";

// Centralised endpoints
const ENDPOINTS = {
    games: "/api/games",
    reviews: "/api/reviews",
    wishlist: "/api/wishlist"
};

const AUTH_TOKEN = "";

// ----API LAYER ---
/*
   This function handles ALL HTTP requests.
   It avoids repeating $.ajax and improves maintainability.
*/