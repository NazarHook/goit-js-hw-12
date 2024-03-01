import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';
import { renderCards } from './js/render-functions.js';

const loader = document.querySelector('.loader');
const form = document.querySelector('.form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more-btn');
let currentPage = 1;
let totalHits = 0;
let totalPages = 0
let currentQuery = '';
let firstLoad = true;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  loader.style.display = 'inline-block';

  if (!query || query.length < 3) {
    iziToast.error({
      message: 'Search query must be at least 3 characters long',
      position: 'topRight',
    });
    loader.style.display = 'none';
    return;
  }

  try {
    const result = await fetchImages(query);
    currentQuery = query;
    totalHits = result.totalHits;

    renderCards(result.images, gallery, firstLoad);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    toggleLoadMoreButton(totalHits > currentPage * 15);
    firstLoad = false;
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
    form.reset();
  }
});

loadMoreButton.addEventListener('click', async () => {
  loader.style.display = 'inline-block';
  currentPage++;

  try {
    const result = await fetchImages(currentQuery, currentPage);

    renderCards(result.images, gallery, firstLoad);
    const lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    lightbox.refresh();

    toggleLoadMoreButton(totalHits > currentPage * 15);
    firstLoad = false;
  } catch (error) {
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
});

function toggleLoadMoreButton(show) {
  loadMoreButton.style.display = show && currentPage < totalPages ? 'block' : 'none';
}


async function fetchImages(query, page = 1) {
  const KEY = '42555164-0de9ae952fe9eb05e418ffbde';
  const perPage = 15;

  const url = `https://pixabay.com/api/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(url);

    if (response.data.hits.length === 0) {
      // Notify user when no images found
      iziToast.info({
        message: 'No images found',
        position: 'topRight',
      });
      
      // Clear the gallery
      gallery.innerHTML = '';
      totalPages = 0; // Reset totalPages
    } else {
      totalPages = Math.ceil(response.data.totalHits / perPage); // Set totalPages
    }

    return {
      images: response.data.hits,
      totalHits: response.data.totalHits,
      totalPages: totalPages,
    };
  } catch (error) {
    console.error('Error during search:', error.message);
    iziToast.error({
      title: 'Error',
      message: 'An error occurred during the search',
      position: 'topRight',
    });
    return {
      images: [],
      totalHits: 0,
      totalPages: 0,
    };
  }
}
