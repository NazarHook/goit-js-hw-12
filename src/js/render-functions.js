
import iziToast from 'izitoast';
import * as basicLightbox from 'basiclightbox'

export function renderCards(images, galleryElement) {
  const gallery = document.querySelector(galleryElement);
  gallery.innerHTML = '';

  images.forEach((image) => {
    const cardMarkup = createCardMarkup(image);
    gallery.insertAdjacentHTML('beforeend', cardMarkup);
  });
}

function createCardMarkup(image) {
  return `
    <div class="card" data-large-image="${image.largeImageURL}">
      <a href="${image.largeImageURL}">
        <img src="${image.webformatURL}" class="card-img" alt="${image.tags}">
      </a>
      <ul class="img-info">
        <li class="img-info-item">Likes: ${image.likes}</li>
        <li class="img-info-item">Views: ${image.views}</li>
        <li class="img-info-item">Comments: ${image.comments}</li>
        <li class="img-info-item">Downloads: ${image.downloads}</li>
      </ul>
    </div>
  `;
}