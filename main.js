const kleiesFBPictures = document.querySelector('.kleies-fb-pictures');
const images = document.querySelector('.image');
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');


const fb = 'http://192.168.99.207:3000/fb'

test();

async function test() {
  const response = await fetch(`${fb}`);
  const json = await response.json();
  console.log(json)

  json.forEach(element => {
    // console.log(element.source);
    kleiesFBPictures.innerHTML +=
      `<div class="column is-inline-block-mobile is-6-mobile is-4-tablet is-3-desktop is-2-widescreen">
        <div class="card">
          <div class="card-image">
          <figure class="image is-1by1">
          <!-- <a href="${element.source}" target="_blank"> </a> -->
          <img src="${element.source}" alt="Placeholder image">
          </figure>
          <div class="card-content has-background-black">
            <p
              class="subtitle is-6 has-background-black has-text-centered has-text-white has-text-weight-bold">
              ${element.name}</p>
          </div>
        </div>
      </div>
      `
  });
}

kleiesFBPictures.addEventListener('click', (element) => {
  modal.classList.add('is-active');
  modal.classList.add('is-clipped');
  console.log(element.target.src)
  images.getElementsByTagName('img')[0].src = element.target.src
  console.log(element);
})

modalClose.addEventListener('click', () => {
  modal.classList.remove('is-active');
  modal.classList.remove('is-clipped');
})

if (window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches) {
  console.log('dark side');

}