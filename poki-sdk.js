// Poki SDK bridge. On Poki the real SDK is injected/loaded; locally this falls back to no-ops.
(function(){
  var ready=false, inPlay=false, first=true;
  function sdk(){return window.PokiSDK;}
  window.FWPoki={
    init:function(){ var s=sdk(); if(!s) return Promise.resolve(); return s.init().then(function(){ready=true; try{s.gameLoadingFinished()}catch(e){}}).catch(function(){ready=true}); },
    start:function(){ if(inPlay) return; inPlay=true; try{ready&&sdk().gameplayStart()}catch(e){} },
    stop:function(){ if(!inPlay) return; inPlay=false; try{ready&&sdk().gameplayStop()}catch(e){} },
    ad:function(){ if(first){first=false; return Promise.resolve();} var s=sdk(); if(!ready||!s) return Promise.resolve(); window.__fwMute&&__fwMute(true); return s.commercialBreak().catch(function(){}).then(function(){window.__fwMute&&__fwMute(false)}); }
  };
  var t=document.createElement('script'); t.src='https://game-cdn.poki.com/scripts/v2/poki-sdk.js';
  t.onload=function(){FWPoki.init()}; t.onerror=function(){};
  if(!/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) document.head.appendChild(t);
})();
