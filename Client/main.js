const kleiesFBPictures = document.querySelector('.kleies-fb-pictures');
const images = document.querySelector('.image');
const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background')
const closeModalButton = document.querySelector('.modal-close')
const modalImage = document.querySelector('.modal-image')
const body = document.querySelector('body');
const backbutton = document.querySelector('.backbutton');
const stars = document.querySelectorAll("input[id^='first-rate']");
const button = document.querySelector('.sendbutton');
const fbmessage = document.querySelector('.fb-messages');
const modalCard = document.querySelector('.modal-card-body')
const divVotes = document.querySelector('.div-votes')


const textarea = document.querySelector('.textarea-message')
const name = document.querySelector('.input-name')

let data = {};
let formdata = {}


const internetURL = 'https://api.kleies.nl/fb'
const intranetURL = 'http://192.168.99.207:3030/fb'
const reviewURL = 'http://kleies.nl/message.html'
const localURL = 'http://192.168.99.207:5500/Client/message.html'

const sendURL = 'https://api.kleies.nl/input'
const getURL = 'https://api.kleies.nl/message'

const localsendURL = 'http://192.168.99.207:3030/input'
const localgetURL = 'http://192.168.99.207:3030/message'

stars.forEach(star => {
  star.addEventListener('click', (e) => {
    starRating = e.target.value
  });
})

const getData = async () => {
  if (getData.fired) return;
  getData.fired = true;
  const response = await fetch(`${internetURL}`);
  const data = await response.json();
  
  
  data.forEach(element => {
    kleiesFBPictures.innerHTML +=
      `<div class="column is-inline-block-mobile is-6-mobile is-2-tablet is-2-desktop is-2-widescreen is-1-fullhd has-background-red">
        <div class="card">
          <figure class="image is-1by1 select-image">
          <img src="${element.source}" id="${element.id}" alt="Placeholder image">
          </figure>
          <div class="card-content has-background-black">
            <p
              class="subtitle cardTitle is-size-7 has-background-black has-text-centered has-text-white has-text-weight-bold">
              ${element.name}</p>
          </div>
        </div>
      </div>
      `
  });
  const cards = document.querySelectorAll('.select-image');
  const modalCardTitle = document.querySelector('.modal-card-title');


  for (const card of cards) {
    card.addEventListener('click', (element) => {
      console.log(element);
      
      kleiesFBPictures.style.display = 'none';
      modal.classList.add('is-active');
      modal.classList.add('is-clipped');
      modal.id = `${element.target.id}`
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      const body = document.body;
      body.style.top = `-${scrollY}`;
      images.getElementsByTagName('img')[0].src = element.target.src
      modalCardTitle.childNodes[0].nodeValue = card.parentNode.getElementsByTagName('p')[0].innerHTML.trim()
      
      getMessages(element.target.id);
      modalCard.scrollTop = 10;
      
    })
  };

};

function closeModal() {
  kleiesFBPictures.style.display = '';
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

window.onload = function () {
  var scrollY = parseInt('<%=Request.Form["scrollY"] %>');
  if (!isNaN(scrollY)) {
    window.scrollTo(0, scrollY);
  }
};

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
});

backbutton.addEventListener('click', () => {
  if (modal.classList.contains('is-active')) {
    closeModal()
  }
});


async function connect(formData) {
  const options = {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
      'content-type': 'application/json'
    },
  }

  const data = await fetch(localsendURL, options)
  const json = await data.json()
  if (json.message == "Success") {
    console.log('Sended to server');
    name.value = '';
    textarea.value = '';
    starRating = '';
  } else {
    console.log(json);
  }
};



document.getElementById('reviewForm').addEventListener('submit', async function (e) {
  
  e.preventDefault();
  e.stopPropagation()

  formdata['FBid'] = modal.id;
  formdata['name'] = name.value;
  formdata['message'] = textarea.value;
  
  if (typeof starRating == 'undefined') {
    alert('Please give atleast a star rating before sending the data to the server')
    return false;
  } else {
    formdata['rating'] = starRating;
  }
  connect(formdata);
  getMessages(modal.id);

  return false
});





async function getMessages(id) {

  console.log(id);
  
  const response = await fetch(`${localgetURL}?id=${id}`);
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
        <div class="column">
         <div class="card-content has-background-red">
         <div class="media">
           <div class="media-content">
             <p class="subtitle is-size-7 has-text-weight-bold is-6 is-clipped">${textmessage.name}</p>
           </div>
         </div>
         <div class="content is-size-6" style="word-wrap: break-word;">
         ${textmessage.message}
           <br>
           <time class="subtitle is-size-7 is-pulled-right" datetime=${textmessage.timestamp}>${textmessage.timestamp}</time>
         </div>
      </div>
    `
  });

  totalVotes = messages.entrys.length
  divVotes.innerHTML = `
    <p class="total-votes has-background-black has-text-white is-pulled-left is-size-7-mobile is-size-6-tablet"
      style="margin-top: 1.0rem; margin-bottom: 0.5rem;"> Totaal aantal stemmen: ${totalVotes}
    </p>
    <p class="starability-result has-background-black is-pulled-right average-stars"
      style="margin-top: 0.5rem; margin-bottom: 0.5rem;" data-rating=${averageVoteValue}>
    </p>
  `
  
}


getData();