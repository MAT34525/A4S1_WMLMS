/*
This class is used by the Database class to handle admin CRUD commands
 */
export class AdminDatabase {

    #app;
    #connection;
    #schema;

    constructor(app, connection, schema) {

        // Initiate admin CRUD commands
        this.#app = app;
        this.#connection = connection;
        this.#schema = schema;

        this.initAdminCRUD();
    }

    initAdminCRUD()
    {
        // User CRUD
        /**
         * @openapi
         * /s/admin/users/{id}:
         *   get:
         *     description: Get an user by UUID
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
         *             $ref: '#/components/schemas/Users'
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

        /**
         * @openapi
         * /s/admin/users/{id}:
         *   put:
         *     description:  Update an existing user by UUID
         *     parameters:
         *      - name: id
         *        in: path
         *        required: true
         *        description: The UUID of the user
         *        schema:
         *          type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Users'
         *     responses:
         *       200:
         *         description: Success reponse
         *       404:
         *         description: Not found reponse
         */
        this.#app.put('/s/admin/users/:id', (req, res) => this.putUser(req, res));

        /**
         * @openapi
         * /s/admin/users/{id}:
         *   delete:
         *     description:  Delete an existing user by UUID
         *     parameters:
         *      - name: id
         *        in: path
         *        required: true
         *        description: The UUID of the user
         *        schema:
         *            type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Users'
         *     responses:
         *       200:
         *         description: Success reponse
         *       404:
         *         description: Not found reponse
         */
        this.#app.delete('/s/admin/users/:id', (req, res) => this.deleteUser(req, res));

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
         *         schema:
         *           $ref: '#/components/schemas/ForumPosts'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/forums-posts', (req, res) => this.getForumPostsList(req, res));

        /**
         * @openapi
         * /s/admin/tracks:
         *   get:
         *     description: Get all tracks
         *     responses:
         *       200:
         *         description: All tracks in the DB
         *         schema:
         *           $ref: '#/components/schemas/tracks'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.get('/s/admin/tracks', (req, res) => this.getTracksList(req, res));

        // Query
        /**
         * @openapi
         * /s/admin/query:
         *   post:
         *     description: Run a custom query on DB and retrieve the response
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/Query'
         *     responses:
         *       200:
         *         description: Result of the operation or status of the reuqest
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.#app.post('/s/admin/query', (req, res) => this.customQuery(req, res))
    }

    // Standard function to get the list of any tables
    async getList(tableName, req, res) {

        // Display the command name
        console.log("Admin GET " + tableName + " List");

        // Convert table name in uppercase to standardize the input
        tableName = String(tableName).toUpperCase();

        if(!/^[A-Za-z\_]*$/.test(tableName)) {
            console.log("SQL Injection detected, query aborded !");
            res.send("Bad request !").status(400);
            return;
        }

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

    // Admin Get Tracks List  function
    async getTracksList(req, res) {

        this.getList('Tracks', req, res);
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

    // GET BY ID ==================================================================================

    // Admin Get USER ID function
    async getUser(req, res) {
        // Display the command name
        console.log("Admin GET User By ID");

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

    // DELETE BY ID ===============================================================================

    // Admin DELETE USER ID function
    async deleteUser(req, res) {

        // Display the command name
        console.log("Admin DELETE User By ID");

        let item = req.body;

        console.log(item);

        // We check that the user exists
        const { id } = req.params;

        // We get look for the user id in the table
        const userLookup = await this.#connection.query('SELECT USER_ID FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        if(userLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.send("User not found !").status(404);
            return;
        }

        await this.#connection.query('DELETE FROM USERS WHERE USER_ID=:id',
        {
            bind : [id]
        });

        res.send("User successfully deleted !").status(200);
    }

    // PUT BY ID ==================================================================================

    // Admin PUT USER ID function
    async putUser(req, res) {

        // Display the command name
        console.log("Admin PUT User By ID");

        let item = req.body;

        console.log(item);

        // We check that the user exists
        const { id } = req.params;

        // We get look for the user id in the table
        const userLookup = await this.#connection.query('SELECT USER_ID FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        if(userLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.send("User not found !").status(404);
            return;
        }

        // We modify the user depending on the existance of the given parameters
        if(item["USERNAME"] !== undefined)
        {
            console.log("[+] USERNAME Modified !")

            let username = item["USERNAME"]
            await this.#connection.query('UPDATE USERS SET USERNAME=:username WHERE USER_ID=:id',
            {
                bind : [username, id]
            });
        }

        if(item["EMAIL"] !== undefined && item["EMAIL"] !== '')
        {
            console.log("[+] EMAIL Modified !")

            let email = item["EMAIL"]
            await this.#connection.query('UPDATE USERS SET EMAIL=:email WHERE USER_ID=:id',
            {
                bind : [email, id]
            });
        }

        if(item["FULL_NAME"] !== undefined && item["FULL_NAME"] !== '')
        {
            console.log("[+] FULL_NAME Modified !")

            let fullName = item["FULL_NAME"]
            await this.#connection.query('UPDATE USERS SET FULL_NAME=:fullName WHERE USER_ID=:id',
            {
                bind : [fullName, id]
            });
        }

        res.send("User successfully updated !").status(200);
    }

    // OTHER ======================================================================================

    // Admin POST Custom query
    async customQuery(req, res) {

        // Display the command name
        console.log("Admin POST Custom query");

        // Get and check the query
        let { query } = req.body;

        if(query === undefined){
            res.json({message: "Bad request !"}).status(400);
            return
        }

        // Standardize the query
        query = String(query).toUpperCase();

        try {
            // We execute the query
            const queryResult = await this.#connection.query(query);

            // We will trim the second part of the response to only keep the output column name
            queryResult[1] = queryResult[1].map(item => ({
                    field: item.name
                })
            )

            console.log("[+] Custom query Ok");
            res.json(queryResult).status(200);
        }
        catch (e) {
            console.log("[-] Invalid custom query !");
            res.json({message: e}).status(400);
        }



    }
}