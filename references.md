## Author: Niamh Hogan

## References for `GAMEdao.py`

The code within this file was adapted from lab material developed by Andrew Beatty for the Web Services & Applications module:

- https://github.com/andrewbeattycourseware/wsaa-courseware/blob/main/code/Topic08-generated-client/bookDAO.py

---

## References for `app.py`

The majority of the code in this file was adapted from lab material developed by Andrew Beatty for the Web Services & Applications module:

- https://github.com/andrewbeattycourseware/wsaa-courseware/blob/main/code/Topic08-generated-client/rest-server.py  

### RAWG Search Endpoint Resources

The following sources were used for the RAWG search endpoint implementation:

- https://rawg.io/apidocs  
- https://requests.readthedocs.io/en/latest/  
- https://flask.palletsprojects.com/en/stable/quickstart/#variable-rules  

---

# Static Page References

## References for `index.html`  

The code in this file was adapted from lab material developed by Andrew Beatty for the Web Services & Applications module:  

- https://github.com/andrewbeattycourseware/wsaa-courseware/blob/main/code/Topic08-generated-client/staticpages/index.html

### HTML Structure & Elements

- HTML Tables: https://www.w3schools.com/html/html_tables.asp  
- HTML Forms & Inputs: https://www.w3schools.com/html/html_forms.asp  
- HTML Buttons: https://www.w3schools.com/tags/tag_button.asp  
- HTML Sections: https://www.w3schools.com/tags/tag_section.asp  
- HTML `<div>` Tag: https://www.w3schools.com/Tags/tag_div.asp  
- HTML `id` & `class`: https://www.w3schools.com/html/html_id.asp  

### UI Behaviour & Form Handling

- Hiding elements with CSS (`display`): https://www.w3schools.com/cssref/pr_class_display.php  
- Select dropdowns: https://www.w3schools.com/tags/tag_select.asp  
- Textarea for reviews/comments: https://www.w3schools.com/tags/tag_textarea.asp  
- Hidden input fields (secure IDs): https://www.w3schools.com/tags/att_input_type_hidden.asp  

---

## References for `app.js`

The code in this file was adapted from lab material developed by Andrew Beatty for the Web Services & Applications module:

- https://github.com/andrewbeattycourseware/wsaa-courseware/blob/main/code/Topic08-generated-client/staticpages/app.js  

### AJAX & API Handling

- jQuery AJAX API: https://api.jquery.com/jquery.ajax/  
- JSON stringify: https://www.w3schools.com/js/js_json_stringify.asp  
- RAWG API: https://rawg.io/apidocs  

### jQuery Functions

- `toggleClass()`: https://api.jquery.com/toggleClass/  
- `addClass()`: https://api.jquery.com/addClass/  
- `.val()`: https://api.jquery.com/val/  
- `.empty()`: https://api.jquery.com/empty/  
- `.append()`: https://api.jquery.com/append/  

### JavaScript Core Concepts

- JavaScript dates & `toISOString()`: https://www.w3schools.com/js/js_dates.asp  
- `encodeURIComponent()`: https://www.w3schools.com/jsref/jsref_encodeURIComponent.asp  
- JavaScript errors: https://www.w3schools.com/js/js_errors.asp  
- String `.trim()`: https://www.w3schools.com/jsref/jsref_trim_string.asp  

### DOM & UI Interaction

- Show/Hide elements with jQuery: https://www.geeksforgeeks.org/jquery/how-to-show-hide-an-element-using-jquery/  
- HTML data attributes: https://www.w3schools.com/tags/att_data-.asp  
- `this` vs `$(this)` in jQuery: https://www.geeksforgeeks.org/jquery/difference-between-this-and-this-in-jquery/  


## References for `styles.css`

The CSS styling for the application was generated with the assistance of the AI tool Claude.

---

## Prompts Used

### Initial Request

> Hello Claude!  
> Please write a complete `style.css` file for my Flask web application called **GameVault** in a Cyberpunk 2077 style. See my `index.html` attached.  
>
> Also, please write the complete `style.css` file with comments explaining each section. Also include the toast and loading spinner styles.

---

### Layout & UI Fixes

> Please fix the following issues:
>
> 1. The **GAMEVAULT title and subtitle** should be centered in the hero section  
> 2. The navigation links (**My Games, Reviews, Wishlist**) should sit directly underneath the hero section, centered in a row  
> 3. The hero section should have corner bracket decorations in all four corners using `position: absolute`  
> 4. Buttons should each have a different neon colour border that fills with that colour on hover with a glow effect:
>
> - Edit button: yellow `#ffe600` border, fills yellow on hover  
> - Delete button: pink `#ff2d78` border, fills pink on hover  
> - Wishlist button: cyan `#00f0ff` border, fills cyan on hover  
>
> 5. The three GAMEVAULT glitch layers must all be centered and stacked exactly on top of each other using `position: absolute` inside a `position: relative` wrapper div  

---

### Desktop Layout Fixes

> The layout looks perfect on mobile, but on desktop the section titles, tables, and forms are all out of alignment. Please fix the CSS so it looks correct on desktop screens too.
>
> Please add:
>
> - A max-width container (around 1200px) centered with `margin: auto`  
> - Proper padding and alignment for desktop screens  
> - Media queries for both desktop and mobile  
> - Tables should stretch to full width of the container  
> - Forms and inputs should align properly on larger screens  

---

### Button Fixes & Styling Rules

> Please fix the following button issues:
>
> 1. The **Edit, Delete, and Reviews buttons** on the game cards are hidden behind the **Save to Collection** button — ensure all buttons are always visible and do not overlap  
> 2. All button text should be white (`#ffffff`)  
> 3. All buttons should have:
>
> - Transparent background  
> - Glowing neon outline border  
> - White text  
>
> On hover:
> - Border glows brighter  
> - Background fills with button colour at ~20% opacity  
>
> Button colour scheme:
>
> - Edit button: glowing yellow `#ffe600`  
> - Delete button: glowing pink `#ff2d78`  
> - Reviews button: glowing cyan `#00f0ff`  
> - Save to Collection button: glowing green `#00ff88`  
> - Add to Wishlist button: glowing cyan `#00f0ff`  
> - Submit Review button: glowing yellow `#ffe600`  
> - Save Changes button: glowing yellow `#ffe600`  
> - Cancel button: glowing pink `#ff2d78`  

---

## Source

https://claude.ai/share/625130ae-f3fd-4589-96e9-303725b70a99