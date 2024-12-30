import express, {Router} from 'express';
import {ReqType, ResType} from "../app";
import {Schema} from "../schema";
import {ModelStatic, Sequelize} from "sequelize";
import {DB_NAME, DB_PASSWORD, DB_USER, SEQUELIZE_DB_PARAMS} from "../config";
import {Users} from "../tables";

const router : Router = express.Router();

/**
 * @openapi
 * /u/admin-login:
 *   post:
 *     description: Log in the database as an administrator
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Admin successfully connected !
 *       404:
 *         description: An error occurred, please try again.
 */
router.post('/u/admin-login', (req : ReqType ,res : ResType) => adminLogin(req, res));

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
router.get('/s/admin/users/:id', (req : ReqType, res : ResType) => getUser(req, res));

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
router.get('/s/admin/users', (req : ReqType, res : ResType) => getUserList(req, res));

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
router.put('/s/admin/users/:id', (req : ReqType, res : ResType) => putUser(req, res));

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
router.put('/s/admin/users/lock/:id', (req : ReqType, res : ResType) => putUserLock(req, res));

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
router.delete('/s/admin/users/:id', (req : ReqType, res : ResType) => deleteUser(req, res));

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
router.get('/s/admin/artists/:id', (req : ReqType, res : ResType) => getArtist(req, res));

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
router.get('/s/admin/artists', (req : ReqType, res : ResType) => getArtistList(req, res));

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
router.get('/s/admin/count/artists', (req : ReqType, res : ResType) => getArtistCount(req, res));

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
router.post('/s/admin/artists/delayed', (req : ReqType, res : ResType) => getArtistListDelayed(req, res));

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
router.put('/s/admin/artists/verification/:id', (req : ReqType, res : ResType) => putArtistVerification(req, res));

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
router.get('/s/admin/albums', (req : ReqType, res : ResType) => getAlbumList(req, res));

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
router.get('/s/admin/playlists', (req : ReqType, res : ResType) => getPlaylistList(req, res));

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
router.get('/s/admin/tracks', (req : ReqType, res : ResType) => getTracksList(req, res));

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
router.post('/s/admin/query', (req : ReqType, res : ResType) => customQuery(req, res))

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
router.post('/s/admin/query-count', (req : ReqType, res : ResType) => customCount(req, res))

// Functions ======================================================================================

async function adminLogin(req : ReqType, res : ResType) {

    const { username, password }  = req.body as {username? : string, password? : string} ;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Check for missing fields
    if (!username || !password) {
        res.json({ errorMessage: 'All fields are mandatory.' }).status(400);
    }
    try {
        // Connection status
        console.log('Trying to connect administrator :', username);

        let testSequelizeConnection : Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, SEQUELIZE_DB_PARAMS);

       testSequelizeConnection.authenticate()
           .then(_ => {
               console.log("Admin successfully connected, admin panel available !");
               res.json({message : "Admin successfully connected !",  status:200}).status(200);

               testSequelizeConnection.close();
           })
           .catch(error => {
               console.log("Admin credentials are invalid : ", error);
               res.json({message : "Admin credentials are invalid!",  status:400}).status(400);
           })

    // Inform the user for any other issues
    } catch (error) {
        console.error('Error when connecting :', error);
        res.json({ message: 'An error occurred, please try again.', status:400 }).status(400);
    }
}

// Standard function to get the list of any tables
async function getList(tableName : string, model : ModelStatic<any> , req: ReqType, res: ResType) {

    // Display the command name
    console.log("Admin GET " + tableName + " List");

    // Convert table name in uppercase to standardize the input
    tableName = String(tableName).toUpperCase();

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    if(!/^[A-Za-z_]*$/.test(tableName)) {
        console.log("SQL Injection detected, query aborted !");
        res.json({message: "Bad request !"}).status(400);
        return;
    }

    // Try to execute the query and handle the Table Not Found error.
    try {

        // Execute the query and send result
        const result = await model.findAll();

        res.json(result).status(200);

    } catch (error) {

        // Send message and 404 result
        console.log('Table doesn"t exists !');
        res.json({message : "Table not found !"}).status(404);

    }
}

// GET ========================================================================================

// Admin Get User List function
async function getUserList(req : ReqType , res : ResType) {

    await getList('Users', Schema.getUsers(), req, res);
}

// Admin Get Artist List function
async function getArtistList(req : ReqType, res : ResType) {

    await getList('Artists', Schema.getArtists(), req, res);
}

// Admin Get Tracks List  function
async function getTracksList(req : ReqType, res : ResType) {

    await getList('Tracks', Schema.getTracks(), req, res);
}

// Admin Get Album List function
async function getAlbumList(req : ReqType, res : ResType) {

    await getList('Albums', Schema.getAlbums(), req, res);
}

// Admin Get Playlist List function
async function getPlaylistList(req : ReqType, res : ResType) {

    await getList('Playlists', Schema.getPlaylists(), req, res);
}

// Admin Get Artist Count function
async function getArtistCount(req : ReqType, res : ResType) {

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Try to execute the query and handle the Table Not Found error.
    try {

        // Execute the query and send result
        const result = await Schema.getArtists().count();
        res.json({ result : result }).status(200);

    } catch (error) {

        // Send message and 404 result
        console.log('Table doesn"t exists !');
        res.json({message : "Table not found !"}).status(404);

    }
}

// Admin Get Artist List  function
async function getArtistListDelayed(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin GET Artists List by page");

    // Checking parameters values
    const { page, size } = req.body;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

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

        // Execute the query and send result
        const result = await Schema.getArtists().findAndCountAll({
            offset : offset,
            limit : size,
        })

        res.json(result.rows).status(200);

    } catch (error) {

        // Send message and 404 result
        console.log('Table doesn"t exists !');
        res.json({message : "Table not found !"}).status(404);

    }
}

// GET BY ID ==================================================================================

// Admin Get USER ID function
async function getUser(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin GET User By ID");

    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const users = await Schema.getUsers().findOne({
        where : {
            USER_ID : id
        }
    })

    if (users === null)
    {
        res.json({message: 'Not found !'}).status(404);
    }
    else {
        res.json(users).status(200);
    }
}

// Admin Get USER ID function
async function getArtist(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin GET Artist By ID");

    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const artist = await Schema.getArtists().findOne({
        where : {
            ARTIST_ID : id
        }
    });

    if (artist === null)
    {
        res.json({message: 'Not found !'}).status(404);
    }
    else {
        res.json(artist).status(200);
    }
}

// DELETE BY ID ===============================================================================

// Admin DELETE USER ID function
async function deleteUser(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin DELETE User By ID");

    // We check that the user exists
    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // We get look for the user id in the table
    const userLookup = await Schema.getUsers().destroy({
        where : {
            USER_ID : id
        }
    });

    if(userLookup === 0)
    {
        console.log("[-] Not found !")
        res.json({ message : "User not found !"}).status(404);
        return;
    }

    res.json({message : "User successfully deleted !"}).status(200);
}

// PUT BY ID ==================================================================================

// Admin PUT USER Lock By ID function
async function putUserLock(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin PUT User Lock By ID");

    let item = req.body;

    // We check that the user exists
    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // We get look for the user id in the table
    const userLookup = await Schema.getUsers().findOne({
        where: {
            USER_ID: id
        }
    });

    if(userLookup === null)
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

        await Schema.getUsers().update(
            { IS_LOCKED : newLock },
            {
                where: {
                    USER_ID: id
                }
            }
        );
    }

    res.json({message : "User successfully updated !"}).status(200);
}

// Admin PUT ARTIST Verification By ID function
async function putArtistVerification(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin PUT Artist Verification By ID");

    let item = req.body;

    // We check that the user exists
    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // We get look for the artist id in the table
    const artistLookup = await Schema.getArtists().findOne({
        where : {
            ARTIST_ID : id
        }
    });

    if(artistLookup === null)
    {
        console.log("[-] Not found !")
        res.json({message: "Artist not found !"}).status(404);
        return;
    }

    // We modify the user depending on the existance of the given parameters
    if(item["IS_VERIFIED"] !== undefined && (item["IS_VERIFIED"].length === 1)) {
        let newLock = (item["IS_VERIFIED"] === 'N') ? 'Y' : 'N';

        console.log("[+] Verification toggled from ", item["IS_VERIFIED"], ' to ', newLock)

        await Schema.getArtists().update(
            {
                IS_VERIFIED: newLock
            },
            {
                where: {
                    ARTIST_ID: id
                }
            }
        );
    }

    res.json({message : "Artist successfully updated !"}).status(200);
}

// Admin PUT USER By ID function
async function putUser(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin PUT User By ID");

    let item = req.body;

    // We check that the user exists
    const { id } = req.params;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // We get look for the user id in the table
    const userLookup = await Schema.getUsers().findOne({
        where : {
            USER_ID : id
        }
    });

    if(userLookup === null)
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
        await Schema.getUsers().update(
            {
                USERNAME : username
            },
            {
                where : {
                    USER_ID : id
                }
            }
        )
    }

    if(item["EMAIL"] !== undefined && item["EMAIL"] !== '')
    {
        console.log("[+] EMAIL Modified !")

        let email = item["EMAIL"]
        await Schema.getUsers().update(
            {
                EMAIL : email
            },
            {
                where : {
                    USER_ID : id
                }
            }
        )
    }

    if(item["FULL_NAME"] !== undefined && item["FULL_NAME"] !== '')
    {
        console.log("[+] FULL_NAME Modified !")

        let fullName = item["FULL_NAME"]
        await Schema.getUsers().update(
            {
                FULL_NAME : fullName
            },
            {
                where : {
                    USER_ID : id
                }
            }
        )
    }

    res.json({message : "User successfully updated !"}).status(200);
}

// OTHER ======================================================================================

// Admin POST Custom count
async function customCount(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin POST Custom count");

    // Get and check the query
    let { query } = req.body;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    if(query === undefined){
        res.json({message: "Bad request !"}).status(400);
        return
    }

    // Standardize the query
    query = String(query).toUpperCase();

    try {
        // We execute the query
        const queryResult : {} = await Schema.getConnection().query(query);

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
async function customQuery(req : ReqType, res : ResType) {

    // Display the command name
    console.log("Admin POST Custom query");

    // Get and check the query
    let { query } = req.body;

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    if(query === undefined){
        res.json({message: "Bad request !"}).status(400);
        return
    }

    // Standardize the query
    query = String(query).toUpperCase();

    try {
        // We execute the query
        const queryResult : {} = await Schema.getConnection().query(query);

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

export default router;
