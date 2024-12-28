import express from 'express';
import oracledb from 'oracledb';
import {ReqType, ResType} from "../app";

const router = express.Router();

// Routes
router.get('/playlists', (req : ReqType, res : ResType) => getPlaylists(req, res));
router.post('/playlists', (req : ReqType, res : ResType) => createPlaylist(req, res));
router.put('/playlists/:id', (req : ReqType, res : ResType) => updatePlaylist(req, res));
router.delete('/playlists/:id', (req : ReqType, res : ResType) => deletePlaylist(req, res));

// Retrieve all playlists
async function getPlaylists(req : ReqType, res : ResType) {
    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get all playlists
        const result = await connection.execute(
            `SELECT PLAYLIST_ID, NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT FROM playlists`
        );

        console.log('Retrieved playlists :', result.rows);

        // Close database connection
        await connection.close();

        // Send the retrieved playlists list
        res.status(200).json({ playlists: result.rows });

    } catch (error) {

        console.error('Error when retrieving playlists :', error);
        res.status(500).json({ errorMessage: 'Error when retrieving artists.' });
    }
}

// Create a new playlist
async function createPlaylist(req : ReqType, res : ResType) {

    const { name, description, isPublic } = req.body;

    // Check missing values
    if (!name || typeof isPublic === 'undefined') {
        res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        return;
    }

    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get all songs from an artists
        await connection.execute(
            `INSERT INTO playlists (NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT)
             VALUES (:name, :description, :isPublic, SYSDATE, SYSDATE)`,
            { name, description, isPublic }
        );

        await connection.commit();
        console.log('Playlist successfully created');
        await connection.close();

        res.status(201).json({ message: 'Playlist successfully created.' });
    } catch (error) {
        console.error('Error with playlist creation:', error);
        res.status(500).json({ errorMessage: 'Error with playlist creation.' });
    }
}

// Mettre à jour une playlist existante
async function updatePlaylist(req, res) {
    const playlistId = req.params.id;
    const { name, description, isPublic } = req.body;

    if (!name || typeof isPublic === 'undefined') {
        res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        return;
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
            res.status(404).json({ errorMessage: 'Playlist not found.' });
            return;

        }

        await connection.commit();
        console.log('Playlist successfully updated');
        await connection.close();

        res.status(200).json({ message: 'Playlist successfully updated.' });
    } catch (error) {
        console.error('Error with playlist update:', error);
        res.status(500).json({ errorMessage: 'Error with playlist update.' });
    }
}

// Supprimer une playlist
async function deletePlaylist(req, res) {
    const playlistId = req.params.id;

    try {
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        const result = await connection.execute(
            `DELETE FROM PLAYLISTS WHERE PLAYLIST_ID = :playlistId`,
            { playlistId }
        );

        if (result.rowsAffected === 0) {
            console.log('Playlist not found');
            return res.status(404).json({ errorMessage: 'Playlist not found.' });
        }

        await connection.commit();
        console.log('Playlist successfully deleted');
        await connection.close();

        res.status(200).json({ message: 'Playlist successfully deleted.' });
    } catch (error) {
        console.error('Error with playlist deletion:', error);
        res.status(500).json({ errorMessage: 'Error with playlist deletion.' });
    }
}

export default router;
