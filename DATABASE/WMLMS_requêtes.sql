-- REQUÊTES

-- Création de comptes et gestion des utilisateurs

-- Insérer un nouvel utilisateur
INSERT INTO users (user_id, username, password, email, full_name)
VALUES (generate_uuid(), 'new_user', 'userpassword', 'new_user@exemple.com', 'New user');

-- Sélectionner un utilisateur par son username
SELECT * FROM users WHERE username = 'new_user';

-- Mettre à jour les informations de l'utilisateur (par ex. changer le mot de passe)
UPDATE users
SET password = 'newpassword', email = 'new_email@exemple.com', updated_at = SYSDATE
WHERE user_id = 1;

-- Supprimer un utilisateur
DELETE FROM users WHERE user_id = 'USER_ID_UUID';


-- Gestion des playlists

-- Insérer une nouvelle playlist
INSERT INTO playlists (user_id, name, is_public, description)
VALUES ('USER_ID_UUID', 'Ma playlist n°...', 'Y', 'Playlist sur le thème de...');

-- Sélectionner toutes les playlists d'un utilisateur spécifique
SELECT * FROM playlists WHERE user_id = 'USER_ID_UUID';

-- Sélectionner une playlist spécifique par son ID
SELECT * FROM playlists WHERE playlist_id = 'PLAYLIST_ID_UUID';

-- Mettre à jour une playlist
UPDATE playlists
SET name = 'My updated playlist', description = 'Nouvelle description', updated_at = SYSDATE
WHERE playlist_id = 'PLAYLIST_ID_UUID';

-- Supprimer une playlist
DELETE FROM playlists WHERE playlist_id = 'PLAYLIST_ID_UUID';


-- Ajout, suppression et gestion des chansons dans les playlists

-- Ajouter une chanson à une playlist
INSERT INTO playlist_tracks (playlist_id, track_id)
SELECT p.playlist_id, t.track_id
FROM playlists p
JOIN tracks t ON t.name = 'Track name'
WHERE p.user_id = (SELECT user_id FROM users WHERE username = 'user2');

-- Supprimer une chanson d'une playlist
DELETE FROM playlist_tracks 
WHERE playlist_id = (SELECT playlist_id FROM playlists WHERE name = 'Playlist 1' AND user_id = (SELECT user_id FROM users WHERE username = 'user2'))
AND track_id = (SELECT track_id FROM tracks WHERE name = 'Track name');

-- Sélectionner toutes les chansons d'une playlist
SELECT t.track_id, t.name, t.artists 
FROM playlist_tracks pt
JOIN tracks t ON pt.track_id = t.track_id 
WHERE pt.playlist_id = (SELECT playlist_id FROM playlists WHERE name = 'Playlist 1' AND user_id = (SELECT user_id FROM users WHERE username = 'user2'));


-- Gestion des musiques et des artistes

-- Changer un user en artiste
UPDATE users
SET is_artist = 'Y', updated_at = SYSDATE
WHERE username = 'user2';

-- Insérer une chanson
INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature)
VALUES ('New song', 'Nom artiste', 'ARTIST_ID_UUID', 240000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4);

-- pour le voir
SELECT * FROM tracks WHERE name = 'New song';

-- Sélectionner toutes les chansons d'un artiste spécifique
SELECT t.track_id, t.name, t.release_date, a.name AS album_name
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
WHERE INSTR(t.id_artists, 'ARTIST_ID_UUID') > 0;

-- Supprimer une chanson
DELETE FROM tracks WHERE track_id = 'TRACK_ID_UUID';

-- Gestion des favoris
-- Ajouter une chanson à ses favoris...
INSERT INTO user_favorite_tracks (user_id, track_id)
SELECT 'USER_ID_UUID', 'TRACK_ID_UUID' 
FROM dual
WHERE NOT EXISTS (
    SELECT 1 
    FROM user_favorite_tracks 
    WHERE user_id = 'USER_ID_UUID' AND track_id = 'TRACK_ID_UUID');

-- Supprimer une chanson favorite
DELETE FROM user_favorite_tracks 
WHERE user_id = 'USER_ID_UUID' AND track_id = 'TRACK_ID_UUID';

-- Sélectionner toutes les chansons favorites d'un user
SELECT t.track_id, t.name, t.artists
FROM user_favorite_tracks uft
JOIN tracks t ON uft.track_id = t.track_id
WHERE uft.user_id = 'USER_ID_UUID';

-- Recherche de chansons
-- Rechercher des chansons par leur titre
SELECT * FROM tracks WHERE name LIKE '%title%';

-- Rechercher des chansons par artiste
SELECT t.track_id, t.name AS title, t.artists, t.release_date
FROM tracks t
WHERE t.artists LIKE '%artist_name%';

-- Rechercher des chansons d'un album spécifique
SELECT t.track_id, t.name, t.artists, a.name AS album_name
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
WHERE a.name LIKE '%album_name%';

-- Créer un nouvel album
INSERT INTO albums (name, release_date, artist_id)
VALUES ('Nom album', TO_DATE('2024-09-01', 'YYYY-MM-DD'), 'ARTIST_ID_UUID');

-- Ajouter des titres à l'album
INSERT INTO tracks (name, artists, id_artists, duration_ms, explicit, release_date, time_signature, album_id)
VALUES ('Titre 1', 'Nom artiste', 'ARTIST_ID_UUID', 180000, 0, TO_DATE('2024-09-01', 'YYYY-MM-DD'), 4, (SELECT album_id FROM albums WHERE name = 'Nom album' AND artist_id = 'ARTIST_ID_UUID'));

-- Pour rchercher les titres d'un album spécifique
SELECT t.track_id, t.name AS track_name, t.artists, a.name AS album_name
FROM tracks t
JOIN albums a ON t.album_id = a.album_id
WHERE a.name = '%Nom album%' AND t.artists = '%Nom artiste%';


-- Gestion des abonnements ou des utilisateurs favoris
-- Insérer un abonnement entre deux utilisateurs
INSERT INTO user_followers (user_id, follower_id)
VALUES ('USER_ID_TO_FOLLOW', 'FOLLOWER_USER_ID');

-- Supprimer un abonnement entre deux utilisateurs
DELETE FROM user_followers WHERE user_id = 'USER_ID_TO_FOLLOW' AND follower_id = 'FOLLOWER_USER_ID';

-- Afficher tous les abonnements d'un utilisateur :
SELECT u.username AS following_user, f.username AS follower_user
FROM user_followers uf
JOIN users u ON uf.user_id = u.user_id
JOIN users f ON uf.follower_id = f.user_id
WHERE uf.follower_id = 'FOLLOWER_USER_ID';

-- Gestion des commentaires ou des avis sur les chansons
-- Ajouter un commentaire sur une chanson
INSERT INTO comments (user_id, track_id, comment_text)
VALUES ('USER_ID_UUID', 'TRACK_ID_UUID', 'Commentaire');

-- Afficher tous les commentaires pour une chanson donnée
SELECT c.comment_text, u.username, c.created_at
FROM comments c
JOIN users u ON c.user_id = u.user_id
WHERE c.track_id = 'TRACK_ID_UUID';

-- Supprimer un commentaire spécifique
DELETE FROM comments WHERE comment_id = 'COMMENT_ID_UUID';


-- Requêtes pour gérer le forum
-- Ajouter un nouveau post :
INSERT INTO forum_posts (user_id, title, content)
VALUES ('USER_ID', 'Recommandations musicales', 'Quels sont vos morceaux préférés en ce moment ?');

-- Ajouter une réponse à un post existant :
INSERT INTO forum_replies (post_id, user_id, content)
VALUES ('POST_ID', 'USER_ID', 'J adore écouter cet artiste récemment !');

-- Afficher tous les posts avec leurs réponses :
SELECT p.title, p.content AS post_content, r.content AS reply_content, u.username AS reply_user, r.created_at AS reply_date
FROM forum_posts p
LEFT JOIN forum_replies r ON p.post_id = r.post_id
LEFT JOIN users u ON r.user_id = u.user_id;


-- Pour marquer un compte comme non vérifié :
UPDATE users
SET account_status = 'UNVERIFIED'
WHERE user_id = '[ID_DE_L_UTILISATEUR]';

-- Pour marquer un compte comme en cours de vérification :
UPDATE users
SET account_status = 'PENDING'
WHERE user_id = '[ID_DE_L_UTILISATEUR]';

-- Pour marquer un compte comme vérifié :
UPDATE users
SET account_status = 'VERIFIED'
WHERE user_id = '[ID_DE_L_UTILISATEUR]';

-- Pour marquer un compte comme artiste vérifié :
UPDATE users
SET account_status = 'ARTIST'
WHERE user_id = '[ID_DE_L_UTILISATEUR]';


