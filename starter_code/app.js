require('dotenv').config()

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");


const app = express();

hbs.registerPartials(__dirname + "/views/partials");


app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });




// the routes go here:

app.get("/", (request, response) => {
    // this will render the template in /views/index.hbs
    response.render("index.hbs");
});

// /search?q=LeBron&foo=
app.get("/artists", (req, res) => {
    // console.log(req.query);
    const searchString = req.query.artistInput;
    console.log(searchString);

    spotifyApi
        .searchArtists(searchString)
        .then(data => {
            console.log("The received data from the API: ", data.body);
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            let artists = data.body.artists.items;
            res.render("artists.hbs", {
                artists
            });

            // res.send(data.body);

        })
        .catch(err => {
            console.log("The error while searching artists occurred: ", err);
        });
});

app.get("/albums/:artistId", (req, res, next) => {
    // .getArtistAlbums() code goes here
    const artistId = req.params.artistId;

    spotifyApi.getArtistAlbums(artistId)
        .then(data => {
            // console.log(data);
            // res.send(data)
            let albumObjects = data.body.items;
            res.render("albums.hbs", {
                albumObjects
            })
        })
    // console.log("albums");
    // res.render("albums.hbs", {albums});

});

app.get("/tracks/:albumId", (req, res, next) => {
    const albumTracks = req.params.albumId;

    spotifyApi.getAlbumTracks(albumTracks)
        .then(data => {
            // console.log(data);
            // res.send(data)

            let tracks = data.body.items;
            res.render("tracks.hbs", {
                tracks
            })
            // console.log(tracks);
        })
        .catch(er => {
            console.log(er);
        })
    // res.render("albums.hbs", {albums});

});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));