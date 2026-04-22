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
/*
   Show or hide the loading spinner.
*/
function showLoading(show = true) {
    console.log("[UI] showLoading:", show);
    $("#loading").toggleClass("hidden", !show);
}

/*
   Show a toast notification to the user.
*/
let toastTimer = null;
function showToast(message, type = "success", timeoutMs = 2400) {
    console.log("[UI] showToast:", type, message);
    const $toast = $("#toast");
    $toast.removeClass("hidden success error").addClass(type).text(message);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.addClass("hidden"), timeoutMs);
}

/*
   Safely escape text before inserting into HTML.
*/
function escapeHtml(value) {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&#039;");
} 

/*
   Get today's date and time formatted for MySQL DATETIME.
   e.g. "2024-03-16 10:00:00"
*/
function getNow() {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
} 

// ---- State ----

let allGames    = [];   
let allReviews  = [];   
let allWishlist = [];   

