import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import oracledb from 'oracledb';

import {Database} from './database.js';

const app = express();



// Connexion BDD


oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = 'admin' // set mypw to the hr schema password

/* Replace oracle db by Sequelize for stucture and model managment
let db = new Database();
const sequelize = new Sequelize('wmlmspdb', 'admin', mypw, {
    host: 'localhost',
    port: 1521,
    dialect: 'oracle'
});

async function RunSequelize()
{
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

RunSequelize();
*/


async function run() {

    const connection = await oracledb.getConnection ({
        user          : "admin",
        password      : mypw,
        connectString : "localhost:1521/wmlmspdb"
    });

    const result = await connection.execute(
        `SELECT * FROM users`
    );

    console.log(result.rows);
    await connection.close();
}

// run();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


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