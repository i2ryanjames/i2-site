(function(){
  function wasDismissed(){ try { return sessionStorage.getItem('i2_ebook_dismissed') === 'true'; } catch (_) { return false; } }
  function rememberDismissal(){ try { sessionStorage.setItem('i2_ebook_dismissed','true'); } catch (_) {} }
  function closeEbookModal(){
    var o = document.getElementById('ebookOverlay');
    o.style.opacity = '0';
    o.querySelector('.ebook-modal').style.transform = 'scale(0.95)';
    setTimeout(function(){ o.classList.remove('active'); o.style.display = 'none'; },400);
    document.body.classList.remove('modal-open');
    rememberDismissal();
  }
  window.closeEbookModal = closeEbookModal;

  if(!wasDismissed()){
    setTimeout(function(){
      if(wasDismissed() || !window.I2Consent || !window.I2Consent.hasDecision()) return;
      var o = document.getElementById('ebookOverlay');
      o.style.display = 'flex';
      document.body.classList.add('modal-open');
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ o.classList.add('active'); }); });
    }, 20000);
  }

  document.getElementById('ebookClose').addEventListener('click', closeEbookModal);
  document.getElementById('ebookOverlay').addEventListener('click', function(e){
    if(e.target === this) closeEbookModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && document.getElementById('ebookOverlay').classList.contains('active')) closeEbookModal();
  });
})();
