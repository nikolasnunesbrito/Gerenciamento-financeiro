document.addEventListener("DOMContentLoaded", function () {



function criarCalculadora() {
  const calc = document.createElement("div");
  calc.id = "calculadora";
  calc.innerHTML = `
    <input type="text" id="calcDisplay" readonly>
    <div id="calcBotoes">
      <button class="num">7</button>
      <button class="num">8</button>
      <button class="num">9</button>
      <button class="op">/</button><br>
      <button class="num">4</button>
      <button class="num">5</button>
      <button class="num">6</button>
      <button class="op">*</button><br>
      <button class="num">1</button>
      <button class="num">2</button>
      <button class="num">3</button>
      <button class="op">-</button><br>
      <button class="num">0</button>
      <button class="op">.</button>
      <button id="igual">=</button>
      <button class="op">+</button><br>
      <button id="limpar">C</button>
    </div>
  `;
  calc.style.display = "none"; 
  document.body.appendChild(calc); 
  return calc;
}

const calc = criarCalculadora();
const display = document.getElementById("calcDisplay");
let expressao = "";


const btnHeader = document.getElementById("btnCalc");
btnHeader.addEventListener("click", () => {
  calc.style.display = (calc.style.display === "none") ? "block" : "none";
});


calc.addEventListener("click", (e) => {
  const el = e.target;
  if (el.classList.contains("num") || el.classList.contains("op")) {
    expressao += el.textContent;
    display.value = expressao;
  }
  if (el.id === "igual") {
    try {
      expressao = eval(expressao);
      display.value = expressao;
    } catch {
      display.value = "Erro";
    }
  }
  if (el.id === "limpar") {
    expressao = "";
    display.value = "";
  }
});


  const btn = document.getElementById("btnHeader");
const header = document.getElementById("meuheader");

function mostrarHeader() {
  if (header.style.display === "none") {
    header.style.display = "flex";
  } else {
    header.style.display = "none";
  }
}

btn.addEventListener("click", mostrarHeader);


   
 
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
  
  const params = new URLSearchParams(window.location.search);
  const valorParam = params.get('valor') || 'R$0,00';
  const mesParam = params.get('mes') || 'Mês não definido';

  const valorLimpo = valorParam.replace(/[^\d,]/g, '').replace(',', '.');
  const saldoMaximo = parseFloat(valorLimpo) || 0;
  let saldoAtual = saldoMaximo;
  let gastoTotal = 0;

  document.getElementById('MesEscolhido').textContent = mesParam;

  const ctx = document.getElementById('graficoSaldo').getContext('2d');
  const erro = document.getElementById('erroSaldo');
  const mensagem = document.getElementById('mensagemSaldo');

  const valorCentralPlugin = {
    id: 'valorCentral',
    beforeDraw: (chart) => {
      const { width, height, ctx } = chart;
      ctx.restore();
      const saldo = chart.data.datasets[0].data[0];
      const texto = saldo > 0 
        ? saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) 
        : 'Saldo insuficiente';
      ctx.font = 'bold 22px Verdana';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(texto, width / 2, height / 2);
      ctx.save();
    }
  };

  const grafico = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Saldo restante', 'Gasto confirmado'],
      datasets: [{
        data: [saldoAtual, gastoTotal],
        backgroundColor: ['#ff69b4', '#4CAF50'],
        borderWidth: 1
      }]
    },
    options: {
      cutout: '70%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false }
      }
    },
    plugins: [valorCentralPlugin]
  });
function aplicarMascaraCampoValor(input) {
  IMask(input, {
    mask: 'R$ num',
    blocks: {
      num: {
        mask: Number,
        scale: 2,
        signed: false,
        thousandsSeparator: '.',
        padFractionalZeros: true,
        normalizeZeros: true,
        radix: ',',
        mapToRadix: ['.']
      }
    },
    lazy: false 
  });
}

  function atualizarGrafico() {
    grafico.data.datasets[0].data = [saldoAtual, gastoTotal];
    grafico.update();
    mensagem.style.display = saldoAtual <= 0 ? 'block' : 'none';
  }

  function atualizarEventos() {
    document.querySelectorAll('.confirmar').forEach((botao) => {
      botao.onclick = () => {
        const linha = botao.closest('tr');
        const valorCampo = linha.querySelector('.valorGasto');
        const valorTexto = valorCampo.value.replace(/[^\d,]/g, '').replace(',', '.');
        const valorAtual = parseFloat(valorTexto);

        if (!isNaN(valorAtual) && valorAtual > 0) {
          if (!botao.classList.contains('ativo')) {
            if (valorAtual <= saldoAtual) {
              saldoAtual -= valorAtual;
              gastoTotal += valorAtual;
              botao.classList.add('ativo');
              botao.textContent = 'Desfazer gasto';
              botao.style.backgroundColor = '#4CAF50';
              botao.style.color = 'white';
              botao.dataset.valorGasto = valorAtual;
              erro.style.display = 'none';
            } else {
              erro.style.display = 'block';
            }
          } else {
            const valorOriginal = parseFloat(botao.dataset.valorGasto) || 0;
            saldoAtual += valorOriginal;
            gastoTotal -= valorOriginal;
            botao.classList.remove('ativo');
            botao.textContent = 'Confirmar gasto';
            botao.style.backgroundColor = '#eee';
            botao.style.color = 'black';
            delete botao.dataset.valorGasto;
            erro.style.display = 'none';
          }
          atualizarGrafico();
          rolarParaGrafico();
        }
      };
    });
  }
  function rolarParaGrafico() {
  const grafico = document.getElementById('graficoContainer');
  if (grafico) {
    grafico.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

  function atualizarRemover() {
    document.querySelectorAll('.remover').forEach((botao) => {
      botao.onclick = () => {
        const linha = botao.closest('tr');
        const valorCampo = linha.querySelector('.valorGasto');
        const valorTexto = valorCampo?.value.replace(/[^\d,]/g, '').replace(',', '.');
        const valor = parseFloat(valorTexto);
        const botaoConfirmar = linha.querySelector('.confirmar');

        if (botaoConfirmar?.classList.contains('ativo') && !isNaN(valor)) {
          saldoAtual += valor;
          gastoTotal -= valor;
          atualizarGrafico();
        }

        linha.remove();
      };
    });
  }

  document.querySelectorAll('.adicionarGasto').forEach((botao) => {
    botao.addEventListener('click', () => {
      const categoria = botao.closest('.categoria');
      const destinoInput = categoria.querySelector('.inputDestino');
      const valorInput = categoria.querySelector('.inputValor');
      const destino = destinoInput.value.trim();
      const valorTexto = valorInput.value.replace(/[^\d,]/g, '').replace(',', '.');
      const valor = parseFloat(valorTexto);

      if (destino && !isNaN(valor) && valor > 0) {
        const tbody = categoria.querySelector('table tbody');
        const novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
          <td><button class="remover">❌</button></td>
          <td><input type="text" value="${destino}" class="campoDestino"></td>
          <td><input type="text" value="${valorInput.value}" class="valorGasto"></td>
          <td><button class="confirmar">Confirmar gasto</button></td>
        `;

        tbody.appendChild(novaLinha);

        const novoInputValor = novaLinha.querySelector('.valorGasto');
        aplicarMascaraCampoValor(novoInputValor);

        destinoInput.value = '';
        valorInput.value = '';
        atualizarEventos();
        atualizarRemover();
      }
    });
  });

  
  document.querySelectorAll('.inputValor').forEach((input) => {
  aplicarMascaraCampoValor(input);
});

  atualizarEventos();
  atualizarRemover();
  atualizarGrafico();
});