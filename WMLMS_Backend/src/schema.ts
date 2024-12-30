
// Database schema (also created by an LLM using the SQL queries for the table creation)
import {DataTypes, ModelStatic, Sequelize, Transaction} from "sequelize";
import {DB_DIALECT, DB_NAME, DB_PASSWORD, DB_USER, SEQUELIZE_DB_PARAMS} from "./config";
import {ARTISTS_DATA, PLAYLIST_TRACKS, PLAYLISTS_DATA, TRACKS_DATA, USERS_DATA} from "./data/data";

export class Schema {

    private static connection : Sequelize | undefined = undefined;

    private static connected : boolean = false;

    private static Artists : ModelStatic<any>;
    private static Albums : ModelStatic<any>;
    private static Tracks : ModelStatic<any>;
    private static Users : ModelStatic<any>;
    private static Playlists : ModelStatic<any>;
    private static PlaylistTracks : ModelStatic<any>;

    // Getters ====================================================================================

    public static getConnectionStatus() : boolean {
        return this.connected;
    }

    public static getConnection() : Sequelize | undefined {
        return this.connection;
    }

    public static getArtists() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.Artists;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Artists !");
        return undefined;
    }

    public static getAlbums() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.Albums;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Albums !");
        return undefined;
    }

    public static getUsers() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.Users;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Users !");
        return undefined;
    }

    public static getTracks() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.Tracks;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Tracks !");
        return undefined;
    }

    public static getPlaylists() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.Playlists;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Playlists !");
        return undefined;
    }

    public static getPlaylistsTracks() : ModelStatic<any> | undefined {
        if (Schema.connected) {
            return Schema.PlaylistTracks;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to use models : Playlists  Tracks !");
        return undefined;
    }

    // Constructor ================================================================================

    // Initialise the tables and the connection
    constructor(connection : Sequelize) {

        Schema.connection = connection;

        connection.authenticate().then(_ => {

            Schema.connected = true;

            // Initialise models with the working connection
            Schema.setArtists();
            Schema.setUsers();
            Schema.setTracks();
            Schema.setAlbums()
            Schema.setPlaylists();
            Schema.setPlaylistsTracks()

            // Create associations
            Schema.Tracks.hasMany(Schema.PlaylistTracks, {foreignKey: 'TRACK_ID'})
            Schema.PlaylistTracks.hasOne(Schema.Tracks, {foreignKey: 'TRACK_ID'})

            // Synchronise the schema with the database
            Schema.syncTables();

            console.info("Schema successfully instantiated !");

        })
        // Error when testing the database connection
        .catch( error => {

            console.error("Invalid Sequelize connection, trying to fix the issue ...");

            Schema.connected = false;

            console.log(error.name);
            console.log(error.message);

            if(DB_DIALECT === 'oracle') {

                Schema.oracleErrorHandling(error);
            }
            else if (DB_DIALECT === 'postgres') {

                Schema.postgresErrorHandling(error);
            }
        });
    }

    private static async  reloadConnectionAndSchema(connection : Sequelize) {

        if(Schema.connected) {
            await Schema.connection.close();
            Schema.connected = false;
        }

        Schema.connection = connection;

        Schema.connected = true;

        // Initialise models with the working connection
        Schema.setArtists();
        Schema.setUsers();
        Schema.setTracks();
        Schema.setAlbums()
        Schema.setPlaylists();
        Schema.setPlaylistsTracks()

        // Synchronise the schema with the database
        await Schema.syncTables();

        console.info("Schema successfully reloaded !");
    }

    // Models operations ==========================================================================

    // Init models

    private static setArtists() : boolean {
        if (Schema.connected) {

            Schema.Artists = Schema.connection.define('Artists', {
                ARTIST_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                NAME: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                IS_VERIFIED : DataTypes.ENUM('Y', 'N'),
                FOLLOWERS: DataTypes.INTEGER,
                GENRES: DataTypes.STRING,
                POPULARITY: DataTypes.INTEGER,
                CREATED_AT: DataTypes.DATE,
                UPDATED_AT: DataTypes.DATE,
            }, {
                tableName: 'ARTISTS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Artists !");
        return false;
    }

    private static setAlbums() : boolean {
        if (Schema.connected) {

            Schema.Albums = Schema.connection.define('Albums', {
                ALBUM_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                NAME: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                RELEASE_DATE: DataTypes.DATE,
                ARTIST_ID: DataTypes.STRING,
            }, {
                tableName: 'ALBUMS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Albums !");
        return false;
    }

    private static setUsers() : boolean {
        if (Schema.connected) {

            Schema.Users = Schema.connection.define('Users', {
                USER_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                USERNAME: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                PASSWORD: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                EMAIL: DataTypes.STRING,
                FULL_NAME: DataTypes.STRING,
                IS_LOCKED: DataTypes.ENUM('Y', 'N'),
                IS_ARTIST: DataTypes.ENUM('Y', 'N'),
                CREATED_AT: DataTypes.DATE,
                UPDATED_AT: DataTypes.DATE,
            }, {
                tableName: 'USERS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Users !");
        return false;
    }

    private static setTracks() : boolean {
        if (Schema.connected) {

            Schema.Tracks = Schema.connection.define('Tracks', {
                TRACK_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                NAME: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                ARTISTS: DataTypes.STRING,
                ID_ARTISTS: DataTypes.STRING,
                DURATION_MS: DataTypes.INTEGER,
                EXPLICIT: DataTypes.INTEGER,
                RELEASE_DATE: DataTypes.DATE,
                TIME_SIGNATURE: DataTypes.INTEGER,
                ALBUM_ID: DataTypes.STRING,
                CREATED_AT: DataTypes.DATE,
                UPDATED_AT: DataTypes.DATE,
            }, {
                tableName: 'TRACKS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Tracks !");
        return false;
    }

    private static setPlaylists() : boolean {
        if (Schema.connected) {

            Schema.Playlists = Schema.connection.define('Playlists', {
                PLAYLIST_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                USER_ID: DataTypes.STRING,
                NAME: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
                DESCRIPTION: DataTypes.STRING,
                IS_PUBLIC: DataTypes.ENUM('Y', 'N'),
                CREATED_AT: DataTypes.DATE,
                UPDATED_AT: DataTypes.DATE,
            }, {
                tableName: 'PLAYLISTS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Playlists !");
        return false;
    }

    private static setPlaylistsTracks() : boolean {
        if (Schema.connected) {

            Schema.PlaylistTracks = Schema.connection.define('PlaylistTracks', {
                PLAYLIST_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
                TRACK_ID: {
                    type: DataTypes.STRING,
                    primaryKey: true,
                },
            }, {
                tableName: 'PLAYLIST_TRACKS',
                timestamps: false,
            });

            return true;
        }
        console.warn("You should be connected to a Sequelize instance in order create models : Playlists  Tracks !");
        return false;
    }

    // Synchronize or create table in the database
    static async syncTables() : Promise<boolean> {
        if(Schema.connected) {
            await Schema.Artists.sync();
            await Schema.Albums.sync();
            await Schema.Tracks.sync();
            await Schema.Users.sync();
            await Schema.Playlists.sync();
            await Schema.PlaylistTracks.sync();
            return true;
        }
        console.warn("You should connect the schema to a Sequelize instance in order to synchronize models !");
        return false;
    }

    // Error handling =============================================================================

    private static postgresErrorHandling(error : any) {
        console.warn("Running postgres error handling...");

        if(error.name === 'SequelizeConnectionError' && error.message.startsWith('password')) {
            console.warn(`Invalid credentials ${DB_USER}/${DB_PASSWORD} to log in the database, check the config.ts file !`);
            console.error('No fixes available, reboot the project and try again !')
            return;
        }

        if(error.name === 'SequelizeConnectionError' && error.message.startsWith('database')) {
            console.warn(`Invalid database name ${DB_NAME}, check the config.ts file !`);
            Schema.postgresDatabaseCreation();
            return;
        }
    }

    private static oracleErrorHandling(error : any) {
        console.warn("Running oracle error handling...");

        if(error.name === 'SequelizeAccessDeniedError') {
            console.warn(`Invalid credentials ${DB_USER}/${DB_PASSWORD} to log in the database, check the config.ts file !`);
            console.error('No fixes available, reboot the project and try again !')
            return;
        }

        if(error.name === 'SequelizeInvalidConnectionError') {
            console.warn(`Invalid service name ${DB_NAME} to log in the database, check the config.ts file !`);
            console.error('No fixes available, reboot the project and try again !')
            return;
        }
    }

    private static async postgresDatabaseCreation() {
        console.warn("Creating database ...");

        // Close actual connection
        await Schema.connection.close();

        // Connect to the Postgres server, not the database
        let tempConnection : Sequelize = new Sequelize('', DB_USER, DB_PASSWORD, SEQUELIZE_DB_PARAMS)

        try {
            await tempConnection
                .query(`CREATE DATABASE "${DB_NAME}"
                WITH
                OWNER = ${DB_USER}
                ENCODING = 'UTF8'
                LOCALE_PROVIDER = 'libc'
                CONNECTION LIMIT = -1
                IS_TEMPLATE = False;`)

            console.warn("New database created !");
            console.warn("Creating schema ...");

            // Connect to the new database
            let newDatabaseConnection: Sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, SEQUELIZE_DB_PARAMS);

            // Create the tables by creating the sequelize models in the Schema class
            await Schema.reloadConnectionAndSchema(newDatabaseConnection);

            console.warn("Schema created !");

            // Close the database connection
            await tempConnection.close()

            console.warn("Temporary server connection closed properly !");

            await Schema.syncTables();

            await Schema.populateSchema();

        } catch (error) {

        }
    }

    public static async populateSchema()  {
        console.warn("Inserting data ...");

        let t : Transaction = await Schema.connection.transaction();

        await Schema.Artists.bulkCreate(ARTISTS_DATA, { ignoreDuplicates: true });
        await Schema.Tracks.bulkCreate(TRACKS_DATA, { ignoreDuplicates: true });
        await Schema.Users.bulkCreate(USERS_DATA, { ignoreDuplicates: true });
        await Schema.Playlists.bulkCreate(PLAYLISTS_DATA, { ignoreDuplicates: true })
        await Schema.PlaylistTracks.bulkCreate(PLAYLIST_TRACKS, { ignoreDuplicates: true })

        await t.commit();

        console.warn("Data inserted !");
    }
}