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
   Central AJAX function - This function handles ALL HTTP requests.
   It avoids repeating $.ajax across every CRUD function.
*/

function api(method, path, data) {
    const url = API_BASE_URL.replace(/\/+$/, "") + path;
    console.log(`[API] ${method} ${url}`, data ?? "");
    return $.ajax({
        url:         url,
        method:      method,
        crossDomain: true,
        contentType: data ? "application/json; charset=utf-8" : undefined,
        dataType:    "json",
        data:        data ? JSON.stringify(data) : undefined,
        headers:     AUTH_TOKEN ? { Authorization: `Bearer ${AUTH_TOKEN}` } : {},
    })
    .done((res, status, xhr) => {
        console.log(`[API DONE] ${method} ${url}`, { status, res, xhr });
    })
    .fail((xhr, status, err) => {
        console.error(`[API FAIL] ${method} ${url}`, { status, err, xhr });
    });
}

// ---- Utilities -----

