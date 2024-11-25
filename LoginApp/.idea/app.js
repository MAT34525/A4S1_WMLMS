const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Connexion BDD
const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const mypw = 'admin' // set mypw to the hr schema password

async function run() {

    const connection = await oracledb.getConnection ({
        user          : "admin",
        password      : mypw,
        connectString : "localhost:1521/wmlmspdb"
    });

    const result = await connection.execute(
        `SELECT * FROM TEST`
    );

    console.log(result.rows);
    await connection.close();
}

run();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Route pour afficher la page de login
app.get('/', (req, res) => {
    res.render('login', { errorMessage: null }); // Pas d'erreur initialement
});

// Route pour traiter la soumission du formulaire
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Exemple de vérification simple
    if (username === 'admin' && password === 'admin') {
        res.send('Login réussi!');
    } else {
        // Renvoyer à la page de login avec un message d'erreur
        res.render('login', { errorMessage: 'Identifiants incorrects.' });
    }
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});