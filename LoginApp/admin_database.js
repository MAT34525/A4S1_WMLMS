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
        this.#app.get('/admin/user/:id', (req, res) => this.getUser(req, res));
        this.#app.get('/admin/user-list', (req, res) => this.getUserList(req, res));

    }

    // Admin functions
    async getUserList(req, res) {
        console.log("Admin User List");

        const users = await this.#connection.query('SELECT * FROM USERS');
        res.json(users[0]).status(200);
    }

    // Admin functions
    async getUser(req, res) {
        console.log("Admin User");

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

}