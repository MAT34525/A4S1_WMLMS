// This is a small configuration file to store the database configuration

import {Dialect, Options} from "sequelize";

export const DB_HOST : string = "localhost";
export const DB_PORT : number = 1521;
export const DB_DIALECT : Dialect = 'oracle';
export const DB_NAME : string = 'wmlmspdb';

const PASSWORD : string = 'admin';
const USER : string = 'admin';

export const ORACLE_DB_PARAMS = {
    user: USER,
    password: PASSWORD,
    connectString: `${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

export const SEQUELIZE_DB_PARAMS : Options = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
}