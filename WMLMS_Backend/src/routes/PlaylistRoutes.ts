import express from 'express';
import {ReqType, ResType} from "../app";
import {Schema} from "../schema";
import {Op} from "sequelize";

const router = express.Router();

// Routes
router.get('/u/playlists', (req : ReqType, res : ResType) => getPlaylists(req, res));
router.post('/u/playlists', (req : ReqType, res : ResType) => createPlaylist(req, res));
router.put('/u/playlists/:id', (req : ReqType, res : ResType) => updatePlaylist(req, res));
router.delete('/u/playlists/:id', (req : ReqType, res : ResType) => deletePlaylist(req, res));
router.get('/u/playlists-tracks/:id', (req : ReqType, res : ResType) => getTracksForPlaylist(req, res));

// Retrieve all playlists
async function getPlaylists(req : ReqType, res : ResType) {

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    try {
        // Query to get all playlists
        const result = await Schema.getPlaylists().findAll({
            attributes : ["PLAYLIST_ID", "NAME", "DESCRIPTION", "IS_PUBLIC", "CREATED_AT", "UPDATED_AT"],
        });

        console.log('Retrieved playlists :', result);

        // Send the retrieved playlists list
        res.status(200).json(result);

    } catch (error) {

        console.error('Error when retrieving playlists :', error);
        res.status(500).json({ errorMessage: 'Error when retrieving artists.' });
    }
}

async function getTracksForPlaylist(req, res) {

    const { id } = req.params;

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    try {
        // Query to get tracks for a given playlist
        const result = await Schema.getTracks().findAndCountAll({
            include : [
                {
                    model: Schema.getPlaylistsTracks(),
                    where: {
                        PLAYLIST_ID : id,
                    }
                }
            ],
            attributes : ['TRACK_ID', 'NAME', 'DURATION_MS', 'EXPLICIT', 'RELEASE_DATE']
        });


        if (result.rows.length === 0) {
            // No tracks found for the playlist
            return res.status(404).json({ message: 'No tracks found for this playlist.' });
        }

        // Send the list of tracks as a response
        res.status(200).json(result[0]);

    } catch (error) {
        console.error('Error fetching tracks for playlist:', error);
        res.status(500).json({ errorMessage: 'Error fetching tracks for playlist.' });
    }
}

// Create a new playlist
async function createPlaylist(req : ReqType, res : ResType) {

    const { name, description, isPublic } = req.body;

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Check missing values
    if (!name || typeof isPublic === 'undefined') {
        res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        return;
    }

    try {
        // Query to get all songs from an artists
        await Schema.getPlaylists().create({
            NAME : name,
            DESCRIPTION : description,
            IS_PUBLIC : isPublic,
            CREATED_AT : new Date(),
            UPDATED_AT : new Date(),
        })

        console.log('Playlist successfully created');

        // Send the creation status
        res.status(201).json({ message: 'Playlist successfully created.' });

    } catch (error) {
        console.error('Error with playlist creation:', error);
        res.status(500).json({ errorMessage: 'Error with playlist creation.' });
    }
}

// Update an existing playlist
async function updatePlaylist(req : ReqType, res : ResType) {

    const playlistId = req.params.id;
    const { name, description, isPublic } = req.body;

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    // Check for missing fields
    if (!name || typeof isPublic === 'undefined') {
        res.status(400).json({ errorMessage: 'All fields are mandatory.' });
        return;
    }

    try {

        // Query to update the playlist description
        const result = await Schema.getPlaylists().update(
            {
                NAME : name,
                DESCRIPTION : description,
                IS_PUBLIC : isPublic,
                UPDATED_AT : new Date()
            },
            {
                where : {
                    PLAYLIST_ID : playlistId
                }
            }
        );

        // Check the playlist update status
        if (result[0] === 0) {
            console.log('Playlist not found');
            res.status(404).json({ errorMessage: 'Playlist not found.' });
            return;
        }

        console.log('Playlist successfully updated');

        // Send the update status
        res.status(200).json({ message: 'Playlist successfully updated.' });

    } catch (error) {
        console.error('Error with playlist update:', error);
        res.status(500).json({ errorMessage: 'Error with playlist update.' });
    }
}

// Delete a playlist
async function deletePlaylist(req : ReqType, res : ResType) {

    const playlistId = req.params.id;

    try {
        // Query to delete the select query
        const result = await Schema.getPlaylists().destroy({
            where : {
                PLAYLIST_ID : playlistId,
            }
        })


        // Check the deletion status
        if (result === 0) {
            console.log('Playlist not found');
            res.status(404).json({ errorMessage: 'Playlist not found.' });
            return;
        }

        console.log('Playlist successfully deleted');

        // Send the deletion status
        res.status(200).json({ message: 'Playlist successfully deleted.' });

    } catch (error) {
        console.error('Error with playlist deletion:', error);
        res.status(500).json({ errorMessage: 'Error with playlist deletion.' });
    }
}

export default router;
