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
        /**
         * @openapi
         * /s/admin/users/{id}:
         *   get:
         *     description: Get an user by it's UUID
         *     parameters:
         *      - name: id
         *        in: path
         *        required: true
         *        description: The UUID of the user
         *        schema:
         *            type: string
         *     responses:
         *       200:
         *         description: The user matching the UUID
         *         schema:
         *           $ref: '#/components/schemas/Users'
         *       404:
         *         description: User not found
         */
        this.#app.get('/s/admin/users/:id', (req, res) => this.getUser(req, res));

        /**
         * @openapi
         * /s/admin/users:
         *   get:
         *     description: Get all users
         *     responses:
         *       200:
         *         description: All users in the DB
         *         schema:
         *           $ref: '#/components/schemas/Users'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/users', (req, res) => this.getUserList(req, res));



        this.#app.put('/s/admin/users/:id', (req, res) => this.putUser(req, res));

        // Table visualisation
        /**
         * @openapi
         * /s/admin/albums:
         *   get:
         *     description: Get all albums
         *     responses:
         *       200:
         *         description: All albums in the DB
         *         schema:
         *           $ref: '#/components/schemas/Albums'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/albums', (req, res) => this.getAlbumList(req, res));

        /**
         * @openapi
         * /s/admin/playlists:
         *   get:
         *     description: Get all playlists
         *     responses:
         *       200:
         *         description: All playlists in the DB
         *         schema:
         *           $ref: '#/components/schemas/Playlists'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/playlists', (req, res) => this.getPlaylistList(req, res));

        /**
         * @openapi
         * /s/admin/forums-replies:
         *   get:
         *     description: Get all forum replies
         *     responses:
         *       200:
         *         description: All forums replies in the DB
         *         schema:
         *           $ref: '#/components/schemas/ForumReplies'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/forums-replies', (req, res) => this.getForumRepliesList(req, res));

        /**
         * @openapi
         * /s/admin/forums-posts:
         *   get:
         *     description: Get all forum posts
         *     responses:
         *       200:
         *         description: All forums posts in the DB
         *         content:
         *             schema:
         *             $ref: '#/components/schemas/ForumPosts'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/forums-posts', (req, res) => this.getForumPostsList(req, res));


    }

    // Standard function to get the list of any tables
    async getList(tableName, req, res) {

        // Convert table name in uppercase to standardize the input
        tableName = String(tableName).toUpperCase();

        if(!/^[A-Za-z\_]*$/.test(tableName)) {
            console.log("SQL Injection detected, query aborded !");
            res.send("Bad request !").status(400);
            return;
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

    // Admin Get Forums Replies List function
    async getForumRepliesList(req, res) {

        this.getList('Forum_Replies', req, res);
    }

    // Admin Get Forum Posts List function
    async getForumPostsList(req, res) {

        this.getList('Forum_Posts', req, res);
    }

    // Admin Get Tracks List function
    // !! SELECT * FROM TRACKS not working ??

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

    // PUT BY ID ==================================================================================

    async putUser(req, res) {

        let item = req.body;

        const id = item.id;
        const idx = lessonPackages.findIndex((x) => x.id === id);

        if (idx !== -1) {

            const found = lessonPackages[idx];

            if (item.title) {
                found.title = item.title;
            }
            if (item.description) {
                found.description = item.description;
            }
            if (item.category) {
                found.category = item.category;
            }
            if (item.category) {
                found.category= item.category;
            }
            if (item.level) {
                found.level = item.level;
            }
            if (item.author) {
                found.author = item.author;
            }
            if (item.lastModified) {
                found.lastModified = item.lastModified;
            }
            if (item.tags) {
                found.tags= item.tags;
            }

            res.send(found).status(200);

        } else {
            res.status(404).send('User item not found by id:' + id);
        }
    }

}