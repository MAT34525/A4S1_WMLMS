import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import oracledb from 'oracledb';

import {Database} from './database.js';

// Swagger

import swaggerJsdoc from 'swagger-jsdoc'; // * as swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';

const jsDocOptions = {
    definition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Documentation for Express API with Swagger',
        },
        components: {
            schemas: {
                Register : {
                    type : 'object',
                    properties : {
                        USERNAME : {type : 'string'},
                        PASSWORD : {type :'string'},
                        EMAIL : {type : 'string'},
                        FULL_NAME : {type :"string"}
                    },
                    required : ["USERNAME", "PASSWORD", "EMAIL", "FULL_NAME"]
                },
                Query: {
                    type: "object",
                    properties: {
                        query: {type: "string"},
                    },
                    required: ["query"]
                },
                Artists: {
                    type: "object",
                    properties: {
                        ARTIST_ID: { type: "string" },
                        NAME: { type: "string" },
                        FOLLOWERS: { type: "integer", nullable: true },
                        GENRES: { type: "string", nullable: true },
                        POPULARITY: { type: "integer", nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["ARTIST_ID", "NAME"]
                },
                Albums: {
                    type: "object",
                    properties: {
                        ALBUM_ID: { type: "string" },
                        NAME: { type: "string" },
                        RELEASE_DATE: { type: "string", format: "date-time", nullable: true },
                        ARTIST_ID: { type: "string", nullable: true }
                    },
                    required: ["ALBUM_ID", "NAME"]
                },
                Tracks: {
                    type: "object",
                    properties: {
                        TRACK_ID: { type: "string" },
                        NAME: { type: "string" },
                        ARTISTS: { type: "string", nullable: true },
                        ID_ARTISTS: { type: "string", nullable: true },
                        DURATION_MS: { type: "integer", nullable: true },
                        EXPLICIT: { type: "integer", nullable: true },
                        RELEASE_DATE: { type: "string", format: "date-time", nullable: true },
                        TIME_SIGNATURE: { type: "integer", nullable: true },
                        ALBUM_ID: { type: "string", nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["TRACK_ID", "NAME"]
                },
                TracksAudioFeatures: {
                    type: "object",
                    properties: {
                        TRACK_ID: { type: "string" },
                        DANCEABILITY: { type: "number", nullable: true },
                        ENERGY: { type: "number", nullable: true },
                        KEY: { type: "integer", nullable: true },
                        LOUDNESS: { type: "number", nullable: true },
                        MODE: { type: "integer", nullable: true },
                        SPEECHINESS: { type: "number", nullable: true },
                        ACOUSTICNESS: { type: "number", nullable: true },
                        INSTRUMENTALNESS: { type: "number", nullable: true },
                        LIVENESS: { type: "number", nullable: true },
                        VALENCE: { type: "number", nullable: true },
                        TEMPO: { type: "number", nullable: true }
                    },
                    required: ["TRACK_ID"]
                },
                Users: {
                    type: "object",
                    properties: {
                        USER_ID: { type: "string" },
                        USERNAME: { type: "string" },
                        PASSWORD: { type: "string" },
                        EMAIL: { type: "string", format: "email", nullable: true },
                        FULL_NAME: { type: "string", nullable: true },
                        IS_ARTIST: { type: "string", enum: ["Y", "N"], nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["USER_ID", "USERNAME", "PASSWORD"]
                },
                Playlists: {
                    type: "object",
                    properties: {
                        PLAYLIST_ID: { type: "string" },
                        USER_ID: { type: "string", nullable: true },
                        NAME: { type: "string" },
                        DESCRIPTION: { type: "string", nullable: true },
                        IS_PUBLIC: { type: "string", enum: ["Y", "N"], nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["PLAYLIST_ID", "NAME"]
                },
                UserFavoriteTracks: {
                    type: "object",
                    properties: {
                        USER_ID: { type: "string" },
                        TRACK_ID: { type: "string" },
                        ADDED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["USER_ID", "TRACK_ID"]
                },
                PlaylistTracks: {
                    type: "object",
                    properties: {
                        PLAYLIST_ID: { type: "string" },
                        TRACK_ID: { type: "string" }
                    },
                    required: ["PLAYLIST_ID", "TRACK_ID"]
                },
                Comments: {
                    type: "object",
                    properties: {
                        COMMENT_ID: { type: "string" },
                        USER_ID: { type: "string" },
                        TRACK_ID: { type: "string" },
                        COMMENT_TEXT: { type: "string" },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["COMMENT_ID", "USER_ID", "TRACK_ID", "COMMENT_TEXT"]
                },
                ForumPosts: {
                    type: "object",
                    properties: {
                        POST_ID: { type: "string" },
                        USER_ID: { type: "string" },
                        TITLE: { type: "string", nullable: true },
                        CONTENT: { type: "string", nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["POST_ID", "USER_ID"]
                },
                ForumReplies: {
                    type: "object",
                    properties: {
                        REPLY_ID: { type: "string" },
                        POST_ID: { type: "string" },
                        USER_ID: { type: "string" },
                        CONTENT: { type: "string", nullable: true },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true }
                    },
                    required: ["REPLY_ID", "POST_ID", "USER_ID"]
                },
                UserFollowers: {
                    type: "object",
                    properties: {
                        USER_ID: {
                            type: "string"
                        },
                        FOLLOWER_ID: {
                            type: "string"
                        },
                        CREATED_AT: {
                            type: "string",
                            format: "date-time",
                            nullable: true
                        }
                    },
                    required: ["USER_ID", "FOLLOWER_ID"]
                }
                // Define other schemas as needed
            },
        },
    },
    apis: ['app.js', 'admin_database.js', 'database.js'],
};

const apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null,2));

const app = express();
app.use(express.json());

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

//gestion des sessions de chaque user
app.use(session({
    secret: 'session_secrete', // Utilisez une clé secrète pour signer les sessions
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // En production, vous devriez mettre `secure: true` si vous utilisez HTTPS
}));



// Connexion BDD

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = 'admin' // set mypw to the hr schema password

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

let databaseConnexions = [];

// Ajoute la connexion initiale pour l'application
// databaseConnexions.push(new Database(app, 'app', 'apppassword'))

databaseConnexions.push(new Database(app, 'admin', 'admin'))

// Lier des fonctions de la bdd aux app
// app.get("/yeet", (req, res) => database.test_function(req, res))

// Route pour afficher la page de login
app.get('/u/login', (req, res) => {
    res.render('login', { errorMessage: null }); // Pas d'erreur initialement
});


app.post('/u/login', async (req, res) => {
    const { username, password } = req.body;

    // Vérifier si l'utilisateur et le mot de passe ont été fournis
    if (!username || !password) {
        return res.render('login', { errorMessage: 'Tous les champs sont obligatoires.' });
    }

    try {
        console.log('Tentative de connexion pour l\'utilisateur:', username); // Log pour suivre la tentative de connexion

        // Connexion à la base de données Oracle
        const connection = await oracledb.getConnection({
            user: "admin",
            password: mypw,
            connectString: "localhost:1521/wmlmspdb"
        });

        console.log('Connexion à la base de données réussie.'); // Log pour vérifier que la connexion fonctionne

        // Recherche de l'utilisateur dans la base de données
        const result = await connection.execute(
            `SELECT user_id, username, password FROM users WHERE username = :username`,
            [username]
        );

        console.log('Résultat de la recherche utilisateur:', result.rows); // Log du résultat de la recherche

        // Vérifier si l'utilisateur existe
        if (result.rows.length === 0) {
            console.log('Aucun utilisateur trouvé avec ce nom d\'utilisateur');
            await connection.close();
            res.json({ errorMessage: 'Identifiants incorrects.' }).status(400)
            return;
        }

        // Récupérer l'utilisateur de la réponse
        const user = result.rows[0];
        const storedPassword = user.PASSWORD;  // Le mot de passe stocké est dans le champ PASSWORD de la base de données

        console.log('Mot de passe stocké:', storedPassword); // Log pour vérifier que le mot de passe est récupéré correctement

        // Vérifier si le mot de passe correspond
        const isPasswordValid = await bcrypt.compare(password, storedPassword);

        if (isPasswordValid) {
            console.log('Mot de passe valide. Connexion réussie!');
            await connection.close();
            res.json({message: 'Login réussi!'}).status(200);
            return;
        } else {
            console.log('Mot de passe incorrect');
            await connection.close();
            res.json({ errorMessage: 'Identifiants incorrects.' }).status(400);
            return;
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error); // Log de l'erreur détaillée
        res.json({ errorMessage: 'Une erreur est survenue, veuillez réessayer.' }).status(400);
    }
});

//Route pour la création de compte
app.get('/u/register', (req, res) => {
    res.render('register', { errorMessage: null });
});

/**
 * @openapi
 * /u/register:
 *   post:
 *     description: Register a new user with a post request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Register'
 *     responses:
 *       200:
 *         description: Successfull user creation !
 *       404:
 *         description: An error occured, please try again.
 */
app.post('/u/register', async (req, res) => {
    const { username, password, email} = req.body;

    // Vérification que tous les champs sont remplis
    if (!username || !password || !email) {
        return res.json({ errorMessage: 'Tous les champs sont obligatoires.' }).status(400);
    }

    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connexion à la base de données
        const connection = await oracledb.getConnection({
            user: "admin",
            password: mypw,
            connectString: "localhost:1521/wmlmspdb"
        });

        // Insertion de l'utilisateur dans la base de données
        const insertResult = await connection.execute(
            `INSERT INTO users (username, password, email)
             VALUES (:username, :password, :email)`,
            {
                username: username,
                password: hashedPassword,
                email: email
            },
            { autoCommit: true }  // Assurez-vous que les modifications sont validées dans la base de données
        );

        console.log(insertResult);
        await connection.close();

        // Redirection ou message de succès
        res.json({message: 'Successfull user creation !'}).status(200);

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.json({errorMessage: 'An error occured, please try again.' }).status(400);
    }
});

// Route pour afficher les playlists de l'utilisateur connecté
app.get('/u/playlists', async (req, res) => {
    const userId = req.session.userId; // On suppose que l'ID de l'utilisateur est stocké dans la session

    // Vérifier si l'utilisateur est connecté
    if (!userId) {
        return res.redirect('/login'); // Redirige vers la page de login si l'utilisateur n'est pas connecté
    }

    try {
        // Connexion à la base de données
        const connection = await oracledb.getConnection({
            user: "admin",
            password: mypw,
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
        res.render('playlists', { playlists: result.rows });

    } catch (error) {
        console.error('Erreur lors de la récupération des playlists:', error);
        res.render('error', { errorMessage: 'Une erreur est survenue lors de la récupération des playlists.' });
    }
});


//méthode du boutton pour se déconnecter
app.get('/u/logout', (req, res) => {
    // Supprimer les informations de session (ici, l'ID de l'utilisateur)
    req.session.destroy((err) => {
        if (err) {
            console.error('Erreur lors de la destruction de la session:', err);
            return res.redirect('/playlists'); // Rediriger vers la page des playlists en cas d'erreur
        }

        // Rediriger l'utilisateur vers la page de login après la déconnexion
        res.redirect('/login');
    });
});



// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server running on : http://localhost:3000');
});