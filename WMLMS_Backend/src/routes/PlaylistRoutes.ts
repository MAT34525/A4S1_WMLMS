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

        console.log('Playlists collected :', result.rows);
        await connection.close();

        _res.status(200).json({ playlists: result.rows });
    } catch (error) {
        console.error('error with playlists collection:', error);
        _res.status(500).json({ errorMessage: 'Error with playlists collection.' });
    }
}

// Créer une nouvelle playlist
async function createPlaylist(_req, _res) {
    const { name, description, isPublic } = _req.body;

    if (!name || typeof isPublic === 'undefined') {
        return _res.status(400).json({ errorMessage: 'all fields are mandatory.' });
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
        console.log('Playlist successfully created');
        await connection.close();

        _res.status(201).json({ message: 'Playlist successfully created.' });
    } catch (error) {
        console.error('Error with playlist creation:', error);
        _res.status(500).json({ errorMessage: 'Error with playlist creation.' });
    }
}

// Mettre à jour une playlist existante
async function updatePlaylist(_req, _res) {
    const playlistId = _req.params.id;
    const { name, description, isPublic } = _req.body;

    if (!name || typeof isPublic === 'undefined') {
        return _res.status(400).json({ errorMessage: 'All fields are mandatory.' });
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
            console.log('Playlist not found');
            return _res.status(404).json({ errorMessage: 'Playlist not found.' });
        }

        await connection.commit();
        console.log('Playlist successfully updated');
        await connection.close();

        _res.status(200).json({ message: 'Playlist successfully updated.' });
    } catch (error) {
        console.error('Error with playlist update:', error);
        _res.status(500).json({ errorMessage: 'Error with playlist update.' });
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
            console.log('Playlist not found');
            return _res.status(404).json({ errorMessage: 'Playlist not found.' });
        }

        await connection.commit();
        console.log('Playlist successfully deleted');
        await connection.close();

        _res.status(200).json({ message: 'Playlist successfully deleted.' });
    } catch (error) {
        console.error('Error with playlist deletion:', error);
        _res.status(500).json({ errorMessage: 'Error with playlist deletion.' });
    }
}

export default router;
