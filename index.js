const express = require('express');
const twilio = require('twilio');
const urlencoded = require('body-parser').urlencoded;
const VoiceResponse = require('twilio').twiml.VoiceResponse;

const app = express();

let IS_CONTEST_ENABLED = false;
let CALLER_NUMBER = 0;
let CALLER_WIN_NUMBER = 5;

// Parse incoming POST params with Express middleware
app.use(urlencoded({ extended: false }));

app.get('/see-caller-count', (req, res) => {
  let output = '';
  output += '<p>contest running?: ' + (IS_CONTEST_ENABLED ? 'yes' : 'no') + '</p>'
  output += "<div><form method='POST' action='/toggle-contest'><button>toggle contest on/off</button></form></div>"
  output += '<p>number of calls: ' + CALLER_NUMBER + '</p>'
  output += "<div><form method='POST' action='/reset-callers-to-zero'><button>reset callers to zero</button></form></div>"
  output += "<div><form method='POST' action='/set-caller-winner-number'><label>winning call number: <input type='number' step='1' value='" + CALLER_WIN_NUMBER + "' name='number'/><button>set</button></label></form></div>"
  res.send(output);
})

app.post('/toggle-contest', (req, res) => {
  IS_CONTEST_ENABLED = !IS_CONTEST_ENABLED
  res.redirect('/see-caller-count')
})

app.post('/reset-callers-to-zero', (req, res) => {
  resetCallersToZero()
  res.redirect('/see-caller-count')
})

app.post('/set-caller-winner-number', (req, res) => {
  const number = parseInt(req.body.number)
  setCallerWinnerNumber(number)
  res.redirect('/see-caller-count')
})

function resetCallersToZero() {
  console.log('reset calls to zero')
  CALLER_NUMBER = 0;
}

function setCallerWinnerNumber(number) {
  console.log('set call win number to:', number)
  CALLER_WIN_NUMBER = number;
}


app.post('/voice', (request, response) => {
  // Use the Twilio Node.js SDK to build an XML response
  const twiml = new VoiceResponse();

  // If the user entered digits, process their request
  const digit = request.body.Digits

  if (IS_CONTEST_ENABLED && digit == 9) {
    console.log('caller number!');
    incrementCallerNumber(twiml);
  } else {
    console.log('play menu');
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
  }

  // // Render the response as XML in reply to the webhook request
  response.type('text/xml');
  response.send(twiml.toString());
});


function incrementCallerNumber(twiml) {
  CALLER_NUMBER++;
  
  if (CALLER_NUMBER === CALLER_WIN_NUMBER) {
    twiml.say('Congratulations! You are lucky caller number ' + CALLER_NUMBER + '. You won!')
    twiml.dial('206-659-9994')
  } else if (CALLER_NUMBER < CALLER_WIN_NUMBER) {
    twiml.say('You are caller number ' + CALLER_NUMBER + '. try calling again!')
  } else {
    twiml.say('The contest has ended! You are caller number ' + CALLER_NUMBER)
  }
}

let port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at http://localhost:3000/see-caller-count'));

