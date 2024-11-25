import PreviewView from './previewView.js';

class BookmarkView extends PreviewView {
  _parentEl = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
  _message = '🚀💪🏆🎉';

  addHandlerLocalStorageBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
