import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const galleryEl = document.querySelector('.gallery');
const moreBtnEl = document.querySelector('.more-btn');

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '37824145-be18cc7d6cb834b81dd7f47f7';
const QUANTITY_IMG = 40;

let counterPage = 1;
let totalHits = 0;

async function fetchImages(searchQuery, page) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: QUANTITY_IMG,
        page: page,
      },
    });

    const result = response.data;
    totalHits = result.totalHits; 

    if (totalHits === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (page === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    }

    return result.hits;
  } catch (error) {
    console.error(error.message);
    throw new Error('Failed to fetch images.');
  }
}

async function fetchSearch(e) {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  counterPage = 1;

  try {
    const images = await fetchImages(searchQuery, counterPage);
    galleryRan(images);
    loadPage(images.length === QUANTITY_IMG);
  } catch {
    Notiflix.Notify.failure('Failed to fetch images. Please try again.');
  }
}

function galleryRan(images) {
  if (counterPage === 1) {
    galleryEl.innerHTML = '';
  }
  const galleryMarkup = images
    .map(
      (image) =>
        `<div class="photo-card">
          <a class="gallery__link" href="${image.largeImageURL}">
            <img class="content-img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${image.likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${image.views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${image.downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', galleryMarkup); 
}

function loadPage(show) {
  if (show) {
    moreBtnEl.style.display = 'block'; 
  } else {
    moreBtnEl.style.display = 'none'; 
  }
}

async function loadMore() {
  counterPage += 1; 
  const searchQuery = formEl.searchQuery.value;

  try {
    const images = await fetchImages(searchQuery, counterPage);
    galleryRan(images);
    loadPage(images.length === QUANTITY_IMG);

    if (counterPage * QUANTITY_IMG >= totalHits) {
      moreBtnEl.style.display = 'none'; 
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch {
    Notiflix.Notify.failure(
      'Failed to fetch more images. Please try again.'
    );
  }
}

function onClick(e) {
  e.preventDefault();
  const lightbox = new SimpleLightbox('.gallery a');
  galleryEl.removeEventListener('click', onClick);
}

formEl.addEventListener('submit', fetchSearch);
galleryEl.addEventListener('click', onClick);
moreBtnEl.addEventListener('click', loadMore);
