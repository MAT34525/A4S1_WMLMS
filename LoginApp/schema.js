import {DataTypes, Sequelize } from 'sequelize';

export class Schema {

    #connection;
    users;
    artists;
    songs;
    playlists;
    songs_playlists;

    constructor(connection) {

        this.#connection = connection;

        this.users = this.#connection.define('USERS', {
            user_id: DataTypes.INTEGER,
            username: DataTypes.STRING(50),
            password: DataTypes.STRING(50),
            email: DataTypes.STRING(100),
            full_name: DataTypes.STRING(100)
        })


        this.getAllUsers();
    }

    async getAllUsers()
    {
        await this.#connection.sync();

        const usr = await this.users.findAll();

        console.log(usr);
    }




}