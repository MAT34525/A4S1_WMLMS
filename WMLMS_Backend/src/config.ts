// This is a small configuration file to store the database connection settings
import {Dialect, Options, Sequelize} from "sequelize";
import {Schema} from "./schema";
import {Database} from "./database";

const DB_HOST : string = "localhost";
const DB_PORT : number = 5432; // 1521; // 5432 for PostgreSQL
const DB_DIALECT : Dialect = 'postgres'; // postrges
const DB_NAME : string = 'LearnEEEEEEDb'; // wmlms

const PASSWORD : string = 'password'; // admin postgres
const USER : string = 'postgres';  // Your postgres server password

export const ORACLE_DB_PARAMS : {} = {
    user: USER,
    password: PASSWORD,
    connectString: `${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

export const SEQUELIZE_DB_PARAMS : Options = {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
}


export function databaseInit() {

    // Create a new database depending on the dialect
    let db = new Sequelize('', USER, PASSWORD, SEQUELIZE_DB_PARAMS)

    if(DB_DIALECT == 'postgres') {
        db.query(`
            CREATE DATABASE "${DB_NAME}"
                WITH
                OWNER = ${USER}
                ENCODING = 'UTF8'
                LOCALE_PROVIDER = 'libc'
                CONNECTION LIMIT = -1
                IS_TEMPLATE = False;
        `).then( e => {

            console.warn("Database created !")

            let newDb = databaseConnect();

            Database.Schema = new Schema(newDb);

            newDb.close();
        })

        db.close();
    }

    /*
    db = new Sequelize(DB_NAME, USER, PASSWORD, SEQUELIZE_DB_PARAMS)

    // Load the tables using the schema in database.ts
    let schema = new Schema(db)
    schema.createTables();
    schema.syncTables();
    */
}

export function databaseConnect() : Sequelize  {
    return new Sequelize(DB_NAME, USER, PASSWORD, SEQUELIZE_DB_PARAMS);
}