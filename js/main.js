/* ==========================================================
   CONFIGURAÇÃO DO SITE — edite somente aqui
   ========================================================== */
var SITE = {
  // WhatsApp do escritório: DDI + DDD + número, só dígitos
  whatsapp: '5522997581149',
  whatsappMessage: 'Olá! Vim pelo site da Pontes & Serafini e gostaria de mais informações sobre atendimento previdenciário.',

  // Prova social — preencher SOMENTE após confirmar no perfil do Google.
  // Enquanto vazios, o site mostra [GOOGLE_RATING] e [GOOGLE_REVIEWS_COUNT].
  googleRating: '',        // ex.: '4,9'
  googleReviewsCount: '',  // ex.: '18'
  // Link direto para as avaliações (perfil do Google do escritório).
  // Enquanto vazio, abre uma busca pelo escritório no Google Maps.
  googleReviewsUrl: '',

  // Vídeos de fundo: quando true, ficam parados para quem ativou "reduzir movimento" no sistema.
  // O Windows também ativa isso quando os "Efeitos de animação" estão desligados (comum por desempenho),
  // por isso o padrão é false: os vídeos são lentos e sutis.
  pauseVideosOnReducedMotion: false
};

(function () {
  document.documentElement.classList.remove('no-js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- WhatsApp: todos os CTAs usam o mesmo número e mensagem ---
  var waHref = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(SITE.whatsappMessage);
  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    el.href = waHref;
    el.target = '_blank';
    el.rel = 'noopener';
  });

  // --- Prova social (Google) ---
  document.querySelectorAll('[data-google-rating]').forEach(function (el) {
    if (SITE.googleRating) el.textContent = SITE.googleRating; else el.classList.add('ph');
  });
  document.querySelectorAll('[data-google-count]').forEach(function (el) {
    if (SITE.googleReviewsCount) el.textContent = SITE.googleReviewsCount; else el.classList.add('ph');
  });
  document.querySelectorAll('[data-google-reviews]').forEach(function (el) {
    el.href = SITE.googleReviewsUrl ||
      'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Pontes & Serafini Advocacia Previdenciária São Fidélis RJ');
  });

  // --- Logo oficial: usa o arquivo se existir, senão mantém o logo em texto ---
  document.querySelectorAll('[data-logo]').forEach(function (img) {
    var logo = img.closest('.logo');
    function ok() { if (img.naturalWidth > 0) logo.classList.add('has-logo'); }
    if (img.complete) ok();
    img.addEventListener('load', ok);
  });

  // --- Fotos: placeholder enquanto o arquivo real não existir ---
  document.querySelectorAll('[data-photo]').forEach(function (img) {
    var fig = img.closest('figure');
    function missing() { fig.classList.add('photo-missing'); }
    if (img.complete && img.naturalWidth === 0) missing();
    img.addEventListener('error', missing);
  });

  // --- Vídeos ---
  var loopVideos = document.querySelectorAll('video[data-autoplay]');
  var onceVideos = document.querySelectorAll('video[data-play-once]');
  if (reduceMotion && SITE.pauseVideosOnReducedMotion) {
    loopVideos.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
  } else {
    loopVideos.forEach(function (v) {
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    });
    // toca uma vez quando a seção aparece e para no último quadro
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var p = entry.target.play();
            if (p && p.catch) p.catch(function () {});
            vio.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 });
      onceVideos.forEach(function (v) { vio.observe(v); });
    }
  }

  // --- Scroll: header, botão flutuante e parallax sutil ---
  var header = document.getElementById('header');
  var waFloat = document.querySelector('.wa-float');
  var finalCta = document.querySelector('.cta');
  var parallax = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;

    header.classList.toggle('is-scrolled', y > 24);

    // aparece após o hero; some quando o CTA final (e o rodapé) entram na tela
    waFloat.classList.toggle('is-visible', y > vh * 0.6);
    waFloat.classList.toggle('is-hidden', finalCta.getBoundingClientRect().top < vh * 0.85);

    if (!reduceMotion) {
      parallax.forEach(function (fig) {
        var img = fig.querySelector('img, video');
        var r = fig.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        var speed = parseFloat(fig.getAttribute('data-parallax')) || 0.08;
        // as imagens têm 10–16% de altura extra; o deslocamento nunca passa de 10%
        var max = r.height * 0.05;
        var offset = (r.top + r.height / 2 - vh / 2) * -speed;
        offset = Math.max(-max, Math.min(max, offset)) - max;
        img.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // --- Menu mobile ---
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('nav');

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(!document.body.classList.contains('menu-open'));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { setMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // --- Fade-up / reveal ao entrar na viewport ---
  var items = document.querySelectorAll('.fade-up, .reveal-img');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  document.getElementById('year').textContent = new Date().getFullYear();
})();
