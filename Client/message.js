const stars = document.querySelectorAll("input[id^='first-rate']");
const button = document.querySelector('.sendbutton');
const backbutton = document.querySelector('.backbutton');
const form = document.querySelector('fieldset');
const fbimage = document.querySelector('.fb-image')
const fbmessage = document.querySelector('.fb-messages');
// const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
const closeModalButton = document.querySelector('.modal-close')

const sendURL = 'https://api.kleies.nl/input'
const reviewURL = 'https://api.kleies.nl/message'

const localsendURL = 'http://192.168.99.207:3030/input'
const localreviewURL = 'http://192.168.99.207:3030/message'



async function getMessages() {
  const urlParams = new URLSearchParams(location.search);
  let valueofMesssage;
  for (const blabla of urlParams.values()) {
    valueofMesssage = blabla
  };
  
  const response = await fetch(`${localreviewURL}?id=${valueofMesssage}`);
  const messages = await response.json()
  

  fbmessage.innerHTML = '';
  let messageRatings = []
  let textmessages = [];

  messages.entrys.forEach(message => {
    if (typeof message.rating !== 'undefined') {
      messageRatings.push(message.rating);
    }
    if (message.name !== "" || message.message !== "") {
      textmessages.push(message)
    }
  });

  if (messageRatings.length < 1) {
    averageVoteValue = 0
  } else {
    let numberVotes = messageRatings.map(v => parseInt(v, 10));
    let votevalues = numberVotes.reduce((a, b) => a + b)
    averageVoteValue = Math.floor(votevalues / messages.entrys.length);
  }
  textmessages.forEach(textmessage => {

    a = textmessage.timestamp.toString()

    fbmessage.innerHTML += `
        <div class="column"></div>
        <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen">
          <div class="card-content has-background-red">
            <div class="media">
              <div class="media-content">
                <p class="title is-6 is-clipped">${textmessage.name}</p>
              </div>
            </div>
            <div class="content" style="word-wrap: break-word;">
              ${textmessage.message}
              <br>
              <time class="is-size-7 is-pulled-right" datetime=${textmessage.timestamp}>${textmessage.timestamp}</time>
            </div>
          </div>
        </div>
          <div class="column"></div>
    `
  });

  totalVotes = messages.entrys.length
  fbimage.innerHTML =
    `
    <div class="column"></div>
    <div class="column is-two-thirds-mobile is-half-tablet is-half-desktop is-one-third-widescreen">
      <div class="card has-background-black">
        <div class="card-image">
          <figure class="image is-4by3">
            <img
              src="${messages.json.source}"
              alt="Placeholder image">
          </figure>
        </div>
        <div class="columns is-mobile">
          <div class="column">
            <p class="total-votes has-background-black has-text-white is-pulled-left is-size-7-mobile is-size-6-tablet"
            style="margin-top: 1.0rem; margin-bottom: 0.5rem;"> Totaal aantal stemmen: ${totalVotes}
          </p>
          </div>
          <div class="column">
            <p class="starability-result has-background-black is-pulled-right"
            style="margin-top: 0.5rem; margin-bottom: 0.5rem;" data-rating=${averageVoteValue}>
          </p>
          </div>
        </div>
      </div>
    </div>
    <div class="column"></div>
    `
}


if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('dark side');
}


backbutton.addEventListener('click', () => {
  window.location = '/index.html';
})

getMessages();