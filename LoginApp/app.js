import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import oracledb from 'oracledb';

import {Database} from './database.js';

// Swagger

import swaggerJsdoc from 'swagger-jsdoc'; // * as swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express';

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
app.get('/login', (req, res) => {
    res.render('login', { errorMessage: null }); // Pas d'erreur initialement
});


app.post('/login', async (req, res) => {
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
            password: mypw,  // Remplacez par votre mot de passe réel
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
            return res.render('login', { errorMessage: 'Identifiants incorrects.' });
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
            res.send('Login réussi!');
        } else {
            console.log('Mot de passe incorrect');
            await connection.close();
            res.render('login', { errorMessage: 'Identifiants incorrects.' });
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error); // Log de l'erreur détaillée
        res.render('login', { errorMessage: 'Une erreur est survenue, veuillez réessayer.' });
    }
});

//Route pour la création de compte
app.get('/register', (req, res) => {
    res.render('register', { errorMessage: null });
});


app.post('/register', async (req, res) => {
    const { username, password, email, full_name } = req.body;

    // Vérification que tous les champs sont remplis
    if (!username || !password || !email || !full_name) {
        return res.render('register', { errorMessage: 'Tous les champs sont obligatoires.' });
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
            `INSERT INTO users (username, password, email, full_name)
             VALUES (:username, :password, :email, :full_name)`,
            {
                username: username,
                password: hashedPassword,
                email: email,
                full_name: full_name
            },
            { autoCommit: true }  // Assurez-vous que les modifications sont validées dans la base de données
        );

        console.log(insertResult);
        await connection.close();

        // Redirection ou message de succès
        res.send('Compte créé avec succès! Veuillez vous connecter.');

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        res.render('register', { errorMessage: 'Une erreur est survenue, veuillez réessayer.' });
    }
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Server running on : http://localhost:3000');
});