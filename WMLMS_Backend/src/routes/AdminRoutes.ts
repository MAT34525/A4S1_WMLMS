import {Database} from "../database";
import express, {Router} from 'express';
import {ReqType, ResType} from "../app";

const router : Router = express.Router();

// Handle multiple connexion (not used)
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
router.post('/u/admin-login', (req : ReqType ,res : ResType) => adminLogin(req, res));

async function adminLogin(req : ReqType, res : ResType) {

    const { username, password }  = req.body as {username? : string, password? : string} ;

    // Check for missing fields
    if (!username || !password) {
        res.json({ errorMessage: 'All fields are mandatory.' }).status(400);
    }
    try {
        // Connection status
        console.log('Trying to connect administrator :', username);

        // Create a new database connection
        databaseConnexions.push(new Database(router, username, password));

        // Wait for the database connection to be established before proceeding
        await databaseConnexions[databaseConnexions.length - 1].connect();

        // Get the connection status
        let status = databaseConnexions[databaseConnexions.length - 1].getConnectionStatus();
        console.log("Admin connection status : ", status);

        // Depending on the status, proceed or abort the login
        if (status)
        {
            console.log("Admin successfully connected, admin panel available !");
            res.json({message : "Admin successfully connected !",  status:200}).status(200);
            return;
        } else {
            console.log("Admin credentials are invalid !");
            res.json({message : "Admin credentials are invalid!",  status:400}).status(400);

            databaseConnexions.pop();

        }

    // Inform the user for any other issues
    } catch (error) {
        console.error('Error when connecting :', error);
        res.json({ message: 'An error occurred, please try again.', status:400 }).status(400);
    }
}

export default router;
