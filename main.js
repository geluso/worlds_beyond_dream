const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

let app = express();

app.post('/voice', (req, res) => {
  // Set the url of the song we are going to play
  let songUrl = 'http://5tephen.com/owen/bikepolo.mp3'

  const twiml = new VoiceResponse();

  twiml.say("you're listening to 'Bike Polo' by 'Owen.' enjoy")

  twiml.play({
    loop: 1
  }, songUrl);

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

app.listen(3000, () => console.log('Listening at http://localhost:3000'));
