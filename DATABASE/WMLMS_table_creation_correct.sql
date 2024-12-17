-- Création de l'utilisateur app
DROP USER app CASCADE;

CREATE USER app IDENTIFIED BY apppassword;
GRANT CONNECT, RESOURCE TO app;
-- RESOURCE permet à l'utilisateur de créer des objets dans sa propre schéma (tables, vues, procédures, etc.)

-- Création de l'utilisateur admin (appelé admin_app car username admin déjà utilisé pour un autre projet)

DROP USER admin_app CASCADE;

CREATE USER admin_app IDENTIFIED BY adminpassword;
GRANT CONNECT, DBA TO admin_app;
GRANT UNLIMITED TABLESPACE TO admin_app;

DROP SEQUENCE  user_id_sequence;

CREATE SEQUENCE user_id_sequence
MINVALUE 0
START WITH 0
INCREMENT BY 1
NOCYCLE;

DROP SEQUENCE  artist_id_sequence;

CREATE SEQUENCE artist_id_sequence
MINVALUE 0
START WITH 0
INCREMENT BY 1
NOCYCLE;

DROP TABLE users CASCADE CONSTRAINTS PURGE;

CREATE TABLE users (
    user_id INTEGER DEFAULT user_id_sequence.NEXTVAL PRIMARY KEY,
    username VARCHAR2(50) NOT NULL,
    password VARCHAR2(50) NOT NULL,
    email VARCHAR2(100),
    full_name VARCHAR2(100)
);

-- Table artists

DROP TABLE artists CASCADE CONSTRAINTS PURGE;

CREATE TABLE artists (
    artist_id INTEGER DEFAULT artist_id_sequence.NEXTVAL PRIMARY KEY,
    artist_name VARCHAR2(100) NOT NULL,
    bio VARCHAR2(500),
    country VARCHAR2(50)
);

-- Table songs

DROP TABLE songs CASCADE CONSTRAINTS PURGE;

CREATE TABLE songs (
    song_id INTEGER PRIMARY KEY,
    title VARCHAR2(100) NOT NULL,
    artist_id INTEGER,
    genre VARCHAR2(50),
    release_date DATE,
    album VARCHAR2(100),
    song_url VARCHAR2(500),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- Table playlists

DROP TABLE playlists CASCADE CONSTRAINTS PURGE;

CREATE TABLE playlists (
    playlist_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR2(100) NOT NULL,
    is_public CHAR DEFAULT 'N',
    creation_date DATE DEFAULT SYSDATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table playlist_songs (pour gérer les chansons dans une playlist)

DROP TABLE playlist_songs CASCADE CONSTRAINTS PURGE;

CREATE TABLE playlist_songs (
    playlist_id INTEGER,
    song_id INTEGER,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);


-- Vues pour l'utilisateur (app)
-- Les utilisateurs (app) auront accès aux chansons, playlists, et pourront gérer leurs propres playlists.

DROP VIEW app_view_songs;

CREATE VIEW app_view_songs AS
SELECT song_id, title, artist_name, genre, release_date, album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id;

DROP VIEW app_view_playlists;

CREATE VIEW app_view_playlists AS
SELECT p.playlist_id, p.name, p.is_public, p.creation_date, u.username AS user_name
FROM playlists p
JOIN users u ON p.user_id = u.user_id;

-- Vues pour l'admin
-- Les administrateurs auront un accès complet aux tables pour gérer les utilisateurs, les chansons, et les artistes.

DROP VIEW admin_view_users;

CREATE VIEW admin_view_users AS
SELECT user_id, username, full_name, email
FROM users;

DROP VIEW  admin_view_artists;

CREATE VIEW admin_view_artists AS
SELECT artist_id, artist_name, bio, country
FROM artists;

DROP VIEW admin_view_songs;

CREATE VIEW admin_view_songs AS
SELECT song_id, title, artist_name, genre, release_date, album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id;

-- III. Création de vues pour les utilisateurs et l'admin

-- Vues pour l'utilisateur (app)
-- Les utilisateurs (app) auront accès aux chansons, playlists, et pourront gérer leurs propres playlists.

GRANT SELECT ON app_view_songs TO app;
GRANT SELECT ON app_view_playlists TO app;
GRANT INSERT, UPDATE, DELETE ON playlists TO app;


-- Privilèges pour admin_app
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON artists TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON songs TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlists TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlist_songs TO admin_app;


-- Ajout d'utilisateurs (on laisse SYS_GUID générer un identifiant unique)
INSERT INTO users (username, password, email, full_name)
VALUES ('user1', 'password1', 'user1@example.com', 'User One');

INSERT INTO users (username, password, email, full_name)
VALUES ('user2', 'password2', 'user2@example.com', 'User Two');

-- Ajout d'artistes (on laisse SYS_GUID générer un identifiant unique)
INSERT INTO artists (artist_name, bio, country)
VALUES ('Artist One', 'Bio of Artist One', 'Country A');

INSERT INTO artists (artist_name, bio, country)
VALUES ('Artist Two', 'Bio of Artist Two', 'Country B');

-- Ajout de chansons
INSERT INTO songs (song_id, title, artist_id, genre, release_date, album, song_url)
VALUES (1, 'Song One', 0, 'Pop', TO_DATE('2024-01-01', 'YYYY-MM-DD'), 'Album A', 'http://example.com/song1.mp3');

INSERT INTO songs (song_id, title, artist_id, genre, release_date, album, song_url)
VALUES (2, 'Song Two', 1, 'Rock', TO_DATE('2024-02-01', 'YYYY-MM-DD'), 'Album B', 'http://example.com/song2.mp3');

