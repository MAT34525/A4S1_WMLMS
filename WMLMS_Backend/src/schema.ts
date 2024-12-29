
// Database schema (also created by an LLM using the SQL queries for the table creation)
import {DataTypes, ModelStatic, Sequelize} from "sequelize";

export class Schema {

    connection : Sequelize;
    public static Artists : ModelStatic<any>;
    public static Albums : ModelStatic<any>;
    public static Tracks : ModelStatic<any>;
    public static TracksAudioFeatures : ModelStatic<any>;
    public static Users : ModelStatic<any>;
    public static Playlists : ModelStatic<any>;
    public static UserFavoriteTracks : ModelStatic<any>;
    public static PlaylistTracks : ModelStatic<any>;
    public static Comments : ModelStatic<any>;
    public static ForumPosts : ModelStatic<any>;
    public static ForumReplies : ModelStatic<any>;
    public static UserFollowers : ModelStatic<any>;

    constructor(connection : Sequelize) {

        console.log("INIT")

        this.connection = connection;

        Schema.Artists = this.connection.define('Artists', {
            ARTIST_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            NAME: {
                type: DataTypes.STRING,
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

        Schema.Albums = this.connection.define('Albums', {
            ALBUM_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            NAME: {
                type: DataTypes.STRING,

            },
            RELEASE_DATE: DataTypes.DATE,
            ARTIST_ID: DataTypes.STRING,
        }, {
            tableName: 'ALBUMS',
            timestamps: false,
        });

        Schema.Tracks = this.connection.define('Tracks', {
            TRACK_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            NAME: {
                type: DataTypes.STRING,

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

        Schema.TracksAudioFeatures = this.connection.define('TracksAudioFeatures', {
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

        Schema.Users = this.connection.define('Users', {
            USER_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USERNAME: {
                type: DataTypes.STRING,

            },
            PASSWORD: {
                type: DataTypes.STRING,

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

        Schema.Playlists = this.connection.define('Playlists', {
            PLAYLIST_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USER_ID: DataTypes.STRING,
            NAME: {
                type: DataTypes.STRING,

            },
            DESCRIPTION: DataTypes.STRING,
            IS_PUBLIC: DataTypes.ENUM('Y', 'N'),
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'PLAYLISTS',
            timestamps: false,
        });

        Schema.UserFavoriteTracks = this.connection.define('UserFavoriteTracks', {
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

        Schema.PlaylistTracks = this.connection.define('PlaylistTracks', {
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

        Schema.Comments = this.connection.define('Comments', {
            COMMENT_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USER_ID: {
                type: DataTypes.STRING,

            },
            TRACK_ID: {
                type: DataTypes.STRING,

            },
            COMMENT_TEXT: {
                type: DataTypes.STRING,

            },
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'COMMENTS',
            timestamps: false,
        });

        Schema.ForumPosts = this.connection.define('ForumPosts', {
            POST_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            USER_ID: {
                type: DataTypes.STRING,

            },
            TITLE: DataTypes.STRING,
            CONTENT: DataTypes.TEXT,
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'FORUM_POSTS',
            timestamps: false,
        });

        Schema.ForumReplies = this.connection.define('ForumReplies', {
            REPLY_ID: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            POST_ID: {
                type: DataTypes.STRING,

            },
            USER_ID: {
                type: DataTypes.STRING,

            },
            CONTENT: DataTypes.TEXT,
            CREATED_AT: DataTypes.DATE,
            UPDATED_AT: DataTypes.DATE,
        }, {
            tableName: 'FORUM_REPLIES',
            timestamps: false,
        });

        Schema.UserFollowers = this.connection.define('UserFollowers', {
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

    // Done manually
    syncTables() {
        Schema.Artists.sync();
        Schema.Albums.sync();
        Schema.Tracks.sync();
        Schema.TracksAudioFeatures.sync();
        Schema.Users.sync();
        Schema.Playlists.sync();
        Schema.UserFavoriteTracks.sync();
        Schema.PlaylistTracks.sync();
        Schema.Comments.sync();
        Schema.ForumPosts.sync();
        Schema.ForumReplies.sync();
        Schema.UserFollowers.sync();
    }

    populateTables() {

    }
}