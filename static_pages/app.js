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

// ---- GAMES ----

/* 
    Render the games table from the cached allGames array.
    Always calLed after updating allGames.
*/
function renderGames(games) {
    console.log("[Render] renderGames() start, count:", games.length);
 
    const $tbody = $("#games-body");
    if ($tbody.length === 0) {
        console.error("[Render] #games-body NOT FOUND in DOM!");
        return;
    }
 
    $tbody.empty();
    populateGameDropdowns(games);
 
    if (!Array.isArray(games)) {
        console.error("[Render] Expected array, got:", games);
        $tbody.append(`<tr><td colspan="5">Invalid data received.</td></tr>`);
        console.log("[Render] appended invalid data row");
        return;
    }
 
    if (games.length === 0) {
        $tbody.append(`<tr><td colspan="5">No games saved yet. Search for one above!</td></tr>`);
        console.log("[Render] No games to display");
        return;
    }
 
    let rowsHtml = "";
    for (const game of games) {
        rowsHtml +=
            `<tr data-id="${escapeHtml(game.id)}">` +
                `<td><img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.title)}" width="60"></td>` +
                `<td>${escapeHtml(game.title)}</td>` +
                `<td>${escapeHtml(game.genre)}</td>` +
                `<td>${escapeHtml(game.release_date)}</td>` +
                `<td>` +
                    `<button class="btn-edit-game">Edit</button>` +
                    `<button class="btn-delete-game">Delete</button>` +
                    `<button class="btn-view-reviews" data-id="${escapeHtml(game.id)}">Reviews</button>` +
                `</td>` +
            `</tr>`;
    }
 
    console.log("[Render] built rowsHtml length:", rowsHtml.length);
    $tbody.html(rowsHtml);
    $("#games-count").text(String(games.length));  // optional count badge
    console.log("[Render] done. Rows now in DOM:", $("#games-body tr").length);
}

/*
   Get all games from the database.
*/
async function loadGames() {
    console.log("[Games] loadGames() called");
    showLoading(true);
    try {
        const data = await api("GET", ENDPOINTS.games);
        console.log("[Games] GET response:", data, "Array?", Array.isArray(data));
        if (Array.isArray(data)) {
            allGames = data;
            renderGames(allGames);
        } else {
            showToast("Unexpected response from server.", "error");
            renderGames([]);
        }
    } catch (err) {
        console.error("[Games] loadGames failed:", err);
        showToast("Failed to load games.", "error");
        renderGames([]);
    } finally {
        showLoading(false);
        console.log("[Games] loadGames() finished");
    }
}

/*
   POST; Save a game from RAWG search results.
   Payload is built in event handler & passed here.
*/
async function saveGame(payload) {
    console.log("[Games] saveGame() payload:", payload);
    showLoading(true);
    try {
        const created = await api("POST", ENDPOINTS.games, payload);
        console.log("[Games] created:", created);
        showToast(created.title + " saved to your collection!", "success");
        allGames.push(created);
        renderGames(allGames);
        $("#search-results").empty();
    } catch (err) {
        console.error("[Games] saveGame failed:", err);
        showToast("Failed to save game.", "error");
    } finally {
        showLoading(false);
    }
}


// --- EVENT HANDLERS ---

$(document).ready(function() {
    console.log("[DOM] document.ready — initialising handlers and loading data");
 
    // load all data on page load
    loadGames();
    loadWishlist();

    // ---- GAMES ----
 
    // Save game from search results; payload built here and passed to saveGame()
    $(document).on("click", ".btn-save-game", function() {
        const $btn = $(this);
        const payload = {
            rawg_id:      $btn.data("rawgid"),
            title:        $btn.data("title"),
            genre:        $btn.data("genre"),
            image_url:    $btn.data("image"),
            release_date: $btn.data("date")
        };
        saveGame(payload);
    }); 