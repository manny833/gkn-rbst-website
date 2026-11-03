/* Content protection: discourages casual copying of photos, video and text.
   Contact details (address, phone, email) stay selectable so visitors can use them. */
(function(){
  var ALLOW='input,textarea,select,[contenteditable],a[href^="tel:"],a[href^="mailto:"],address,.v9-footer-contact,.site-credit-details,.allow-copy';
  function allowed(t){return t&&t.closest&&t.closest(ALLOW);}
  document.addEventListener('contextmenu',function(e){if(!allowed(e.target))e.preventDefault();});
  document.addEventListener('dragstart',function(e){if(e.target&&(e.target.tagName==='IMG'||e.target.tagName==='VIDEO'||!allowed(e.target)))e.preventDefault();});
  document.addEventListener('copy',function(e){var s=window.getSelection();if(s&&s.anchorNode&&allowed(s.anchorNode.parentElement))return;e.preventDefault();});
  document.addEventListener('cut',function(e){if(!allowed(e.target))e.preventDefault();});
  document.addEventListener('selectstart',function(e){if(!allowed(e.target&&e.target.nodeType===3?e.target.parentElement:e.target))e.preventDefault();});
  document.addEventListener('keydown',function(e){
    var k=(e.key||'').toLowerCase(),mod=e.ctrlKey||e.metaKey;
    if(mod&&(k==='s'||k==='u'))e.preventDefault();
    if(mod&&e.shiftKey&&(k==='i'||k==='j'||k==='c'))e.preventDefault();
  });
  function harden(){
    document.querySelectorAll('img').forEach(function(i){i.setAttribute('draggable','false');});
    document.querySelectorAll('video').forEach(function(v){v.setAttribute('controlsList','nodownload noplaybackrate');v.setAttribute('disablePictureInPicture','');v.setAttribute('disableRemotePlayback','');});
  }
  if(document.readyState!=='loading')harden();else document.addEventListener('DOMContentLoaded',harden);
})();
