<div align="center">

# WSAA-Project 🎮

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Bitcount+Ink&size=35&duration=2000&pause=2000&color=B842BD&background=FF86E800&width=435&lines=GameVault)](https://git.io/typing-svg)

> A RESTful Flask web application for managing your personal game collection.

</div>

---

## About The Project

This repository contains my final project completed as part of the 
assessment requirements for the *Web Services & Applications* module 
at Atlantic Technological University ~ Galway.

In this project I demonstrate the creation and consumption of a 
RESTful API built with Python and Flask. I used the 
[RAWG Video Games Database API](https://rawg.io/apidocs) as an 
outside data source, allowing me to search for real games and save 
them to my personal collection.

The application performs full **CRUD (Create, Read, Update, Delete)** 
operations across three related MySQL database tables: games, reviews 
and wishlist. 


---

## Features

- 🔍 Search for games using the RAWG API
- 💾 Save games to your personal collection
- ⭐ Write and manage reviews for saved games
- 🎯 Maintain a wishlist with priority levels and notes
- 🔗 Full CRUD operations on all three tables
- 🎨 Cyberpunk themed responsive UI

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
├── config_template.py      # Template for config.py setup
├── requirements.txt        # Python dependencies
├── README.md               
└── static_pages/
    ├── index.html          # Main web page
    ├── app.js              # JavaScript and jQuery AJAX calls
    └── style.css           # Cyberpunk themed styling
```

⚠️ `config.py` contains sensitive credentials and is excluded from this repository via `.gitignore`

---

## Dependencies

The following libraries are required to run this project:

- **Python** 3.13.9
- **Flask** – Web framework for building the REST API
- **mysql-connector-python** – Connects Python to the MySQL database
- **requests** – Makes HTTP requests to the RAWG external API

All dependencies are listed in `requirements.txt` and can be installed by running:
```bash
pip install -r requirements.txt
```

---

## Environment Setup

- **Git** – Download the latest version of Git at: https://git-scm.com/downloads
- **GitHub** – Create a free GitHub account at: https://github.com/signup
- **WAMP** – Download WAMP for local MySQL database at: https://www.wampserver.com
- **Anaconda** – Recommended as it comes bundled with Python 3.13.9. Install using the following steps:
  1. Download Anaconda from: https://www.anaconda.com/download
  2. Open the downloaded file and press next, next
  3. When the advanced options appear check the following boxes:
     * Add to PATH environment variable
     * Make this version your default Python
- **Visual Studio Code** – Download at: https://code.visualstudio.com/Download

---

## Getting Started

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

**4. Set up your config file**

- Copy `config_template.py` and rename it to `config.py`
- Fill in your own MySQL credentials and RAWG API key:

```python
mysql = {
    'host': 'localhost',
    'user': 'your_mysql_username',
    'password': 'your_mysql_password',
    'database': 'game_library'
}

rawg = {
    'api_key': 'your_rawg_api_key'
}
```

⚠️ Never share or commit your `config.py` file. It is excluded from this repository via `.gitignore`.

**5. Run the application**
```bash
python app.py
```

**6. Open your browser**
```
http://localhost:5000
```

---

## Hosted Version

The live version of this application is hosted on PythonAnywhere:

🌐 **[https://nibnab.pythonanywhere.com/](https://nibnab.pythonanywhere.com/)**

---

## References

References for each file are documented within that file as comments. Please see below:

- `app.py` 
- `GAMEdao.py` 
- `index.html`
- `app.js`
- `style.css`

