# A4S1_WMLMS

Web Music Library Management System (WMLMS)

Léandre BROSSIER, Mathys DECKER, Benoît HUA, Kylie WU

The “Web Music Library Management System” (WMLMS) is designed to provide users with a user-friendly experience to manage their playlists. Users can easily create and edit them.

## The repository contains : 

- Project reports for the Advanced Database Managment course in `Advanced Database Management Reports`
- Scripts for database setup, including table creation, data population, user management, and security measures (SQL). It also includes queries for data retrieval and system optimization. The dataset used for this project is the Spotify Dataset from Kaggle : https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks, with “artists.csv” and “tracks.csv”. We chose to split “tracks.csv” into “tracks.csv” and “tracks_audio_features.csv” thanks to a python script ;
- Management, login and navigation interfaces codes (Node and Angular React)

## Project Structure : 

```
/
├─ Database         : The sql and python scripts to setup and populate the database
|
├─ WMLMS_Frontend   : The front end (angular / typescript / css / html) code of the tool
|                     This is used for the UI and connects to the back end
|           
├─ WMLMS_Backend    : The back end (node / typescript) code of the tool
|                     This is used to link the datatabase to the front end
|
├─ Advanced Database Management : Final reports, presentation video, installation video 
```

## Installation guide

You have a video tutorial for the installation steps in the `Advanced Database Management Reports` folder !

### Requirements

- [ ] [Oracle Database XE 21.c (download link)](https://www.oracle.com/database/technologies/xe-downloads.html)
- [ ] [Node.js (download link)](https://nodejs.org/en)

### Database installation and setup

- [ ] Step 0 : Install Oracle Database XE 21.c
- [ ] Step 1 : Pluggable database setup using DATABASE\WMLMS_Step_1_PDB_SETUP.sql
  - [ ] Create a new pluggable database
  - [ ] Create a new user
  - [ ] Open the database and create a new service
- [ ] Step 2 : Prepare and split the dataset using DATABASE\WMLMS_Step_2_Datasets
  - [ ] Unzip the dataset files
  - [ ] Use the python script WMLMS_Step_2_CSV_Separation.py 
- [ ] Step 3 : Setup the database using  DATABASE\WMLMS_Step_3_Database_Setup.sql
  - [ ] Run the installation scripts

### Front end installation and setup

Make sure you have installed Node.js and that it is in your PATH

- [ ] Step 0 : Browse to the WMLMS_Frontend folder with a terminal
- [ ] Step 1 : Install packages with `npm install`

### Back end installation and setup

- [ ] Step 0 : Browse to the WMLMS_Backend folder with a terminal
- [ ] Step 1 : Install packages with `npm install`

### Build the project and run

To bypass the following steps, you can open individually WMLMS_Backend or WMLMS_Frontend in IntelliJ and used predefined configurations :
<p align="center">
 <img src="Advanced Database Management Reports/Readme_Assets/IntelliJ_Backend_Run.png" />
 <img src="Advanced Database Management Reports/Readme_Assets//IntelliJ_Frontend_Run.png" />
</p>


- [ ] Step 0 : Browse to the WMLMS_Backend folder with a terminal
  - [ ] Run `npx ts-node src/app.ts`
  - [ ] Install aditionnal tools if necessary
- [ ] Step 1 : Browse to the WMLMS_Frontend folder with a terminal
  - [ ] Run `ng serve`

Once both front-end and back-end instances ar running, you can open your browser and navigate to : http://localhost:4200/

Hopefully, if you didn't managed to run or build the project, you have a presentation video in `Advanced Database Management Reports` as well !

## Key features :

(done)
- Administration panel

(work in progres...)
- Playlist management: Create and edit private or public playlists
- Advanced search: Find music by title, artist name, or author
- Artist accounts: Upload music and add track descriptions
- User interaction: Comment on tracks and participate in music forums

## Business goals :

- Increase artist visibility
- Build a music-centered community

