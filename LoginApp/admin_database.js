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
        this.#app.get('/admin/user-list', (req, res) => this.getUserList(req, res));
    }

    // Admin functions
    getUserList(req, res) {
        console.log("Admin User List");
        res.send('This will be the list');
    }


}