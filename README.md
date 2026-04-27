<div align="center">

# Game Vault 🎮


> A RESTful Flask web application for managing your personal game collection.

---

</div> 


## About The Project

This project demonstrates the creation and consumption of a RESTful API built with Python and Flask. It uses the [RAWG Video Games Database API](https://rawg.io/apidocs) as an outside data source, allowing users to search for real games and save them to their personal collection.

The application performs full **CRUD (Create, Read, Update, Delete)** operations across three related MySQL database tables: games, reviews and wishlist.

---

## Features

- 🔍 Search for games using the RAWG API
- 💾 Save games to your personal collection
- ⭐ Write and manage reviews for saved games
- 🎯 Maintain a wishlist with priority levels and notes
- 🔗 Full CRUD operations on all three tables
- 🎨 Clean responsive UI

---

## Built With

| Layer | Technology |
|-------|------------|
| Backend | Python & Flask |
| Database | MySQL |
| Frontend | HTML, CSS, JavaScript |
| API Calls | jQuery AJAX with async/await |
| External API | RAWG Video Games Database |
| Hosting | PythonAnywhere |

---

## Database Structure

```
game_library
│
├── games
│   ├── id  (PRIMARY KEY)
│   ├── rawg_id
│   ├── title
│   ├── genre
│   ├── image_url
│   └── release_date
│
├── reviews
│   ├── id  (PRIMARY KEY)
│   ├── game_id  (FK → games.id)
│   ├── recommended
│   ├── comment
│   └── date_added
│
└── wishlist
    ├── id  (PRIMARY KEY)
    ├── game_id  (FK → games.id)
    ├── priority
    ├── notes
    └── date_added
```

---

## API Endpoints

### Games
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/games` | Get all saved games |
| `GET` | `/api/games/<id>` | Get a single game |
| `POST` | `/api/games` | Save a new game from RAWG |
| `PUT` | `/api/games/<id>` | Update a game |
| `DELETE` | `/api/games/<id>` | Delete a game |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/reviews/<game_id>` | Get all reviews for a game |
| `POST` | `/api/reviews` | Add a new review |
| `PUT` | `/api/reviews/<id>` | Edit a review |
| `DELETE` | `/api/reviews/<id>` | Delete a review |

### Wishlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/wishlist` | Get all wishlist entries |
| `POST` | `/api/wishlist` | Add a game to wishlist |
| `PUT` | `/api/wishlist/<id>` | Update a wishlist entry |
| `DELETE` | `/api/wishlist/<id>` | Remove from wishlist |

### RAWG Search
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/search/<game_name>` | Search RAWG for a game by name |

---

## Repo Structure

```
WSAA-Project/
├── app.py                  # Flask app and API routes
├── GAMEdao.py              # All database operations
├── requirements.txt        # Python dependencies
├── references.md           # References used for Project
├── config.py               # MySQL credentials & RAWG API key - stored in .gitignore
├── README.md               
└── static_pages/
    ├── index.html          # Main web page
    ├── app.js              # JavaScript and jQuery AJAX calls
    └── style.css           # Styling
```

---

## Getting Started

### Prerequisites
- Python 3.13.9
- MySQL / WAMP
- A free RAWG API key from [rawg.io/apidocs](https://rawg.io/apidocs)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/NibnabCodes/WSAA-Project.git
cd WSAA-Project
```

**2. Install dependencies**
```bash
pip install -r requirements.txt
```

**3. Set up the database**

Start WAMP, open phpMyAdmin, create a database called `game_library` and run the following SQL:

```sql
CREATE TABLE games (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    rawg_id      INT,
    title        VARCHAR(255),
    genre        VARCHAR(100),
    image_url    VARCHAR(500),
    release_date DATE
);

CREATE TABLE reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    game_id     INT NOT NULL,
    recommended BOOLEAN,
    comment     TEXT,
    date_added  DATETIME,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

CREATE TABLE wishlist (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    game_id     INT NOT NULL,
    priority    ENUM('High', 'Medium', 'Low'),
    notes       VARCHAR(500),
    date_added  DATETIME,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);
```  

**4. Configure database credentials**

Open `app.py` and update your MySQL connection details:
```python
app.config["MYSQL_HOST"]     = "localhost"
app.config["MYSQL_USER"]     = "root"
app.config["MYSQL_PASSWORD"] = "your_password"
app.config["MYSQL_DB"]       = "game_library"
```

**5. Add your RAWG API key**

Open `app.py` and replace `YOUR_RAWG_API_KEY` with your actual key.

**6. Run the application**
```bash
python app.py
```

**7. Open your browser**
```
http://localhost:5000
```

---

## Hosted Version

The live version of this application is hosted on PythonAnywhere:

🌐 **[https://nibnab.pythonanywhere.com/](https://nibnab.pythonanywhere.com/)**
