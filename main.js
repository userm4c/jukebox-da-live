(function () {
  'use strict';

  var songs = (window.SONGS || []).slice().sort(function (a, b) { return (b.id || 0) - (a.id || 0); });
  var expandedId = null;
  var query = '';

  var listEl = document.getElementById('list');
  var countEl = document.getElementById('countLabel');
  var searchInput = document.getElementById('searchInput');

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : String(s);
    return d.innerHTML;
  }

  function matches(song, q) {
    if (!q) return true;
    var hay = ((song.nome || '') + ' ' + (song.letra || '')).toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function render() {
    var q = query.trim().toLowerCase();
    var filtered = songs.filter(function (s) { return matches(s, q); });

    countEl.textContent = songs.length === 0 ? '' :
      (filtered.length + ' de ' + songs.length + ' música' + (songs.length === 1 ? '' : 's'));

    if (songs.length === 0) {
      listEl.innerHTML = '<div class="empty"><div class="ico">🎶</div><h3>Ainda sem músicas</h3>' +
        '<p>Em breve o arquivo é preenchido pelo admin.</p></div>';
      return;
    }

    if (filtered.length === 0) {
      listEl.innerHTML = '<div class="empty"><div class="ico">🔍</div><h3>Nada encontrado</h3><p>Tenta outro termo de busca.</p></div>';
      return;
    }

    listEl.innerHTML = '';
    filtered.forEach(function (song, idx) {
      listEl.appendChild(renderTrack(song, idx + 1));
    });
  }

  function slugifyText(value) {
    var text = String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'musica';
  }

  function renderTrack(song, num) {
    var open = expandedId === song.id;
    var el = document.createElement('div');
    el.className = 'track' + (open ? ' open' : '');

    var titleSlug = slugifyText(song.nome || 'Sem título');
    var head = document.createElement('button');
    head.className = 'track-head';
    head.type = 'button';
    head.innerHTML =
      '<span class="track-num">' + String(num).padStart(2, '0') + '</span>' +
      '<span class="track-main">' +
        '<div class="track-title"><a href="musicas/' + titleSlug + '.html">' + esc(song.nome || 'Sem título') + '</a></div>' +
      '</span>' +
      '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
    head.addEventListener('click', function () {
      expandedId = open ? null : song.id;
      render();
    });
    el.appendChild(head);

    if (open) {
      var body = document.createElement('div');
      body.className = 'track-body';

      var audioBlock = document.createElement('div');
      if (song.audio) {
        audioBlock.innerHTML = '<div class="field-label">Tocar</div>' +
          '<audio controls controlsList="nodownload noplaybackrate" preload="none" src="' + esc(song.audio) + '"></audio>';
      } else {
        audioBlock.innerHTML = '<div class="field-label">Tocar</div><div class="no-audio">Ainda sem áudio enviado pra esta música.</div>';
      }
      body.appendChild(audioBlock);

      if (song.descricao) {
        var descBlock = document.createElement('div');
        descBlock.innerHTML = '<div class="field-label">Sobre</div><div class="desc">' + esc(song.descricao) + '</div>';
        body.appendChild(descBlock);
      }

      if (song.videoFonte) {
        var linkBlock = document.createElement('div');
        linkBlock.innerHTML = '<div class="field-label">Origem</div>' +
          '<a class="srclink" href="' + esc(song.videoFonte) + '" target="_blank" rel="noopener">' +
          '▶ Ver o vídeo que gerou essa música</a>';
        body.appendChild(linkBlock);
      }

      var lyricsBlock = document.createElement('div');
      lyricsBlock.innerHTML = '<div class="field-label">Letra</div><div class="lyrics">' + esc(song.letra || '') + '</div>';
      body.appendChild(lyricsBlock);

      el.appendChild(body);
    }

    return el;
  }

  searchInput.addEventListener('input', function (e) {
    query = e.target.value;
    render();
  });

  render();
})();
