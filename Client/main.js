const kleiesFBPictures = document.querySelector('.kleies-fb-pictures');
const images = document.querySelector('.image');
const modal = document.querySelector('.modal');
const modalBackground = document.querySelector('.modal-background')
const closeModalButton = document.querySelector('.modal-close')
const modalImage = document.querySelector('.modal-image')
const body = document.querySelector('body');
const reviewBtn = document.querySelector('.reviewButton')

let data = {};


const internetURL = 'https://api.kleies.nl/fb'
const intranetURL = 'http://localhost:3030/fb'
const reviewURL = 'http://kleies.nl/message.html'

const getData = async () => {
  if (getData.fired) return;
  getData.fired = true;
  const response = await fetch(`${internetURL}`);
  const data = await response.json();

  data.forEach(element => {
    kleiesFBPictures.innerHTML +=
      `<div class="column is-inline-block-mobile is-6-mobile is-4-tablet is-3-desktop is-2-widescreen has-background-red">
        <div class="card">
          <figure class="image is-1by1">
          <img src="${element.source}" id="${element.id}" alt="Placeholder image" class="select-image">
          </figure>
          <div class="card-content has-background-black">
            <p
              class="subtitle is-size-7 has-background-black has-text-centered has-text-white has-text-weight-bold">
              ${element.name}</p>
          </div>
        </div>
      `
  });
  const cards = document.querySelectorAll('.select-image');

  for (const card of cards) {
    card.addEventListener('click', async (element) => {
      kleiesFBPictures.style.display = 'none';
      modal.classList.add('is-active');
      modal.classList.add('is-clipped');
      modal.id = `${element.target.id}`
      const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
      const body = document.body;
      body.style.top = `-${scrollY}`;
      images.getElementsByTagName('img')[0].src = element.target.src
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

reviewBtn.addEventListener('click', async (e) => {
  const fbid = modal.id;
  window.location = `${reviewURL}?id=${fbid}`
})


getData();