const stars = document.querySelectorAll("input[id^='first-rate']");
const button = document.querySelector('.sendbutton');
const backbutton = document.querySelector('.backbutton');
const form = document.querySelector('fieldset');
const fbimage = document.querySelector('.fb-image')
const fbmessage = document.querySelector('.fb-messages');
const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background');
const closeModalButton = document.querySelector('.modal-close')

const sendURL = 'https://api.kleies.nl/input'
const reviewURL = 'https://api.kleies.nl/message'


stars.forEach(star => {
  star.addEventListener('click', (e) => {
    starRating = e.target.value
  });
})


document.addEventListener('submit', e => {

  e.preventDefault();

  let formdata = {}

  const urlParams = new URLSearchParams(location.search);
  for (const value of urlParams.values()) {
    formdata['FBid'] = value
  };

  if (typeof starRating == 'undefined') {
    modal.classList.add('is-active');
    modal.classList.add('is-clipped');
    modal.classList.add('starRatingNot');

    const starRatingNot = document.querySelector('.starRatingNot')

    starRatingNot.addEventListener('click', () => {
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      const body = document.body;
      body.style.top = `-${scrollY}`;
      return false;
    });
  };

  if (typeof starRating !== 'undefined') {
    modal.classList.add('is-active');
    modal.classList.add('is-clipped');
    modal.classList.add('messageCompleted');

    const messageCompleted = document.querySelector('.messageCompleted')
    messageCompleted.addEventListener('click', () => {
      formdata['name'] = e.target['name'].value;
      formdata['message'] = e.target['message'].value;
      formdata['rating'] = starRating;
      connect(formdata);
      document.getElementById("messageForm").reset();
      return true;
    });
  }
  const mediaModal = document.querySelector('.media-modal')
  if (modal.classList.contains('messageCompleted')) {
    mediaModal.innerHTML = `
    <p>Thanks for your message</p>
    `
  } else {
    mediaModal.innerHTML = `
      <p>Give atleast a Star Rating</p>
      `
  }
  return false
})


async function connect(formData) {
  // console.log(formData)
  const options = {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'content-type': 'application/json'
    },
  }

  const data = await fetch(sendURL, options)
  const json = await data.json()
  if (json.message == "Success") {
    console.log('Sended to server');
    fbmessage.innerHTML = '';
    location.reload();
  } else {
    console.log(json);
  }
};

async function getMessages() {
  const urlParams = new URLSearchParams(location.search);
  let valueofMesssage;
  for (const blabla of urlParams.values()) {
    valueofMesssage = blabla
  };
  const response = await fetch(`${reviewURL}?id=${valueofMesssage}`);
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
       <div class="columns is-mobile">
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
     </div>
    `
  });

  totalVotes = messages.entrys.length
  fbimage.innerHTML =
    `
    <div class="column"></div>
    <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd">
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

function closeModal() {
  modal.classList.remove('is-active');
  modal.classList.remove('is-clipped');
  const body = document.body;
  const scrollY = body.style.top;
  body.style.position = '';
  body.style.top = '';
  window.scrollTo(0, parseInt(scrollY || '0') * -1);
};



closeModalButton.addEventListener('click', function (e) {
  if (modal.classList.contains('is-active')) {
    closeModal()
  }
});

window.addEventListener('click', function (e) {
  if (e.target == modalBackground) {
    closeModal()
  }
});


if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('dark side');
}


backbutton.addEventListener('click', () => {
  window.location = '/index.html';
})

getMessages();