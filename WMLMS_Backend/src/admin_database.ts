/*
    This class is used by the Database class to handle admin CRUD commands
    It is only activated when an admin logs in.
*/
import express, {Router} from "express";
import {Sequelize} from "sequelize";
import {Schema} from "./database";
import {ReqType, ResType} from "./app";

export class AdminDatabase {

    private app : Router;
    private connection : Sequelize;
    private schema : Schema;

    constructor(app : Router, connection : Sequelize, schema : Schema) {

        // Initiate admin CRUD commands
        this.app = app;
        this.connection = connection;
        this.schema = schema;

        // Initialise the admin routes and API features
        this.initAdminCRUD();
    }

    // Associate admin routes to their corresponding functions
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
         *             $ref: '/components/schemas/Users'
         *       404:
         *         description: User not found
         */
        this.app.get('/s/admin/users/:id', (req : ReqType, res : ResType) => this.getUser(req, res));

        /**
         * @openapi
         * /s/admin/users:
         *   get:
         *     description: Get all users
         *     responses:
         *       200:
         *         description: All users in the DB
         *         schema:
         *           $ref: '/components/schemas/Users'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/users', (req : ReqType, res : ResType) => this.getUserList(req, res));

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
         *             $ref: '/components/schemas/Users'
         *     responses:
         *       200:
         *         description: Success response
         *       404:
         *         description: Not found response
         */
        this.app.put('/s/admin/users/:id', (req : ReqType, res : ResType) => this.putUser(req, res));

        /**
         * @openapi
         * /s/admin/users/lock/{id}:
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
         *             $ref: '/components/schemas/Users'
         *     responses:
         *       200:
         *         description: Success response
         *       404:
         *         description: Not found response
         */
        this.app.put('/s/admin/users/lock/:id', (req : ReqType, res : ResType) => this.putUserLock(req, res));

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
         *             $ref: '/components/schemas/Users'
         *     responses:
         *       200:
         *         description: Success reponse
         *       404:
         *         description: Not found reponse
         */
        this.app.delete('/s/admin/users/:id', (req : ReqType, res : ResType) => this.deleteUser(req, res));

        // Artists CRUD
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
         *             $ref: '/components/schemas/Users'
         *       404:
         *         description: User not found
         */
        this.app.get('/s/admin/artists/:id', (req : ReqType, res : ResType) => this.getArtist(req, res));

        /**
         * @openapi
         * /s/admin/artists:
         *   post:
         *     description: Get all artists
         *     responses:
         *       200:
         *         description: All artists in the DB
         *         schema:
         *           $ref: '/components/schemas/Artists'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/artists', (req : ReqType, res : ResType) => this.getArtistList(req, res));

        /**
         * @openapi
         * /s/admin/count/artists:
         *   get:
         *     description: Get artists count
         *     responses:
         *       200:
         *         description: Number of artists in the DB
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/count/artists', (req : ReqType, res : ResType) => this.getArtistCount(req, res));

        /**
         * @openapi
         * /s/admin/artists/delayed:
         *   post:
         *     description: Get artists count
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '/components/schemas/ArtistPage'
         *     responses:
         *       200:
         *         description: List of artists of the selected page
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.post('/s/admin/artists/delayed', (req : ReqType, res : ResType) => this.getArtistListDelayed(req, res));

        /**
         * @openapi
         * /s/admin/artists/verification/{id}:
         *   put:
         *     description:  Update an existing artist by UUID
         *     parameters:
         *      - name: id
         *        in: path
         *        required: true
         *        description: The UUID of the artist
         *        schema:
         *          type: string
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '/components/schemas/Artists'
         *     responses:
         *       200:
         *         description: Success response
         *       404:
         *         description: Not found response
         */
        this.app.put('/s/admin/artists/verification/:id', (req : ReqType, res : ResType) => this.putArtistVerification(req, res));

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
         *           $ref: '/components/schemas/Albums'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/albums', (req : ReqType, res : ResType) => this.getAlbumList(req, res));

        /**
         * @openapi
         * /s/admin/playlists:
         *   get:
         *     description: Get all playlists
         *     responses:
         *       200:
         *         description: All playlists in the DB
         *         schema:
         *           $ref: '/components/schemas/Playlists'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/playlists', (req : ReqType, res : ResType) => this.getPlaylistList(req, res));

        /**
         * @openapi
         * /s/admin/forums-replies:
         *   get:
         *     description: Get all forum replies
         *     responses:
         *       200:
         *         description: All forums replies in the DB
         *         schema:
         *           $ref: '/components/schemas/ForumReplies'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/forums-replies', (req : ReqType, res : ResType) => this.getForumRepliesList(req, res));

        /**
         * @openapi
         * /s/admin/forums-posts:
         *   get:
         *     description: Get all forum posts
         *     responses:
         *       200:
         *         description: All forums posts in the DB
         *         schema:
         *           $ref: '/components/schemas/ForumPosts'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/forums-posts', (req : ReqType, res : ResType) => this.getForumPostsList(req, res));

        /**
         * @openapi
         * /s/admin/tracks:
         *   get:
         *     description: Get all tracks
         *     responses:
         *       200:
         *         description: All tracks in the DB
         *         schema:
         *           $ref: '/components/schemas/tracks'
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.get('/s/admin/tracks', (req : ReqType, res : ResType) => this.getTracksList(req, res));

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
         *             $ref: '/components/schemas/Query'
         *     responses:
         *       200:
         *         description: Result of the operation or status of the reuqest
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.post('/s/admin/query', (req : ReqType, res : ResType) => this.customQuery(req, res))

        /**
         * @openapi
         * /s/admin/query-count:
         *   post:
         *     description: Run a custom count query on DB and retrieve the count
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '/components/schemas/Query'
         *     responses:
         *       200:
         *         description: Result of the operation or status of the request
         *       404:
         *         description: Table not found !
         *       400 :
         *         description : Bad request !
         */
        this.app.post('/s/admin/query-count', (req : ReqType, res : ResType) => this.customCount(req, res))
    }

    // Standard function to get the list of any tables
    async getList(tableName : string, req: ReqType, res: ResType) {

        // Display the command name
        console.log("Admin GET " + tableName + " List");

        // Convert table name in uppercase to standardize the input
        tableName = String(tableName).toUpperCase();

        if(!/^[A-Za-z_]*$/.test(tableName)) {
            console.log("SQL Injection detected, query aborted !");
            res.json({message: "Bad request !"}).status(400);
            return;
        }

        // Try to execute the query and handle the Table Not Found error.
        try {

            // Execute the query and send result
            const result = await this.connection.query(`SELECT * FROM ${tableName}`);
            res.json(result[0]).status(200);

        } catch (error) {

            // Send message and 404 result
            console.log('Table doesn"t exists !');
            res.json({message : "Table not found !"}).status(404);

        }
    }

    // GET ========================================================================================

    // Admin Get User List function
    async getUserList(req : ReqType , res : ResType) {

        await this.getList('Users', req, res);
    }

    // Admin Get Artist List function
    async getArtistList(req : ReqType, res : ResType) {

        await this.getList('Artists', req, res);
    }

    // Admin Get Artist Count function
    async getArtistCount(req : ReqType, res : ResType) {

        // Try to execute the query and handle the Table Not Found error.
        try {

            // Execute the query and send result
            const result = await this.connection.query(`SELECT COUNT(ARTIST_ID) FROM ARTISTS;`);
            res.json({ result : result[0][0]["COUNT(ARTIST_ID)"]}).status(200);

        } catch (error) {

            // Send message and 404 result
            console.log('Table doesn"t exists !');
            res.json({message : "Table not found !"}).status(404);

        }
    }

    // Admin Get Artist List  function
    async getArtistListDelayed(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin GET Artists List by page");

        // Checking parameters values
        const { page, size } = req.body;

        if(page === undefined || size === undefined) {
            res.json({message : "Missing body fields !"}).status(400);
            return
        }

        if(page < 0 || size <= 0) {
            res.json({message : "Invalid sizes !"}).status(400);
            return
        }

        // Try to execute the query and handle the Table Not Found error.
        try {

            // Compute offset
            let offset : number = page * size;
            let limit : number = size;

            // Execute the query and send result
            const result = await this.connection.query(`SELECT * FROM ARTISTS OFFSET :offset ROWS FETCH NEXT :limit ROWS ONLY;`,
                {
                    bind: [offset, limit],
                });
            res.json(result[0]).status(200);

        } catch (error) {

            // Send message and 404 result
            console.log('Table doesn"t exists !');
            res.json({message : "Table not found !"}).status(404);

        }
    }

    // Admin Get Tracks List  function
    async getTracksList(req : ReqType, res : ResType) {

        this.getList('Tracks', req, res);
    }

    // Admin Get Album List function
    async getAlbumList(req : ReqType, res : ResType) {

        this.getList('Albums', req, res);
    }

    // Admin Get Playlist List function
    async getPlaylistList(req : ReqType, res : ResType) {

        this.getList('Playlists', req, res);
    }

    // Admin Get Forums Replies List function
    async getForumRepliesList(req : ReqType, res : ResType) {

        this.getList('Forum_Replies', req, res);
    }

    // Admin Get Forum Posts List function
    async getForumPostsList(req : ReqType, res : ResType) {

        this.getList('Forum_Posts', req, res);
    }

    // GET BY ID ==================================================================================

    // Admin Get USER ID function
    async getUser(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin GET User By ID");

        const { id } = req.params;

        const users = await this.connection.query('SELECT * FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        if (users[0].length == 0)
        {
            res.json({message: 'Not found !'}).status(404);
        }
        else {
            res.json(users[0][0]).status(200);
        }
    }

    // Admin Get USER ID function
    async getArtist(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin GET Artist By ID");

        const { id } = req.params;

        const artist = await this.connection.query('SELECT * FROM ARTISTS WHERE ARTIST_ID=:id',
            {
                bind : [id]
            });

        if (artist[0].length == 0)
        {
            res.json({message: 'Not found !'}).status(404);
        }
        else {
            res.json(artist[0][0]).status(200);
        }
    }

    // DELETE BY ID ===============================================================================

    // Admin DELETE USER ID function
    async deleteUser(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin DELETE User By ID");

        let item = req.body;

        // We check that the user exists
        const { id } = req.params;

        // We get look for the user id in the table
        const userLookup = await this.connection.query('SELECT USER_ID FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        if(userLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.json({ message : "User not found !"}).status(404);
            return;
        }

        await this.connection.query('DELETE FROM USERS WHERE USER_ID=:id',
        {
            bind : [id]
        });

        res.json({message : "User successfully deleted !"}).status(200);
    }

    // PUT BY ID ==================================================================================

    // Admin PUT USER Lock By ID function
    async putUserLock(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin PUT User Lock By ID");

        let item = req.body;

        // We check that the user exists
        const { id } = req.params;

        // We get look for the user id in the table
        const userLookup = await this.connection.query('SELECT USER_ID FROM USERS WHERE user_id=:id',
        {
            bind : [id]
        });

        if(userLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.json({message: "User not found !"}).status(404);
            return;
        }

        // We modify the user depending on the existence of the given parameters
        if(item["IS_LOCKED"] !== undefined && (item["IS_LOCKED"].length === 1))
        {
            let newLock = (item["IS_LOCKED"] === 'N') ? 'Y' : 'N';

            console.log("[+] Locked toggled from ", item["IS_LOCKED"], ' to ', newLock )

            await this.connection.query('UPDATE USERS SET IS_LOCKED=:newLock WHERE USER_ID=:id',
            {
                bind : [newLock, id]
            });
        }

        res.json({message : "User successfully updated !"}).status(200);
    }

    // Admin PUT ARTIST Verification By ID function
    async putArtistVerification(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin PUT Artist Verification By ID");

        let item = req.body;

        // We check that the user exists
        const { id } = req.params;

        // We get look for the artist id in the table
        const artistLookup = await this.connection.query('SELECT ARTIST_ID FROM ARTISTS WHERE artist_id=:id',
            {
                bind : [id]
            });

        if(artistLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.json({message: "Artist not found !"}).status(404);
            return;
        }

        // We modify the user depending on the existance of the given parameters
        if(item["IS_VERIFIED"] !== undefined && (item["IS_VERIFIED"].length === 1))
        {
            let newLock = (item["IS_VERIFIED"] === 'N') ? 'Y' : 'N';

            console.log("[+] Verification toggled from ", item["IS_VERIFIED"], ' to ', newLock )

            await this.connection.query('UPDATE ARTISTS SET IS_VERIFIED=:newLock WHERE ARTIST_ID=:id',
                {
                    bind : [newLock, id]
                });
        }

        res.json({message : "Artist successfully updated !"}).status(200);
    }

    // Admin PUT USER By ID function
    async putUser(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin PUT User By ID");

        let item = req.body;

        // We check that the user exists
        const { id } = req.params;

        // We get look for the user id in the table
        const userLookup = await this.connection.query('SELECT USER_ID FROM USERS WHERE user_id=:id',
            {
                bind : [id]
            });

        if(userLookup[0].length === 0)
        {
            console.log("[-] Not found !")
            res.json({message: "User not found !"}).status(404);
            return;
        }

        // We modify the user depending on the existence of the given parameters
        if(item["USERNAME"] !== undefined)
        {
            console.log("[+] USERNAME Modified !")

            let username = item["USERNAME"]
            await this.connection.query('UPDATE USERS SET USERNAME=:username WHERE USER_ID=:id',
                {
                    bind : [username, id]
                });
        }

        if(item["EMAIL"] !== undefined && item["EMAIL"] !== '')
        {
            console.log("[+] EMAIL Modified !")

            let email = item["EMAIL"]
            await this.connection.query('UPDATE USERS SET EMAIL=:email WHERE USER_ID=:id',
                {
                    bind : [email, id]
                });
        }

        if(item["FULL_NAME"] !== undefined && item["FULL_NAME"] !== '')
        {
            console.log("[+] FULL_NAME Modified !")

            let fullName = item["FULL_NAME"]
            await this.connection.query('UPDATE USERS SET FULL_NAME=:fullName WHERE USER_ID=:id',
                {
                    bind : [fullName, id]
                });
        }

        res.json({message : "User successfully updated !"}).status(200);
    }

    // OTHER ======================================================================================

    // Admin POST Custom count
    async customCount(req : ReqType, res : ResType) {

        // Display the command name
        console.log("Admin POST Custom count");

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
            const queryResult : {} = await this.connection.query(query);

            // We will trim the second part of the response to only keep the output column name
            queryResult[1] = queryResult[1].map(item => ({
                    field: item.name
                })
            )

            // We check the content of the query and extract the count value
            let result = 0;

            for (let item in queryResult[0][0]) {
                result = queryResult[0][0][item];
                break;
            }

            console.log("[+] Custom query Ok");
            res.json(result).status(200);
        }
        catch (e) {
            console.log("[-] Invalid custom query !");
            res.json({message: e}).status(400);
        }
    }

    // Admin POST Custom query
    async customQuery(req : ReqType, res : ResType) {

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
            const queryResult : {} = await this.connection.query(query);

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