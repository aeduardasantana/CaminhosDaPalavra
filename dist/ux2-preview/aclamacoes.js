/* Diálogo litúrgico: proclamação do ministro e resposta da assembleia.
   As glosas são esboços para estudo, não sinais validados por pessoa surda. */
(function(root){
  const reading=Object.freeze({
    proclamation:'Palavra do Senhor',
    response:'Graças a Deus',
    minister:'Leitor',
    proclamationStudy:'PALAVRA / SENHOR',
    responseStudy:'DEUS / AGRADECER'
  });
  const gospel=Object.freeze({
    proclamation:'Palavra da Salvação',
    response:'Glória a Vós, Senhor',
    minister:'Ministro',
    proclamationStudy:'PALAVRA / SALVAÇÃO',
    responseStudy:'SENHOR / GLÓRIA A TI'
  });
  function forItem(item){
    if(item==='primeira-leitura'||item==='segunda-leitura')return reading;
    if(item==='evangelho')return gospel;
    return null; // Salmo, cântico e sequência não recebem esta aclamação.
  }
  root.LCE_ACLAMACOES=Object.freeze({forItem});
})(window);
