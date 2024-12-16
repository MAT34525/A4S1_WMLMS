# A4S1_WMLMS

Web Music Library Management System (WMLMS)

Léandre BROSSIER, Mathys DECKER, Benoît HUA, Kylie WU

The “Web Music Library Management System” (WMLMS) is designed to provide users with a user-friendly experience to manage their playlists. Users can easily create and edit them.

## The repository contains : 
- Scripts for database setup, including table creation, data population, user management, and security measures (SQL). It also includes queries for data retrieval and system optimization. The dataset used for this project is the Spotify Dataset from Kaggle : https://www.kaggle.com/datasets/yamaerenay/spotify-dataset-19212020-600k-tracks, with “artists.csv” and “tracks.csv”. We chose to split “tracks.csv” into “tracks.csv” and “tracks_audio_features.csv” thanks to a python script ;
- Management, login and navigation interfaces codes (Node and React)

## Key features
- Playlist management: Create and edit private or public playlists
- Advanced search: Find music by title, artist name, or author
- Artist accounts: Upload music and add track descriptions
- User interaction: Comment on tracks and participate in music forums

## Business goals
- Increase artist visibility
- Build a music-centered community

## Webapp README : WMLMS/RAEDME.md

Run : 
```bash
cd WMLMS
ng serve
```
