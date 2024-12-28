import express from 'express';
import oracledb from 'oracledb';
import bcrypt from "bcrypt";

const router = express.Router();

// Route to show the login page
router.get('/u/login', (_req, _res) => {
    _res.json({ message: null,  status:404 }).status(404);
});

router.post('/u/login',  async (_req, _res) => {
    const { username, password } = _req.body;

    // Check if all fields are filled
    if (!username || !password) {
        _res.json({ messsage : 'All fields are mandatory.',  status:400 }).status(400);
        return;
    }

    try {
        console.log('Trying to connect with user:', username);

        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        console.log('Successfully connected to the database.');

        // Searching for user in the database
        const result = await connection.execute(
            `SELECT user_id, username, password FROM users WHERE username = :username`,
            [username]
        );

        console.log('User search result:', result.rows);

        // Check if user exists
        if (result.rows.length === 0) {
            console.log('No user found');
            await connection.close();
            _res.json({message: 'Invalid credentials.',  status:400 }).status(400)
            return;
        }


        // Get stored hashed password
        const user = result.rows[0];
        const storedPassword = user.PASSWORD;

        console.log('stored password:', storedPassword)
        console.log('verification:', await bcrypt.compare(password, storedPassword))

        // Verify the password using bcrypt
        const isPasswordValid = await bcrypt.compare(password, storedPassword);

        if (isPasswordValid) {
            console.log('Correct password. Managed to connect!');
            await connection.close();
            _res.json({message: 'Loged in!',  status:200}).status(200);
            return;
        } else {
            console.log('Incorrect password');
            await connection.close();
            _res.json({ message: 'Incorrect credentials.',  status:400 }).status(400);
            return;
        }
    } catch (error) {
        console.error('Error during connection:', error); // Log detailed error
        _res.json({message: 'An error occurred, please try again.',  status:400 }).status(400);
    }
});

// Route for account creation page
router.get('/u/register', (req, res) => {
    res.send({message: null,  status:404 });
});

// Route to create an account
router.post('/u/register', (_req, _res) => register(_req, _res));

async function register(_req : any, _res : any) {
    const { username, password, email} = _req.body;

    // Check that all fields are filled
    if (!username || !password || !email) {
        return _res.json({message: 'All fields are required.',  status:400 }).status(400);
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connect to the database
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
            connectString: "localhost:1521/wmlmspdb"
        });

        // Insert the user into the database
        const insertResult = await connection.execute(
            `INSERT INTO users (username, password, email)
             VALUES (:username, :password, :email)`,
            {
                username: username,
                password: hashedPassword,
                email: email
            },
            { autoCommit: true }  // Ensure changes are committed to the database
        );

        console.log(insertResult);
        await connection.close();

        // Redirect or send success message
        _res.json({message: 'Successful user creation!',  status:200}).status(200);

    } catch (error) {
        console.error('Error during registration:', error);
        _res.json({message: 'An error occurred, please try again.',  status:400 }).status(400);
    }
}


// Method for the logout button
router.get('/u/logout', (req, res) => {
    // Remove session information (e.g., user ID)
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during session destruction:', err);
            return res.redirect('/playlists'); // Redirect to the playlists page in case of error
        }

        // Redirect the user to the login page after logging out
        res.redirect('/login');
    });
});

export default router;