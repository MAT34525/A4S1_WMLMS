
// Import json files : https://www.slingacademy.com/article/how-to-import-json-files-in-typescript/
// Bulk insert from json data into database using Sequelize : https://dev.to/yugabyte/bulk-loading-data-in-postgresql-with-nodejs-and-sequelize-1bn7

import artists from './artists.json'
import tracks from './tracks.json'
import users from './users.json'
import playlist from './playlists.json'
import playlist_tracks from './playlist_tracks.json'
import {Artists, Playlists, PlaylistTracks, Tracks, Users} from "../tables";

export const ARTISTS_DATA : Omit<Artists, string>[] = artists['artists'];
export const TRACKS_DATA : Omit<Tracks, string>[] = tracks['tracks'];
export const USERS_DATA : Omit<Users, string>[] = users['users'];
export const PLAYLISTS_DATA : Omit<Playlists, string>[] = playlist['playlists'];
export const PLAYLIST_TRACKS : Omit<PlaylistTracks, string>[] = playlist_tracks['playlist_tracks']