import Sequelize from 'sequelize';
import { AdminDatabase } from './admin_database.js';
import { Schema } from './database_models.js'

export class Database {

    #connection;
    #app;
    #schema;
    #isConnected = false;
    #isAdmin = false;
    #isApp = false;
    #username;
    #adminDatabase;

    constructor(app, username, password)
    {
        this.#username=username;
        this.#app = app

        // Create the connection to the database
        this.#connection = new Sequelize('wmlmspdb', username, password, {
            host: 'localhost',
            port: 1521,
            dialect: 'oracle'
        });

        // Test the connection to the databse
        this.TestConnection(username);

        // Define link schema for the current connection
        this.#schema = new Schema(this.#connection);
    }

    UserInitCRUD()
    {
        let path = '/' + this.#username + '/hi';

        console.log(path);

        // Assign paths and commands to the backend for the connected user
        this.#app.get(path, (req, res) => this.test_function(req, res))
    }

    // Test the connection to the local database
    async TestConnection(username) {
        try {
            await this.#connection.authenticate();

            console.log('Connection has been established successfully.');

            if(username === 'app')
            {
                this.#isApp = true;
                console.log('Welcome App !');
            }
            else if(username === 'admin')
            {
                this.#isAdmin = true;
                console.log('Welcome Administrator !');

                // Initialise the CRUD commands and links for the admin
                this.#adminDatabase = new AdminDatabase(this.#app, this.#connection, this.#schema);
                this.UserInitCRUD();
            }
            else
            {
                this.UserInitCRUD();
            }

        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    test_function(req, res)
    {
        console.log("Hello world");
        res.send('Hi ' + this.#username + ' !');
    }

    // Close the connection when the class is destroyed
    destroy()
    {
        this.#connection.close()
    }

}
