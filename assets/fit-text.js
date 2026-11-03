/* Shrinks oversized display text on small screens so no word runs past its box. */
(function(){
  var SEL='h1,h2,h3,.gkh-photo-fallback span,[class*="year"],[class*="number"],[class*="numeral"]';
  var touched=[];
  function fit(){
    var vw=document.documentElement.clientWidth;
    touched.forEach(function(el){el.style.fontSize='';});
    touched=[];
    if(vw>780)return;
    document.querySelectorAll(SEL).forEach(function(el){
      if(!el.offsetParent&&getComputedStyle(el).position!=='fixed')return;
      var base=parseFloat(getComputedStyle(el).fontSize);if(!base||base<20)return;
      var size=base,guard=0;
      function overflows(){
        var r=el.getBoundingClientRect();
        var limit=Math.min(vw-12,(el.parentElement?el.parentElement.getBoundingClientRect().right:vw));
        return el.scrollWidth>el.clientWidth+1||r.right>limit+1||rightmostText(el)>limit+1;
      }
      while(overflows()&&size>base*0.55&&guard++<40){size*=0.95;el.style.fontSize=size+'px';}
      if(size!==base)touched.push(el);
    });
  }
  function rightmostText(el){
    var max=0,w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT),n,rg=document.createRange();
    while((n=w.nextNode())){if(!n.textContent.trim())continue;rg.selectNodeContents(n);var rs=rg.getClientRects();for(var i=0;i<rs.length;i++)if(rs[i].right>max)max=rs[i].right;}
    return max;
  }
  var t;function later(){clearTimeout(t);t=setTimeout(fit,120);}
  if(document.readyState!=='loading')fit();else document.addEventListener('DOMContentLoaded',fit);
  window.addEventListener('load',fit);window.addEventListener('resize',later);window.addEventListener('orientationchange',later);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
})();
