
// List all the tables contained in the DB schema that is accessible to the app (admin & app)
// This file is common between user and admin services

/* IMPORTANT :
  All fields must be in uppercase to allow DB, Sequelize, Backend and Frontent fields capabilities
*/

// Interface for the "artists" table
export interface Artists {
  ARTIST_ID: string;
  NAME: string;
  FOLLOWERS?: number;
  GENRES?: string;
  POPULARITY?: number;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "albums" table
export interface Albums {
  ALBUM_ID: string;
  NAME: string;
  RELEASE_DATE?: Date;
  ARTIST_ID?: string;
}

// Interface for the "tracks" table
export interface Tracks {
  TRACK_ID: string;
  NAME: string;
  ARTISTS?: string;
  ID_ARTISTS?: string;
  DURATION_MS?: number;
  EXPLICIT?: number;
  RELEASE_DATE?: Date;
  TIME_SIGNATURE?: number;
  ALBUM_ID?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "tracks_audio_features" table
export interface TracksAudioFeatures {
  TRACK_ID: string;
  DANCEABILITY?: number;
  ENERGY?: number;
  KEY?: number;
  LOUDNESS?: number;
  MODE?: number;
  SPEECHINESS?: number;
  ACOUSTICNESS?: number;
  INSTRUMENTALNESS?: number;
  LIVENESS?: number;
  VALENCE?: number;
  TEMPO?: number;
}

// Interface for the "users" table
export interface Users {
  USER_ID: string;
  USERNAME: string;
  PASSWORD: string;
  EMAIL?: string;
  FULL_NAME?: string;
  IS_ARTIST?: 'Y' | 'N';
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "playlists" table
export interface Playlists {
  PLAYLIST_ID: string;
  USER_ID?: string;
  NAME: string;
  DESCRIPTION?: string;
  IS_PUBLIC?: 'Y' | 'N';
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "user_favorite_tracks" table
export interface UserFavoriteTracks {
  USER_ID: string;
  TRACK_ID: string;
  ADDED_AT?: Date;
}

// Interface for the "playlist_tracks" table
export interface PlaylistTracks {
  PLAYLIST_ID: string;
  TRACK_ID: string;
}

// Interface for the "comments" table
export interface Comments {
  COMMENT_ID: string;
  USER_ID: string;
  TRACK_ID: string;
  COMMENT_TEXT: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "forum_posts" table
export interface ForumPosts {
  POST_ID: string;
  USER_ID: string;
  TITLE?: string;
  CONTENT?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "forum_replies" table
export interface ForumReplies {
  REPLY_ID: string;
  POST_ID: string;
  USER_ID: string;
  CONTENT?: string;
  CREATED_AT?: Date;
  UPDATED_AT?: Date;
}

// Interface for the "user_followers" table
export interface UserFollowers {
  USER_ID: string;
  FOLLOWER_ID: string;
  CREATED_AT?: Date;
}
