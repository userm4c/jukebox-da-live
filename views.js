// Contagem de acessos por música, via Abacus (abacus.jasoncameron.dev) —
// serviço público gratuito, sem conta, sem backend próprio. Número pode ser
// inflado (sem proteção real contra bots), mas é suficiente pra ordenar a
// lista. (countapi.xyz, a escolha original, estava fora do ar — domínio sem
// resposta em dois resolvedores DNS diferentes.)
(function (global) {
  'use strict';
  var NAMESPACE = 'jukebox-da-live-misaemaria';
  var BASE = 'https://abacus.jasoncameron.dev';

  // Conta no máximo uma vez por aba/sessão, pra um simples F5 não inflar.
  function hit(slug) {
    try {
      var key = 'counted_' + slug;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch (e) {}
    fetch(BASE + '/hit/' + NAMESPACE + '/' + encodeURIComponent(slug)).catch(function () {});
  }

  // Resolve um mapa { slug: count }. Slugs sem contagem ainda viram 0.
  function getAll(slugs) {
    return Promise.all(slugs.map(function (slug) {
      return fetch(BASE + '/get/' + NAMESPACE + '/' + encodeURIComponent(slug))
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (data) { return { slug: slug, count: (data && typeof data.value === 'number') ? data.value : 0 }; })
        .catch(function () { return { slug: slug, count: 0 }; });
    })).then(function (results) {
      var map = {};
      results.forEach(function (r) { map[r.slug] = r.count; });
      return map;
    });
  }

  global.Views = { hit: hit, getAll: getAll };
})(window);
