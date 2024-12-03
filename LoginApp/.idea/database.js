import Sequelize from 'sequelize';
import oracledb from 'oracledb';

export class Database {

    #connection;
    #mypw = 'admin'

    constructor()
    {
        // Create the connection to the database
        this.connection = new Sequelize('wmlmspdb', 'admin', 'admin', {
            host: 'localhost',
            port: 1521,
            dialect: 'oracle'
        });

        // Test the connection to the databse
        this.TestConnection();
    }

    // Test the connection to the local database
    async TestConnection()
    {
        try {
            await this.connection.authenticate();
            console.log('Connection has been established successfully.');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

    // Close the connection when the class is destroyed
    destroy()
    {
        this.connection.close()
    }

}
