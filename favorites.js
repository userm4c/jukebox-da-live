// Favoritos do visitante — guardados só no navegador dele (localStorage),
// sem backend. Usado tanto pela home (main.js) quanto pelas páginas de
// música geradas (generate_song_pages.py).
(function (global) {
  'use strict';
  var KEY = 'jukebox_favorites';

  function getFavorites() {
    try {
      var raw = localStorage.getItem(KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function isFavorite(id) {
    return getFavorites().indexOf(id) !== -1;
  }

  // Retorna o novo estado (true = favoritado agora).
  function toggleFavorite(id) {
    var favs = getFavorites();
    var idx = favs.indexOf(id);
    if (idx === -1) favs.push(id); else favs.splice(idx, 1);
    try { localStorage.setItem(KEY, JSON.stringify(favs)); } catch (e) {}
    return idx === -1;
  }

  global.Favorites = { getFavorites: getFavorites, isFavorite: isFavorite, toggleFavorite: toggleFavorite };
})(window);
