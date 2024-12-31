import express from 'express';
import bcrypt from "bcrypt";
import {ReqType, ResType} from "../app";
import {Schema} from "../schema";
import {Op} from "sequelize";
import {Users} from "../tables";
import {v4 as uuid} from 'uuid';

const router = express.Router();

router.post('/u/login',  async (req : ReqType, res : ResType) => login(req, res));
router.post('/u/register', (req : ReqType, res : ResType) => register(req, res));
router.get('/u/logout', (req : ReqType, res : ResType) => logout(req, res));

// Verify and log an user using its credentials
async function login (req : ReqType, res : ResType) {

    console.log("User POST Login");

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const { username, password } : {username? : string, password? : string } = req.body;

    // Check for missing fields
    if (!username || !password) {
        res.status(400).json({ message : 'All fields are mandatory.',  status:400 });
        return;
    }

    try {
        console.log('Trying to connect with user:', username);

        // Searching for user in the database
        const result : Users[] = await Schema.getUsers().findAll({
            attributes: ["USER_ID", "USERNAME", "PASSWORD"],
            where : {
                USERNAME : {
                    [Op.like] : username,
                }
            },
            raw : true
        });

        console.log('User search result:', result);

        // Check if user exists
        if (result.length === 0) {
            console.log('No user found');
            res.status(404).json({message: 'User not found.'})
            return;
        }

        // Get stored hashed password
        const storedPassword : string = result[0].PASSWORD;

        console.log('Stored password:', storedPassword)
        console.log('Verification:', await bcrypt.compare(password, storedPassword))

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, storedPassword);

        if (isPasswordValid) {
            console.log('Correct password. Managed to connect!');
            res.status(200).json({message: 'Logged in!'});
            return;
        } else {
            console.log('Incorrect password');
            res.status(400).json({message: 'Incorrect credentials.'});
            return;
        }
    } catch (error) {
        console.error('Error during connection ', error); // Log detailed error
        res.status(400).json({message: 'An error occurred, please try again.'});
    }
}

// Register an user using given credentials
async function register(req : ReqType, res : ResType) {

    console.log('User POST Register')

    const { username, password, email} : { username? : string, password? : string, email? : string}  = req.body;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Check that all fields are filled
    if (!username || !password || !email) {
        res.status(400).json({message: 'All fields are required.'});
        return;
    }

    try {
        // Hash the password
        const hashedPassword : string = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await Schema.getUsers().create({
            USER_ID : uuid(),
            USERNAME : username,
            PASSWORD : hashedPassword,
            EMAIL : email,
        }, {raw : true});

        // Redirect or send success message
        res.status(200).json({message: 'Successful user creation !'});

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({message: 'An error occurred, please try again.'});
    }
}

// Logout an user
function logout(req : ReqType, res : ResType) {

    console.log("User GET Logout")

    // Remove session information (e.g., user ID)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout :', err);
            res.status(400).json({message: 'An error occurred, please try again.'})
                .redirect('/playlists'); // Redirect to the playlists page in case of error
            return;
        }

        // Redirect the user to the login page after logging out
        res.redirect('/login');
    });
}

export default router;