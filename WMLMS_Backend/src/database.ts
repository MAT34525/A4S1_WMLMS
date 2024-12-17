import { Sequelize } from 'sequelize';
import { AdminDatabase } from './admin_database';
import { Schema } from './database_models'

export class Database {

    #connection : Sequelize;
    #app;
    #schema;
    #isConnected = false;
    #isAdmin = false;
    #isApp = false;
    #username;
    #password;
    #adminDatabase;

    constructor(app, username, password)
    {
        this.#username=username;
        this.#password = password;
        this.#app = app

    }

    UserInitCRUD()
    {
        let path = '/' + this.#username + '/hi';

        console.log(path);

        // Assign paths and commands to the backend for the connected user
        this.#app.get(path, (req, res) => this.test_function(req, res))
    }

    // Test the connection to the local database
    async connect() {
        try {
            // Create the connection to the database
            this.#connection = await new Sequelize('wmlmspdb', this.#username, this.#password, {
                host: 'localhost',
                port: 1521,
                dialect: 'oracle',

                pool: {
                    max: 20,
                    min: 0,
                    acquire: 30000,
                    idle: 10000
                },

            });

            await this.#connection.authenticate();

            console.log('Connection has been established successfully.');

            if(this.#username === 'app')
            {
                this.#isApp = true;
                console.log('Welcome App !');
            }
            else if(this.#username === 'admin')
            {
                this.#isAdmin = true;
                console.log('Welcome Administrator !');

                // Initialise the CRUD commands and links for the admin
                this.#adminDatabase = await new AdminDatabase(this.#app, this.#connection, this.#schema);
                this.UserInitCRUD();
            }
            else
            {
                this.UserInitCRUD();
            }

            this.#isConnected = true;

        } catch (error) {
            console.error('Unable to connect to the database:', error);

            this.#isConnected = false;
        }

        if(this.#isConnected)
        {
            // Define link schema for the current connection
            this.#schema = new Schema(this.#connection);
        }
    }

    getConnectionStatus() {
        return this.#isConnected;
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
