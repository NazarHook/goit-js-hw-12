import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/pixabay-api.js';
import { renderCards } from './js/render-functions.js';

const loader = document.querySelector('.loader');
const form = document.querySelector('.form');
const input = document.querySelector('.search-input');
const gallery = '.gallery';
const loadMoreButton = document.querySelector('.load-more-btn');
let currentPage = 1;
let totalHits = 0;
let currentQuery = '';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  loader.style.display = 'inline-block';

  if (query.length < 3) {
    iziToast.error({
      message: 'Search query must be at least 3 characters long',
      position: 'topRight',
    });
    loader.style.display = 'none';
    return;
  }

  if (query === '') {
    iziToast.show({
      message: 'Please write what you want to search',
      position: 'topRight',
      color: 'red',
    });
    loader.style.display = 'none';
    return;
  }

  try {
    const result = await fetchImages(query);
    const newTotalHits = result.totalHits;
    currentQuery = query;
    totalHits = newTotalHits;

    renderCards(result.images, gallery);
    gallery.innerHTML = '';

    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    // Toggle load more button based on totalHits and currentPage
    toggleLoadMoreButton(newTotalHits > currentPage * 15);

    // Smooth scroll after rendering images
    const cardHeight = getGalleryCardHeight();
    window.scrollBy(0, cardHeight * 2); // Scroll by two card heights
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
    form.reset();
  }
});

loadMoreButton.addEventListener('click', async () => {
  loader.style.display = 'inline-block';

  try {
    currentPage++;
    const result = await fetchImages(currentQuery, currentPage);
    renderCards(result.images, gallery);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    // Toggle load more button based on totalHits and currentPage
    toggleLoadMoreButton(totalHits > currentPage * 15);

    // Smooth scroll after rendering images
    const cardHeight = getGalleryCardHeight();
    window.scrollBy(0, cardHeight * 2); // Scroll by two card heights
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
});

function toggleLoadMoreButton(show) {
  loadMoreButton.style.display = show ? 'block' : 'none';
}

function getGalleryCardHeight() {
  // Get the height of one gallery card
  const card = document.querySelector(`${gallery} a`);
  const cardRect = card.getBoundingClientRect();
  return cardRect.height;
}
