// Copy of the file in the WMLMS Front End : schema.ts

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

// Dummy items used by some ag-grid components ====================================================

export const DUMMY_ARTIST: Artists = {
    ARTIST_ID: "",
    NAME: "",
    FOLLOWERS: 0,
    GENRES: "",
    POPULARITY: 0,
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_ALBUM: Albums = {
    ALBUM_ID: "",
    NAME: "",
    RELEASE_DATE: new Date(),
    ARTIST_ID: ""
};

export const DUMMY_TRACK: Tracks = {
    TRACK_ID: "",
    NAME: "",
    ARTISTS: "",
    ID_ARTISTS: "",
    DURATION_MS: 0,
    EXPLICIT: 0,
    RELEASE_DATE: new Date(),
    TIME_SIGNATURE: 0,
    ALBUM_ID: "",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_TRACK_AUDIO_FEATURES: TracksAudioFeatures = {
    TRACK_ID: "",
    DANCEABILITY: 0,
    ENERGY: 0,
    KEY: 0,
    LOUDNESS: 0,
    MODE: 0,
    SPEECHINESS: 0,
    ACOUSTICNESS: 0,
    INSTRUMENTALNESS: 0,
    LIVENESS: 0,
    VALENCE: 0,
    TEMPO: 0
};

export const DUMMY_USER: Users = {
    USER_ID: "",
    USERNAME: "",
    PASSWORD: "",
    EMAIL: "",
    FULL_NAME: "",
    IS_ARTIST: "N",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_PLAYLIST: Playlists = {
    PLAYLIST_ID: "",
    USER_ID: "",
    NAME: "",
    DESCRIPTION: "",
    IS_PUBLIC: "N",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_USER_FAVORITE_TRACK: UserFavoriteTracks = {
    USER_ID: "",
    TRACK_ID: "",
    ADDED_AT: new Date()
};

export const DUMMY_PLAYLIST_TRACK: PlaylistTracks = {
    PLAYLIST_ID: "",
    TRACK_ID: ""
};

export const DUMMY_COMMENT: Comments = {
    COMMENT_ID: "",
    USER_ID: "",
    TRACK_ID: "",
    COMMENT_TEXT: "",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_FORUM_POST: ForumPosts = {
    POST_ID: "",
    USER_ID: "",
    TITLE: "",
    CONTENT: "",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_FORUM_REPLY: ForumReplies = {
    REPLY_ID: "",
    POST_ID: "",
    USER_ID: "",
    CONTENT: "",
    CREATED_AT: new Date(),
    UPDATED_AT: new Date()
};

export const DUMMY_USER_FOLLOWER: UserFollowers = {
    USER_ID: "",
    FOLLOWER_ID: "",
    CREATED_AT: new Date()
};