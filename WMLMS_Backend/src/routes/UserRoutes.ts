import express from 'express';
import bcrypt from "bcrypt";
import {ReqType, ResType} from "../app";
import {Schema} from "../schema";
import {Op} from "sequelize";
import {Users} from "../tables";

const router = express.Router();

router.post('/u/login',  async (req : ReqType, res : ResType) => login(req, res));
router.post('/u/register', (req : ReqType, res : ResType) => register(req, res));
router.get('/u/logout', (req : ReqType, res : ResType) => logout(req, res));

// Verify and log an user using its credentials
async function login (req : ReqType, res : ResType) {

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const { username, password } = req.body;

    // Check for missing fields
    if (!username || !password) {
        res.json({ message : 'All fields are mandatory.',  status:400 }).status(400);
        return;
    }

    try {
        console.log('Trying to connect with user:', username);

        // Searching for user in the database
        const result = await Schema.getUsers().findAndCountAll({
            attributes: ["USER_ID", "USERNAME", "PASSWORD"],
            where : {
                USERNAME : {
                    [Op.like] : username,
                }
            }
        });

        console.log('User search result:', result.rows);

        // Check if user exists
        if (result.rows.length === 0) {
            console.log('No user found');
            res.json({message: 'Invalid credentials.',  status:400 }).status(400)
            return;
        }

        // Get stored hashed password
        const user : Users[] = result.rows;
        const storedPassword = user[0].PASSWORD;

        console.log('stored password:', storedPassword)
        console.log('verification:', await bcrypt.compare(password, storedPassword))

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, storedPassword);

        if (isPasswordValid) {
            console.log('Correct password. Managed to connect!');
            res.json({message: 'Logged in!',  status:200}).status(200);
            return;
        } else {
            console.log('Incorrect password');
            res.json({ message: 'Incorrect credentials.',  status:400 }).status(400);
            return;
        }
    } catch (error) {
        console.error('Error during getConnection():', error); // Log detailed error
        res.json({message: 'An error occurred, please try again.',  status:400 }).status(400);
    }
}

// Register an user using given credentials
async function register(req : ReqType, res : ResType) {

    const { username, password, email} = req.body;

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Check that all fields are filled
    if (!username || !password || !email) {
        res.json({message: 'All fields are required.',  status:400 }).status(400);
        return;
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        const insertResult = await Schema.getUsers().create({
            USERNAME : username,
            PASSWORD : hashedPassword,
            EMAIL : email,
        });

        console.log(insertResult.rows);

        // Redirect or send success message
        res.json({message: 'Successful user creation!',  status:200}).status(200);

    } catch (error) {
        console.error('Error during registration:', error);
        res.json({message: 'An error occurred, please try again.',  status:400}).status(400);
    }
}

// Logout an user
function logout(req : ReqType, res : ResType) {
    // Remove session information (e.g., user ID)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout :', err);
            res.json({message: 'An error occurred, please try again.', status: 400})
                .status(400)
                .redirect('/playlists'); // Redirect to the playlists page in case of error
            return;
        }

        // Redirect the user to the login page after logging out
        res.redirect('/login');
    });
}

export default router;