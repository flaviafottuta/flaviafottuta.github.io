// Ricerca istantanea nel dizionario dei dialetti
(function () {
  var inp = document.getElementById('cerca');
  if (!inp) return;
  var voci = [].slice.call(document.querySelectorAll('.voce'));
  var sezioni = [].slice.call(document.querySelectorAll('.lettera'));
  var lettere = [].slice.call(document.querySelectorAll('.alfabeto a'));
  var cont = document.getElementById('conteggio');
  var vuoto = document.getElementById('vuoto');
  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }
  voci.forEach(function (v) {
    v._titolo = norm(v.querySelector('h3').textContent + ' ' + v.querySelector('.trad').textContent);
    v._tutto = norm(v.textContent);
  });
  function filtra() {
    var q = norm(inp.value), parole = q ? q.split(' ') : [], n = 0;
    voci.forEach(function (v) {
      var ok = parole.every(function (w) { return v._tutto.indexOf(w) > -1; });
      v.hidden = !ok;
      if (ok) n++;
    });
    sezioni.forEach(function (s) {
      var vis = !!s.querySelector('.voce:not([hidden])');
      s.hidden = !vis;
      var a = document.querySelector('.alfabeto a[href="#' + s.id + '"]');
      if (a) a.classList.toggle('spento', !vis);
    });
    if (cont) cont.textContent = q ? (n === 1 ? '1 espressione trovata' : n + ' espressioni trovate') : voci.length + ' espressioni in questa pagina';
    if (vuoto) vuoto.hidden = n > 0;
  }
  inp.addEventListener('input', filtra);
  var m = /[?&]q=([^&]+)/.exec(location.search);
  if (m) { try { inp.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (e) {} }
  filtra();
})();
