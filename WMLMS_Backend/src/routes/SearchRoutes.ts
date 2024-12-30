// Search tracks endpoint
import {Schema} from "../schema";
import {ReqType, ResType} from "../app";
import express from "express";


const router = express.Router();

router.post('/u/queries/tracks', (req : ReqType, res : ResType ) => searchTracks(req, res));
router.post('/u/queries/artists', (req : ReqType, res : ResType) => searchArtist(req, res));


async function searchTracks(req: ReqType, res : ResType) {

    console.log("User POST Search for tracks");

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const query = req.body.query.toString().toLowerCase();

    if (!query || query.trim().length === 0) {
        res.status(400).send({message: 'Query parameter is required'});
        return;
    }

    try {

        const result = await Schema.getConnection().query("SELECT * FROM TRACKS WHERE NAME LIKE '%" + query + "%'");

        console.log(result[0]);

        res.status(200).send(result[0]);
    } catch (err) {
        res.status(500).send({message: 'Internal server error'});
        console.log("Internal server error :", err);
    }
}

// Search artists endpoint
async function searchArtist(req : ReqType, res : ResType) {

    console.log("User POST Search for artists");

    if(Schema.getConnection() === undefined) {
        res.status(503).send({message: 'No connection to the database !'});
        return;
    }

    const query = req.body.query.toString().toLowerCase();

    if (!query || query.trim().length === 0) {
        res.status(400).send({message: 'Query parameter is required'});
        return;
    }

    try {
        const result = await Schema.getConnection().query("SELECT * FROM ARTISTS WHERE NAME LIKE '%" + query + "%'");

        res.status(200).send(result[0]);
    } catch (err) {
        res.status(500).send({message: 'Internal server error'});
        console.log("Internal server error :", err);
    }
}
export default router;