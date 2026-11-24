// Il buono proibito del giorno: un buono fisso per ogni data, «Pesca un altro» a caso, ?b=N per condividerne uno preciso
(function () {
  var L = window.BUONI || [];
  if (!L.length) return;
  var $ = function (id) { return document.getElementById(id); };
  var img = $('g-img'), testo = $('g-testo'), quando = $('g-quando'), nota = $('g-nota'), scarica = $('g-scarica');
  var oggi = new Date();
  var giorni = Math.floor(Date.UTC(oggi.getFullYear(), oggi.getMonth(), oggi.getDate()) / 864e5);
  var cur = (giorni * 17) % L.length;
  var m = /[?&]b=(\d+)/.exec(location.search);
  var preciso = false;
  if (m && +m[1] >= 1 && +m[1] <= L.length) { cur = +m[1] - 1; preciso = true; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function file(b) { return '../../assets/buoni/b' + (b.n < 10 ? '0' : '') + b.n + '.jpg'; }
  function mostra(i, etichetta) {
    var b = L[i]; cur = i;
    img.src = file(b); img.alt = 'Buono proibito: ' + b.t + '. ' + b.d;
    scarica.href = file(b);
    testo.innerHTML = '<strong>' + esc(b.t) + '</strong> &middot; ' + esc(b.c) + '<br>' + esc(b.d);
    quando.textContent = etichetta;
    nota.innerHTML = b.g ? 'Questo buono &egrave; tra i <a href="../index.html">5 gratis da stampare</a>.'
      : 'Questo buono &egrave; nel carnet <a href="../index.html#carnet">Buoni proibiti</a>, insieme ad altri 49.';
  }
  mostra(cur, preciso ? 'Un buono per te' : 'Il buono di oggi');
  $('g-altro').addEventListener('click', function () {
    var j; do { j = Math.floor(Math.random() * L.length); } while (j === cur && L.length > 1);
    mostra(j, 'Pescato a caso');
  });
  $('g-condividi').addEventListener('click', function () {
    var b = L[cur], url = location.origin + location.pathname + '?b=' + b.n;
    var dati = { title: 'Buono proibito: ' + b.t, text: 'Ho un buono proibito per te: «' + b.t + '». ' + b.d, url: url };
    if (navigator.share) { navigator.share(dati).catch(function () {}); return; }
    var fatto = function () { nota.textContent = 'Link copiato: incollalo dove vuoi.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(dati.text + ' ' + url).then(fatto, function () { prompt('Copia il link:', url); });
    else prompt('Copia il link:', url);
  });
})();
