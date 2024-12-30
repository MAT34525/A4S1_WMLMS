// List all the tables contained in the DB schema that is accessible to the app (admin & app)
// This file has been duplicated from the Frontend schema.ts file

/* IMPORTANT :
  All fields must be in uppercase to allow DB, Sequelize, Backend and Frontend fields capabilities
*/

// Interface for the "artists" table
export interface Artists {
    ARTIST_ID: string;
    NAME: string;
    FOLLOWERS?: number;
    GENRES?: string;
    IS_VERIFIED: string | 'Y' | 'N';
    CREATED_AT?: Date | string;
    UPDATED_AT?: Date | string;
}

// Interface for the "albums" table
export interface Albums {
    ALBUM_ID: string;
    NAME: string;
    RELEASE_DATE?: Date | string;
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
    RELEASE_DATE?: Date | string;
    TIME_SIGNATURE?: number;
    ALBUM_ID?: string;
    CREATED_AT?: Date | string;
    UPDATED_AT?: Date | string;
}

// Interface for the "users" table
export interface Users {
    USER_ID: string;
    USERNAME: string;
    PASSWORD: string;
    EMAIL?: string;
    FULL_NAME?: string;
    IS_LOCKED : string | 'Y' | 'N';
    IS_ARTIST?: string | 'Y' | 'N';
    CREATED_AT?: Date | string;
    UPDATED_AT?: Date | string;
}

// Interface for the "playlists" table
export interface Playlists {
    PLAYLIST_ID: string;
    USER_ID?: string;
    NAME: string;
    DESCRIPTION?: string;
    IS_PUBLIC?: string | 'Y' | 'N';
    CREATED_AT?: Date | string;
    UPDATED_AT?: Date | string;
}

// Interface for the "playlist_tracks" table
export interface PlaylistTracks {
    PLAYLIST_ID: string;
    TRACK_ID: string;
}