export function renderCards(images, gallery) {

  images.forEach((image, index) => {
    const cardMarkup = createCardMarkup(image);
    gallery.insertAdjacentHTML('beforeend', cardMarkup);

    // Scroll to the last appended image
    if (index === images.length - 1) {
      const lastImage = gallery.lastElementChild;
      lastImage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
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
