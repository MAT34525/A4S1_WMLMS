// Search tracks endpoint
import {Schema} from "../schema";
import {ReqType, ResType} from "../app";
import express from "express";
import {Op} from "sequelize";
import {Artists, Tracks} from "../tables";


const router = express.Router();

router.post('/u/queries/tracks', (req : ReqType, res : ResType ) => searchTracks(req, res));
router.post('/u/queries/artists', (req : ReqType, res : ResType) => searchArtist(req, res));


async function searchTracks(req: ReqType, res : ResType) {

    console.log("User POST Search for tracks");

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const query : string | undefined = req.body.query.toString().toLowerCase();

    // Check that all fields are filled
    if (!query || query.trim().length === 0) {
        res.status(400).send({message: 'Query parameter is required'});
        return;
    }

    try {

        // Lookup for the tracks in the database
        const result : Tracks[] = await Schema.getTracks().findAll({
            where : {
                NAME : {
                    [Op.like] : `%${query}%`,
                },
            },
            raw : true
        });

        // Send the result
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({message: 'Internal server error'});
        console.log("Internal server error :", err);
    }
}

// Search artists endpoint
async function searchArtist(req : ReqType, res : ResType) {

    console.log("User POST Search for artists");

    if(Schema.getConnection() === undefined || Schema.getConnectionStatus() === false) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const query : string | undefined = req.body.query.toString().toLowerCase();

    // Check that all fields are filled
    if (!query || query.trim().length === 0) {
        res.status(400).send({message: 'Query parameter is required'});
        return;
    }

    try {
        // Lookup for the artists in the database
        const result : Artists[] = await Schema.getArtists().findAll({
            where : {
                NAME : {
                    [Op.like] : `%${query}%`,
                },
            },
            raw : true
        });

        // Send the result
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send({message: 'Internal server error'});
        console.log("Internal server error :", err);
    }
}

export default router;