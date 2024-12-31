# Node JS & React Project : Web Music Library Managment System (WMLMS)

**Authors (ESILV A4 CDOF3) :**
- Léandre BROSSIER
- Mathys DECKER
- Benoît HUA
- Kylie WU (Kylie isn't registered as a NodeJS & React student)

## Summary

This projects aims to recreate a simple music streaming system with administration tools using the knowledge we acquired during our Advanced Database Management, NodeJS & React and Software Engineering courses.  
The main requirements of all three courses are distributed as following :

- Advanced Database Management : 
  - Database creation, setup and management
  - Queries built on the created database and tables
  - Bonus : Management tool with a graphical interface (such as a webapp) 
  
- NodeJS & React :
  - Build a  webapp using a typescript backend & frontend
  - Developing a CRUD API
  - Using charts (Highcharts), tables (AG Grid)
  
- Software Engineering :
  - Managing a project using the Scrum framework
  - Using GitHub to handle project versions, iterations and increments

## Project Structure : 

```
/
├─ Frontend     : The front end (angular / typescript / css / html) code 
|                 of the tool
|                 This is used for the UI and connects to the back end
|                 
├─ Backend      : The back end (node / typescript) code of the tool
|                 This is used to link the database to the front end
|                 It also contains database creation and population 
|                 scripts and datasets
|                   
├─ NodeJS_React : Installation and presentation videos
```

## Installation guide

You have a video tutorial for the installation steps in the `NodeJS_React` folder !

### Requirements

- [ ] [PostgreSQL (download link)](https://www.postgresql.org/download/)
- [ ] [Node.js (download link)](https://nodejs.org/en)

### Database installation and setup

- [ ] Step 0 : Install PostgreSQL
- [ ] Step 1 : Configure the connection in the `Backend>config.ts` file 
  - [ ] Set the credentials of the root user to log in the database
  - [ ] Provide a database name that will be used by the webapp
  
- [ ] Step 2 : Run the backend (see 'Back end installation and setup'). 

If the credentials are correct and the database does not exist yet, it will automatically be created, the schema will be created as well and all the data in `Backend>data` will be loaded into the tables.

### Front end installation and setup

Make sure you have installed Node.js and that it is in your PATH

- [ ] Step 0 : Browse to the `Frontend` folder with a terminal
- [ ] Step 1 : Install packages with `npm install`

### Back end installation and setup

- [ ] Step 0 : Browse to the `Backend` folder with a terminal
- [ ] Step 1 : Install packages with `npm install`

### Build the project and run

To bypass the following steps, you can open individually `Backend` and `Frontend` in IntelliJ and use predefined configurations :

<p align="center">
 <img src="NodeJS_React/Readme_Resources/IntelliJ_Backend_Run.png" />
 <img src="NodeJS_React/Readme_Resources/IntelliJ_Frontend_Run.png" />
</p>


- [ ] Step 0 : Browse to the `Backend` folder with a terminal
  - [ ] Run `npx ts-node src/app.ts`
  - [ ] Install additional tools if necessary
- [ ] Step 1 : Browse to the `Frontend` folder with a terminal
  - [ ] Run `ng serve`

Once both front-end and back-end instances ar running, you can open your browser and navigate to : http://localhost:4200/

The swagger ui is also available at http://localhost:3000/swagger-ui/

Hopefully, if you didn't managed to run or build the project, you have a presentation video in `NodeJS_React` as well !
**This presentation only include a previous version of the administration panel with deprecated features**

## User guide - Frontend

### User : **Home**

You can access the home page by browsing to http://localhost:4200 on this page wou will be able to register as a new user, log in using an existing user credentials, browse to the user home page using the `Home` navbar entry and reach the Admin panel using the `Admin` button in the navbar.

![alt text](NodeJS_React/Readme_Resources/UG_Home.png)

### User : **Register**

On the home page, users can register a new account using the registration forms :

![alt text](NodeJS_React/Readme_Resources/UG_User_Register.png)

### User : **Login**

Once an user is registered, he can log into the app :

![alt text](NodeJS_React/Readme_Resources/UG_User_Login.png)

### User : **Song Search**

The logged user is directly redirected to the song and artist searching page. On this page, he can search for music using the Track radio button, type his searched song and search for it using the dedicated button. Once the list is loaded from the database, the user can click on a song and a small player will appear so he can listen to it.

![alt text](NodeJS_React/Readme_Resources/UG_User_Track_Search.png)

### User : **Artist Search**

On the same page, if the user want to look for an artist, he can toggle the dedicated radio button and redo his research, but this will only give him a list without further actions.

![alt text](NodeJS_React/Readme_Resources/UG_User_Artist_Search.png)

### User : **Playlists**

The last user panel is dedicated to the playlist browsing he will be able to look to the playlist and list it's content once he clicked on it. (playlist are empty by default)

![alt text](NodeJS_React/Readme_Resources/UG_User_Playlist.png)

If you click on one of the results, you will be able to scroll down and look at the tracks it contains :

![alt text](NodeJS_React/Readme_Resources/UG_User_Playlist_Tracks.png)

### Admin : **Login**

Once you click on the `Admin` button in the navbar, you will be redirected to the admin login page. The default credentials are your credentials to log into the database, they are similar to the one you provided into `Backend>config.ts`

![alt text](NodeJS_React/Readme_Resources/UG_Admin_Login.png)

### Admin : **Home page**

There is nothing important to display here, it is quite similar to Webapp home page, without login/register buttons and with a custom navbar for the administration tools.

### Admin : **Users page**

The first tool the administrator has is the one to lock / unlock or update user data. 

![alt text](NodeJS_React/Readme_Resources/UG_Admin_Users.png)

For each user, you have access to two simple pages to do this.

![alt text](NodeJS_React/Readme_Resources/UG_Admin_User_Edit.png)

![alt text](NodeJS_React/Readme_Resources/UG_Admin_User_View.png)

### Admin : **Artists page**

The second tool, the artist page, only allow the administrator to verify or not the artist. It has a custom pagination tool to limit the loading time and we are fully aware that it will greatly reduce the functionality brought by ag grid modules top operate filters and selection since only 20 artists are loaded at the same time.

![alt text](NodeJS_React/Readme_Resources/UG_Admin_Artist.png)

### Admin : **Tables page**

The third tool only allow you to monitor the content of various tables once they are selected. You can use the base functionalities of Ag grid to do more advanced filtering and sorting of the tables.

![alt text](NodeJS_React/Readme_Resources/UG_Admin_Tables.png)


### Admin : **Queries page**

The fourth tool is the query page. This will allow you to run custom SQL queries, you can load predefined queries using the bottom left panel and show the result of the query in the bottom right panel. You can also enhance your query result using AG Grid default tools.  

![alt text](NodeJS_React/Readme_Resources//UG_Admin_Queries.png)

### Admin : **Statistics page**

The fifth and last page is the statistic page whe you can find some KPI on the number of rows and tables into the database and also some charts to display additional statistics such as the explicit repartition of songs or the top artists.

![alt text](NodeJS_React/Readme_Resources/UG_Admin_Statistics.png)

## User guide - Backend

Once the backend is running, you will be able to access the swagger-ui page at http://localhost:3000/swagger-ui

As you already know, the API we built is available here and you will be able to test it :

### Overview : **All available commands**

![alt text](NodeJS_React/Readme_Resources/SW_Page_1.png)
![alt text](NodeJS_React/Readme_Resources/SW_Page_2.png)
![alt text](NodeJS_React/Readme_Resources/SW_Page_3.png)

### Overview : **Command example**

As you can see, we have many commands we can handle with our backend, here is a quick overview of one of them.

![alt text](NodeJS_React/Readme_Resources/SW_Command_1.png)
![alt text](NodeJS_React/Readme_Resources/SW_Command_2.png)

## Tasks distribution 

For more precision, don't hesitate to check the activity report on GitHub :wink:

### Database :
- Tables creation :  Kylie
- Triggers, functions, procedures creation : Kylie
- Queries, Advanced Queries : Kylie
- Pluggable database creation / guide : Mathys
- Database connection with backend : Mathys

### Backend :
- Login API : Léandre
- User API (Tracks, Albums, Playlists) : Léandre
- Admin API (Users, Artists, Tables, Queries, Statistics) : Mathys

### Frontend :
- Login and register pages (User, Admin, Home) : Benoit
- User pages (Playlist, Songs) : Léandre 
- User pages (Song searches) : Benoit
- Admin pages (Users, Artists, Playlists, Statistics, Queries) : Mathys

### Other (Mathys) :
- Code cleanup
- Swagger-UI documentation
- Integrating postgres as a possible database source
- Auto-create database and insert values when using postges dialect