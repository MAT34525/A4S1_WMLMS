import {DataTypes, ModelStatic, Sequelize} from 'sequelize';
import { AdminDatabase } from './admin_database';
import {Router} from "express";
import {SEQUELIZE_DB_PARAMS} from "./config";
import {Schema} from "./schema";

export class Database {

    protected connection : Sequelize;
    protected app : Router;

    // Database connection
    private readonly username : string = '';
    private readonly password : string = '';

    // Database connection flags
    private isConnected : boolean = false;
    private isAdmin : boolean = false;
    private isApp : boolean = false;

    // Database connection additional features
    protected schema : Schema;
    private adminDatabase : AdminDatabase;

    constructor(app : Router, username : string, password : string)
    {
        this.username=username;
        this.password = password;
        this.app = app
    }

    // Function to create additional routes dedicated for logged users (not used)
    UserInitCRUD()
    {
        let path = '/' + this.username + '/hi';

        console.log(path);

        // Assign paths and commands to the backend for the connected user
        this.app.get(path, (req, res) => {} /* Custom function */)
    }

    // Test the connection to the local database
    async connect() {
        try {

            // Directly connect to the database
            this.connection = new Sequelize('wmlmspdb', this.username, this.password, SEQUELIZE_DB_PARAMS);

            await this.connection.authenticate();

            console.log('Connection has been established successfully.');

            // Set up the database features and flags using the default usernames

            // App user
            if(this.username === 'app')
            {
                this.isApp = true;
                console.log('Welcome App !');
            }

            // Admin user
            else if(this.username === 'admin')
            {
                this.isAdmin = true;
                console.log('Welcome Administrator !');

                // Initialise the CRUD commands and links for the admin
                this.adminDatabase = new AdminDatabase(this.app, this.connection, this.schema);
            }

            this.isConnected = true;

        } catch (error) {
            console.error('Unable to connect to the database:', error);

            this.isConnected = false;
        }

        if(this.isConnected)
        {
            // Define link schema for the current connection
            this.schema = new Schema(this.connection);
        }
    }

    // Return connection status
    getConnectionStatus() {
        return this.isConnected;
    }

    // Close the connection when the class is destroyed
    destroy()
    {
        this.connection.close().then();
    }

}