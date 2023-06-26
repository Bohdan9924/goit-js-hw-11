import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector(".search-form");
const galleryEl = document.querySelector(".gallery");
const moreBtnEl = document.querySelector(".more-btn");

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
    const totalHits = result.totalHits;

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
        galleryRun(images);
        loadPage(images.length === QUANTITY_IMG);
    }
    catch {
    Notiflix.Notify.failure('Failed to fetch images. Please try again.');
  }
}