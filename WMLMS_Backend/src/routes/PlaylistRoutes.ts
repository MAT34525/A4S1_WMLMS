import express from 'express';
import oracledb from 'oracledb';

const router = express.Router();

// Routes
router.get('/playlists', (_req, _res) => getPlaylists(_req, _res));
router.post('/playlists', (_req, _res) => createPlaylist(_req, _res));
router.put('/playlists/:id', (_req, _res) => updatePlaylist(_req, _res));
router.delete('/playlists/:id', (_req, _res) => deletePlaylist(_req, _res));

// Récupérer toutes les playlists
async function getPlaylists(_req, _res) {
    try {
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        const result = await connection.execute(
            `SELECT PLAYLIST_ID, NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT FROM playlists`
        );

        console.log('Playlists récupérées :', result.rows);
        await connection.close();

        _res.status(200).json({ playlists: result.rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des playlists:', error);
        _res.status(500).json({ errorMessage: 'Erreur lors de la récupération des playlists.' });
    }
}

// Créer une nouvelle playlist
async function createPlaylist(_req, _res) {
    const { name, description, isPublic } = _req.body;

    if (!name || typeof isPublic === 'undefined') {
        return _res.status(400).json({ errorMessage: 'Les champs "name" et "isPublic" sont obligatoires.' });
    }

    try {
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        await connection.execute(
            `INSERT INTO playlists (NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT)
             VALUES (:name, :description, :isPublic, SYSDATE, SYSDATE)`,
            { name, description, isPublic }
        );

        await connection.commit();
        console.log('Playlist créée avec succès');
        await connection.close();

        _res.status(201).json({ message: 'Playlist créée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la création de la playlist:', error);
        _res.status(500).json({ errorMessage: 'Erreur lors de la création de la playlist.' });
    }
}

// Mettre à jour une playlist existante
async function updatePlaylist(_req, _res) {
    const playlistId = _req.params.id;
    const { name, description, isPublic } = _req.body;

    if (!name || typeof isPublic === 'undefined') {
        return _res.status(400).json({ errorMessage: 'Les champs "name" et "isPublic" sont obligatoires.' });
    }

    try {
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        const result = await connection.execute(
            `UPDATE playlists
             SET NAME = :name, DESCRIPTION = :description, IS_PUBLIC = :isPublic, UPDATED_AT = SYSDATE
             WHERE PLAYLIST_ID = :playlistId`,
            { name, description, isPublic, playlistId }
        );

        if (result.rowsAffected === 0) {
            console.log('Playlist non trouvée');
            return _res.status(404).json({ errorMessage: 'Playlist non trouvée.' });
        }

        await connection.commit();
        console.log('Playlist mise à jour avec succès');
        await connection.close();

        _res.status(200).json({ message: 'Playlist mise à jour avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la playlist:', error);
        _res.status(500).json({ errorMessage: 'Erreur lors de la mise à jour de la playlist.' });
    }
}

// Supprimer une playlist
async function deletePlaylist(_req, _res) {
    const playlistId = _req.params.id;

    try {
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        const result = await connection.execute(
            `DELETE FROM playlists WHERE PLAYLIST_ID = :playlistId`,
            { playlistId }
        );

        if (result.rowsAffected === 0) {
            console.log('Playlist non trouvée');
            return _res.status(404).json({ errorMessage: 'Playlist non trouvée.' });
        }

        await connection.commit();
        console.log('Playlist supprimée avec succès');
        await connection.close();

        _res.status(200).json({ message: 'Playlist supprimée avec succès.' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la playlist:', error);
        _res.status(500).json({ errorMessage: 'Erreur lors de la suppression de la playlist.' });
    }
}

export default router;
