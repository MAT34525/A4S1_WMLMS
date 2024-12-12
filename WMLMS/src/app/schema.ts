
// List all the tables contained in the DB schema that is accessible to the app (admin & app)
// This file is common between user and admin services

/* IMPORTANT :
  All fields must be in uppercase to allow DB, Sequelize, Backend and Frontent fields capabilities
*/

// User table
export interface User {
  USER_ID : number,
  USERNAME : string,
  PASSWORD : string,
  EMAIL: string,
  FULL_NAME : string
}
