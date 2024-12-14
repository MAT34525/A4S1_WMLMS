-- Pour supprimer les données précédentes, si besoin : 
/*
DROP VIEW app_view_songs;
DROP VIEW app_view_playlists;
DROP VIEW admin_view_users;
DROP VIEW admin_view_artists;
DROP VIEW admin_view_songs;
DROP TABLE playlist_tracks CASCADE CONSTRAINTS;
DROP TABLE track_artists CASCADE CONSTRAINTS;
DROP TABLE tracks CASCADE CONSTRAINTS;
DROP TABLE playlists CASCADE CONSTRAINTS;
DROP TABLE artists CASCADE CONSTRAINTS;
DROP TABLE users CASCADE CONSTRAINTS;
DROP TABLE albums CASCADE CONSTRAINTS;
DROP SEQUENCE seq_users;
DROP SEQUENCE seq_artists;
DROP SEQUENCE seq_songs;
DROP SEQUENCE seq_playlists;
DROP USER app CASCADE;
DROP USER admin_app CASCADE;
DROP DIRECTORY data_dir;
DROP FUNCTION generate_uuid;
*/
-- peut-être qu'il restera des choses, à supprimer avec un DROP TABLE ou DROP SEQUENCE ou DROP USER


-- CHAPTER 1 : Preparing your relational schema

-- Fonction pour générer des UUID (au lieu de auto increment)
CREATE OR REPLACE FUNCTION generate_uuid RETURN VARCHAR2 IS
BEGIN
    RETURN LOWER(REGEXP_REPLACE(RAWTOHEX(SYS_GUID()), '([A-F0-9]{8})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{4})([A-F0-9]{12})', '\1-\2-\3-\4-\5'));
END;
/
-- Comme fonction generate_uuid() ne peut pas être utilisée directement dans la définition d'une table,
-- il faut utiliser un trigger pour générer l'UUID lors de l'insertion

-- 1.3 Populating the tables

-- Table artists
CREATE TABLE artists (
    artist_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    followers NUMBER,
    genres VARCHAR2(1000),
    popularity NUMBER,
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE);
    
CREATE OR REPLACE TRIGGER trg_artists_id
BEFORE INSERT ON artists
FOR EACH ROW
BEGIN
    IF :NEW.artist_id IS NULL THEN
        :NEW.artist_id := generate_uuid();
    END IF;
END;
/

-- Table albums
CREATE TABLE albums (
    album_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    release_date DATE,
    artist_id VARCHAR2(36),
    FOREIGN KEY (artist_id) REFERENCES artists(artist_id));

CREATE OR REPLACE TRIGGER trg_albums_id
BEFORE INSERT ON albums
FOR EACH ROW
BEGIN
    IF :NEW.album_id IS NULL THEN
        :NEW.album_id := generate_uuid();
    END IF;
END;
/

-- Table tracks
CREATE TABLE tracks (
    track_id VARCHAR2(36) PRIMARY KEY,
    name VARCHAR2(255) NOT NULL,
    artists VARCHAR2(1000),
    id_artists VARCHAR2(1000),
    duration_ms NUMBER,
    explicit NUMBER(1),
    release_date DATE,
    time_signature NUMBER,
    album_id VARCHAR2(36),
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE,
    FOREIGN KEY (album_id) REFERENCES albums(album_id));

CREATE OR REPLACE TRIGGER trg_tracks_id
BEFORE INSERT ON tracks
FOR EACH ROW
BEGIN
    IF :NEW.track_id IS NULL THEN
        :NEW.track_id := generate_uuid();
    END IF;
END;
/

-- Table tracks_audio_features
CREATE TABLE tracks_audio_features (
    track_id VARCHAR2(36) PRIMARY KEY,
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
    FOREIGN KEY (track_id) REFERENCES tracks(track_id));

-- Table users
CREATE TABLE users (
    user_id VARCHAR2(36) PRIMARY KEY,
    username VARCHAR2(50) UNIQUE NOT NULL,
    password VARCHAR2(256) NOT NULL,
    email VARCHAR2(100) UNIQUE,
    full_name VARCHAR2(100),
    is_artist CHAR(1) DEFAULT 'N',
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE);

CREATE OR REPLACE TRIGGER trg_users_id
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF :NEW.user_id IS NULL THEN
        :NEW.user_id := generate_uuid();
    END IF;
END;
/

-- Table playlists
CREATE TABLE playlists (
    playlist_id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36),
    name VARCHAR2(100) NOT NULL,
    description VARCHAR2(500),
    is_public CHAR(1) DEFAULT 'N',
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id));

CREATE OR REPLACE TRIGGER trg_playlists_id
BEFORE INSERT ON playlists
FOR EACH ROW
BEGIN
    IF :NEW.playlist_id IS NULL THEN
        :NEW.playlist_id := generate_uuid();
    END IF;
END;
/

-- Table user_favorite_tracks
CREATE TABLE user_favorite_tracks (
    user_id VARCHAR2(36),
    track_id VARCHAR2(36),
    added_at DATE DEFAULT SYSDATE,
    PRIMARY KEY (user_id, track_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (track_id) REFERENCES tracks(track_id));

-- Pour importer les données des fichiers csv artists.csv, tracks.csv et tracks_audio_features,
-- on créé un répertoire pour les fichiers CSV : 
CREATE OR REPLACE DIRECTORY data_dir AS 'D:\Kyl\4 Ecole\S7\SW engineering\WMLMS'; -- perso, à adapter comme suit
-- CREATE OR REPLACE DIRECTORY data_dir AS '/chemin/vers/votre/dossier';

-- Table externe pour artists.csv
CREATE TABLE ext_artists (
    id VARCHAR2(22),
    followers NUMBER,
    genres VARCHAR2(1000),
    name VARCHAR2(255),
    popularity NUMBER) 
    ORGANIZATION EXTERNAL 
    (TYPE ORACLE_LOADER
    DEFAULT DIRECTORY data_dir
    ACCESS PARAMETERS 
        (RECORDS DELIMITED BY NEWLINE
        SKIP 1
        FIELDS TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
        MISSING FIELD VALUES ARE NULL)
    LOCATION ('artists.csv')) 
    REJECT LIMIT UNLIMITED;

-- Table externe pour tracks.csv
CREATE TABLE ext_tracks (
    id VARCHAR2(22),
    name VARCHAR2(255),
    artists VARCHAR2(1000),
    id_artists VARCHAR2(1000),
    duration_ms NUMBER,
    explicit NUMBER(1),
    release_date VARCHAR2(10),
    time_signature NUMBER) 
    ORGANIZATION EXTERNAL 
    (TYPE ORACLE_LOADER
    DEFAULT DIRECTORY data_dir
    ACCESS PARAMETERS 
        (RECORDS DELIMITED BY NEWLINE
        SKIP 1
        FIELDS TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
        MISSING FIELD VALUES ARE NULL)
    LOCATION ('tracks.csv')) 
    REJECT LIMIT UNLIMITED;

-- Table externe pour tracks_audio_features.csv
CREATE TABLE ext_tracks_audio_features (
    id VARCHAR2(22),
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
    tempo NUMBER) 
    ORGANIZATION EXTERNAL 
    (TYPE ORACLE_LOADER
    DEFAULT DIRECTORY data_dir
    ACCESS PARAMETERS 
        (RECORDS DELIMITED BY NEWLINE
        SKIP 1
        FIELDS TERMINATED BY ','
        OPTIONALLY ENCLOSED BY '"'
        MISSING FIELD VALUES ARE NULL)
    LOCATION ('tracks_audio_features.csv')) 
    REJECT LIMIT UNLIMITED;

-- Importer les données dans les tables
INSERT INTO artists (artist_id, name, followers, genres, popularity)
SELECT id, name, followers, genres, popularity
FROM ext_artists;
-- donne 1 162 088 lignes insérées

INSERT INTO tracks (track_id, name, artists, id_artists, duration_ms, explicit, release_date, time_signature)
SELECT id, 
       CASE 
           WHEN name IS NULL OR TRIM(name) = '' THEN 'Unknown Track' 
           ELSE CONVERT(name, 'UTF8', 'AL32UTF8')
       END,
       CONVERT(artists, 'UTF8', 'AL32UTF8'),
       id_artists,
       duration_ms,
       explicit,
       CASE 
           WHEN REGEXP_LIKE(release_date, '^\d{4}-\d{2}-\d{2}$') THEN TO_DATE(release_date, 'YYYY-MM-DD')
           WHEN REGEXP_LIKE(release_date, '^\d{4}$') THEN TO_DATE(release_date || '-01-01', 'YYYY-MM-DD')
           WHEN REGEXP_LIKE(release_date, '^\d{4}-\d{2}$') THEN TO_DATE(release_date || '-01', 'YYYY-MM-DD')
           ELSE NULL
       END,
       NVL(time_signature, 4)
FROM ext_tracks;
-- car il y a des données où la date n'est qu'une année, et des noms avec des caractères autres que l'alphabet latin
-- donne 586 653 lignes insérées

INSERT INTO tracks_audio_features (track_id, danceability, energy, "key", loudness, "mode", speechiness, acousticness, instrumentalness, liveness, valence, tempo)
SELECT e.id, e.danceability, e.energy, e."key", e.loudness, e."mode", e.speechiness, e.acousticness, e.instrumentalness, e.liveness, e.valence, e.tempo
FROM ext_tracks_audio_features e
INNER JOIN tracks t ON e.id = t.track_id;
-- INNER JOIN pour s'assurer que seules les lignes avec des track_id correspondants dans la table tracks seront insérées dans tracks_audio_features
-- donne 586 653 lignes insérées

-- Ajout de données d'exemple (users, playlists, albums)
-- Ajout d'utilisateurs
INSERT INTO users (username, password, email, full_name, is_artist, created_at, updated_at)
VALUES ('user1', 'password1', 'user1@example.com', 'User One', 'N', SYSDATE, SYSDATE);

INSERT INTO users (username, password, email, full_name, is_artist, created_at, updated_at)
VALUES ('user2', 'password2', 'user2@example.com', 'User Two', 'N', SYSDATE, SYSDATE);

INSERT INTO users (username, password, email, full_name, is_artist, created_at, updated_at)
VALUES ('user3', 'password3', 'user3@example.com', 'User Three', 'Y', SYSDATE, SYSDATE);

INSERT INTO users (username, password, email, full_name, is_artist, created_at, updated_at)
VALUES ('user4', 'password4', 'user4@example.com', 'User Four', 'N', SYSDATE, SYSDATE);

INSERT INTO users (username, password, email, full_name, is_artist, created_at, updated_at)
VALUES ('user5', 'password5', 'userµ5@example.com', 'User Five', 'N', SYSDATE, SYSDATE);

-- Ajout de données dans la table playlists
INSERT INTO playlists (user_id, name, description, is_public)
SELECT user_id, 'Playlist 1', 'Playlist privée n°1', 'N'
FROM users WHERE username = 'user2';

INSERT INTO playlists (user_id, name, description, is_public)
SELECT user_id, 'Playlist 2', 'Playlist privée n°2', 'N' 
FROM users WHERE username = 'user1';

INSERT INTO playlists (user_id, name, description, is_public)
SELECT user_id, 'Playlist 2', 'Playlist privée n°2', 'N' 
FROM users WHERE username = 'user1';

-- Ajout d'albums avec UUID généré par le trigger
INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album One', TO_DATE('2023-01-01', 'YYYY-MM-DD'), 
        (SELECT artist_id FROM artists WHERE name = 'Artist One' FETCH FIRST 1 ROW ONLY));

INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album Two', TO_DATE('2023-02-15', 'YYYY-MM-DD'), 
        (SELECT artist_id FROM artists WHERE name = 'Artist Two' FETCH FIRST 1 ROW ONLY));

INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album Three', TO_DATE('2023-03-30', 'YYYY-MM-DD'), 
        (SELECT artist_id FROM artists WHERE name = 'Artist Three' FETCH FIRST 1 ROW ONLY));

INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album Four', TO_DATE('2023-04-20', 'YYYY-MM-DD'), 
        (SELECT artist_id FROM artists WHERE name = 'Artist Four' FETCH FIRST 1 ROW ONLY));

INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album Five', TO_DATE('2023-05-10', 'YYYY-MM-DD'), 
        (SELECT artist_id FROM artists WHERE name = 'Artist Five' FETCH FIRST 1 ROW ONLY));



-- CHAPTER 2 : Security and user management

-- Création des utilisateurs de base de données, et attribution de privilèges

-- Pour l'utilisateur app
CREATE USER app IDENTIFIED BY apppassword;
GRANT CONNECT, RESOURCE TO app;
-- RESOURCE permet à l'utilisateur de créer des objets dans sa propre schéma (tables, vues, procédures, etc)
GRANT ALL PRIVILEGES TO app;

GRANT CONNECT, DBA TO admin;
GRANT UNLIMITED TABLESPACE TO admin;
-- DBA permet à l'utilisateur admin d'exécuter des tâches d'administration de base de données (création d'utilisateurs, gestion des privilèges, etc)
-- et en tant qu'admin, on doit pouvoir ajouter ou supprimer des lignes
-- Privilèges sur les tables pour admin (accès complet)
GRANT SELECT, INSERT, UPDATE, DELETE ON artists TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON albums TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON tracks TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON tracks_audio_features TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlists TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_favorite_tracks TO admin;

-- Création d'un utilisateur régulier
CREATE USER regular_user IDENTIFIED BY userpassword;
GRANT CONNECT TO regular_user; -- accès en lecture seulement

-- pour voir les users créés : 
-- SELECT username, account_status, created FROM DBA_USERS
-- ORDER BY created DESC;

-- Vue pour les tracks
-- permet aux utilisateurs de l'application d'accéder aux informations essentielles des pistes musicales
-- elle inclut le nom de l'album via une jointure avec la table albums
CREATE OR REPLACE VIEW app_view_tracks AS
SELECT t.track_id, t.name, t.artists, t.duration_ms, t.release_date
FROM tracks t;

-- Vue pour les playlists
-- offre une vue des playlists avec des informations sur leur visibilité et leur créateur
-- utilise une jointure avec la table users pour obtenir le nom d'utilisateur du créateur
CREATE OR REPLACE VIEW app_view_playlists AS
SELECT p.playlist_id, p.name, p.is_public, p.created_at AS creation_date, u.username AS user_name
FROM playlists p
JOIN users u ON p.user_id = u.user_id;

-- Vue pour les utilisateurs (admin)
-- fournit aux admin une vue complète des informations utilisateur
-- inclut des champs comme is_artist et les horodatages de création/màj
CREATE OR REPLACE VIEW admin_view_users AS
SELECT user_id, username, full_name, email, is_artist, created_at, updated_at
FROM users;

-- Vue pour les artistes (admin)
-- donne aux admin un aperçu complet des informations sur les artistes
-- comprend des données comme le nombre de followers et la popularité
CREATE OR REPLACE VIEW admin_view_artists AS
SELECT artist_id, name, followers, genres, popularity
FROM artists;

-- Vue pour les tracks (admin)
-- offre aux administrateurs une vue détaillée des pistes musicales
-- inclut des infos supplémentaires comme la durée et le caractère explicite
CREATE OR REPLACE VIEW admin_view_tracks AS
SELECT t.track_id, t.name, t.artists, t.duration_ms, t.explicit, t.release_date, t.id_artists
FROM tracks t;

-- Vue pour les playlists d'un utilisateur avec les chansons associées
CREATE OR REPLACE VIEW app_view_user_playlists AS
SELECT p.playlist_id, p.name, p.is_public, p.created_at AS creation_date, 
       u.username AS user_name, t.name AS track_name
FROM playlists p
JOIN users u ON p.user_id = u.user_id
JOIN user_favorite_tracks uft ON p.user_id = uft.user_id
JOIN tracks t ON uft.track_id = t.track_id;

-- Attribution des privilèges
-- Privilèges d'accès aux vues pour l'utilisateur app
GRANT SELECT ON app_view_tracks TO app;
GRANT SELECT ON app_view_playlists TO app;

-- Privilèges d'accès aux vues pour l'administrateur admin
GRANT SELECT ON admin_view_users TO admin;
GRANT SELECT ON admin_view_artists TO admin;
GRANT SELECT ON admin_view_tracks TO admin;

-- Vérification des vues et des privilèges
-- Lister toutes les vues disponibles :
SELECT view_name FROM user_views;

-- Hachage pour les mots de passe
ALTER TABLE users MODIFY password VARCHAR2(256); -- hash SHA-256



-- CHAPTER 3 : Queries and optimization

-- 3.1. Requêtes SQL : 

-- jJOIN entre plusieurs tables pour afficher les noms des pistes, artistes, albums et playlists associés pour les pistes de plus de 5 min
EXPLAIN PLAN FOR
SELECT t.name AS track_name, a.name AS artist_name, al.name AS album_name, p.name AS playlist_name
FROM tracks t
JOIN artists a ON INSTR(t.id_artists, a.artist_id) > 0
LEFT JOIN albums al ON t.album_id = al.album_id
LEFT JOIN user_favorite_tracks uft ON t.track_id = uft.track_id
LEFT JOIN users u ON uft.user_id = u.user_id
LEFT JOIN playlists p ON u.user_id = p.user_id
WHERE t.duration_ms > 300000;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY); -- 33 lignes en 0,313 secondes

-- fonction analytique AVG() pour calculer l'énergie moyenne des pistes par année de sortie
EXPLAIN PLAN FOR
SELECT EXTRACT(YEAR FROM t.release_date) AS release_year, AVG(taf.energy) AS avg_energy
FROM tracks t
JOIN tracks_audio_features taf ON t.track_id = taf.track_id
GROUP BY EXTRACT(YEAR FROM t.release_date)
ORDER BY release_year DESC;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY); -- 0,101 secondes

-- fonction analytique COUNT() pour compter le nombre de pistes par artiste et afficher uniquement ceux ayant + de 5 pistes
SELECT a.name AS artist_name, COUNT(t.track_id) AS track_count
FROM artists a
JOIN tracks t ON INSTR(t.id_artists, a.artist_id) > 0
GROUP BY a.name
HAVING COUNT(t.track_id) > 5
ORDER BY track_count DESC;

-- fonction analytique SUM() pour avoir le nombre total de followers pour chaque genre d'artiste
SELECT a.genres, SUM(a.followers) AS total_followers
FROM artists a
GROUP BY a.genres
ORDER BY total_followers DESC;

-- requête imbriquée (nested query) pour récupérer les artistes dont la popularité est supérieure à la moyenne de tous les artistes
SELECT name, popularity FROM artists
WHERE popularity > (SELECT AVG(popularity) FROM artists);

-- sous-requête (subquery) pour identifier les artistes populaires par rapport à la moyenne des followers dans la base de données
SELECT name, followers FROM artists
WHERE followers > (SELECT AVG(followers) FROM artists);

-- fonction de fenêtrage (window function) pour classer les artistes par nombre de followers
SELECT name, followers, RANK() OVER (ORDER BY followers DESC) AS follower_rank
FROM artists;

-- fonction de fenêtrage (window function) pour classer les artistes ayant plus d'1 million de followers
SELECT name, followers, RANK() OVER (ORDER BY followers DESC) AS follower_rank
FROM artists
WHERE followers > 1000000;

-- fonction de fenêtrage (window function) pour classer les artistes en fonction du nombre total de pistes qu'ils ont, +afficher le nombre de pistes pour chaque artiste
SELECT a.name AS artist_name, COUNT(t.track_id) AS track_count, RANK() OVER (ORDER BY COUNT(t.track_id) DESC) AS track_rank
FROM artists a
JOIN tracks t ON INSTR(t.id_artists, a.artist_id) > 0
GROUP BY a.name;

-- 3.2. Query optimization :

-- création d'index sur les colonnes fréquemment utilisées dans les jointures et les conditions WHERE
CREATE INDEX idx_user_favorite_tracks_user_id ON user_favorite_tracks(user_id);
CREATE INDEX idx_tracks_album_id ON tracks(album_id);
CREATE INDEX idx_tracks_id_artists ON tracks(id_artists);
CREATE INDEX idx_playlists_user_id ON playlists(user_id);

-- réécriture de certaines requêtes
-- cette vue peut être utilisée pour simplifier la requête qui affiche les noms des pistes, artistes, albums et playlists associés pour les pistes de plus de 5min
EXPLAIN PLAN FOR 
SELECT 
    t.track_id,
    t.name AS track_name,
    a.name AS artist_name,
    al.name AS album_name,
    u.username AS user_name,
    p.name AS playlist_name
FROM tracks t
JOIN artists a ON INSTR(t.id_artists, a.artist_id) > 0
LEFT JOIN albums al ON t.album_id = al.album_id
LEFT JOIN user_favorite_tracks uft ON t.track_id = uft.track_id
LEFT JOIN users u ON uft.user_id = u.user_id
LEFT JOIN playlists p ON u.user_id = p.user_id
WHERE t.duration_ms > 300000;

SELECT * FROM TABLE(DBMS_XPLAN.DISPLAY);
-- 33 lignes en 0,034 secondes

-- vues matérialisées : 
-- pour l'énergie moyenne par année
CREATE MATERIALIZED VIEW mv_avg_energy_per_year AS
SELECT EXTRACT(YEAR FROM t.release_date) AS release_year, AVG(taf.energy) AS avg_energy
FROM tracks t
JOIN tracks_audio_features taf ON t.track_id = taf.track_id
GROUP BY EXTRACT(YEAR FROM t.release_date);

-- requête utilisant la vue matérialisée mv_avg_energy_per_year
SELECT * FROM mv_avg_energy_per_year ORDER BY release_year DESC;
-- 0,009 secondes



-- CHAPTER 4: Automation of the information system

-- 4.1 Triggers

-- pour mettre à jour la colonne updated_at chaque fois qu'une ligne est mise à jour dans les tables artists, tracks, users et playlists
CREATE OR REPLACE TRIGGER trg_update_artists_updated_at
BEFORE UPDATE ON artists
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_update_tracks_updated_at
BEFORE UPDATE ON tracks
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSDATE;
END;
/

CREATE OR REPLACE TRIGGER trg_update_playlists_updated_at
BEFORE UPDATE ON playlists
FOR EACH ROW
BEGIN
    :NEW.updated_at := SYSDATE;
END;
/

-- trigger pour envoyer une alerte lors de l'ajout d'un nouvel utilisateur
-- ce déclencheur envoie un message d'alerte chaque fois qu'un nouvel utilisateur est ajouté.
CREATE TABLE alert_log (id NUMBER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    message VARCHAR2(4000), created_at DATE);

CREATE OR REPLACE PROCEDURE send_alert(p_message VARCHAR2) IS
BEGIN
    INSERT INTO alert_log (message, created_at) VALUES (p_message, SYSDATE);
END;
/

CREATE OR REPLACE TRIGGER trg_new_user_alert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    send_alert('Nouvel utilisateur ajouté : ' || :NEW.username); -- appel d'une procédure pour envoyer une alerte
END;
/

-- pour insérer un utilisateur dans la table artists lorsque son statut en tant qu'artiste est mis à jour
CREATE OR REPLACE TRIGGER trg_insert_artist
AFTER UPDATE OF is_artist ON users
FOR EACH ROW
BEGIN
    IF :NEW.is_artist = 'Y' AND :OLD.is_artist = 'N' THEN
        INSERT INTO artists (artist_id, name, followers, genres, popularity, created_at, updated_at)
        VALUES (generate_uuid(), :NEW.full_name, 0, NULL, 0, SYSDATE, SYSDATE);
    END IF;
END;
/

-- 4.2. Fonctions et procédures stockées

-- permettent d'automatiser des processus récurrents

-- Table de liaison pour relier les pistes aux playlists
CREATE TABLE playlist_tracks (
    playlist_id VARCHAR2(36),
    track_id VARCHAR2(36),
    PRIMARY KEY (playlist_id, track_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
    FOREIGN KEY (track_id) REFERENCES tracks(track_id) );

-- Fonction pour calculer la durée totale d'une playlist
CREATE OR REPLACE FUNCTION get_playlist_duration(p_playlist_id VARCHAR2)
RETURN NUMBER
IS
  v_total_duration NUMBER;
BEGIN
  SELECT SUM(t.duration_ms)
  INTO v_total_duration
  FROM tracks t
  JOIN playlist_tracks pt ON t.track_id = pt.track_id
  WHERE pt.playlist_id = p_playlist_id;

  RETURN NVL(v_total_duration, 0); -- renvoie 0 si aucune piste n'est trouvée
END;
/

-- Fonction pour générer un rapport mensuel sur le nombre d'utilisateurs ajoutés
CREATE OR REPLACE FUNCTION generate_monthly_report RETURN VARCHAR2 IS
    v_report VARCHAR2(4000);
BEGIN
    SELECT "Nombre d utilisateurs ajoutés ce mois-ci : " || COUNT(*)
    INTO v_report
    FROM users
    WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM SYSDATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM SYSDATE);
    
    RETURN v_report;
END;
/

-- Exécution automatique des tâches (procédure PL/SQL)
-- configuration de job avec le package DBMS_SCHEDULER pour avoir le rapport mensuel
BEGIN
    DBMS_SCHEDULER.create_job (
        job_name        => 'monthly_report_job',
        job_type        => 'PLSQL_BLOCK',
        job_action      => 'BEGIN generate_monthly_report; END;',
        start_date      => SYSTIMESTAMP,
        repeat_interval  => 'FREQ=MONTHLY; BYMONTHDAY=1; BYHOUR=0; BYMINUTE=0; BYSECOND=0',
        enabled         => TRUE );
END;
/

-- Création de la table pour les commentaires (pour stocker les commentaires des utilisateurs sur les tracks)
CREATE TABLE comments (
    comment_id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36),
    track_id VARCHAR2(36),
    comment_text VARCHAR2(1000),
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(track_id) ON DELETE CASCADE);

CREATE OR REPLACE TRIGGER trg_comments_id
BEFORE INSERT ON comments
FOR EACH ROW
BEGIN
    IF :NEW.comment_id IS NULL THEN
        :NEW.comment_id := generate_uuid(); 
    END IF;
END;
/

-- Création des tables pour le forum (pour stocker les sujets de discussion et les messages associés)
CREATE TABLE forum_posts (
    post_id VARCHAR2(36) PRIMARY KEY,
    user_id VARCHAR2(36),
    title VARCHAR2(255),
    content CLOB,
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE OR REPLACE TRIGGER trg_forum_posts_id
BEFORE INSERT ON forum_posts
FOR EACH ROW
BEGIN
    IF :NEW.post_id IS NULL THEN
        :NEW.post_id := generate_uuid();
    END IF;
END;
/

CREATE TABLE forum_replies (
    reply_id VARCHAR2(36) PRIMARY KEY,
    post_id VARCHAR2(36),
    user_id VARCHAR2(36),
    content CLOB,
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE DEFAULT SYSDATE,
    FOREIGN KEY (post_id) REFERENCES forum_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE);

CREATE OR REPLACE TRIGGER trg_forum_replies_id
BEFORE INSERT ON forum_replies
FOR EACH ROW
BEGIN
    IF :NEW.reply_id IS NULL THEN
        :NEW.reply_id := generate_uuid();
    END IF;
END;
/

-- Table pour les abonnements
CREATE TABLE user_followers (
    user_id VARCHAR2(36),
    follower_id VARCHAR2(36),
    created_at DATE DEFAULT SYSDATE,
    PRIMARY KEY (user_id, follower_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE);

ALTER TABLE user_followers ADD follower_name VARCHAR2(255);
ALTER TABLE user_followers ADD user_name VARCHAR2(255);

INSERT INTO user_followers (user_id, follower_id)
-- VALUES ('USER_ID_TO_FOLLOW', 'FOLLOWER_USER_ID');
VALUES ('0ff74e26-86a0-48ed-a19f-202679007bf3', '9f78f04c-a0b3-4d22-86b9-4e5ec5eb666c');
-- user to follow : 0ff74e26-86a0-48ed-a19f-202679007bf3 (user1)
-- user follower : 9f78f04c-a0b3-4d22-86b9-4e5ec5eb666c (user2) par exemple

-- + d'insertions et màj
GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON forum_posts TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON forum_replies TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlist_tracks TO app;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_followers TO app;

GRANT SELECT, INSERT, UPDATE, DELETE ON comments TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON forum_posts TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON forum_replies TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON playlist_tracks TO admin;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_followers TO admin;

INSERT INTO users (user_id, username, password, email, full_name)
VALUES (generate_uuid(), 'Kylie', 'password123', 'etudiant@edu.devinci.fr', 'Kylie W');

INSERT INTO users (user_id, username, password, email, full_name)
VALUES (generate_uuid(), 'Amalunga', 'password123', 'artist@gmail.com', 'A. L.');

UPDATE users
SET password = 'newpassword123', email = 'etudiant@edu.devinci.fr', updated_at = SYSDATE
WHERE user_id = '06175e5f-0e1a-4d3c-a052-a0bb382b2b5b';

INSERT INTO playlists (user_id, name, is_public, description)
VALUES ('06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', 'Ma playlist calme', 'Y', 'Playlist pour les musiques de type ambient (instrumental)');

INSERT INTO playlists (user_id, name, is_public, description)
VALUES ('030c9cae-4e57-463a-83ef-13408dd4d44d', 'Instru', 'Y', 'Playlist - instrumental');

INSERT INTO playlists (user_id, name, is_public, description)
VALUES ('06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', 'Ma playlist ost', 'Y', 'Playlist pour les OST');

INSERT INTO playlists (user_id, name, is_public, description)
VALUES ('06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', 'Rap', 'Y', 'Playlist rap fr');

-- pour les voir : 
-- SELECT * FROM playlists WHERE user_id = '06175e5f-0e1a-4d3c-a052-a0bb382b2b5b';

UPDATE playlists
SET name = 'OST', description = 'Playlist pour des OST', updated_at = SYSDATE
WHERE playlist_id = '4e390e1b-55d1-4b9e-b3e2-28b968697d66';

INSERT INTO playlist_tracks (playlist_id, track_id)
SELECT p.playlist_id, t.track_id
FROM playlists p
JOIN tracks t ON t.name = 'Recuerdo de París - Remasterizado'
WHERE p.user_id = (SELECT user_id FROM users WHERE username = 'Kylie');

UPDATE users
SET is_artist = 'Y', updated_at = SYSDATE
WHERE username = 'Amalunga';

INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature)
VALUES ('New Song', 'Amalunga', '030c9cae-4e57-463a-83ef-13408dd4d44d', 240000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4);

INSERT INTO user_favorite_tracks (user_id, track_id)
VALUES ('06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', '19885396-b791-4c24-805d-123a3a4e8b38');

INSERT INTO albums (name, release_date, artist_id)
VALUES ('Album1', TO_DATE('2024-12-12', 'YYYY-MM-DD'), '030c9cae-4e57-463a-83ef-13408dd4d44d');

INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature, album_id)
VALUES ('Titre 1', 'Amalunga', '030c9cae-4e57-463a-83ef-13408dd4d44d', 180000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4, (SELECT album_id FROM albums WHERE name = 'Album1' AND artist_id = '030c9cae-4e57-463a-83ef-13408dd4d44d'));

INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature, album_id)
VALUES ('Titre 2', 'Amalunga', '030c9cae-4e57-463a-83ef-13408dd4d44d', 180000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4, (SELECT album_id FROM albums WHERE name = 'Album1' AND artist_id = '030c9cae-4e57-463a-83ef-13408dd4d44d'));

INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature, album_id)
VALUES ('Titre 3', 'Amalunga', '030c9cae-4e57-463a-83ef-13408dd4d44d', 180000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4, (SELECT album_id FROM albums WHERE name = 'Album1' AND artist_id = '030c9cae-4e57-463a-83ef-13408dd4d44d'));

INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature, album_id)
VALUES ('Titre 4', 'Amalunga', '030c9cae-4e57-463a-83ef-13408dd4d44d', 180000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4, (SELECT album_id FROM albums WHERE name = 'Album1' AND artist_id = '030c9cae-4e57-463a-83ef-13408dd4d44d'));

INSERT INTO user_followers (user_id, follower_id)
VALUES ('030c9cae-4e57-463a-83ef-13408dd4d44d', '06175e5f-0e1a-4d3c-a052-a0bb382b2b5b');

INSERT INTO comments (user_id, track_id, comment_text)
VALUES ('06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', '19885396-b791-4c24-805d-123a3a4e8b38', 'J adore cette chanson !');

-- pour le voir : 
-- SELECT c.comment_text, u.username, c.created_at
-- FROM comments c
-- JOIN users u ON c.user_id = u.user_id
-- WHERE c.track_id = '19885396-b791-4c24-805d-123a3a4e8b38';

INSERT INTO forum_posts (user_id, title, content)
VALUES ('USER_ID', 'Recommandations musicales', 'Quels sont vos morceaux préférés en ce moment ?');

INSERT INTO forum_replies (post_id, user_id, content)
VALUES ('82fc61a1-8bb3-43f2-b046-482284f19068', '06175e5f-0e1a-4d3c-a052-a0bb382b2b5b', 'To the moon');

INSERT INTO forum_replies (post_id, user_id, content)
VALUES ('82fc61a1-8bb3-43f2-b046-482284f19068', '0ff74e26-86a0-48ed-a19f-202679007bf3', 'Aporia');






-- Quelques commandes à exécuter pour afficher des données :
/*
SELECT * FROM Albums;
SELECT * FROM Artists;
SELECT * FROM Playlists;
SELECT * FROM Tracks;
SELECT * FROM Tracks_audio_features;
SELECT * FROM Users;
*/