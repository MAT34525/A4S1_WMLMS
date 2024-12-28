import express from 'express';
import oracledb from 'oracledb';

const router = express.Router();

// Route pour récupérer les artistes
router.get('/u/artists', async (_req, _res) => {
    try {
        // Connexion à la base de données Oracle
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Requête pour récupérer tous les artistes
        const result = await connection.execute(
            `SELECT ARTIST_ID, NAME, FOLLOWERS, GENRES, POPULARITY, CREATED_AT, UPDATED_AT
       FROM artists`
        );

        console.log('Artistes récupérés:', result.rows); // Log pour débogage

        // Fermer la connexion à la base de données
        await connection.close();

        // Répondre avec la liste des artistes
        _res.status(200).json({ artists: result.rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error);
        _res.status(500).json({ message: 'Erreur lors de la récupération des artistes.' });
    }
});



// Route pour récupérer les albums d'un artiste
router.get('/u/albums/:artistId', async (_req, _res) => {
    const { artistId } = _req.params; // Récupérer l'ID de l'artiste depuis l'URL

    try {
        // Connexion à la base de données Oracle
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Requête pour récupérer les albums d'un artiste
        const result = await connection.execute(
            `SELECT ALBUM_ID, NAME, RELEASE_DATE, ARTIST_ID
       FROM albums
       WHERE ARTIST_ID = :artistId`,
            [artistId]
        );

        console.log('Albums récupérés pour l\'artiste:', result.rows); // Log pour débogage

        // Fermer la connexion à la base de données
        await connection.close();

        // Répondre avec la liste des albums de l'artiste
        _res.status(200).json({ albums: result.rows });
    } catch (error) {
        console.error('Erreur lors de la récupération des albums:', error);
        _res.status(500).json({ message: 'Erreur lors de la récupération des albums.' });
    }
});


// Route pour récupérer les musiques (tracks) d'un artiste
router.get('/u/tracks/:artistId', async (_req, _res) => {
    const { artistId } = _req.params; // Récupérer l'ID de l'artiste depuis l'URL

    try {
        // Connexion à la base de données Oracle
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Requête pour récupérer les tracks d'un artiste
        const result = await connection.execute(
            `SELECT TRACK_ID, NAME, ARTISTS, ID_ARTISTS, DURATION_MS, EXPLICIT, RELEASE_DATE, TIME_SIGNATURE, ALBUM_ID
             FROM tracks
             WHERE ID_ARTISTS = :artistId`, // Utiliser l'ID_ARTISTS pour filtrer les tracks par artiste
            [artistId] // Passer l'ID de l'artiste comme paramètre
        );

        console.log('music collected for artist', result.rows); // Log pour débogage

        // Fermer la connexion à la base de données
        await connection.close();

        // Répondre avec la liste des tracks de l'artiste
        _res.status(200).json({ tracks: result.rows });
    } catch (error) {
        console.error('Error when music collection', error);
        _res.status(500).json({ message: 'Error when music collection.' });
    }
});




export default router;