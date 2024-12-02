-- Pour se connecter au pdb : sqlplus admin/admin@wmlmwpdb ou sqlplus sys/password@wmlmwpdb as sysdba ou sqlplus sys@wmlmwpdb as sysdba
-- Pour utiliser le fichier :  @"D:\Kyl\4 Ecole\S7\SW engineering\WMLMS\WMLMS_tables_creation6.sql"

-- I. Création des utilisateurs de base de données (app et admin)

-- Création de l'utilisateur app
CREATE USER app IDENTIFIED BY apppassword;
GRANT CONNECT, RESOURCE TO app;
-- RESOURCE permet à l'utilisateur de créer des objets dans sa propre schéma (tables, vues, procédures, etc.)

-- Création de l'utilisateur admin
CREATE USER admin_app IDENTIFIED BY adminpassword;
GRANT CONNECT, DBA TO admin_app;
-- DBA permet à l'utilisateur admin_app d'exécuter des tâches d'administration de base de données (création d'utilisateurs, gestion des privilèges, etc.)



-- II. Création des tables pour les utilisateurs (app et admin)

-- Table users
DROP TABLE IF EXISTS users
CREATE TABLE users (
    user_id RAW(16) DEFAULT SYS_GUID() NUMBER PRIMARY KEY,
    username VARCHAR2(50) NOT NULL,
    password VARCHAR2(50) NOT NULL,
    email VARCHAR2(100),
    full_name VARCHAR2(100)
);

-- Table artists
CREATE TABLE artists (
    artist_id NUMBER PRIMARY KEY,
    artist_name VARCHAR2(100) NOT NULL,
    bio VARCHAR2(500),
    country VARCHAR2(50)
);

-- Table songs
CREATE TABLE songs (
    song_id NUMBER PRIMARY KEY,
    title VARCHAR2(100) NOT NULL,
    artist_id NUMBER,
    genre VARCHAR2(50),
    release_date DATE,
    album VARCHAR2(100),
    song_url VARCHAR2(500),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- Table playlists
CREATE TABLE playlists (
    playlist_id NUMBER PRIMARY KEY,
    user_id NUMBER,
    name VARCHAR2(100) NOT NULL,
    is_public CHAR(1) DEFAULT 'N',
    creation_date DATE DEFAULT SYSDATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table playlist_songs (pour gérer les chansons dans une playlist)
CREATE TABLE playlist_songs (
    playlist_id NUMBER,
    song_id NUMBER,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);



-- III. Création de vues pour les utilisateurs et l'admin

-- Vues pour l'utilisateur (app)
-- Les utilisateurs (app) auront accès aux chansons, playlists, et pourront gérer leurs propres playlists.

CREATE VIEW app_view_songs AS
SELECT song_id, title, artist_name, genre, release_date, album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id;

CREATE VIEW app_view_playlists AS
SELECT p.playlist_id, p.name, p.is_public, p.creation_date, u.username AS user_name
FROM playlists p
JOIN users u ON p.user_id = u.user_id;

-- Vues pour l'admin
-- Les administrateurs auront un accès complet aux tables pour gérer les utilisateurs, les chansons, et les artistes.
CREATE VIEW admin_view_users AS
SELECT user_id, username, full_name, email
FROM users;

CREATE VIEW admin_view_artists AS
SELECT artist_id, artist_name, bio, country
FROM artists;

CREATE VIEW admin_view_songs AS
SELECT song_id, title, artist_name, genre, release_date, album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id;



-- IV. Privilèges d'accès aux tables et vues

-- Privilèges d'accès aux tables et vues
GRANT SELECT ON app_view_songs TO app;
GRANT SELECT ON app_view_playlists TO app;
GRANT INSERT, UPDATE, DELETE ON playlists TO app;

-- Privilèges pour admin_app
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON artists TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON songs TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlists TO admin_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlist_songs TO admin_app;



-- V. Ajout de données d'exemple (users, artists, songs)

-- Ajout d'utilisateurs
INSERT INTO users (user_id, username, password, email, full_name)
VALUES (1, 'user1', 'password1', 'user1@example.com', 'User One');

INSERT INTO users (user_id, username, password, email, full_name)
VALUES (2, 'user2', 'password2', 'user2@example.com', 'User Two');

-- Ajout d'artistes
INSERT INTO artists (artist_id, artist_name, bio, country)
VALUES (1, 'Artist One', 'Bio of Artist One', 'Country A');

INSERT INTO artists (artist_id, artist_name, bio, country)
VALUES (2, 'Artist Two', 'Bio of Artist Two', 'Country B');

-- Ajout de chansons
INSERT INTO songs (song_id, title, artist_id, genre, release_date, album, song_url)
VALUES (1, 'Song One', 1, 'Pop', TO_DATE('2024-01-01', 'YYYY-MM-DD'), 'Album A', 'http://example.com/song1.mp3');

INSERT INTO songs (song_id, title, artist_id, genre, release_date, album, song_url)
VALUES (2, 'Song Two', 2, 'Rock', TO_DATE('2024-02-01', 'YYYY-MM-DD'), 'Album B', 'http://example.com/song2.mp3');



