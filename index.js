const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  // If the user entered digits, process their request
  const digit = request.body.Digits
  let songUrl = 'http://5tephen.com/owen/mp3real/'
  if (digit) {
    songUrl += digit + '.mp3'
  } else {
    songUrl += 'menu.mp3'
  }

  const gather = twiml.gather({
    numDigits: 1,
  });

  gather.play({
    loop: 1
  }, songUrl);

  twiml.redirect('/voice');

  // // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at http://localhost:3000'));

