import express from 'express';
import oracledb from 'oracledb';
import bcrypt from "bcrypt";

const router = express.Router();

// Route pour afficher la page de login
router.get('/u/login', (_req, _res) => {
    _res.json({ message: null,  status:404 }).status(404); // Pas d'erreur initialement
});

router.post('/u/login',  async (_req, _res) => {
    const { username, password } = _req.body;

    // Vérifier si l'utilisateur et le mot de passe ont été fournis
    if (!username || !password) {
        _res.json({ messsage : 'Tous les champs sont obligatoires.',  status:400 }).status(400);
        return;
    }

    try {
        console.log('Tentative de connexion pour l\'utilisateur:', username); // Log pour suivre la tentative de connexion

        // Connexion à la base de données Oracle
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
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
            _res.json({message: 'Identifiants incorrects.',  status:400 }).status(400)
            return;
        }

        // Récupérer l'utilisateur de la réponse
        const user = result.rows[0];
        const storedPassword = user.PASSWORD;  // Le mot de passe stocké est dans le champ PASSWORD de la base de données

        console.log('Mot de passe stocké:', storedPassword); // Log pour vérifier que le mot de passe est récupéré correctement

        // Vérifier si le mot de passe correspond
        const isPasswordValid = (password === storedPassword);

        if (isPasswordValid) {
            console.log('Mot de passe valide. Connexion réussie!');
            await connection.close();
            _res.json({message: 'Login réussi!',  status:200}).status(200);
            return;
        } else {
            console.log('Mot de passe incorrect');
            await connection.close();
            _res.json({ message: 'Identifiants incorrects.',  status:400 }).status(400);
            return;
        }

    } catch (error) {
        console.error('Erreur lors de la connexion:', error); // Log de l'erreur détaillée
        _res.json({message: 'Une erreur est survenue, veuillez réessayer.',  status:400 }).status(400);
    }
});

//Route pour la création de compte
router.get('/u/register', (req, res) => {
    res.send({message: null,  status:404 });
});

//Route pour créer un compte
router.post('/u/register', (_req, _res) => register(_req, _res));

async function register(_req : any, _res : any) {
    const { username, password, email} = _req.body;

    // Vérification que tous les champs sont remplis
    if (!username || !password || !email) {
        return _res.json({message: 'Tous les champs sont obligatoires.',  status:400 }).status(400);
    }

    try {
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connexion à la base de données
        const connection = await oracledb.getConnection({
            user: "admin",
            password: "admin",
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
        _res.json({message: 'Successfull user creation !',  status:200}).status(200);

    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        _res.json({message: 'An error occured, please try again.',  status:400 }).status(400);
    }
}


//méthode du bouton pour se déconnecter
router.get('/u/logout', (req, res) => {
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


export default router;
