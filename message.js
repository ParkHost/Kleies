const stars = document.querySelectorAll("input[id^='first-rate']");
const button = document.querySelector('.sendbutton');
const backbutton = document.querySelector('.backbutton');
const form = document.querySelector('fieldset');
const fbimage = document.querySelector('.fb-image')
const fbmessage = document.querySelector('.fb-messages');

const sendURL = 'https://kleies.herokuapp.com/input'
const reviewURL = 'https://kleies.herokuapp.com/message'


stars.forEach(star => {
  star.addEventListener('click', (e) => {
    starRating = e.target.value
  });
})

// document.querySelectorAll('input').forEach( input => {

//   console.log(input.value)
  
// });


document.addEventListener('submit', e => {
  console.log('submit event');
  // document.querySelectorAll('input').forEach( input => {
  //   console.log(input.value)  
  // })
  let formdata = {}
  console.log(starRating)

  if (typeof starRating == 'undefined') {
    alert('Please give some Rating')
  }


  const urlParams = new URLSearchParams(location.search);
  for (const value of urlParams.values()) {
    console.log(value);
    formdata['FBid'] = value
  };

  if (typeof starRating !== 'undefined') {
    formdata['name'] = e.target['name'].value;
    formdata['message'] = e.target['message'].value;
    formdata['rating'] = starRating;
    console.log('button clicked')
    connect(formdata)
    console.log(formdata)
    e.preventDefault();
    document.getElementById("messageForm").reset();
  }
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
  console.log(options);
  
  const data = await fetch(sendURL, options)
  const json = await data.json()
  console.log(json);
  if (json.message == "Success") {
    console.log('hi success received client side')
  }
};

async function getMessages() {
  const urlParams = new URLSearchParams(location.search);
  for (const value of urlParams.values()) {
    const response = await fetch(`${reviewURL}?id=${value}`);
    const messages = await response.json()
    console.log(messages);

    let messageRatings = []
    let textmessages = [];

    messages.entrys.forEach(message => {
      if(typeof message.rating !== 'undefined') {
        messageRatings.push(message.rating);
      }
      if(message.name !== "" || message.message !== "") {
        textmessages.push(message)
        // messageData['message'] += message;
      }
    })

    // console.log(messageRatings);
    if (messageRatings.length < 1) {
       averageVoteValue = 0
    } else {
      let numberVotes = messageRatings.map(v => parseInt(v, 10));
      let votevalues = numberVotes.reduce((a,b) => a + b)
      averageVoteValue = Math.floor(votevalues / messages.entrys.length);
    }
    // const averageVoteValue = Math.floor(votevalues / messages.entrys.length);
    
    
    textmessages.forEach(textmessage => {
       fbmessage.innerHTML += `
       <div class="columns is-mobile">
       <div class="column"></div>
       <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop">
         <div class="card-content has-background-red">
           <div class="media">
             <div class="media-content">
               <p class="title is-6">${textmessage.name}</p>
             </div>
           </div>
           <div class="content">
           ${textmessage.message}
             <br>
             <time class="is-size-7 is-pulled-right" datetime=${textmessage.timestamp}>${textmessage.timestamp}</time>
           </div>
         </div>
       </div>
       <div class="column"></div>
       </div>
       `
    })
    
    totalVotes = messages.entrys.length
    fbimage.innerHTML =
    `
    <div class="column"></div>
    <div class="column is-three-quarters-mobile is-two-thirds-tablet is-half-desktop">
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
            <p class="total-votes has-background-black has-text-white is-pulled-left"
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
}

backbutton.addEventListener('click', e => {
  window.location = '/Kleies/'; 
})

getMessages();