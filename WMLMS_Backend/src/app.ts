import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import oracledb from 'oracledb';


// Swagger

import swaggerJsdoc from 'swagger-jsdoc'; // * as swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';

// Import des routes
import adminRoutes from './routes/AdminRoutes';
import userRoutes from './routes/UserRoutes';
import playlistRoutes from './routes/PlaylistRoutes';


const jsDocOptions = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'Documentation for Express API with Swagger',
    },
    components: {
      schemas: {
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
            IS_ARTIST: { type: "string", enum: ["Y", "N"], nullable: true },
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
  apis: ['.//src/app.ts', './/src/admin_database.ts', './/src/database.ts'],
};

const apiDoc = swaggerJsdoc(jsDocOptions);
console.log('api-doc json:', JSON.stringify(apiDoc, null,2));

const app = express();
app.use(express.json());

app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(apiDoc));

//gestion des sessions de chaque user
app.use(session({
  secret: 'session_secrete',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Connexion BDD

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Utilisation des routes
app.use('/u', adminRoutes);
app.use('/u', userRoutes);
app.use('/u', playlistRoutes);

// Démarrer le serveur
app.listen(3000, () => {
  console.log('Server running on : http://localhost:3000');
});
