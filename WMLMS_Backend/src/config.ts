// This is a small configuration file to store the database connection settings

import {Dialect, Options} from "sequelize";

export const DB_HOST : string = "localhost";        // Don't change unless you have a distant server running the database
export const DB_PORT : number = 1521;               // Oracle service : 1521
export const DB_DIALECT : Dialect = 'oracle';     // oracle or postgres
export const DB_NAME : string = 'wmlmspdb';         // Oracle service name : wmlmspdb

export const DB_USER : string = 'admin';            // Oracle PDB : admin
export const DB_PASSWORD : string = 'admin';        // Oracle PDB : admin

export const SEQUELIZE_DB_PARAMS : Options = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
}

