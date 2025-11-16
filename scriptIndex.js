document.addEventListener("DOMContentLoaded", function () {
  // Troca de imagens
  const imagens = [
    'Copilot_20251026_202426.png',
    'Copilot_20251026_202429.png',
    'Copilot_20251026_202434.png',
    'Copilot_20251026_203425.png'
  ];

  let index = 0;

  setInterval(() => {
    const fofinha = document.getElementById('fofinha');
    if (fofinha) {
      fofinha.style.backgroundImage = `url('${imagens[index]}')`;
      index = (index + 1) % imagens.length;
    }
  }, 1500);

  // Máscara no campo de valor
  const campoValor = document.getElementById('valor');
  if (campoValor) {
    IMask(campoValor, {
      mask: 'R$ num',
      blocks: {
        num: {
          mask: Number,
          scale: 2,
          signed: false,
          thousandsSeparator: '.',
          radix: ',',
          mapToRadix: ['.'],
          normalizeZeros: true,
          padFractionalZeros: true
        }
      }
    });
  }

 
  const botao = document.getElementById('EnviarValor');

  botao.addEventListener('click', function (e) {
    const valor = document.getElementById('valor').value.trim();
    const mes = document.getElementById('mes').value;
    let msg = document.getElementById('mensagem');
    if (valor === '' || mes === 'Selecione') {
      e.preventDefault(); 
       msg.textContent = 'Preencha todos os campos corretamente!!';
       msg.style.display = 'block'; 
        setTimeout(() => {
      msg.style.display = 'none';
    }, 3000);
     return;
     
    } else {
      msg.style.display = 'none'; 
    }
  });
});



