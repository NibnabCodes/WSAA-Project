// All JavaScript and AJAX fetch calls that communicate with the Flask API. This file is linked to the index.html file and will be executed when the page loads. 
// It will handle all user interactions and update the UI accordingly.
// Author: Niamh Hogan

// ---- CONFIG ----

const API_BASE_URL = "http://127.0.0.1:5000";

// Centralised endpoints
const ENDPOINTS = {
    games:      "/api/games",
    reviews:    "/api/reviews",
    wishlist:   "/api/wishlist",
    search:     "/api/search"
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

// ---- UTILITIES -----
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

// ----- VALIDATION HELPERS -------
 
/*
   Clear all error messages for a given group.
*/
function clearErrors(group) {
    $(`.${group}-error`).text("");
}
 
/*
   Set an error message for a specific field in a group.
*/
function setError(group, name, message) {
    $(`.${group}-error[data-for="${name}"]`).text(message || "");
}

// ---- STATE ----

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

/*
   PUT - Update an existing game.
   id and payload are built in the event handler and passed in.
*/
async function updateGame(id, payload) {
    console.log("[Games] updateGame() id:", id, "payload:", payload);
    showLoading(true);
    try {
        const updated = await api("PUT", `${ENDPOINTS.games}/${encodeURIComponent(id)}`, payload);
        console.log("[Games] updated:", updated);
        showToast("Game updated successfully!", "success");
        const idx = allGames.findIndex(g => String(g.id) === String(id));
        if (idx !== -1) allGames[idx] = updated;
        renderGames(allGames);
        hideEditGameForm();
        clearErrors("game");
    } catch (err) {
        console.error("[Games] updateGame failed:", err);
        showToast("Failed to update game.", "error");
    } finally {
        showLoading(false);
    }
}
 
/*
   DELETE - Remove a game from the database.
   ON DELETE CASCADE removes its reviews and wishlist entries too.
*/
async function deleteGame(id) {
    console.log("[Games] deleteGame() id:", id);
    if (!confirm("Are you sure you want to delete this game?\nThis will also delete its reviews and wishlist entries.")) return;
    showLoading(true);
    try {
        await api("DELETE", `${ENDPOINTS.games}/${encodeURIComponent(id)}`);
        console.log("[Games] deleted id:", id);
        showToast("Game deleted!", "success");
        allGames = allGames.filter(g => String(g.id) !== String(id));
        renderGames(allGames);
    } catch (err) {
        console.error("[Games] deleteGame failed:", err);
        showToast("Failed to delete game.", "error");
    } finally {
        showLoading(false);
    }
}

// Show and fill the edit game form
function showEditGameForm(id, title, genre, image_url, release_date) {
    console.log("[Games] showEditGameForm() id:", id);
    clearErrors("game");
    $("#edit-game-form").show();
    $("#edit-game-id").val(id);
    $("#edit-game-title").val(title);
    $("#edit-game-genre").val(genre);
    $("#edit-game-image").val(image_url);
    $("#edit-game-date").val(release_date);
}
 
// Hide the edit game form
function hideEditGameForm() {
    $("#edit-game-form").hide();
    clearErrors("game");
}
 
// Validate game edit form before submitting
function validateGameForm() {
    let ok = true;
    clearErrors("game");
 
    if (!$("#edit-game-title").val().trim()) {
        setError("game", "title", "Title is required");
        ok = false;
    }
    if (!$("#edit-game-genre").val().trim()) {
        setError("game", "genre", "Genre is required");
        ok = false;
    }
    if (!$("#edit-game-date").val()) {
        setError("game", "date", "Release date is required");
        ok = false;
    }
    console.log("[Games] validateGameForm ok?", ok);
    return ok;
}
 
// --- RAWG SEARCH ---
/*
   Search RAWG API for games by name.
*/
async function searchGames() {
    const query = $("#search-input").val().trim();
    console.log("[Search] searchGames() called, query:", query);
 
    if (!query) {
        showToast("Please enter a game name!", "error");
        return;
    }
 
    showLoading(true);
    try {
        const data = await api("GET", `${ENDPOINTS.search}/${encodeURIComponent(query)}`);
        console.log("[Search] results:", data);
 
        const $resultsDiv = $("#search-results");
        $resultsDiv.empty();
 
        if (!Array.isArray(data) || data.length === 0) {
            $resultsDiv.append("<p>No games found. Try a different search.</p>");
            return;
        }
 
        let html = "";
        for (const game of data) {
            html +=
                `<div class="search-result">` +
                    `<img src="${escapeHtml(game.image_url)}" alt="${escapeHtml(game.title)}" width="60">` +
                    `<span>${escapeHtml(game.title)} (${escapeHtml(game.release_date)})</span>` +
                    `<button class="btn-save-game"` +
                        ` data-rawgid="${escapeHtml(game.rawg_id)}"` +
                        ` data-title="${escapeHtml(game.title)}"` +
                        ` data-genre="${escapeHtml(game.genre)}"` +
                        ` data-image="${escapeHtml(game.image_url)}"` +
                        ` data-date="${escapeHtml(game.release_date)}">` +
                        `Save to Collection` +
                    `</button>` +
                `</div>`;
        }
        $resultsDiv.html(html);
 
    } catch (err) {
        console.error("[Search] searchGames failed:", err);
        showToast("Search failed. Please try again.", "error");
    } finally {
        showLoading(false);
        console.log("[Search] searchGames() finished");
    }
}

// -- REVIEWS ---
/*
   Render the reviews table from the cached allReviews array.
*/
function renderReviews(reviews) {
    console.log("[Render] renderReviews() start, count:", reviews.length);
 
    const $tbody = $("#reviews-body");
    if ($tbody.length === 0) {
        console.error("[Render] #reviews-body NOT FOUND in DOM!");
        return;
    }
 
    $tbody.empty();
 
    if (!Array.isArray(reviews)) {
        console.error("[Render] Expected array, got:", reviews);
        $("#reviews-count").text("0");
        $tbody.append(`<tr><td colspan="5">Invalid data received.</td></tr>`);
        return;
    }
 
    if (reviews.length === 0) {
        $tbody.append(`<tr><td colspan="5">No reviews yet for this game.</td></tr>`);
        $("#reviews-count").text("0");
        return;
    }
 
    let rowsHtml = "";
    for (const review of reviews) {
        const recommended = review.recommended ? "Recommended" : "Not Recommended";
        rowsHtml +=
            `<tr data-id="${escapeHtml(review.id)}">` +
                `<td>${escapeHtml(review.game_id)}</td>` +
                `<td>${escapeHtml(recommended)}</td>` +
                `<td>${escapeHtml(review.comment)}</td>` +
                `<td>${escapeHtml(review.date_added)}</td>` +
                `<td>` +
                    `<button class="btn-edit-review">Edit</button>` +
                    `<button class="btn-delete-review">Delete</button>` +
                `</td>` +
            `</tr>`;
    }
 
    console.log("[Render] built rowsHtml length:", rowsHtml.length);
    $tbody.html(rowsHtml);
    $("#reviews-count").text(String(reviews.length));
    console.log("[Render] done. Rows now in DOM:", $("#reviews-body tr").length);
}
 
/*
   GET all reviews for a specific game.
*/
async function loadReviews(game_id) {
    console.log("[Reviews] loadReviews() called, game_id:", game_id);
    showLoading(true);
    try {
        const data = await api("GET", `${ENDPOINTS.reviews}/${encodeURIComponent(game_id)}`);
        console.log("[Reviews] GET response:", data);
        if (Array.isArray(data)) {
            allReviews = data;
            renderReviews(allReviews);
        } else {
            showToast("Unexpected response from server.", "error");
            renderReviews([]);
        }
    } catch (err) {
        console.error("[Reviews] loadReviews failed:", err);
        showToast("Failed to load reviews.", "error");
        renderReviews([]);
    } finally {
        showLoading(false);
        console.log("[Reviews] loadReviews() finished");
    }
}
 
/*
   POST - Create a new review.
   Payload is built in the event handler and passed in.
*/
async function createReview(payload) {
    console.log("[Reviews] createReview() payload:", payload);
    showLoading(true);
    try {
        const created = await api("POST", ENDPOINTS.reviews, payload);
        console.log("[Reviews] created:", created);
        showToast("Review added successfully!", "success");
        allReviews.push(created);
        renderReviews(allReviews);
        $("#review-comment").val("");
        clearErrors("review");
    } catch (err) {
        console.error("[Reviews] createReview failed:", err);
        showToast("Failed to add review.", "error");
    } finally {
        showLoading(false);
    }
}
 
/*
   PUT - Update an existing review.
   id and payload are built in the event handler and passed in.
*/
async function updateReview(id, payload) {
    console.log("[Reviews] updateReview() id:", id, "payload:", payload);
    showLoading(true);
    try {
        const updated = await api("PUT", `${ENDPOINTS.reviews}/${encodeURIComponent(id)}`, payload);
        console.log("[Reviews] updated:", updated);
        showToast("Review updated successfully!", "success");
        const idx = allReviews.findIndex(r => String(r.id) === String(id));
        if (idx !== -1) allReviews[idx] = updated;
        renderReviews(allReviews);
        hideEditReviewForm();
        clearErrors("edit-review");
    } catch (err) {
        console.error("[Reviews] updateReview failed:", err);
        showToast("Failed to update review.", "error");
    } finally {
        showLoading(false);
    }
}
 
/*
   DELETE - Remove a review.
*/
async function deleteReview(id) {
    console.log("[Reviews] deleteReview() id:", id);
    if (!confirm("Are you sure you want to delete this review?")) return;
    showLoading(true);
    try {
        await api("DELETE", `${ENDPOINTS.reviews}/${encodeURIComponent(id)}`);
        console.log("[Reviews] deleted id:", id);
        showToast("Review deleted!", "success");
        allReviews = allReviews.filter(r => String(r.id) !== String(id));
        renderReviews(allReviews);
    } catch (err) {
        console.error("[Reviews] deleteReview failed:", err);
        showToast("Failed to delete review.", "error");
    } finally {
        showLoading(false);
    }
}
 
// Show and fill the edit review form
function showEditReviewForm(id, recommended, comment) {
    console.log("[Reviews] showEditReviewForm() id:", id);
    clearErrors("edit-review");
    $("#edit-review-form").show();
    $("#edit-review-id").val(id);
    $("#edit-review-recommended").val(recommended);
    $("#edit-review-comment").val(comment);
}
 
// Hide the edit review form
function hideEditReviewForm() {
    $("#edit-review-form").hide();
    clearErrors("edit-review");
}
 
// Validate add review form before submitting
function validateReviewForm() {
    let ok = true;
    clearErrors("review");
 
    if (!$("#review-game-id").val()) {
        setError("review", "game_id", "Please select a game");
        ok = false;
    }
    if (!$("#review-comment").val().trim()) {
        setError("review", "comment", "Comment is required");
        ok = false;
    }
    console.log("[Reviews] validateReviewForm ok?", ok);
    return ok;
}
 
// Validate edit review form before submitting
function validateEditReviewForm() {
    let ok = true;
    clearErrors("edit-review");
 
    if (!$("#edit-review-comment").val().trim()) {
        setError("edit-review", "comment", "Comment is required");
        ok = false;
    }
    console.log("[Reviews] validateEditReviewForm ok?", ok);
    return ok;
}

// ---- WISHLIST -----
/*
   Render the wishlist table 
*/
function renderWishlist(wishlist) {
    console.log("[Render] renderWishlist() start, count:", wishlist.length);
 
    const $tbody = $("#wishlist-body");
    if ($tbody.length === 0) {
        console.error("[Render] #wishlist-body NOT FOUND in DOM!");
        return;
    }
 
    $tbody.empty();
 
    if (!Array.isArray(wishlist)) {
        console.error("[Render] Expected array, got:", wishlist);
        $("#wishlist-count").text("0");
        $tbody.append(`<tr><td colspan="5">Invalid data received.</td></tr>`);
        return;
    }
 
    if (wishlist.length === 0) {
        $tbody.append(`<tr><td colspan="5">Your wishlist is empty.</td></tr>`);
        $("#wishlist-count").text("0");
        return;
    }
 
    let rowsHtml = "";
    for (const entry of wishlist) {
        rowsHtml +=
            `<tr data-id="${escapeHtml(entry.id)}">` +
                `<td>${escapeHtml(entry.game_id)}</td>` +
                `<td>${escapeHtml(entry.priority)}</td>` +
                `<td>${escapeHtml(entry.notes)}</td>` +
                `<td>${escapeHtml(entry.date_added)}</td>` +
                `<td>` +
                    `<button class="btn-edit-wishlist">Edit</button>` +
                    `<button class="btn-delete-wishlist">Delete</button>` +
                `</td>` +
            `</tr>`;
    }
 
    console.log("[Render] built rowsHtml length:", rowsHtml.length);
    $tbody.html(rowsHtml);
    $("#wishlist-count").text(String(wishlist.length));
    console.log("[Render] done. Rows now in DOM:", $("#wishlist-body tr").length);
}

/*
   GET all wishlist entries.
*/
async function loadWishlist() {
    console.log("[Wishlist] loadWishlist() called");
    showLoading(true);
    try {
        const data = await api("GET", ENDPOINTS.wishlist);
        console.log("[Wishlist] GET response:", data);
        if (Array.isArray(data)) {
            allWishlist = data;
            renderWishlist(allWishlist);
        } else {
            showToast("Unexpected response from server.", "error");
            renderWishlist([]);
        }
    } catch (err) {
        console.error("[Wishlist] loadWishlist failed:", err);
        showToast("Failed to load wishlist.", "error");
        renderWishlist([]);
    } finally {
        showLoading(false);
        console.log("[Wishlist] loadWishlist() finished");
    }
}
 
/*
   POST- Add a game to the wishlist.
*/
async function createWishlist(payload) {
    console.log("[Wishlist] createWishlist() payload:", payload);
    showLoading(true);
    try {
        const created = await api("POST", ENDPOINTS.wishlist, payload);
        console.log("[Wishlist] created:", created);
        showToast("Added to wishlist!", "success");
        allWishlist.push(created);
        renderWishlist(allWishlist);
        $("#wishlist-notes").val("");
        clearErrors("wishlist");
    } catch (err) {
        console.error("[Wishlist] createWishlist failed:", err);
        showToast("Failed to add to wishlist.", "error");
    } finally {
        showLoading(false);
    }
}
 
/*
   PUT- Update a wishlist entry.
*/
async function updateWishlist(id, payload) {
    console.log("[Wishlist] updateWishlist() id:", id, "payload:", payload);
    showLoading(true);
    try {
        const updated = await api("PUT", `${ENDPOINTS.wishlist}/${encodeURIComponent(id)}`, payload);
        console.log("[Wishlist] updated:", updated);
        showToast("Wishlist updated successfully!", "success");
        const idx = allWishlist.findIndex(w => String(w.id) === String(id));
        if (idx !== -1) allWishlist[idx] = updated;
        renderWishlist(allWishlist);
        hideEditWishlistForm();
    } catch (err) {
        console.error("[Wishlist] updateWishlist failed:", err);
        showToast("Failed to update wishlist.", "error");
    } finally {
        showLoading(false);
    }
}
 
/*
   DELETE - Remove a wishlist entry.
*/
async function deleteWishlist(id) {
    console.log("[Wishlist] deleteWishlist() id:", id);
    if (!confirm("Are you sure you want to remove this from your wishlist?")) return;
    showLoading(true);
    try {
        await api("DELETE", `${ENDPOINTS.wishlist}/${encodeURIComponent(id)}`);
        console.log("[Wishlist] deleted id:", id);
        showToast("Removed from wishlist!", "success");
        allWishlist = allWishlist.filter(w => String(w.id) !== String(id));
        renderWishlist(allWishlist);
    } catch (err) {
        console.error("[Wishlist] deleteWishlist failed:", err);
        showToast("Failed to remove from wishlist.", "error");
    } finally {
        showLoading(false);
    }
}
 
// Show and fill the edit wishlist form
function showEditWishlistForm(id, priority, notes) {
    console.log("[Wishlist] showEditWishlistForm() id:", id);
    $("#edit-wishlist-form").show();
    $("#edit-wishlist-id").val(id);
    $("#edit-wishlist-priority").val(priority);
    $("#edit-wishlist-notes").val(notes);
}
 
// Hide the edit wishlist form
function hideEditWishlistForm() {
    $("#edit-wishlist-form").hide();
}
 
// Validate wishlist form before submitting
function validateWishlistForm() {
    let ok = true;
    clearErrors("wishlist");
}
    if (!$("#wishlist-game-id").val()) {
        setError("wishlist", "game_id", "Please select a game");
        ok = false;
    }
    console.log("[Wishlist] validateWishlistForm ok?", ok);
    return ok;

// --- HELPERS ----
/*
   Populate the game dropdowns in the reviews and wishlist forms.
   Called every time renderGames() runs so dropdowns stay up to date.
*/
function populateGameDropdowns(games) {
    console.log("[Helpers] populateGameDropdowns() count:", games.length);
    const $reviewSelect   = $("#review-game-id");
    const $wishlistSelect = $("#wishlist-game-id");
 
    $reviewSelect.empty().append('<option value="">Select a game...</option>');
    $wishlistSelect.empty().append('<option value="">Select a game...</option>');
 
    for (const game of games) {
        const option = `<option value="${escapeHtml(game.id)}">${escapeHtml(game.title)}</option>`;
        $reviewSelect.append(option);
        $wishlistSelect.append(option);
    }
}

// --- EVENT HANDLERS ---

$(document).ready(function() {
    console.log("[DOM] document.ready - initialising handlers and loading data");
 
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

    // Edit game button- show form filled with current values
    $(document).on("click", ".btn-edit-game", function() {
        const $row = $(this).closest("tr");
        showEditGameForm(
            $row.data("id"),
            $row.find("td:eq(1)").text(),
            $row.find("td:eq(2)").text(),
            $row.find("td:eq(0) img").attr("src"),
            $row.find("td:eq(3)").text()
        );
    });
 
    // Save game edit- validate, build payload here and pass to updateGame()
    $(document).on("click", "#btn-save-game-edit", function() {
        if (!validateGameForm()) return;
        const id = $("#edit-game-id").val();
        const payload = {
            title:        $("#edit-game-title").val().trim(),
            genre:        $("#edit-game-genre").val().trim(),
            image_url:    $("#edit-game-image").val().trim(),
            release_date: $("#edit-game-date").val()
        };
        updateGame(id, payload);
    });
 
    // Cancel game edit
    $(document).on("click", "#btn-cancel-game-edit", function() {
        hideEditGameForm();
    });
 
    // Delete game button
    $(document).on("click", ".btn-delete-game", function() {
        deleteGame($(this).closest("tr").data("id"));
    });
 
    // View reviews button
    $(document).on("click", ".btn-view-reviews", function() {
        loadReviews($(this).data("id"));
    });

    // ---- REVIEWS ----
 
    // Submit review - validate, build payload here and pass to createReview()
    $(document).on("click", "#btn-submit-review", function() {
        if (!validateReviewForm()) return;
        const payload = {
            game_id:     $("#review-game-id").val(),
            recommended: $("#review-recommended").val(),
            comment:     $("#review-comment").val().trim(),
            date_added:  getNow()
        };
        createReview(payload);
    });
 
    // Edit review button - show form filled with current values
    $(document).on("click", ".btn-edit-review", function() {
        const $row = $(this).closest("tr");
        showEditReviewForm(
            $row.data("id"),
            $row.find("td:eq(1)").text().includes("Recommended") ? 1 : 0,
            $row.find("td:eq(2)").text()
        );
    });
 
    // Save review edit - validate, build payload here and pass to updateReview()
    $(document).on("click", "#btn-save-review-edit", function() {
        if (!validateEditReviewForm()) return;
        const id = $("#edit-review-id").val();
        const payload = {
            recommended: $("#edit-review-recommended").val(),
            comment:     $("#edit-review-comment").val().trim()
        };
        updateReview(id, payload);
    });
 
    // Cancel review edit
    $(document).on("click", "#btn-cancel-review-edit", function() {
        hideEditReviewForm();
    });
 
    // Delete review button
    $(document).on("click", ".btn-delete-review", function() {
        deleteReview($(this).closest("tr").data("id"));
    });

    // Add to wishlist- validate, build payload here and pass to createWishlist()
    $(document).on("click", "#btn-add-wishlist", function() {
        if (!validateWishlistForm()) return;
        const payload = {
            game_id:    $("#wishlist-game-id").val(),
            priority:   $("#wishlist-priority").val(),
            notes:      $("#wishlist-notes").val().trim(),
            date_added: getNow()
        };
        createWishlist(payload);
    });
 
    // Edit wishlist button — show form filled with current values
    $(document).on("click", ".btn-edit-wishlist", function() {
        const $row = $(this).closest("tr");
        showEditWishlistForm(
            $row.data("id"),
            $row.find("td:eq(1)").text(),
            $row.find("td:eq(2)").text()
        );
    });
 
    // Save wishlist edit — build payload here and pass to updateWishlist()
    $(document).on("click", "#btn-save-wishlist-edit", function() {
        const id = $("#edit-wishlist-id").val();
        const payload = {
            priority: $("#edit-wishlist-priority").val(),
            notes:    $("#edit-wishlist-notes").val().trim()
        };
        updateWishlist(id, payload);
    });
 
    // Cancel wishlist edit
    $(document).on("click", "#btn-cancel-wishlist-edit", function() {
        hideEditWishlistForm();
    });
 
    // Delete wishlist button
    $(document).on("click", ".btn-delete-wishlist", function() {
        deleteWishlist($(this).closest("tr").data("id"));
    });

});