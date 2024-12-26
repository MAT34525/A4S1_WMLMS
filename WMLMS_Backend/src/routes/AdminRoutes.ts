import {Database} from "../database";
import express from 'express';

const router = express.Router();

let databaseConnexions = [];

/**
 * @openapi
 * /u/admin-login:
 *   post:
 *     description: Log in the database as an administrator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Admin successfully connected !
 *       404:
 *         description: An error occurred, please try again.
 */
router.post('/u/admin-login', (_req, _res) => adminLogin(_req, _res));

async function adminLogin(_req : any, _res : any) {

    const { username, password }  = _req.body as {username? : string, password? : string} ;

    // Vérifier si l'utilisateur et le mot de passe ont été fournis
    if (!username || !password) {
        return _res.json({ errorMessage: 'Tous les champs sont obligatoires.' }).status(400);
    }
    try {
        console.log('Tentative de connexion pour l\'administrateur:', username); // Log pour suivre la tentative de connexion

        // Create a new database connection
        databaseConnexions.push(new Database(router, username, password));

        // Wait for the database connection to be established before proceeding
        await databaseConnexions[databaseConnexions.length - 1].connect();

        // Get the connection status
        let status = databaseConnexions[databaseConnexions.length - 1].getConnectionStatus();
        console.log("Admin connection status : ", status);

        // Depending on the status, proceed or abord the login
        if (status)
        {
            console.log("Admin successfully connected, admin panel available !");
            _res.json({message : "Admin successfully connected !",  status:200}).status(200);
            return;
        } else {
            console.log("Admin credentials are invalid !");
            _res.json({message : "Admin credentials are invalid!",  status:400}).status(400);

            databaseConnexions.pop();

        }

        // Inform the user for any other issues
    } catch (error) {
        console.error('Error when connecting :', error); // Log de l'erreur détaillée
        _res.json({ message: 'An error occurred, please try again.', status:400 }).status(400);
    }
}

export default router;
