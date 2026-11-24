// "Indovina la parolaccia": 10 domande casuali, mai ripetute nella stessa partita
(function () {
  var box = document.getElementById('quiz');
  if (!box || !window.VOCI) return;
  var N = 10;

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, ''); }
  function mescola(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // tutte le voci (q !== 0), senza doppioni di espressione o di significato
  var visteE = {}, pool = [];
  window.VOCI.forEach(function (v, i) {
    if (v.q === 0) return;
    var ke = norm(v.e);
    if (visteE[ke]) return;
    visteE[ke] = 1;
    v.id = i; v.k = v.k || ('u' + i);
    pool.push(v);
  });
  var tutte = window.VOCI.map(function (v, i) { v.k = v.k || ('u' + i); return v; });

  var FRASI = [
    [0, 'Mannaggia! Con queste parole al massimo ordini un caffè. Ripassa il dizionario e riprova.'],
    [3, 'Turista educato: capisci quando ti insultano, ma solo dal tono di voce.'],
    [5, 'Discreto! Al bar ti servono senza guardarti storto.'],
    [7, 'Notevole: le nonne di mezza Italia sarebbero fiere di te (e un po\' preoccupate).'],
    [9, 'Quasi perfetto: ti manca solo il gesto con la mano.'],
    [10, 'Dieci su dieci! Sei un dizionario ambulante del turpiloquio: Flavia ti stima moltissimo.']
  ];

  var domande, i, punti, rispostaData;

  function opzioni(v) {
    var scelte = [v], kUsati = {}, tUsati = {};
    kUsati[v.k] = 1; tUsati[norm(v.t)] = 1;
    var cand = mescola(tutte.slice());
    for (var c = 0; c < cand.length && scelte.length < 4; c++) {
      var x = cand[c], nt = norm(x.t);
      if (kUsati[x.k] || tUsati[nt]) continue;
      kUsati[x.k] = 1; tUsati[nt] = 1;
      scelte.push(x);
    }
    return mescola(scelte);
  }

  function nuovaPartita() {
    domande = mescola(pool.slice()).slice(0, N);
    i = 0; punti = 0;
    mostra();
  }

  function mostra() {
    var v = domande[i];
    rispostaData = false;
    var ops = opzioni(v);
    var h = '<div class="stato"><span>Domanda ' + (i + 1) + ' di ' + N + '</span><span>Punti: ' + punti + '</span></div>' +
      '<div class="barra" aria-hidden="true"><i style="width:' + (i / N * 100) + '%"></i></div>' +
      '<p class="domanda">In ' + esc(v.d) + ', che cosa vuol dire:</p>' +
      '<p class="parola">«' + esc(v.e) + '»</p>' +
      '<div class="opzioni" role="group" aria-label="Risposte possibili">';
    ops.forEach(function (o) {
      h += '<button type="button" data-ok="' + (o === v ? 1 : 0) + '">' + esc(o.t) + '</button>';
    });
    h += '</div><div class="esito" aria-live="polite"></div>';
    box.innerHTML = h;
    [].forEach.call(box.querySelectorAll('.opzioni button'), function (b) { b.addEventListener('click', rispondi); });
    var primo = box.querySelector('.opzioni button');
    if (i > 0 && primo) primo.focus({ preventScroll: true });
  }

  function rispondi(ev) {
    if (rispostaData) return;
    rispostaData = true;
    var b = ev.currentTarget, ok = b.getAttribute('data-ok') === '1', v = domande[i];
    [].forEach.call(box.querySelectorAll('.opzioni button'), function (x) {
      x.disabled = true;
      if (x.getAttribute('data-ok') === '1') x.classList.add('giusta');
    });
    if (ok) punti++; else b.classList.add('sbagliata');
    var es = box.querySelector('.esito');
    es.innerHTML = '<p><strong>' + (ok ? 'Esatto!' : 'Eh no!') + '</strong> «' + esc(v.e) + '» significa «' + esc(v.t) + '». ' +
      (v.n ? esc(v.n) + ' ' : '') + '<a href="' + esc(v.p) + '">Leggi la voce</a></p>' +
      '<button type="button" class="btn rosa" id="avanti">' + (i + 1 < N ? 'Avanti →' : 'Vedi il punteggio') + '</button>';
    box.querySelector('.stato span:last-child').textContent = 'Punti: ' + punti;
    var av = document.getElementById('avanti');
    av.addEventListener('click', function () { i++; if (i < N) mostra(); else fine(); });
    av.focus({ preventScroll: true });
  }

  function fine() {
    var frase = FRASI[0][1];
    FRASI.forEach(function (f) { if (punti >= f[0]) frase = f[1]; });
    box.innerHTML = '<div class="finale"><p class="domanda">Il tuo punteggio</p><p class="punti">' + punti + '/' + N + '</p>' +
      '<p class="frase">' + esc(frase) + '</p>' +
      '<button type="button" class="btn rosa" id="rigioca">Rigioca</button></div>';
    var r = document.getElementById('rigioca');
    r.addEventListener('click', function () { nuovaPartita(); box.scrollIntoView({ block: 'start' }); });
    r.focus({ preventScroll: true });
  }

  window.QUIZ_TEST = function () { return domande.map(function (d) { return d.e; }); };
  nuovaPartita();
})();
