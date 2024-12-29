import {Sequelize} from 'sequelize';
import { AdminDatabase } from './admin_database';
import {Router} from "express";
import {databaseConnect, databaseInit} from "./config";
import {Schema} from "./schema";

export class Database {

    protected connection : Sequelize;
    protected app : Router;

    // Database connection
    private readonly username : string = '';
    private readonly password : string = '';

    // Database connection flags
    public static  isConnected : boolean = false;
    private isAdmin : boolean = false;
    private isApp : boolean = false;

    // Database connection additional features
    public static Schema : Schema; // Tables models
    static adminDatabase : AdminDatabase;

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
            this.connection = databaseConnect();

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
                Database.adminDatabase = new AdminDatabase(this.app, this.connection, Database.Schema);
            }

            Database.isConnected = true;

        } catch (error) {

            if(error.name === 'SequelizeConnectionError') {
                console.log("CONNEXION ERROR")

                if(error.message.startsWith('password')) {
                    console.error("Invalid credentials to connect to the database, check the config.ts file !")
                }

                if(error.message.startsWith('database')) {
                    console.warn("The table does not exists, it will automatically be created...")

                    databaseInit();
                }
            }
            console.error('Unable to connect to the database:', error.message);

            Database.isConnected = false;
        }

        if(Database.isConnected)
        {
            // Define link schema for the current connection
            Database.Schema = new Schema(this.connection);
        }
    }

    public static queryWrapper(func : any) {

        if(Database.Schema === undefined) {

        }

        let db = databaseConnect()

        db.authenticate().then(_ => {

            func();
        })

        db.close();
    }

    // Return connection status
    getConnectionStatus() {
        return Database.isConnected;
    }

    // Close the connection when the class is destroyed
    destroy()
    {
        this.connection.close().then();
    }
}