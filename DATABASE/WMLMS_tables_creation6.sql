-- I. Création des utilisateurs de base de données (app et admin)

-- Création de l'utilisateur app
CREATE USER app IDENTIFIED BY apppassword;
GRANT CONNECT, RESOURCE TO app;
-- RESOURCE permet à l'utilisateur de créer des objets dans sa propre schéma (tables, vues, procédures, etc.)

-- Création de l'utilisateur admin (appelé admin_app car username admin déjà utilisé pour un autre projet)
CREATE USER admin_app IDENTIFIED BY adminpassword;
GRANT CONNECT, DBA TO admin_app;
GRANT UNLIMITED TABLESPACE TO admin_app;
-- DBA permet à l'utilisateur admin_app d'exécuter des tâches d'administration de base de données (création d'utilisateurs, gestion des privilèges, etc.)
-- et en tant qu'admin, on doit pouvoir ajouter ou supprimer des lignes



-- II. Création des tables pour les utilisateurs (app et admin)

-- Table users
CREATE TABLE users (
    user_id NUMBER PRIMARY KEY,
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



-- V. UPDATE fin nov : améliorer la bdd

-- Ajout de contraintes uniques pour les colonnes où la duplication n'est pas permise, comme username, email, ou song_url

ALTER TABLE users ADD CONSTRAINT uq_users_username UNIQUE (username);

ALTER TABLE users ADD CONSTRAINT uq_users_email UNIQUE (email);

ALTER TABLE artists ADD CONSTRAINT uq_artists_artist_name UNIQUE (artist_name);

ALTER TABLE songs ADD CONSTRAINT uq_songs_song_url UNIQUE (song_url);


-- Séquences pour générer automatiquement des IDs uniques dans les tables users, artists, songs, et playlists : 

CREATE SEQUENCE seq_users START WITH 3 INCREMENT BY 1; -- Commence après les ID déjà présents

CREATE SEQUENCE seq_artists START WITH 3 INCREMENT BY 1;

CREATE SEQUENCE seq_songs START WITH 3 INCREMENT BY 1;

CREATE SEQUENCE seq_playlists START WITH 1 INCREMENT BY 1;


-- Ajout de triggers qui insèrent automatiquement un ID lors de l'insertion dans les tables

-- Trigger pour users
CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        SELECT seq_users.NEXTVAL INTO :NEW.user_id FROM dual;
    END IF;
END;
/

-- Trigger pour artists
CREATE OR REPLACE TRIGGER trg_artists_id
BEFORE INSERT ON artists
FOR EACH ROW
BEGIN
    IF :NEW.artist_id IS NULL THEN
        SELECT seq_artists.NEXTVAL INTO :NEW.artist_id FROM dual;
    END IF;
END;
/

-- Trigger pour songs
CREATE OR REPLACE TRIGGER trg_songs_id
BEFORE INSERT ON songs
FOR EACH ROW
BEGIN
    IF :NEW.song_id IS NULL THEN
        SELECT seq_songs.NEXTVAL INTO :NEW.song_id FROM dual;
    END IF;
END;
/

-- Trigger pour playlists
CREATE OR REPLACE TRIGGER trg_playlists_id
BEFORE INSERT ON playlists
FOR EACH ROW
BEGIN
    IF :NEW.playlist_id IS NULL THEN
        SELECT seq_playlists.NEXTVAL INTO :NEW.playlist_id FROM dual;
    END IF;
END;
/


-- Ajout de colonnes pour audit et description : 

-- Ajout des colonnes created_at et updated_at pour les utilisateurs
ALTER TABLE users ADD (created_at DATE DEFAULT SYSDATE, updated_at DATE DEFAULT SYSDATE);

-- Ajout des colonnes created_at et updated_at pour les artistes
ALTER TABLE artists ADD (created_at DATE DEFAULT SYSDATE, updated_at DATE DEFAULT SYSDATE);

-- Ajout d'une colonne description pour les playlists
ALTER TABLE playlists ADD (description VARCHAR2(500));


-- Mise à jour des contraintes de clé étrangère : si une ligne dans la table parent est supprimée, toutes les lignes dans la table enfant qui font référence à cette ligne seront également supprimées (grâce à ON DELETE CASCADE). ex : si un artiste (artists) est supprimé, toutes ses chansons (songs) associées sont également supprimées.
-- ON DELETE SET NULL : si une ligne dans la table parent est supprimée, toutes les lignes dans la table enfant qui font référence à cette ligne auront leur clé étrangère définie à NULL. ex : si un artiste est supprimé, les chansons associées conservent leurs données mais artist_id est mis à NULL.

-- Mise à jour de la contrainte pour artist_id dans songs
ALTER TABLE songs DROP CONSTRAINT SYS_C008245;
ALTER TABLE songs ADD CONSTRAINT fk_songs_artist_id
FOREIGN KEY (artist_id) REFERENCES artists(artist_id) ON DELETE SET NULL;

-- Mise à jour de la contrainte pour user_id dans playlists
-- ALTER TABLE playlists DROP CONSTRAINT SYS_C008271;
- ALTER TABLE playlists ADD CONSTRAINT fk_playlists_user_id
-- FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE;

-- Mise à jour de la contrainte pour playlist_id dans playlist_songs
-- ALTER TABLE playlist_songs DROP CONSTRAINT SYS_C008273;
-- ALTER TABLE playlist_songs ADD CONSTRAINT fk_playlist_songs_playlist_id
-- FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id) ON DELETE CASCADE;

-- Mise à jour de la contrainte pour song_id dans playlist_songs
-- ALTER TABLE playlist_songs DROP CONSTRAINT SYS_C008274;
-- ALTER TABLE playlist_songs ADD CONSTRAINT fk_playlist_songs_song_id
-- FOREIGN KEY (song_id) REFERENCES songs(song_id) ON DELETE CASCADE;


-- Colonnes updated_at : maj automatiquement la colonne updated_at lors des modifications avec des triggers : 
CREATE OR REPLACE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSDATE;
END;
/


-- Ajout de données dans la table playlists
INSERT INTO playlists (user_id, name, is_public, description)
VALUES (1, 'My Favorite Songs', 'Y', 'Playlist publique avec mes chansons préférées');

INSERT INTO playlists (user_id, name, is_public, description)
VALUES (2, 'Playlist 1', 'N', 'Playlist privée n°1');

-- Ajout de données dans la table playlist_songs
-- La table playlist_songs fait la jonction entre les playlists et les songs. Il faut spécifier l'ID de la playlist et l'ID de la musique à ajouter.
-- Insertion de chansons dans les playlists
INSERT INTO playlist_songs (playlist_id, song_id)
VALUES (1, 1); -- La chanson avec ID 1 est ajoutée à la playlist avec ID 1

INSERT INTO playlist_songs (playlist_id, song_id)
VALUES (1, 2); -- La chanson avec ID 2 est ajoutée à la playlist avec ID 1

INSERT INTO playlist_songs (playlist_id, song_id)
VALUES (2, 1); -- La chanson avec ID 1 est ajoutée à la playlist avec ID 2



-- VI. UPDATE début décembre : améliorer la bdd avec ADBM

-- Renommer la table 'songs' en 'tracks'
ALTER TABLE songs RENAME TO tracks;
ALTER TABLE playlist_songs RENAME TO playlist_tracks;
ALTER TABLE playlist_tracks RENAME COLUMN song_id TO track_id;

-- Renommer la colonne 'song_id' en 'track_id'
ALTER TABLE tracks RENAME COLUMN song_id TO track_id;

-- Modifier la table 'tracks' pour ajouter les nouvelles colonnes
ALTER TABLE tracks ADD popularity NUMBER;
ALTER TABLE tracks ADD duration_ms NUMBER;
ALTER TABLE tracks ADD explicit NUMBER(1);
ALTER TABLE tracks ADD danceability NUMBER;
ALTER TABLE tracks ADD energy NUMBER;
ALTER TABLE tracks ADD "key" NUMBER;
ALTER TABLE tracks ADD loudness NUMBER;
ALTER TABLE tracks ADD mode NUMBER;
ALTER TABLE tracks ADD speechiness NUMBER;
ALTER TABLE tracks ADD acousticness NUMBER;
ALTER TABLE tracks ADD instrumentalness NUMBER;
ALTER TABLE tracks ADD liveness NUMBER;
ALTER TABLE tracks ADD valence NUMBER;
ALTER TABLE tracks ADD tempo NUMBER;
ALTER TABLE tracks ADD time_signature NUMBER;

-- Créer la table 'albums'
CREATE TABLE albums (
    album_id NUMBER PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    release_date DATE
);

-- Ajouter la colonne 'album_id' à la table 'tracks'
ALTER TABLE tracks ADD album_id NUMBER;


-- Ajouter la contrainte de clé étrangère pour 'album_id' dans 'tracks'
ALTER TABLE tracks ADD CONSTRAINT fk_tracks_album_id 
FOREIGN KEY (album_id) REFERENCES albums(album_id);

-- Créer la table de liaison 'track_artists'
CREATE TABLE track_artists (
    track_id NUMBER,
    artist_id NUMBER,
    PRIMARY KEY (track_id, artist_id),
    FOREIGN KEY (track_id) REFERENCES tracks(track_id),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

-- Supprimer les colonnes non nécessaires de la table 'tracks'
ALTER TABLE tracks DROP COLUMN song_url;

-- Mettre à jour les contraintes de la table 'playlist_songs'
ALTER TABLE playlist_tracks DROP CONSTRAINT fk_playlist_songs_song_id;
ALTER TABLE playlist_tracks ADD CONSTRAINT fk_playlist_tracks_track_id
FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE;
ALTER TABLE playlist_tracks ADD CONSTRAINT fk_playlist_tracks_track_id
FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE;


-- Création d'un répertoire Oracle pour pointer vers le dossier contenant les fichiers CSV
CREATE OR REPLACE DIRECTORY data_dir AS '/chemin/vers/votre/dossier';
-- perso : 'D:\Kyl\4 Ecole\S7\SW engineering\WMLMS'

-- Créer les tables externes pour les fichiers CSV (pour lire directement les données à partir des fichiers CSV sans avoir à les importer physiquement dans la bdd):
CREATE TABLE ext_spotify_artists (
  id VARCHAR2(22),
  name VARCHAR2(255),
  popularity NUMBER,
  genres VARCHAR2(1000)
)
ORGANIZATION EXTERNAL (
  TYPE ORACLE_LOADER
  DEFAULT DIRECTORY data_dir
  ACCESS PARAMETERS (
    RECORDS DELIMITED BY NEWLINE
    SKIP 1
    FIELDS TERMINATED BY ','
    OPTIONALLY ENCLOSED BY '"'
    MISSING FIELD VALUES ARE NULL
  )
  LOCATION ('artists.csv')
)
REJECT LIMIT UNLIMITED;

CREATE TABLE ext_spotify_tracks (
    id VARCHAR2(22),
    name VARCHAR2(255),
    popularity NUMBER,
    duration_ms NUMBER,
    explicit NUMBER(1),
    artists VARCHAR2(4000),
    id_artists VARCHAR2(4000),
    release_date VARCHAR2(10),
    danceability NUMBER,
    energy NUMBER,
    "key" NUMBER,
    loudness NUMBER,
    "mode" NUMBER,
    speechiness NUMBER,
    acousticness NUMBER,
    instrumentalness NUMBER,
    liveness NUMBER,
    valence NUMBER,
    tempo NUMBER,
    time_signature NUMBER
) ORGANIZATION EXTERNAL (
    TYPE ORACLE_LOADER
    DEFAULT DIRECTORY data_dir
    ACCESS PARAMETERS (
        RECORDS DELIMITED BY NEWLINE
        SKIP 1
        FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' 
        MISSING FIELD VALUES ARE NULL 
        READSIZE 1048576
    )
    LOCATION ('tracks.csv')
) REJECT LIMIT UNLIMITED;



-- Corriger le déclencheur avec track au lieu de song : 
CREATE OR REPLACE TRIGGER trg_songs_id 
BEFORE INSERT ON tracks 
FOR EACH ROW 
BEGIN 
    IF :NEW.track_id IS NULL THEN 
        SELECT seq_songs.NEXTVAL INTO :NEW.track_id FROM dual; 
    END IF; 
END;
/

ALTER TRIGGER trg_songs_id COMPILE;




-- Importer les données dans les tables 'artists' et 'tracks'











