-- REQUÊTES

-- Création de comptes et gestion des utilisateurs

-- Insérer un nouvel utilisateur
INSERT INTO users (user_id, username, password, email, full_name)
VALUES (seq_users.NEXTVAL, 'new_user', 'userpassword', 'new_user@example.com', 'New User');

-- Sélectionner un utilisateur par son username
SELECT * FROM users WHERE username = 'new_user';

-- Mettre à jour les informations de l'utilisateur (par exemple, changer le mot de passe)
UPDATE users
SET password = 'newpassword', email = 'new_email@example.com', updated_at = SYSDATE
WHERE user_id = 1;

-- Supprimer un utilisateur (attention à l'intégrité des données)
DELETE FROM users WHERE user_id = 1;



-- Gestion des playlists

-- Insérer une nouvelle playlist
INSERT INTO playlists (playlist_id, user_id, name, is_public, description)
VALUES (seq_playlists.NEXTVAL, 1, 'My Playlist n°...', 'Y', 'Ma playlist n°...');

-- Sélectionner toutes les playlists d'un utilisateur spécifique
SELECT * FROM playlists WHERE user_id = 1;

-- Sélectionner une playlist spécifique par son ID
SELECT * FROM playlists WHERE playlist_id = 1;

-- Mettre à jour une playlist (par exemple, modifier le nom ou la description)
UPDATE playlists
SET name = 'My Updated Playlist', description = 'Nouvelle description', updated_at = SYSDATE
WHERE playlist_id = 1;

-- Supprimer une playlist
DELETE FROM playlists WHERE playlist_id = 1;



-- Ajout, suppression et gestion des chansons dans les playlists

-- Ajouter une chanson à une playlist
INSERT INTO playlist_songs (playlist_id, song_id)
VALUES (1, 1);  -- Ajouter la chanson avec ID 1 à la playlist avec ID 1
-- à voir avec le bon song_id...

-- Supprimer une chanson d'une playlist
DELETE FROM playlist_songs WHERE playlist_id = 1 AND song_id = 1;

-- Sélectionner toutes les chansons d'une playlist
SELECT s.song_id, s.title, s.artist_name
FROM playlist_songs ps
JOIN songs s ON ps.song_id = s.song_id
JOIN artists a ON s.artist_id = a.artist_id
WHERE ps.playlist_id = 1;



-- Gestion des musiques et des artistes

-- Insérer une chanson
INSERT INTO songs (song_id, title, artist_id, genre, release_date, album, song_url)
VALUES (seq_songs.NEXTVAL, 'New Song', 1, 'Pop', TO_DATE('2024-09-01', 'YYYY-MM-DD'), 'New Album', 'http://example.com/new_song.mp3');

-- Sélectionner toutes les chansons d'un artiste spécifique
SELECT s.song_id, s.title, s.genre, s.release_date, s.album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id
WHERE a.artist_name = 'Artist One';

-- Mettre à jour une chanson (par exemple, modifier l'album ou la durée)
UPDATE songs
SET album = 'Updated Album', genre = 'Rock', updated_at = SYSDATE
WHERE song_id = 1;

-- Supprimer une chanson
DELETE FROM songs WHERE song_id = 1;



-- Vues

-- Vue pour les chansons avec les artistes
CREATE VIEW app_view_songs AS
SELECT s.song_id, s.title, a.artist_name, s.genre, s.release_date, s.album
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id;

-- Vue pour les playlists d'un utilisateur avec les chansons associées
SELECT p.playlist_id, p.name, p.is_public, p.creation_date, u.username AS user_name, s.title AS song_title
FROM playlists p
JOIN users u ON p.user_id = u.user_id
JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
JOIN songs s ON ps.song_id = s.song_id;



-- Recherche de chansons

-- Rechercher des chansons par leur titre
SELECT * FROM songs
WHERE title LIKE '%song_title%';

-- Rechercher des chansons par artiste
SELECT s.song_id, s.title, a.artist_name, s.genre, s.release_date
FROM songs s
JOIN artists a ON s.artist_id = a.artist_id
WHERE a.artist_name LIKE '%artist_name%';

-- Rechercher des chansons par genre
SELECT * FROM songs
WHERE genre = 'Pop';

-- Rechercher des chansons d'un album spécifique
SELECT * FROM songs
WHERE album LIKE '%album_name%';



-- Gestion des abonnements ou des utilisateurs favoris (il faudra créer des tables etc.!! à ajouter)

-- Insérer un abonnement entre deux utilisateurs (par exemple, un utilisateur A suit un utilisateur B)
INSERT INTO user_followers (user_id, follower_id)
VALUES (2, 1); -- L'utilisateur avec ID 1 suit l'utilisateur avec ID 2


-- Supprimer un abonnement entre deux utilisateurs
DELETE FROM user_followers WHERE user_id = 2 AND follower_id = 1;

-- Afficher tous les abonnements d'un utilisateur
SELECT u.username AS following_user, f.username AS follower_user
FROM user_followers uf
JOIN users u ON uf.user_id = u.user_id
JOIN users f ON uf.follower_id = f.user_id
WHERE uf.user_id = 2; -- L'utilisateur avec ID 2

-- Insérer une chanson dans les favoris d'un utilisateur
INSERT INTO user_favorites (user_id, song_id)
VALUES (1, 2); -- L'utilisateur avec ID 1 ajoute la chanson avec ID 2 à ses favoris

-- Supprimer une chanson des favoris d'un utilisateur
DELETE FROM user_favorites WHERE user_id = 1 AND song_id = 2;



-- Gestion des commentaires ou des avis sur les chansons (à ajouter)

-- Ajouter un commentaire sur une chanson
INSERT INTO song_comments (user_id, song_id, comment_text, comment_date)
VALUES (1, 2, 'J\'adore cette chanson !', SYSDATE);

-- Afficher tous les commentaires pour une chanson donnée
SELECT c.comment_text, u.username, c.comment_date
FROM song_comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.song_id = 2; -- Chanson avec ID 2

-- Supprimer un commentaire spécifique (quels privilèges, pour qui ?)
DELETE FROM song_comments WHERE comment_id = 1;



-- Suivi de l'activité de l'utilisateur (historique d'écoute) (à ajouter ?)

-- Ajouter une chanson à l'historique d'écoute d'un utilisateur
INSERT INTO user_listening_history (user_id, song_id, listen_date)
VALUES (1, 2, SYSDATE); -- L'utilisateur 1 a écouté la chanson 2 par ex.

-- Afficher l'historique d'écoute pour un utilisateur
SELECT s.song_id, s.title, a.artist_name, ulh.listen_date
FROM user_listening_history ulh
JOIN songs s ON ulh.song_id = s.song_id
JOIN artists a ON s.artist_id = a.artist_id
WHERE ulh.user_id = 1
ORDER BY ulh.listen_date DESC;

-- Supprimer une chanson de l'historique d'écoute
DELETE FROM user_listening_history WHERE user_id = 1 AND song_id = 2;



-- Statistiques et analyse des chansons et playlists (à ajouter)

-- Sélectionner les chansons les plus écoutées
SELECT s.song_id, s.title, a.artist_name, COUNT(ulh.song_id) AS listens_count
FROM user_listening_history ulh
JOIN songs s ON ulh.song_id = s.song_id
JOIN artists a ON s.artist_id = a.artist_id
GROUP BY s.song_id, s.title, a.artist_name
ORDER BY listens_count DESC
FETCH FIRST 10 ROWS ONLY;

-- Sélectionner les playlists les plus populaires (celles avec le plus de chansons/favoris...)
SELECT p.playlist_id, p.name, COUNT(ps.song_id) AS song_count
FROM playlists p
JOIN playlist_songs ps ON p.playlist_id = ps.playlist_id
GROUP BY p.playlist_id, p.name
ORDER BY song_count DESC
FETCH FIRST 10 ROWS ONLY;



-- Requêtes de gestion des utilisateurs avec des rôles ou permissions avancées

-- Attribution d'un rôle à un utilisateur (par exemple, un administrateur)
GRANT admin_role TO user1;

-- Vérifier les rôles d'un utilisateur
SELECT * FROM user_roles WHERE user_id = 1;

