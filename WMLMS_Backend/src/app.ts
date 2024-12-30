import express, {Express} from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';

// Import des routes
import adminRoutes from './routes/AdminRoutes';
import userRoutes from './routes/UserRoutes';
import playlistRoutes from './routes/PlaylistRoutes';
import searchRoutes from './routes/SearchRoutes';

// Swagger
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi, {SwaggerOptions} from 'swagger-ui-express';
import {DB_NAME, DB_PASSWORD, DB_USER, SEQUELIZE_DB_PARAMS} from "./config";
import {Sequelize} from "sequelize";
import {Schema} from "./schema";

// Default shorten types for express
export type ReqType = express.Request;
export type ResType = express.Response;

// Swagger configuration (initial tables created by an LLM using the SQL queries for table creation)
const jsDocOptions : SwaggerOptions  = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'Documentation for Express API with Swagger',
    },
    components: {
      schemas: {
        ArtistPage : {
          type : 'object',
          properties : {
            page : {type : 'number'},
            size : {type : 'number'}
          },
          required : ['page', 'size']
        },
        UserLock : {
          type : 'object',
          properties : {
            lock : {type : 'string'},
          },
          required : ['lock']
        },
        Login : {
          type : 'object',
          properties : {
            username : {type : 'string'},
            password : {type : 'string'}
          },
          required : ['username', 'password']
        },
        Register : {
          type : 'object',
          properties : {
            USERNAME : {type : 'string'},
            PASSWORD : {type :'string'},
            EMAIL : {type : 'string'},
            FULL_NAME : {type :"string"}
          },
          required : ["USERNAME", "PASSWORD", "EMAIL", "FULL_NAME"]
        },
        Query: {
          type: "object",
          properties: {
            query: {type: "string"},
          },
          required: ["query"]
        },
        Artists: {
          type: "object",
          properties: {
            ARTIST_ID: { type: "string" },
            NAME: { type: "string" },
            FOLLOWERS: { type: "integer", nullable: true },
            IS_VERIFIED: {type: "string",  enum: ["Y", "N"] },
            GENRES: { type: "string", nullable: true },
            POPULARITY: { type: "integer", nullable: true },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["ARTIST_ID", "NAME"]
        },
        Albums: {
          type: "object",
          properties: {
            ALBUM_ID: { type: "string" },
            NAME: { type: "string" },
            RELEASE_DATE: { type: "string", format: "date-time", nullable: true },
            ARTIST_ID: { type: "string", nullable: true }
          },
          required: ["ALBUM_ID", "NAME"]
        },
        Tracks: {
          type: "object",
          properties: {
            TRACK_ID: { type: "string" },
            NAME: { type: "string" },
            ARTISTS: { type: "string", nullable: true },
            ID_ARTISTS: { type: "string", nullable: true },
            DURATION_MS: { type: "integer", nullable: true },
            EXPLICIT: { type: "integer", nullable: true },
            RELEASE_DATE: { type: "string", format: "date-time", nullable: true },
            TIME_SIGNATURE: { type: "integer", nullable: true },
            ALBUM_ID: { type: "string", nullable: true },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["TRACK_ID", "NAME"]
        },
        TracksAudioFeatures: {
          type: "object",
          properties: {
            TRACK_ID: { type: "string" },
            DANCEABILITY: { type: "number", nullable: true },
            ENERGY: { type: "number", nullable: true },
            KEY: { type: "integer", nullable: true },
            LOUDNESS: { type: "number", nullable: true },
            MODE: { type: "integer", nullable: true },
            SPEECHINESS: { type: "number", nullable: true },
            ACOUSTICNESS: { type: "number", nullable: true },
            INSTRUMENTALNESS: { type: "number", nullable: true },
            LIVENESS: { type: "number", nullable: true },
            VALENCE: { type: "number", nullable: true },
            TEMPO: { type: "number", nullable: true }
          },
          required: ["TRACK_ID"]
        },
        Users: {
          type: "object",
          properties: {
            USER_ID: { type: "string" },
            USERNAME: { type: "string" },
            PASSWORD: { type: "string" },
            EMAIL: { type: "string", format: "email", nullable: true },
            FULL_NAME: { type: "string", nullable: true },
            IS_LOCKED: { type: "string", enum: ["Y", "N"] },
            IS_ARTIST: { type: "string", enum: ["Y", "N"]},
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["USER_ID", "USERNAME", "PASSWORD"]
        },
        Playlists: {
          type: "object",
          properties: {
            PLAYLIST_ID: { type: "string" },
            USER_ID: { type: "string", nullable: true },
            NAME: { type: "string" },
            DESCRIPTION: { type: "string", nullable: true },
            IS_PUBLIC: { type: "string", enum: ["Y", "N"], nullable: true },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["PLAYLIST_ID", "NAME"]
        },
        UserFavoriteTracks: {
          type: "object",
          properties: {
            USER_ID: { type: "string" },
            TRACK_ID: { type: "string" },
            ADDED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["USER_ID", "TRACK_ID"]
        },
        PlaylistTracks: {
          type: "object",
          properties: {
            PLAYLIST_ID: { type: "string" },
            TRACK_ID: { type: "string" }
          },
          required: ["PLAYLIST_ID", "TRACK_ID"]
        },
        Comments: {
          type: "object",
          properties: {
            COMMENT_ID: { type: "string" },
            USER_ID: { type: "string" },
            TRACK_ID: { type: "string" },
            COMMENT_TEXT: { type: "string" },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["COMMENT_ID", "USER_ID", "TRACK_ID", "COMMENT_TEXT"]
        },
        ForumPosts: {
          type: "object",
          properties: {
            POST_ID: { type: "string" },
            USER_ID: { type: "string" },
            TITLE: { type: "string", nullable: true },
            CONTENT: { type: "string", nullable: true },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["POST_ID", "USER_ID"]
        },
        ForumReplies: {
          type: "object",
          properties: {
            REPLY_ID: { type: "string" },
            POST_ID: { type: "string" },
            USER_ID: { type: "string" },
            CONTENT: { type: "string", nullable: true },
            CREATED_AT: { type: "string", format: "date-time", nullable: true },
            UPDATED_AT: { type: "string", format: "date-time", nullable: true }
          },
          required: ["REPLY_ID", "POST_ID", "USER_ID"]
        },
        UserFollowers: {
          type: "object",
          properties: {
            USER_ID: {
              type: "string"
            },
            FOLLOWER_ID: {
              type: "string"
            },
            CREATED_AT: {
              type: "string",
              format: "date-time",
              nullable: true
            }
          },
          required: ["USER_ID", "FOLLOWER_ID"]
        }
        // Define other schemas as needed
      },
    },
  },
  apis: ['.//src/admin_database.ts', './/src/routes/*.ts'],
};

const apiDoc : SwaggerOptions = swaggerJsdoc(jsDocOptions);

// Run the API
const app : Express = express();
app.use(express.json());

// Link swagger component
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

// Session handling for users
app.use(session({
  secret: 'session_secrete',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.json());

// Instantiate the database connection and the models
let _ : Schema = new Schema(new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, SEQUELIZE_DB_PARAMS));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Activate routes
app.use(adminRoutes);
app.use(userRoutes);
app.use(playlistRoutes);
app.use(searchRoutes);

// API startup
app.listen(3000, () => {
  console.log('Server running on : http://localhost:3000');
  console.log('The swagger API is also available at : http://localhost:3000/swagger-ui/')
});
