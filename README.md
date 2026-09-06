# Spotify Backend

A Node.js/Express backend that replicates core Spotify-like functionality — user authentication, music uploads, and album management — using MongoDB for storage and ImageKit for audio file hosting.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB (via Mongoose)
- **Auth:** JWT (stored in HTTP cookies) + bcryptjs for password hashing
- **File Uploads:** Multer (in-memory storage) + ImageKit for cloud storage
- **Env Management:** dotenv

## Project Structure

```
Spotify-backend/
├── server.js                      # App entry point
├── src/
│   ├── app.js                     # Express app setup & route mounting
│   ├── db/
│   │   └── db.js                  # MongoDB connection
│   ├── models/
│   │   ├── user.model.js          # User schema (username, email, password, role)
│   │   ├── music.model.js         # Music schema (uri, title, artist)
│   │   └── album.model.js         # Album schema (title, artist, musics[])
│   ├── controllers/
│   │   ├── auth.controller.js     # Register, login, logout
│   │   └── music.controller.js    # Upload music, create album, fetch music/albums
│   ├── middlewares/
│   │   └── auth.middleware.js     # authArtist & authUser route guards
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── music.routes.js
│   └── services/
│       └── storage.services.js    # ImageKit upload integration
```

## Prerequisites

- Node.js (v18+ recommended)
- A MongoDB instance (local or Atlas)
- An [ImageKit](https://imagekit.io/) account for audio file storage

## Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/adunic/Spotify-backend.git
   cd Spotify-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the project root:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   ```

4. **Run the server**
   ```bash
   node server.js
   ```

   The server starts on `http://localhost:3000`.

## Authentication & Roles

Users have a `role` of either `user` or `artist` (default: `user`). On register/login, a JWT is issued and set as an httpOnly-style cookie named `token`. Two role-based middlewares guard the music routes:

- `authArtist` — only requests from users with `role: 'artist'` are allowed
- `authUser` — only requests from users with `role: 'user'` are allowed

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint    | Description                  | Body                                          |
|--------|-------------|-------------------------------|------------------------------------------------|
| POST   | `/register` | Register a new user           | `username, email, password, role` (JSON)       |
| POST   | `/login`    | Log in and receive a token cookie | `username or email, password` (JSON)       |
| POST   | `/logout`   | Clear the auth cookie         | —                                                |

### Music (`/api/music`)

| Method | Endpoint         | Access   | Description                                  | Body                                              |
|--------|------------------|----------|-----------------------------------------------|-----------------------------------------------------|
| POST   | `/upload`        | Artist   | Upload a music file                           | `form-data`: `music` (File), `title` (Text)         |
| POST   | `/album`         | Artist   | Create an album from existing music tracks    | `title, musics` (JSON, `musics` = array of music IDs) |
| GET    | `/`              | User     | List all uploaded music                       | —                                                    |
| GET    | `/albums`        | User     | List all albums (with artist & music details populated) | —                                       |
| GET    | `/albums/:albumId` | User   | Get a single album by ID                      | —                                                    |

**Uploading music via Postman:** set the body type to `form-data`, add a `music` key with type **File** and select an audio file, and a `title` key with type **Text**. Make sure you're authenticated as a user with the `artist` role (the `token` cookie must be present).

## Notes

- Model reference names (`ref` in schemas) are lowercase (`'user'`, `'music'`, `'album'`) — keep this consistent if you add new models or population logic, since Mongoose model lookups are case-sensitive.
- `.env` and `node_modules/` are gitignored; make sure to set up your own `.env` before running.

## License

ISC
