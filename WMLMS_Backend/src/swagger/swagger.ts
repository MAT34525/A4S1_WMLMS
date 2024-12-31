
// Swagger configuration (initial tables created by an LLM using the SQL queries for table creation)
import {SwaggerOptions} from "swagger-ui-express";

export const jsDocOptions : SwaggerOptions  = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'Documentation for Express API with Swagger',
        },
        components: {
            schemas: {
                Artists: {
                    type: "object",
                    properties: {
                        ARTIST_ID: { type: "string", example : "0E0eEzoo3nfBf5efmw6S1Q" },
                        NAME: { type: "string", example : "Omar Ferreyra" },
                        FOLLOWERS: { type: "integer", nullable: true, example: 1234 },
                        IS_VERIFIED: {type: "string",  enum: ["Y", "N"], example : 'N' },
                        GENRES: { type: "string", nullable: true, example : '[]' },
                        CREATED_AT: { type: "string", format: "date-time", nullable: true, example : "2024-12-15T23:00:00.000Z" },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true, example : "2024-12-15T23:00:00.000Z" }
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
                Users: {
                    type: "object",
                    properties: {
                        USER_ID: { type: "string", example : 'e2150b36-21af-4647-87ff-6410a5862ec7'},
                        USERNAME: { type: "string", example : "vwalker" },
                        PASSWORD: { type: "string", example : "$2b$10$5FcPT1EbV/8QKClKlp4iK.3S/lsz1XbbW8oKz4eydknGpv8eQa8kO" },
                        EMAIL: { type: "string", format: "email", nullable: true, example : "vwalker@example.com" },
                        FULL_NAME: { type: "string", nullable: true, example :  "Vwalker"},
                        IS_LOCKED: { type: "string", enum: ["Y", "N"], example : 'N' },
                        IS_ARTIST: { type: "string", enum: ["Y", "N"], example : 'Y'},
                        CREATED_AT: { type: "string", format: "date-time", nullable: true, example : "2005-03-20T19:25:26.438Z" },
                        UPDATED_AT: { type: "string", format: "date-time", nullable: true, example : "2016-06-18T13:29:43.675Z" }
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
                PlaylistTracks: {
                    type: "object",
                    properties: {
                        PLAYLIST_ID: { type: "string" },
                        TRACK_ID: { type: "string" }
                    },
                    required: ["PLAYLIST_ID", "TRACK_ID"]
                },
            },
            requestBodies : {
                Query: {
                    type: "object",
                    properties: {
                        query: {type: "string"},
                    },
                    required: ["query"]
                },
                ArtistPage : {
                    type : 'object',
                    properties : {
                        page : {type : 'number'},
                        size : {type : 'number'}
                    },
                    required : ['page', 'size']
                },
                Login : {
                    type : 'object',
                    properties : {
                        username : {type : 'string'},
                        password : {type : 'string'}
                    },
                    example : {username : 'postgres', password : 'password'},
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

            },
            responses : {
                UsersList : {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Users',
                    }
                },
                ArtistsList : {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Artists',
                    }
                },
                AlbumsList : {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Albums',
                    }
                },
                PlaylistsList : {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Playlists',
                    }
                },
                TracksList : {
                    type: 'array',
                    items: {
                        $ref: '#/components/schemas/Tracks',
                    }
                },
                Error : {
                    type : 'object',
                    properties : {
                        message : {type : 'string'},
                    },
                    example : { message : "Error message"}
                },
                Info : {
                    type : 'object',
                    properties : {
                        message : {type : 'string'},
                    },
                    example : { message : "Action successful !"}
                },

            }


        },
    },
    apis: ['.//src/routes/*.ts', './/src/swagger/*.yaml'],
};