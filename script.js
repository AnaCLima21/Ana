/* =============================================
   SCRIPT.JS — Ana Claudia · UX Designer
   Todas as interações do site em JavaScript puro.
   Cada seção é comentada para facilitar edição.
   ============================================= */


/* =============================================
   1. AGUARDAR O DOM ESTAR PRONTO
   Garante que o HTML foi carregado antes de
   executar qualquer código JavaScript.
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {

  // Chama todas as funções de inicialização
  iniciarMenu();
  iniciarTema();
  iniciarScrollHeader();
  iniciarReveal();
  iniciarBarrasHabilidade();
  iniciarFiltrosProjetos();
  iniciarFormulario();
  iniciarBotaoTopo();
  iniciarAnoRodape();
  iniciarLinksAtivos();

});


/* =============================================
   2. MENU RESPONSIVO (HAMBÚRGUER)
   Abre e fecha o menu no mobile ao clicar
   no botão de três barras.
   ============================================= */
function iniciarMenu() {
  // Seleciona os elementos do menu
  var btnToggle = document.getElementById('navToggle');
  var navList   = document.getElementById('navList');
  var links     = navList.querySelectorAll('.nav__link');

  // Alterna o menu ao clicar no botão hambúrguer
  btnToggle.addEventListener('click', function () {
    var estaAberto = navList.classList.contains('aberto');

    // Adiciona ou remove a classe 'aberto'
    navList.classList.toggle('aberto');
    btnToggle.classList.toggle('aberto');

    // Atualiza o atributo de acessibilidade
    btnToggle.setAttribute('aria-expanded', !estaAberto);
  });

  // Fecha o menu ao clicar em qualquer link
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      navList.classList.remove('aberto');
      btnToggle.classList.remove('aberto');
      btnToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Fecha o menu ao clicar fora dele
  document.addEventListener('click', function (evento) {
    var clicouFora = !navList.contains(evento.target) &&
                     !btnToggle.contains(evento.target);
    if (clicouFora && navList.classList.contains('aberto')) {
      navList.classList.remove('aberto');
      btnToggle.classList.remove('aberto');
      btnToggle.setAttribute('aria-expanded', 'false');
    }
  });
}


/* =============================================
   3. ALTERNADOR DE TEMA CLARO / ESCURO
   Salva a preferência do usuário no
   localStorage para persistir entre visitas.
   ============================================= */
function iniciarTema() {
  var btnTema = document.getElementById('btnTheme');
  var html    = document.documentElement; // Elemento <html>

  // Verifica se há preferência salva anteriormente
  var temaSalvo = localStorage.getItem('tema');

  // Se houver tema salvo, aplica ele
  if (temaSalvo) {
    html.setAttribute('data-theme', temaSalvo);
  } else {
    // Caso contrário, verifica a preferência do sistema operacional
    var prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefereEscuro ? 'dark' : 'light');
  }

  // Alterna o tema ao clicar no botão
  btnTema.addEventListener('click', function () {
    var temaAtual = html.getAttribute('data-theme');
    var novoTema  = temaAtual === 'light' ? 'dark' : 'light';

    // Aplica o novo tema
    html.setAttribute('data-theme', novoTema);

    // Salva a preferência no localStorage
    localStorage.setItem('tema', novoTema);
  });
}


/* =============================================
   4. HEADER COM EFEITO AO ROLAR
   Adiciona sombra e borda ao header quando
   o usuário rola a página para baixo.
   ============================================= */
function iniciarScrollHeader() {
  var header = document.getElementById('header');

  // Função executada ao rolar a página
  function verificarScroll() {
    if (window.scrollY > 50) {
      // Adiciona classe de estilo ao rolar
      header.classList.add('header--scrolled');
    } else {
      // Remove a classe quando volta ao topo
      header.classList.remove('header--scrolled');
    }
  }

  // Escuta o evento de scroll
  window.addEventListener('scroll', verificarScroll);

  // Verifica na carga inicial (caso a página já esteja rolada)
  verificarScroll();
}


/* =============================================
   5. ANIMAÇÃO DE ENTRADA AO ROLAR (SCROLL REVEAL)
   Elementos com a classe .reveal ficam
   invisíveis e aparecem suavemente quando
   entram na área visível da tela.
   ============================================= */
function iniciarReveal() {
  // Seleciona todos os elementos com a classe reveal
  var elementos = document.querySelectorAll('.reveal');

  // Usa IntersectionObserver para detectar quando elementos ficam visíveis
  // Isso é mais eficiente do que verificar a posição no scroll
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        // Adiciona a classe que ativa a animação de entrada
        entrada.target.classList.add('visivel');

        // Para de observar o elemento após a animação
        // (evita que a animação repita ao rolar de volta)
        observador.unobserve(entrada.target);
      }
    });
  }, {
    threshold: 0.15,  // Ativa quando 15% do elemento está visível
    rootMargin: '0px 0px -50px 0px' // Margem para ativar um pouco antes
  });

  // Começa a observar cada elemento
  elementos.forEach(function (el) {
    observador.observe(el);
  });
}


/* =============================================
   6. BARRAS DE PROGRESSO DAS HABILIDADES
   Anima as barras de habilidade quando elas
   entram na área visível da tela.
   ============================================= */
function iniciarBarrasHabilidade() {
  // Seleciona todas as barras de preenchimento
  var barras = document.querySelectorAll('.hab-card__bar-fill');

  // Observador para detectar quando as barras ficam visíveis
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        var barra = entrada.target;

        // Lê o valor de largura definido no atributo data-width
        var largura = barra.getAttribute('data-width');

        // Aplica a largura com um pequeno atraso para efeito visual
        setTimeout(function () {
          barra.style.width = largura + '%';
        }, 300);

        // Para de observar após animar
        observador.unobserve(barra);
      }
    });
  }, { threshold: 0.5 });

  barras.forEach(function (barra) {
    observador.observe(barra);
  });
}


/* =============================================
   7. FILTRO DE PROJETOS
   Filtra os cards de projeto por categoria
   ao clicar nos botões de filtro.
   ============================================= */
function iniciarFiltrosProjetos() {
  // Seleciona todos os botões de filtro e cards de projeto
  var botoesFiltro = document.querySelectorAll('.filtro-btn');
  var cardsProjeto = document.querySelectorAll('.proj-card');

  botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
      // Obtém a categoria do botão clicado
      var filtroSelecionado = botao.getAttribute('data-filtro');

      // Remove a classe ativa de todos os botões
      botoesFiltro.forEach(function (btn) {
        btn.classList.remove('filtro-btn--ativo');
      });

      // Adiciona a classe ativa ao botão clicado
      botao.classList.add('filtro-btn--ativo');

      // Filtra os cards de projeto
      cardsProjeto.forEach(function (card) {
        var categoriaCard = card.getAttribute('data-categoria');

        if (filtroSelecionado === 'todos' || categoriaCard === filtroSelecionado) {
          // Mostra o card
          card.classList.remove('proj-card--oculto');

          // Reinicia a animação de entrada
          card.classList.remove('visivel');
          setTimeout(function () {
            card.classList.add('visivel');
          }, 50);
        } else {
          // Oculta o card
          card.classList.add('proj-card--oculto');
        }
      });
    });
  });
}


/* =============================================
   8. VALIDAÇÃO E ENVIO DO FORMULÁRIO DE CONTATO
   Valida os campos antes de "enviar" e exibe
   mensagens de feedback ao usuário.
   ============================================= */
function iniciarFormulario() {
  var form = document.getElementById('contatoForm');

  if (!form) return; // Sai se o formulário não existir

  form.addEventListener('submit', function (evento) {
    // Impede o envio padrão do formulário (que recarregaria a página)
    evento.preventDefault();

    // Limpa erros anteriores
    limparErros();

    // Coleta os valores dos campos
    var nome     = document.getElementById('nome').value.trim();
    var email    = document.getElementById('email').value.trim();
    var assunto  = document.getElementById('assunto').value.trim();
    var mensagem = document.getElementById('mensagem').value.trim();

    // Variável para controlar se há erros
    var temErro = false;

    // Validação do nome
    if (nome.length < 2) {
      mostrarErro('erroNome', 'Por favor, informe seu nome completo.');
      document.getElementById('nome').classList.add('form__input--erro');
      temErro = true;
    }

    // Validação do e-mail
    if (!validarEmail(email)) {
      mostrarErro('erroEmail', 'Por favor, informe um e-mail válido.');
      document.getElementById('email').classList.add('form__input--erro');
      temErro = true;
    }

    // Validação do assunto
    if (assunto.length < 3) {
      mostrarErro('erroAssunto', 'Por favor, informe o assunto da mensagem.');
      document.getElementById('assunto').classList.add('form__input--erro');
      temErro = true;
    }

    // Validação da mensagem
    if (mensagem.length < 10) {
      mostrarErro('erroMensagem', 'A mensagem deve ter pelo menos 10 caracteres.');
      document.getElementById('mensagem').classList.add('form__input--erro');
      temErro = true;
    }

    // Se não há erros, simula o envio
    if (!temErro) {
      simularEnvio(form);
    }
  });

  // Remove o estilo de erro ao digitar no campo
  var campos = form.querySelectorAll('.form__input');
  campos.forEach(function (campo) {
    campo.addEventListener('input', function () {
      campo.classList.remove('form__input--erro');
    });
  });
}

/* Exibe uma mensagem de erro em um campo específico */
function mostrarErro(idErro, mensagem) {
  var spanErro = document.getElementById(idErro);
  if (spanErro) {
    spanErro.textContent = mensagem;
  }
}

/* Remove todas as mensagens de erro */
function limparErros() {
  var erros = document.querySelectorAll('.form__erro');
  erros.forEach(function (erro) { erro.textContent = ''; });

  var campos = document.querySelectorAll('.form__input--erro');
  campos.forEach(function (campo) { campo.classList.remove('form__input--erro'); });

  var feedback = document.getElementById('formFeedback');
  if (feedback) {
    feedback.className = 'form__feedback';
    feedback.textContent = '';
  }
}

/* Valida o formato de um e-mail */
function validarEmail(email) {
  // Expressão regular para validar e-mail
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/* Simula o envio do formulário com feedback visual */
function simularEnvio(form) {
  var btnEnviar = form.querySelector('button[type="submit"]');
  var feedback  = document.getElementById('formFeedback');

  // Desabilita o botão durante o "envio"
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando...';

  // Simula um atraso de rede (1.5 segundos)
  setTimeout(function () {
    // Exibe mensagem de sucesso
    feedback.className = 'form__feedback form__feedback--sucesso';
    feedback.textContent = 'Mensagem enviada com sucesso! Em breve entrarei em contato.';

    // Limpa o formulário
    form.reset();

    // Reabilita o botão
    btnEnviar.disabled = false;
    btnEnviar.textContent = 'Enviar Mensagem';

    // Remove o feedback após 5 segundos
    setTimeout(function () {
      feedback.className = 'form__feedback';
      feedback.textContent = '';
    }, 5000);
  }, 1500);
}


/* =============================================
   9. BOTÃO VOLTAR AO TOPO
   Aparece quando o usuário rola para baixo
   e leva de volta ao topo ao ser clicado.
   ============================================= */
function iniciarBotaoTopo() {
  var btnTopo = document.getElementById('btnTopo');

  // Mostra ou oculta o botão conforme o scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 400) {
      btnTopo.classList.add('btn-topo--visivel');
    } else {
      btnTopo.classList.remove('btn-topo--visivel');
    }
  });

  // Rola suavemente para o topo ao clicar
  btnTopo.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}


/* =============================================
   10. ANO AUTOMÁTICO NO RODAPÉ
   Atualiza o ano automaticamente sem precisar
   editar o HTML manualmente todo ano.
   ============================================= */
function iniciarAnoRodape() {
  var spanAno = document.getElementById('anoAtual');
  if (spanAno) {
    // Obtém o ano atual do sistema
    spanAno.textContent = new Date().getFullYear();
  }
}


/* =============================================
   11. LINKS DE NAVEGAÇÃO ATIVOS
   Destaca o link do menu correspondente à
   seção que está sendo visualizada no momento.
   ============================================= */
function iniciarLinksAtivos() {
  var secoes = document.querySelectorAll('section[id]');
  var links  = document.querySelectorAll('.nav__link');

  // Observa qual seção está visível
  var observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        var idSecao = entrada.target.getAttribute('id');

        // Remove a classe ativa de todos os links
        links.forEach(function (link) {
          link.classList.remove('ativo');
        });

        // Adiciona a classe ativa ao link correspondente
        var linkAtivo = document.querySelector('.nav__link[href="#' + idSecao + '"]');
        if (linkAtivo) {
          linkAtivo.classList.add('ativo');
        }
      }
    });
  }, {
    threshold: 0.4, // Ativa quando 40% da seção está visível
    rootMargin: '-70px 0px 0px 0px' // Compensa o header fixo
  });

  secoes.forEach(function (secao) {
    observador.observe(secao);
  });
}


/* =============================================
   12. EFEITO DE DIGITAÇÃO NO HERO (TYPEWRITER)
   Anima o texto do cargo como se estivesse
   sendo digitado em tempo real.
   ============================================= */
(function iniciarTypewriter() {
  // Textos que serão exibidos em sequência
  var textos = [
    'UX Designer',
    'Especialista em CX',
    'Pesquisadora de Usuário',
    'Comunicadora'
  ];

  var elementoRole = document.querySelector('.hero__role');
  if (!elementoRole) return;

  var indiceTexto    = 0; // Índice do texto atual
  var indiceChar     = 0; // Índice do caractere atual
  var estaApagando   = false; // Se está apagando ou digitando
  var velocidade     = 100;   // Velocidade de digitação (ms)
  var pausaFim       = 2000;  // Pausa no fim de cada texto (ms)
  var pausaApagando  = 50;    // Velocidade de apagar (ms)

  function digitar() {
    var textoAtual = textos[indiceTexto];
    var cursor = '<span class="cursor" aria-hidden="true">|</span>';

    if (!estaApagando) {
      // Adiciona um caractere
      indiceChar++;
      elementoRole.innerHTML = textoAtual.substring(0, indiceChar) + cursor;

      if (indiceChar === textoAtual.length) {
        // Chegou ao fim do texto — pausa antes de apagar
        estaApagando = true;
        setTimeout(digitar, pausaFim);
        return;
      }
    } else {
      // Remove um caractere
      indiceChar--;
      elementoRole.innerHTML = textoAtual.substring(0, indiceChar) + cursor;

      if (indiceChar === 0) {
        // Apagou tudo — passa para o próximo texto
        estaApagando = false;
        indiceTexto  = (indiceTexto + 1) % textos.length;
      }
    }

    // Velocidade varia entre digitar e apagar
    var delay = estaApagando ? pausaApagando : velocidade;
    setTimeout(digitar, delay);
  }

  // Inicia o efeito após um pequeno atraso
  setTimeout(digitar, 800);
})();
