/* Descrição sonora voluntária da interface; não equivale a audiodescrição sincronizada de vídeos. */
(() => {
  'use strict';
  const play=document.getElementById('accessPlay');
  const stop=document.getElementById('accessStop');
  const text=document.getElementById('accessNarration');
  const status=document.getElementById('accessStatus');
  if(!play||!stop||!text||!status)return;
  const supported=typeof window.speechSynthesis!=='undefined' && typeof window.SpeechSynthesisUtterance==='function';
  if(!supported){
    play.disabled=true;
    status.textContent='Narração não disponível neste navegador. A descrição escrita permanece acessível.';
    return;
  }
  function cancel(){
    window.speechSynthesis.cancel();
    stop.disabled=true;
    play.disabled=false;
  }
  play.addEventListener('click',()=>{
    cancel();
    const utterance=new window.SpeechSynthesisUtterance(text.textContent);
    utterance.lang='pt-BR';
    utterance.rate=0.92;
    utterance.onend=()=>{
      stop.disabled=true;play.disabled=false;
      status.textContent='Descrição do ambiente concluída.';
    };
    utterance.onerror=()=>{
      stop.disabled=true;play.disabled=false;
      status.textContent='A voz do navegador não conseguiu realizar a narração.';
    };
    play.disabled=true;stop.disabled=false;
    status.textContent='Descrição do ambiente em reprodução.';
    window.speechSynthesis.speak(utterance);
  });
  stop.addEventListener('click',()=>{cancel();status.textContent='Narração interrompida.';});
  window.addEventListener('pagehide',cancel);
})();
