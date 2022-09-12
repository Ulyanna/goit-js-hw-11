import './css/styles.css';
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";

import Notiflix from 'notiflix';
import "notiflix/dist/notiflix-3.2.5.min.css";
import PicturesAPIService from './pictures-service/pictures_service_api'




const refs = {
    searchForm: document.querySelector('.search-form'),
    picturesContainer: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.load-more')
}

const picturesAPIService = new PicturesAPIService();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
    e.preventDefault()
    
    picturesAPIService.query = e.currentTarget.elements.searchQuery.value;
    picturesAPIService.resetPage()
     refs.loadMoreBtn.classList.add('ishidden')
    picturesAPIService.fetchPictures().then((pictures) => {
        if (pictures.length === 0) {
            Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.');
        }
        clearPicturesContainer()
        const markUp = createPicturesMarkup(pictures);
        appendPicturesCardMarcup(markUp);
        refs.loadMoreBtn.classList.remove('ishidden')
           lightbox = new SimpleLightbox('.gallery a', {
               captionsData: 'alt',
               captionDelay: 250,
});

})
  .catch(error => console.log(error));
 
    
}

function onLoadMore(e) {
    picturesAPIService.fetchPictures().then((pictures) => {
        const markUp = createPicturesMarkup(pictures);
        appendPicturesCardMarcup(markUp);
        
        lightbox.refresh()
})
  .catch(error => console.log(error));
}

function appendPicturesCardMarcup(markUp) {
    refs.picturesContainer.insertAdjacentHTML('beforeend', markUp )
}

function createPicturesMarkup(pictures) {
  return pictures
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');
}

function clearPicturesContainer() {
refs.picturesContainer.innerHTML = '';
}

