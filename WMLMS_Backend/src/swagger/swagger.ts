
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
                Error : {
                    type : 'object',
                    properties : {
                        message : {type : 'string'},
                    },
                    example : { message : "Error message"}
                },

            }


        },
    },
    apis: ['.//src/routes/*.ts', './/src/swagger/*.yaml'],
};