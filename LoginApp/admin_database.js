/*
This class is used by the Database class to handle admin CRUD commands
 */
export class AdminDatabase {

    #app;
    #connection;

    constructor(app, connection) {

        // Initiate admin CRUD commands
        this.#app = app;
        this.#connection = connection;

        this.initAdminCRUD();
    }

    initAdminCRUD()
    {
        // User CRUD
        this.#app.get('/s/admin/users/:id', (req, res) => this.getUser(req, res));
        this.#app.get('/s/admin/users', (req, res) => this.getUserList(req, res));

        // Table visualisation
        this.#app.get('/s/admin/albums', (req, res) => this.getAlbumList(req, res));
        this.#app.get('/s/admin/playlists', (req, res) => this.getPlaylistList(req, res));


    }

    // Standard function to get the list of any tables
    async getList(tableName, req, res) {

        // Convert table name in uppercase to standardize the input
        tableName = String(tableName).toUpperCase();

        if(!/^[A-Za-z]*$/.test(tableName)) {
            console.log("SQL Injection detected, query aborded !");
            res.send("Bad request !").status(400);
        }

        // Display the command name
        console.log("Admin " + tableName + " List");

        // Try to execute the query and handle the Table Not Found error.
        try {

            // Execute the query and send result
            const result = await this.#connection.query(`SELECT * FROM ${tableName}`);
            res.json(result[0]).status(200);

        } catch (error) {

            // Send message and 404 result
            console.log('Table doesn"t exists !');
            res.send("Table not found !").status(404);

        }
    }

    // GET ========================================================================================

    // Admin Get User List  function
    async getUserList(req, res) {

        this.getList('Users', req, res);
    }

    // Admin Get Album List function
    async getAlbumList(req, res) {

        this.getList('Albums', req, res);
    }

    // Admin Get Playlist List function
    async getPlaylistList(req, res) {

        this.getList('Playlists', req, res);
    }

    // GET BY ID ==================================================================================

    // Admin Get USER ID function
    async getUser(req, res) {
        console.log("Admin User ID");

        const { id } = req.params;

        const users = await this.#connection.query('SELECT * FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        console.log(users[0][0]);

        if (users[0].length == 0)
        {
            res.send('Not found !').status(404);
        }
        else {
            res.json(users[0][0]).status(200);
        }
    }

    // Admin Get Tracks List function
    // !! SELECT * FROM TRACKS not working ??


}