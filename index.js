const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

let app = express();

app.post('/voice', (req, res) => {
  // Set the url of the song we are going to play
  let songUrl = 'http://5tephen.com/owen/mp3real/menu.mp3'

  const twiml = new VoiceResponse();

  twiml.play({
    loop: 1
  }, songUrl);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

let port = process.env.PORT;
app.listen(port, () => console.log('Listening at http://localhost:3000'));

