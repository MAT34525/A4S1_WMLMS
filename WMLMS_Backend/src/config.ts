// This is a small configuration file to store the database connection settings

import {Dialect, Options} from "sequelize";

export const DB_HOST : string = "localhost";        // Don't change unless you have a distant server running the database
export const DB_PORT : number = 5432;               // Oracle service : 1521
export const DB_DIALECT : Dialect = 'postgres';     // oracle or postgres
export const DB_NAME : string = 'wmlms';         // Oracle service name : wmlmspdb

export const DB_USER : string = 'postgres';            // Oracle PDB : admin
export const DB_PASSWORD : string = 'passord';        // Oracle PDB : admin

export const SEQUELIZE_DB_PARAMS : Options = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
}

