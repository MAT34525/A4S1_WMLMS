import express from 'express';
import oracledb from 'oracledb';
import {ReqType, ResType} from "../app";
import {ORACLE_DB_PARAMS} from "../config";

const router = express.Router();

// Routes
router.get('/playlists', (req : ReqType, res : ResType) => getPlaylists(req, res));
router.post('/playlists', (req : ReqType, res : ResType) => createPlaylist(req, res));
router.put('/playlists/:id', (req : ReqType, res : ResType) => updatePlaylist(req, res));
router.delete('/playlists/:id', (req : ReqType, res : ResType) => deletePlaylist(req, res));
router.get('/playlists', (req : ReqType, res : ResType) => getTracksForPlaylist(req, res));

// Retrieve all playlists
async function getPlaylists(req : ReqType, res : ResType) {
    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection(ORACLE_DB_PARAMS);

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

async function getTracksForPlaylist(req, res) {
    const { id } = req.params;

    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get tracks for a given playlist
        const result = await connection.execute(
            `
            SELECT t.track_id, t.name, t.artists, t.duration_ms, t.explicit, t.release_date
            FROM tracks t
            JOIN playlist_tracks pt ON t.track_id = pt.track_id
            WHERE pt.playlist_id = :playlistId
            `,
            { playlistId: id }
        );

        // Close the database connection
        await connection.close();

        if (result.rows.length === 0) {
            // No tracks found for the playlist
            return res.status(404).json({ message: 'No tracks found for this playlist.' });
        }

        // Send the list of tracks as a response
        res.status(200).json(result.rows);

    } catch (error) {
        console.error('Error fetching tracks for playlist:', error);
        res.status(500).json({ errorMessage: 'Error fetching tracks for playlist.' });
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
        const connection = await oracledb.getConnection(ORACLE_DB_PARAMS);

        // Query to get all songs from an artists
        await connection.execute(
            `INSERT INTO playlists (NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT)
             VALUES (:name, :description, :isPublic, SYSDATE, SYSDATE)`,
            { name, description, isPublic }
        );

        console.log('Playlist successfully created');

        // Commit changes
        await connection.commit();

        // Close the database connection
        await connection.close();

        // Send the creation status
        res.status(201).json({ message: 'Playlist successfully created.' });

    } catch (error) {
        console.error('Error with playlist creation:', error);
        res.status(500).json({ errorMessage: 'Error with playlist creation.' });
    }
}

// Update an existing playlist
async function updatePlaylist(req : ReqType, res : ResType) {

    const playlistId = req.params.id;
    const { name, description, isPublic } = req.body;

    // Check for missing fields
    if (!name || typeof isPublic === 'undefined') {
        res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        return;
    }

    try {

        // Connect to the database
        const connection = await oracledb.getConnection(ORACLE_DB_PARAMS);

        // Query to update the playlist description
        const result = await connection.execute(
            `UPDATE playlists
             SET NAME = :name, DESCRIPTION = :description, IS_PUBLIC = :isPublic, UPDATED_AT = SYSDATE
             WHERE PLAYLIST_ID = :playlistId`,
            { name, description, isPublic, playlistId }
        );

        // Check the playlist update status
        if (result.rowsAffected === 0) {
            console.log('Playlist not found');
            res.status(404).json({ errorMessage: 'Playlist not found.' });
            return;
        }

        console.log('Playlist successfully updated');

        // Commit changes
        await connection.commit();

        // Close database connection
        await connection.close();

        // Send the update status
        res.status(200).json({ message: 'Playlist successfully updated.' });

    } catch (error) {
        console.error('Error with playlist update:', error);
        res.status(500).json({ errorMessage: 'Error with playlist update.' });
    }
}

// Delete a playlist
async function deletePlaylist(req : ReqType, res : ResType) {

    const playlistId = req.params.id;

    try {
        // Connect to the database
        const connection = await oracledb.getConnection(ORACLE_DB_PARAMS);

        // Query to delete the select query
        const result = await connection.execute(
            `DELETE FROM PLAYLISTS WHERE PLAYLIST_ID = :playlistId`,
            { playlistId }
        );

        // Check the deletion status
        if (result.rowsAffected === 0) {
            console.log('Playlist not found');
            res.status(404).json({ errorMessage: 'Playlist not found.' });
            return;
        }

        console.log('Playlist successfully deleted');

        // Commit changes
        await connection.commit();

        // Close database connection
        await connection.close();

        // Send the deletion status
        res.status(200).json({ message: 'Playlist successfully deleted.' });

    } catch (error) {
        console.error('Error with playlist deletion:', error);
        res.status(500).json({ errorMessage: 'Error with playlist deletion.' });
    }
}

export default router;
