import {DataTypes, ModelStatic, Sequelize} from 'sequelize';
import { AdminDatabase } from './admin_database';
import {Router} from "express";
import {SEQUELIZE_DB_PARAMS} from "./config";

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

// Database schema (also created by an LLM using the SQL queries for the table creation)
export class Schema {

    connection : Sequelize;
    Artists : ModelStatic<any>;
    Albums : ModelStatic<any>;
    Tracks : ModelStatic<any>;
    TracksAudioFeatures : ModelStatic<any>;
    Users : ModelStatic<any>;
    Playlists : ModelStatic<any>;
    UserFavoriteTracks : ModelStatic<any>;
    PlaylistTracks : ModelStatic<any>;
    Comments : ModelStatic<any>;
    ForumPosts : ModelStatic<any>;
    ForumReplies : ModelStatic<any>;
    UserFollowers : ModelStatic<any>;

    constructor(connection : Sequelize) {

        this.connection = connection;

        this.Artists = this.connection.define('Artists', {
            ARTIST_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            NAME: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            FOLLOWERS: DataTypes.INTEGER,
            GENRES: DataTypes.STRING,
            POPULARITY: DataTypes.INTEGER,
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'ARTISTS',
            timestamps: false,
        });

        this.Albums = this.connection.define('Albums', {
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

        this.Tracks = this.connection.define('Tracks', {
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

        this.TracksAudioFeatures = this.connection.define('TracksAudioFeatures', {
            TRACK_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            DANCEABILITY: DataTypes.FLOAT,
            ENERGY: DataTypes.FLOAT,
            KEY: DataTypes.INTEGER,
            LOUDNESS: DataTypes.FLOAT,
            MODE: DataTypes.INTEGER,
            SPEECHINESS: DataTypes.FLOAT,
            ACOUSTICNESS: DataTypes.FLOAT,
            INSTRUMENTALNESS: DataTypes.FLOAT,
            LIVENESS: DataTypes.FLOAT,
            VALENCE: DataTypes.FLOAT,
            TEMPO: DataTypes.FLOAT,
        }, {
            tableName: 'TRACKS_AUDIO_FEATURES',
            timestamps: false,
        });

        this.Users = this.connection.define('Users', {
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
            IS_ARTIST: DataTypes.ENUM('Y', 'N'),
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'USERS',
            timestamps: false,
        });

        this.Playlists = this.connection.define('Playlists', {
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

        this.UserFavoriteTracks = this.connection.define('UserFavoriteTracks', {
            USER_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            TRACK_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            ADDED_AT: DataTypes.DATE,
        }, {
            tableName: 'USER_FAVORITE_TRACKS',
            timestamps: false,
        });

        this.PlaylistTracks = this.connection.define('PlaylistTracks', {
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

        this.Comments = this.connection.define('Comments', {
            COMMENT_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USER_ID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            TRACK_ID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            COMMENT_TEXT: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'COMMENTS',
            timestamps: false,
        });

        this.ForumPosts = this.connection.define('ForumPosts', {
            POST_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USER_ID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            TITLE: DataTypes.STRING,
            CONTENT: DataTypes.TEXT,
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'FORUM_POSTS',
            timestamps: false,
        });

        this.ForumReplies = this.connection.define('ForumReplies', {
            REPLY_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            POST_ID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            USER_ID: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            CONTENT: DataTypes.TEXT,
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'FORUM_REPLIES',
            timestamps: false,
        });

        this.UserFollowers = this.connection.define('UserFollowers', {
            USER_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            FOLLOWER_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            CREATED_AT: DataTypes.DATE,
        }, {
            tableName: 'USER_FOLLOWERS',
            timestamps: false,
        });

        this.syncTables();

    }

    syncTables() {
        this.Artists.sync();
        this.Albums.sync();
        this.Tracks.sync();
        this.TracksAudioFeatures.sync();
        this.Users.sync();
        this.Playlists.sync();
        this.UserFavoriteTracks.sync();
        this.PlaylistTracks.sync();
        this.Comments.sync();
        this.ForumPosts.sync();
        this.ForumReplies.sync();
        this.UserFollowers.sync();
    }


}