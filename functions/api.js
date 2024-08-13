const express = require('express');
const app = express();
const router = express.Router();
const url = require('url');
// YouTubeTranscriptAPI = require('@0x6a69616e/youtube-transcript');
YouTubeTranscriptAPI = require('youtube-transcript').YoutubeTranscript;
const cors = require('cors');

console.log("Running...")

app.use(cors()); // Enables CORS for all routes

// app.get('/', async (req, res) => {
router.get('/', async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true); // Parse the URL including query parameters
    const queryParameters = parsedUrl.query;    // Extract query parameters object
  
    // Access individual query parameters
    const videoId = queryParameters.videoId; 
    console.log('Receive videoId: ' + videoId) 
    data = await loadScripts(videoId).then((res) => {return res});
    console.log('End...')
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(data));
    res.end();
        
  } catch (e) {
    res.writeHead(503,  { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({'Attr': 'name: ' + e.name + ' message: ' + e.message + ' at: ' + e.at + ' text: ' + e.text, "Error": e.stack}))
  }
});

async function loadScripts(videoId) {

  const config = {
      lang: 'en',
      country: 'EN'
  };

  const scripts = await YouTubeTranscriptAPI.fetchTranscript(videoId, config).then((res) => {
      return res
  });
  
  // const scripts = await YouTubeTranscriptAPI.getTranscript(videoId).then(transcript => transcript);
  return scripts;
}

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

// Uncomment to start local
// port = 3000
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })