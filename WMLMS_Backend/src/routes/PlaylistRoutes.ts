import express from 'express';
import oracledb from 'oracledb';

const router = express.Router();


// Route pour afficher les playlists de l'utilisateur connecté
router.get('/u/playlists', (_req, _res) => playlists(_req, _res));

async function playlists (_req : any, _res : any) {

    const userId = _req.session.userId; // On suppose que l'ID de l'utilisateur est stocké dans la session

    // Vérifier si l'utilisateur est connecté
    if (!userId) {
        return _res.redirect('/login'); // Redirige vers la page de login si l'utilisateur n'est pas connecté
    }

    try {
        // Connexion à la base de données
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Récupérer les playlists de l'utilisateur
        const result = await connection.execute(
            `SELECT PLAYLIST_ID, NAME, DESCRIPTION, IS_PUBLIC, CREATED_AT, UPDATED_AT
             FROM playlists
             WHERE USER_ID = :userId`,
            [userId]
        );

        console.log('Playlists récupérées pour l\'utilisateur:', result.rows); // Log pour débogage

        // Fermer la connexion à la base de données
        await connection.close();

        // Passer les playlists à la vue
        _res.render('playlists', { playlists: result.rows });

    } catch (error) {
        console.error('Erreur lors de la récupération des playlists:', error);
        _res.render('error', { errorMessage: 'Une erreur est survenue lors de la récupération des playlists.' });
    }
}

export default router;

