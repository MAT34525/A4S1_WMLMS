
// Import json files : https://www.slingacademy.com/article/how-to-import-json-files-in-typescript/
// Bulk insert from json data into database using Sequelize : https://dev.to/yugabyte/bulk-loading-data-in-postgresql-with-nodejs-and-sequelize-1bn7

import artists from './artists.json'
import tracks from './tracks.json'
import users from './users.json'
import playlist from './playlists.json'
import playlist_tracks from './playlist_tracks.json'

export const ARTISTS_DATA = artists['artists'];
export const TRACKS_DATA = tracks['tracks'];
export const USERS_DATA = users['users'];
export const PLAYLISTS_DATA = playlist['playlists'];
export const PLAYLIST_TRACKS = playlist_tracks['playlist_tracks']