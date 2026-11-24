// Stampa di una sola tavola: imposta body[data-stampa] e apre la finestra di stampa
(function () {
  function imposta(n) { if (n) document.body.setAttribute('data-stampa', n); else document.body.removeAttribute('data-stampa'); }
  [].forEach.call(document.querySelectorAll('[data-stampa-tavola]'), function (b) {
    b.addEventListener('click', function () {
      imposta(b.getAttribute('data-stampa-tavola'));
      window.print();
    });
  });
  window.addEventListener('afterprint', function () { imposta(null); });
  var m = /^#stampa-(\d)$/.exec(location.hash);
  if (m) imposta(m[1]);
})();
