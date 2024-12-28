import express from 'express';
import oracledb from 'oracledb';
import {ReqType, ResType} from "../app";

const router = express.Router();

// Route to retrieve artists
router.get('/u/artists', async (req : ReqType, res : ResType) => {
    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get all artists
        const result = await connection.execute(
            `SELECT ARTIST_ID, NAME, FOLLOWERS, GENRES, POPULARITY, CREATED_AT, UPDATED_AT
            FROM artists`
        );

        console.log('Retrieved artists :', result.rows);

        // Close database connection
        await connection.close();

        // Send the retrieved artist list
        res.status(200).json({ artists: result.rows });

    } catch (error) {
        console.error('Error when retrieving artists :', error);
        res.status(500).json({ message: 'Error when retrieving artists.' });
    }
});



// Route to retrieve albums from an artist
router.get('/u/albums/:artistId', async (req : ReqType, res : ResType) => {

    const { artistId } = req.params;

    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get all albums from an artists
        const result = await connection.execute(
            `SELECT ALBUM_ID, NAME, RELEASE_DATE, ARTIST_ID
            FROM albums
            WHERE ARTIST_ID = :artistId`,
            [artistId] // Pass ARTIST_ID value
        );

        console.log('Retrieved songs from artist :', artistId);

        // Close database connection
        await connection.close();

        // Send the retrieved albums list
        res.status(200).json({ albums: result.rows });

    } catch (error) {
        console.error('Error when retrieving artist albums :', error);
        res.status(500).json({ message: 'Error when retrieving artists albums.' });
    }
});


// Route to retrieve songs from an artist
router.get('/u/tracks/:artistId', async (req : ReqType, res : ResType) => {

    const { artistId } = req.params;

    try {
        // Connect to the Oracle database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Query to get all songs from an artists
        const result = await connection.execute(
            `SELECT TRACK_ID, NAME, ARTISTS, ID_ARTISTS, DURATION_MS, EXPLICIT, RELEASE_DATE, TIME_SIGNATURE, ALBUM_ID
             FROM tracks
             WHERE ID_ARTISTS = :artistId`,
            [artistId] // Pass ARTIST_ID value
        );

        console.log('Retrieved songs from artist :', artistId);

        // Close database connection
        await connection.close();

        // Send the retrieved songs list
        res.status(200).json({ tracks: result.rows });

    } catch (error) {

        console.error('Error when retrieving artist songs :', error);
        res.status(500).json({ message: 'Error when retrieving artist songs' });
    }
});

export default router;