const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: (process.env.NODE_ENV === 'development' && process.env.SPOTIFY_REDIRECT_URI_DEV) || process.env.SPOTIFY_REDIRECT_URI_PROD
});

spotifyApi.clientCredentialsGrant().then((data) => {
    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body.access_token);
    spotifyApi.setRefreshToken(data.body.refresh_token);
  
    console.log("Spotify access token set!");
    console.log("Exires in", data.body.expires_in, "seconds");
}).catch((error) => {
console.error('Error getting Spotify access token:', error);
});

module.exports = spotifyApi;