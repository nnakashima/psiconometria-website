/* Psiconometria — static export app logic.
   Renders shared header/footer and powers all interactive features:
   equation, flow, mini-matrix, catalog filters, matriz selector,
   laboratorio simulator, disciplinas tabs, glossario search, mobile nav. */
(function () {
  'use strict';
  var D = window.PSICO_DATA;
  var HERO_IMG = 'https://images.hostinger.com/070c6260-dfbb-4a33-9c0b-1a5b62c001ba.png';
  var CASOS_IMG = 'https://images.hostinger.com/a57b3388-8503-4a35-9a83-201b9c1c7b8b.png';
  var SOBRE_IMG = 'https://images.hostinger.com/4f47b864-f70e-4130-8608-505367283e70.png';

  var NAV = [
    { to:'o-que-e.html', label:'O conceito' },
    { to:'as-duas-disciplinas.html', label:'Disciplinas' },
    { to:'catalogo.html', label:'Catálogo' },
    { to:'matriz.html', label:'Matriz' },
    { to:'laboratorio.html', label:'Laboratório' },
    { to:'casos.html', label:'Casos' },
    { to:'metodo.html', label:'Método' },
    { to:'glossario.html', label:'Glossário' },
    { to:'sobre.html', label:'Sobre' },
  ];

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function activePath() {
    var p = location.pathname.split('/').pop();
    return p === '' ? 'index.html' : p;
  }

  function renderHeader() {
    var head = document.getElementById('site-header');
    if (!head) return;
    var cur = activePath();
    var navHtml = NAV.map(function (n) {
      var a = n.to === cur ? ' active' : '';
      return '<a href="' + n.to + '"' + a + '>' + n.label + '</a>';
    }).join('');
    var mobileHtml = NAV.map(function (n) {
      var a = n.to === cur ? ' active' : '';
      return '<a href="' + n.to + '"' + a + '>' + n.label + '</a>';
    }).join('');
    head.innerHTML =
      '<div class="inner">' +
        '<a class="brand" href="index.html"><span class="name">Psiconometria</span><span class="tag">pessoas, dados e resultados</span></a>' +
        '<nav class="nav-desktop" aria-label="Navegação principal">' + navHtml +
          '<a class="btn btn-outline" style="height:2.5rem;margin-left:0.5rem" href="sobre.html#contato">Contato ↗</a>' +
        '</nav>' +
        '<button class="menu-toggle" id="menu-open" aria-label="Abrir menu">☰</button>' +
      '</div>' +
      '<div class="mobile-nav" id="mobile-nav">' +
        '<button class="close" id="menu-close">Fechar ✕</button>' +
        '<a href="sobre.html#contato" class="btn" style="margin:1rem 0">Fale conosco ↗</a>' +
        mobileHtml +
      '</div>';
    var open = document.getElementById('menu-open');
    var close = document.getElementById('menu-close');
    var mn = document.getElementById('mobile-nav');
    if (open) open.addEventListener('click', function () { mn.classList.add('open'); });
    if (close) close.addEventListener('click', function () { mn.classList.remove('open'); });
  }

  function renderFooter() {
    var foot = document.getElementById('site-footer');
    if (!foot) return;
    var navHtml = NAV.map(function (n) { return '<li><a href="' + n.to + '">' + n.label + '</a></li>'; }).join('');
    foot.innerHTML =
      '<div class="grid">' +
        '<div>' +
          '<p class="brand-name">Psiconometria</p>' +
          '<p class="manifesto">Uma abordagem integrada que combina a mensuração rigorosa de características humanas com métodos quantitativos de análise econômica — para compreender como pessoas, comportamentos, relações e decisões influenciam processos e resultados empresariais.</p>' +
          '<div style="margin-top:2rem">' +
            '<h4>Receba novos estudos</h4>' +
            '<form class="newsletter-form" id="newsletter-form">' +
              '<input type="email" id="newsletter-email" placeholder="seu@email.com" required aria-label="Seu e-mail">' +
              '<button type="submit">Assinar →</button>' +
            '</form>' +
            '<p id="newsletter-msg" style="margin-top:0.5rem;font-size:0.75rem;color:var(--teal);display:none">Inscrição registrada. Obrigado.</p>' +
          '</div>' +
        '</div>' +
        '<div><h4>Navegação</h4><ul>' + navHtml + '</ul></div>' +
        '<div>' +
          '<h4>Compromisso metodológico</h4>' +
          '<ul>' +
            '<li style="font-size:0.875rem;color:rgba(244,241,234,0.7);margin-bottom:0.5rem">Correlação não comprova causalidade.</li>' +
            '<li style="font-size:0.875rem;color:rgba(244,241,234,0.7);margin-bottom:0.5rem">Nenhum instrumento deve ser usado isoladamente em decisões de alto impacto.</li>' +
            '<li style="font-size:0.875rem;color:rgba(244,241,234,0.7);margin-bottom:0.5rem">Testes psicológicos de uso privativo exigem profissionais habilitados.</li>' +
            '<li style="font-size:0.875rem;color:rgba(244,241,234,0.7)">Toda afirmação factual indica fonte, ano e tipo de evidência.</li>' +
          '</ul>' +
          '<p style="margin-top:1.5rem;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(244,241,234,0.5)">Fontes de referência: APA · AERA/NCME · CFP/SATEPSI · OECD · World Bank · Google re:Work · Gallup · Our World in Data</p>' +
        '</div>' +
      '</div>' +
      '<div class="bottom">' +
        '<span>© ' + new Date().getFullYear() + ' Psiconometria — conceito autoral em desenvolvimento</span>' +
        '<span>www.psiconometria.com</span>' +
      '</div>';
    var form = document.getElementById('newsletter-form');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('newsletter-msg').style.display = 'block';
      form.reset();
    });
  }

  /* ---------- Home ---------- */
  function initHome() {
    var root = document.getElementById('home-equation');
    if (!root) return;
    var parts = [
      { id:'psi', label:'Psicometria', hint:'A ciência de medir características humanas com rigor: validade, confiabilidade, equidade.' },
      { id:'eco', label:'Econometria', hint:'Métodos quantitativos para analisar dados econômicos: incerteza, causalidade, previsão.' },
      { id:'psico', label:'Psiconometria', hint:'A proposta integrada: investigar como fatores humanos influenciam processos e resultados empresariais.' },
    ];
    var hintP = el('p', null, 'Passe o cursor ou toque em cada termo da equação.');
    hintP.style.cssText = 'margin-top:0.75rem;min-height:2.5rem;max-width:36rem;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.7)';
    var eq = el('div', 'eq');
    parts.forEach(function (p, i) {
      if (i === 1) eq.appendChild(el('span', 'op', '+'));
      if (i === 2) eq.appendChild(el('span', 'op', '='));
      var b = el('button', (p.id === 'psico' ? 'psico' : ''), p.label);
      b.addEventListener('click', function () {
        hintP.textContent = p.hint;
        parts.forEach(function (q) { if (q.id !== 'psico') { var btn = eq.querySelector('button'); } });
      });
      b.addEventListener('mouseenter', function () { hintP.textContent = p.hint; });
      eq.appendChild(b);
    });
    root.appendChild(eq);
    root.appendChild(hintP);

    // mini matrix
    var mm = document.getElementById('home-mini-matrix');
    if (mm) {
      var demo = D.FATORES.filter(function (f) { return ['seguranca-psicologica','lideranca','aprendizado'].indexOf(f.id) >= 0; });
      var sel = demo[0].id;
      var left = el('div');
      var right = el('div');
      function draw() {
        var f = demo.find(function (x) { return x.id === sel; });
        left.innerHTML = '<p class="eyebrow eyebrow-muted">Escolha um fator humano</p>';
        demo.forEach(function (x) {
          var b = el('button', '', x.nome);
          b.style.cssText = 'display:block;width:100%;border:none;border-top:1px solid rgba(28,32,36,0.15);background:transparent;padding:0.75rem 0;text-align:left;font-size:0.875rem;font-weight:600;cursor:pointer;color:' + (x.id === sel ? 'var(--petrol)' : 'rgba(28,32,36,0.7)');
          b.addEventListener('click', function () { sel = x.id; draw(); });
          left.appendChild(b);
        });
        var lk = el('a', null, 'Ver os 16 fatores ↗');
        lk.href = 'matriz.html';
        lk.style.cssText = 'display:inline-flex;margin-top:1rem;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--petrol)';
        left.appendChild(lk);

        var labels = ['Comportamento','Efeito no processo','Indicador antecedente','KPI operacional','KPI financeiro'];
        var chainHtml = f.cadeia.map(function (s, i) {
          return '<li><span class="step-label">' + labels[i] + '</span>' + s + '</li>';
        }).join('');
        right.innerHTML =
          '<div class="flex items-center gap-3"><p class="serif italic" style="font-size:1.5rem;margin:0">' + f.nome + '</p>' +
          '<span class="badge ' + D.EVIDENCIA_CORES[f.evidencia] + '">Evidência ' + f.evidencia.toLowerCase() + '</span></div>' +
          '<ol class="chain" style="margin-top:1.25rem">' + chainHtml + '</ol>';
      }
      draw();
      mm.appendChild(left);
      mm.appendChild(right);
      mm.style.display = 'grid';
      mm.style.gridTemplateColumns = '1fr';
      mm.style.gap = '2rem';
      var mq = window.matchMedia('(min-width: 1024px)');
      function applyGrid() { mm.style.gridTemplateColumns = mq.matches ? '4fr 8fr' : '1fr'; }
      applyGrid(); mq.addEventListener('change', applyGrid);
    }
  }

  /* ---------- Disciplinas ---------- */
  function initDisciplinas() {
    var root = document.getElementById('disc-root');
    if (!root) return;
    var GRUPOS = {
      psicometria: { nome:'Psicometria', dados:D.PSICOMETRIA, intro:'A ciência da medida psicológica: como transformar características humanas em dados confiáveis, válidos e justos.' },
      econometria: { nome:'Econometria', dados:D.ECONOMETRIA, intro:'Métodos quantitativos aplicados a dados econômicos: como estimar relações, quantificar incerteza e aproximar causalidade.' },
      convergencias: { nome:'Convergências', dados:D.CONVERGENCIAS, intro:'Onde as duas disciplinas se encontram — o terreno da Psiconometria.' },
    };
    var grupo = 'convergencias';
    var sel = D.CONVERGENCIAS[0].id;

    // hash deep link
    var hash = location.hash.replace('#','');
    if (hash) {
      Object.keys(GRUPOS).forEach(function (k) {
        if (GRUPOS[k].dados.some(function (d) { return d.id === hash; })) { grupo = k; sel = hash; }
      });
    }

    var tabs = el('div', 'tabs');
    Object.keys(GRUPOS).forEach(function (k) {
      var b = el('button', k === grupo ? 'active' : '', GRUPOS[k].nome);
      b.addEventListener('click', function () { grupo = k; sel = GRUPOS[k].dados[0].id; render(); });
      tabs.appendChild(b);
    });

    var introP = el('p', 'serif italic');
    introP.style.cssText = 'margin-top:1.5rem;max-width:42rem;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.7)';
    var listWrap = el('div');
    var detail = el('article');
    detail.style.cssText = 'border:1px solid rgba(28,32,36,0.2);background:var(--ivory);padding:1.75rem';

    function render() {
      Array.prototype.forEach.call(tabs.children, function (b, i) {
        b.classList.toggle('active', Object.keys(GRUPOS)[i] === grupo);
      });
      var g = GRUPOS[grupo];
      introP.textContent = g.intro;
      var ol = el('ol');
      ol.style.cssText = 'border-bottom:1px solid rgba(28,32,36,0.15);padding:0;margin:0;list-style:none';
      g.dados.forEach(function (d, i) {
        var li = el('li');
        li.id = d.id;
        var b = el('button', '', '<span class="tnum" style="font-size:11px;letter-spacing:0.16em;color:rgba(28,32,36,0.4)">' + String(i+1).padStart(2,'0') + '</span> <span style="font-size:0.875rem;font-weight:600">' + d.titulo + '</span>');
        b.style.cssText = 'display:flex;gap:1rem;align-items:baseline;width:100%;border:none;border-top:1px solid rgba(28,32,36,0.15);background:transparent;padding:0.875rem 0;text-align:left;cursor:pointer;color:' + (sel === d.id ? 'var(--petrol)' : 'rgba(28,32,36,0.75)');
        b.addEventListener('click', function () { sel = d.id; render(); });
        li.appendChild(b);
        ol.appendChild(li);
      });
      listWrap.innerHTML = '';
      listWrap.appendChild(ol);

      var item = g.dados.find(function (d) { return d.id === sel; }) || g.dados[0];
      var rows = [
        ['Definição simples', item.definicao],
        ['Exemplo organizacional', item.exemplo],
        ['Método de análise', item.metodo],
        ['Decisão que pode apoiar', item.decisao],
        ['Limitações', item.limitacoes],
        ['Nível de evidência', item.evidencia],
      ];
      detail.innerHTML = '<h2 class="serif italic" style="font-size:1.75rem;margin:0">' + item.titulo + '</h2>' +
        rows.map(function (r) {
          return '<div style="display:grid;gap:0.25rem;border-top:1px solid rgba(28,32,36,0.1);padding-top:1rem;margin-top:1.25rem;grid-template-columns:1fr">' +
            '<dt style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:rgba(28,32,36,0.5)">' + r[0] + '</dt>' +
            '<dd style="margin:0.25rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + r[1] + '</dd></div>';
        }).join('');
      // responsive 2-col on detail rows
      var style2 = window.matchMedia('(min-width:768px)');
      Array.prototype.forEach.call(detail.querySelectorAll('div[style]'), function (d) {
        if (d.tagName === 'DIV' && d.querySelector('dt')) d.style.gridTemplateColumns = style2.matches ? '4fr 8fr' : '1fr';
      });
    }

    root.appendChild(tabs);
    root.appendChild(introP);
    var grid = el('div');
    grid.style.cssText = 'display:grid;gap:2.5rem;margin-top:2rem;grid-template-columns:1fr';
    grid.appendChild(listWrap);
    grid.appendChild(detail);
    root.appendChild(grid);
    var mq = window.matchMedia('(min-width:1024px)');
    function applyGrid() { grid.style.gridTemplateColumns = mq.matches ? '5fr 7fr' : '1fr'; }
    applyGrid(); mq.addEventListener('change', applyGrid);
    render();
  }

  /* ---------- Catálogo ---------- */
  function initCatalogo() {
    var root = document.getElementById('catalogo-root');
    if (!root) return;
    var EV_COR = { Alta:'badge-teal', Moderada:'badge-cobalt', Limitada:'badge-amber', 'Em debate':'badge-coral' };
    var ALL = 'todos';
    var state = { busca:'', finalidade:ALL, tipo:ALL, evidencia:ALL, aplicacao:ALL, restrito:ALL, licenca:ALL };
    var filtros = [
      ['finalidade','Finalidade',['Seleção','Desenvolvimento','Equipes','Liderança','Cultura']],
      ['tipo','Tipo de construto',['Traço','Estado','Preferência','Competência','Comportamento','Percepção']],
      ['evidencia','Nível de evidência',['Alta','Moderada','Limitada','Em debate']],
      ['aplicacao','Aplicação',['Individual','Coletiva','Organizacional']],
      ['restrito','Restrição',[['sim','Restrito a psicólogos'],['nao','Não restrito']]],
      ['licenca','Licença',['Gratuito','Licenciado','Proprietário']],
    ];

    var filterBar = el('div');
    filterBar.style.cssText = 'border:1px solid rgba(28,32,36,0.2);background:var(--sand);padding:1.25rem';
    var search = el('input');
    search.type = 'search';
    search.placeholder = 'Buscar método ou construto…';
    search.setAttribute('aria-label','Buscar no catálogo');
    search.style.cssText = 'height:2.75rem;width:100%;border:1px solid rgba(28,32,36,0.25);background:var(--ivory);padding:0 0.75rem;font-size:0.875rem;font-family:inherit';
    search.addEventListener('input', function () { state.busca = search.value; render(); });
    filterBar.appendChild(search);
    var fgrid = el('div');
    fgrid.style.cssText = 'display:grid;gap:0.75rem;margin-top:1rem;grid-template-columns:repeat(2,1fr)';
    if (window.matchMedia('(min-width:1024px)').matches) fgrid.style.gridTemplateColumns = 'repeat(6,1fr)';
    filtros.forEach(function (f) {
      var wrap = el('div', 'field');
      wrap.appendChild(el('label', null, f[1]));
      var sel = el('select');
      sel.innerHTML = '<option value="' + ALL + '">Todos</option>' + f[2].map(function (o) {
        var v = Array.isArray(o) ? o[0] : o; var l = Array.isArray(o) ? o[1] : o;
        return '<option value="' + v + '">' + l + '</option>';
      }).join('');
      sel.addEventListener('change', function () { state[f[0]] = sel.value; render(); });
      wrap.appendChild(sel);
      fgrid.appendChild(wrap);
    });
    filterBar.appendChild(fgrid);
    root.appendChild(filterBar);

    var countP = el('p');
    countP.style.cssText = 'margin-top:1.5rem;font-size:11px;text-transform:uppercase;letter-spacing:0.14em;color:rgba(28,32,36,0.6)';
    root.appendChild(countP);
    var listRoot = el('div');
    root.appendChild(listRoot);

    function filtered() {
      return D.METODOS.filter(function (m) {
        if (state.busca && (m.nome + ' ' + m.mede).toLowerCase().indexOf(state.busca.toLowerCase()) < 0) return false;
        if (state.finalidade !== ALL && m.finalidade.indexOf(state.finalidade) < 0) return false;
        if (state.tipo !== ALL && m.tipo !== state.tipo) return false;
        if (state.evidencia !== ALL && m.evidencia !== state.evidencia) return false;
        if (state.aplicacao !== ALL && m.aplicacao.indexOf(state.aplicacao) < 0) return false;
        if (state.restrito === 'sim' && !m.restrito) return false;
        if (state.restrito === 'nao' && m.restrito) return false;
        if (state.licenca !== ALL && m.licenca !== state.licenca) return false;
        return true;
      });
    }

    function card(m) {
      var c = el('article', 'method-card');
      c.innerHTML =
        '<div class="flex items-center justify-between gap-3">' +
          '<h3>' + m.nome + '</h3>' +
          '<span class="badge ' + EV_COR[m.evidencia] + '" style="flex-shrink:0">' + m.evidencia + '</span>' +
        '</div>' +
        '<p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.75)">' + m.mede + '</p>' +
        '<dl class="meta" style="margin:1rem 0 0">' +
          [['Mede',m.tipo],['Uso',m.uso],['KPIs',m.kpis.join(' · ')],['Licença',m.licenca + (m.restrito ? ' · restrito a psicólogos' : '')]].map(function (r) {
            return '<div><dt>' + r[0] + '</dt><dd style="margin:0">' + r[1] + '</dd></div>';
          }).join('') +
        '</dl>';
      var body = el('div');
      body.style.cssText = 'margin-top:1rem;border-top:1px solid rgba(28,32,36,0.1);padding-top:1rem;font-size:0.875rem;line-height:1.6';
      var risco = false;
      function drawBody() {
        body.innerHTML = (risco
          ? '<p style="margin:0;color:rgba(28,32,36,0.8)"><strong style="color:var(--coral)">Riscos e limites: </strong>' + m.riscos + '</p>'
          : '<p style="margin:0;color:rgba(28,32,36,0.8)"><strong style="color:var(--teal)">Potencial: </strong>' + m.potencial + '</p>');
      }
      drawBody();
      var toggle = el('button', null, 'Ver riscos');
      toggle.style.cssText = 'margin-top:1rem;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--petrol);background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:4px';
      toggle.addEventListener('click', function () { risco = !risco; toggle.textContent = risco ? 'Ver potencial' : 'Ver riscos'; drawBody(); });
      var foot = el('div');
      foot.style.cssText = 'margin-top:auto;padding-top:1rem';
      foot.appendChild(toggle);
      foot.appendChild(el('p', null, m.satepsi + ' · Fonte: ' + m.fonte));
      foot.lastChild.style.cssText = 'margin-top:0.75rem;font-size:10px;line-height:1.5;color:rgba(28,32,36,0.5)';
      c.appendChild(body);
      c.appendChild(foot);
      return c;
    }

    function render() {
      var list = filtered();
      countP.textContent = list.length + ' de ' + D.METODOS.length + ' métodos';
      listRoot.innerHTML = '';
      if (!list.length) {
        var p = el('p', null, 'Nenhum método corresponde aos filtros. Amplie os critérios ou limpe a busca.');
        p.style.cssText = 'margin-top:2.5rem;border:1px solid rgba(28,32,36,0.2);padding:2rem;font-size:0.875rem;color:rgba(28,32,36,0.7)';
        listRoot.appendChild(p);
        return;
      }
      D.FAMILIAS.forEach(function (fam) {
        var itens = list.filter(function (m) { return m.familia === fam.id; });
        if (!itens.length) return;
        var sec = el('div');
        sec.style.cssText = 'margin-top:3rem';
        var h = el('h2', 'serif italic', fam.nome);
        h.style.cssText = 'border-top:2px solid var(--graphite);padding-top:1rem;font-size:1.5rem;font-weight:300;margin:0';
        sec.appendChild(h);
        var grid = el('div');
        grid.style.cssText = 'display:grid;gap:1.25rem;margin-top:1.5rem;grid-template-columns:1fr';
        var mq = window.matchMedia('(min-width:768px)');
        grid.style.gridTemplateColumns = mq.matches ? (window.matchMedia('(min-width:1280px)').matches ? 'repeat(3,1fr)' : 'repeat(2,1fr)') : '1fr';
        itens.forEach(function (m) { grid.appendChild(card(m)); });
        sec.appendChild(grid);
        listRoot.appendChild(sec);
      });
    }
    render();
  }

  /* ---------- Matriz ---------- */
  function initMatriz() {
    var root = document.getElementById('matriz-root');
    if (!root) return;
    var sel = 'seguranca-psicologica';
    var ETAPAS = ['Comportamento observável','Efeito no processo','Indicador antecedente','KPI operacional','KPI financeiro'];

    var left = el('div');
    var right = el('div');
    function render() {
      var f = D.FATORES.find(function (x) { return x.id === sel; });
      var kpis = D.KPIS.filter(function (k) { return f.kpis.indexOf(k.id) >= 0; });
      left.innerHTML = '<p class="eyebrow eyebrow-muted">Fatores humanos</p>';
      var grid = el('div');
      grid.style.cssText = 'margin-top:0.75rem;display:grid;gap:1px;border:1px solid rgba(28,32,36,0.15);background:rgba(28,32,36,0.15);grid-template-columns:1fr 1fr';
      if (window.matchMedia('(min-width:1024px)').matches) grid.style.gridTemplateColumns = '1fr';
      D.FATORES.forEach(function (x) {
        var b = el('button', null, x.nome);
        b.style.cssText = 'padding:0.75rem 1rem;text-align:left;font-size:0.875rem;font-weight:600;cursor:pointer;border:none;background:' + (sel === x.id ? 'var(--petrol)' : 'var(--ivory)') + ';color:' + (sel === x.id ? 'var(--ivory)' : 'rgba(28,32,36,0.75)');
        b.addEventListener('click', function () { sel = x.id; render(); });
        grid.appendChild(b);
      });
      left.appendChild(grid);

      var chainHtml = f.cadeia.map(function (s, i) {
        return '<li style="position:relative;padding:0 0 1.5rem 2rem"><span style="position:absolute;left:0;top:4px;width:16px;height:16px;border-radius:50%;border:2px solid var(--petrol);background:var(--ivory)"></span><p class="eyebrow eyebrow-muted" style="margin:0">' + ETAPAS[i] + '</p><p style="margin:0.25rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.85)">' + s + '</p></li>';
      }).join('');
      var kpiHtml = kpis.map(function (k) {
        return '<span class="' + (k.distal ? '' : 'badge-graphite') + '" style="' + (k.distal ? 'border:1px dashed rgba(28,32,36,0.4);color:rgba(28,32,36,0.6);padding:0.25rem 0.5rem;font-size:0.75rem' : '') + '">' + k.nome + (k.distal ? ' (distal)' : '') + '</span>';
      }).join(' ');
      right.innerHTML =
        '<div class="flex flex-wrap items-center gap-3"><h2 class="serif italic" style="font-size:1.875rem;margin:0">' + f.nome + '</h2><span class="badge ' + D.EVIDENCIA_CORES[f.evidencia] + '">Evidência ' + f.evidencia.toLowerCase() + '</span></div>' +
        '<p style="margin:0.5rem 0 0;max-width:42rem;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.7)">' + f.descricao + '</p>' +
        '<ol style="margin:2rem 0 0;padding:0;list-style:none">' + chainHtml + '</ol>' +
        '<div class="grid-2" style="margin-top:1.5rem">' +
          '<div style="background:var(--ivory);padding:1.25rem"><p class="eyebrow eyebrow-teal">Impacto positivo plausível</p><p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + f.positivo + '</p></div>' +
          '<div style="background:var(--ivory);padding:1.25rem"><p class="eyebrow text-coral">Impacto negativo plausível</p><p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + f.negativo + '</p></div>' +
        '</div>' +
        '<dl style="margin-top:1.5rem;display:grid;gap:1.25rem;grid-template-columns:1fr">' +
          '<div style="border-top:1px solid rgba(28,32,36,0.15);padding-top:0.75rem"><dt class="eyebrow eyebrow-muted">Variáveis moderadoras</dt><dd style="margin:0.5rem 0 0;display:flex;flex-wrap:wrap;gap:0.375rem">' + f.moderadoras.map(function (m) { return '<span style="border:1px solid rgba(28,32,36,0.25);padding:0.25rem 0.5rem;font-size:0.75rem;color:rgba(28,32,36,0.75)">' + m + '</span>'; }).join('') + '</dd></div>' +
          '<div style="border-top:1px solid rgba(28,32,36,0.15);padding-top:0.75rem"><dt class="eyebrow eyebrow-muted">Prazo provável</dt><dd style="margin:0.5rem 0 0;font-size:0.875rem;color:rgba(28,32,36,0.8)">' + f.prazo + '</dd></div>' +
          '<div style="border-top:1px solid rgba(28,32,36,0.15);padding-top:0.75rem"><dt class="eyebrow eyebrow-muted">Dados necessários</dt><dd style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + f.dados.join(' · ') + '</dd></div>' +
          '<div style="border-top:1px solid rgba(28,32,36,0.15);padding-top:0.75rem"><dt class="eyebrow eyebrow-muted">KPIs potencialmente relacionados</dt><dd style="margin:0.5rem 0 0;display:flex;flex-wrap:wrap;gap:0.375rem">' + kpiHtml + '</dd></div>' +
        '</dl>';
      if (window.matchMedia('(min-width:768px)').matches) right.querySelector('dl').style.gridTemplateColumns = '1fr 1fr';
      if (f.evidencia === 'Emergente' || f.evidencia === 'Hipótese') {
        var warn = el('p', 'notice-amber flex', '<span>⚠</span><span>Para este fator, a relação com resultados é majoritariamente hipótese ou correlação. Trate como pergunta a testar, não como alavanca garantida.</span>');
        warn.style.marginTop = '1.5rem';
        right.appendChild(warn);
      }
    }
    root.style.display = 'grid';
    root.style.gap = '2.5rem';
    root.style.gridTemplateColumns = '1fr';
    var mq = window.matchMedia('(min-width:1024px)');
    function applyGrid() { root.style.gridTemplateColumns = mq.matches ? '4fr 8fr' : '1fr'; }
    applyGrid(); mq.addEventListener('change', applyGrid);
    root.appendChild(left);
    root.appendChild(right);
    render();
  }

  /* ---------- Laboratório ---------- */
  function initLaboratorio() {
    var root = document.getElementById('lab-root');
    if (!root) return;
    var st = { empregados:250, faturamento:80, salario:6000, turnover:18, absenteismo:5, retrabalho:8, investimento:300 };
    function BRL(v) { return v >= 1e6 ? 'R$ ' + (v/1e6).toFixed(1).replace('.',',') + ' mi' : 'R$ ' + Math.round(v/1e3) + ' mil'; }

    var campos = [
      ['empregados','Empregados',20,5000,10,''],
      ['faturamento','Faturamento anual',5,1000,5,' mi'],
      ['salario','Salário médio mensal',2000,25000,250,''],
      ['turnover','Turnover anual',2,60,1,'%'],
      ['absenteismo','Absenteísmo',1,20,0.5,'%'],
      ['retrabalho','Retrabalho',1,30,1,'%'],
      ['investimento','Investimento previsto',50,3000,50,' mil'],
    ];
    var left = el('div');
    left.innerHTML = '<p class="eyebrow eyebrow-muted">Premissas da sua empresa</p>';
    campos.forEach(function (c) {
      var key = c[0], label = c[1], min = c[2], max = c[3], step = c[4], un = c[5];
      var row = el('div');
      row.style.cssText = 'border-top:1px solid rgba(28,32,36,0.15);padding:1rem 0';
      row.innerHTML =
        '<div class="flex items-baseline justify-between gap-3"><label style="font-size:0.875rem;font-weight:600">' + label + '</label>' +
        '<span class="tnum" style="font-size:0.875rem;font-weight:700;color:var(--petrol)" id="val-' + key + '">' + st[key].toLocaleString('pt-BR') + un + '</span></div>';
      var input = el('input');
      input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = st[key];
      input.style.cssText = 'margin-top:0.5rem;width:100%;accent-color:var(--petrol)';
      input.addEventListener('input', function () { st[key] = Number(input.value); document.getElementById('val-'+key).textContent = st[key].toLocaleString('pt-BR') + un; compute(); });
      row.appendChild(input);
      left.appendChild(row);
    });
    var note = el('p', null, 'Premissas fixas do modelo: reposição ≈ 60% do salário anual por saída; 35% do valor do retrabalho vira custo; reduções relativas de 5%, 10% e 20% nos três custos, por cenário.');
    note.style.cssText = 'margin-top:1rem;font-size:0.75rem;line-height:1.5;color:rgba(28,32,36,0.6)';
    left.appendChild(note);

    var right = el('div');
    var costBox = el('div');
    var scenBox = el('div');
    var sensBox = el('div');
    var testBox = el('div');
    right.appendChild(costBox);
    right.appendChild(scenBox);
    right.appendChild(sensBox);
    right.appendChild(testBox);

    function compute() {
      var salAno = st.salario * 13.3;
      var custoTurn = st.empregados * (st.turnover/100) * salAno * 0.6;
      var custoAbs = st.empregados * salAno * (st.absenteismo/100);
      var custoRetr = st.faturamento * 1e6 * (st.retrabalho/100) * 0.35;
      var cenarios = [{nome:'Conservador',f:0.05},{nome:'Central',f:0.1},{nome:'Otimista',f:0.2}].map(function (c) {
        var eco = (custoTurn + custoAbs + custoRetr) * c.f;
        return { nome:c.nome, economia:eco, min:eco*0.5, max:eco*1.6, roi:eco/(st.investimento*1e3) };
      });
      var maxEco = Math.max.apply(null, cenarios.map(function (c) { return c.max; }));
      var sens = [{nome:'Turnover',v:custoTurn},{nome:'Retrabalho',v:custoRetr},{nome:'Absenteísmo',v:custoAbs}].sort(function (a,b) { return b.v - a.v; });

      costBox.innerHTML = '<p class="eyebrow eyebrow-muted">Custo anual estimado hoje</p>' +
        '<div class="grid-3" style="margin-top:0.75rem">' +
          [['Turnover',custoTurn],['Absenteísmo',custoAbs],['Retrabalho',custoRetr]].map(function (r) {
            return '<div style="background:var(--ivory);padding:1.25rem"><p style="font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(28,32,36,0.6);margin:0">' + r[0] + '</p><p class="tnum" style="margin:0.25rem 0 0;font-size:1.5rem;font-weight:900">' + BRL(r[1]) + '</p></div>';
          }).join('') +
        '</div>';

      scenBox.innerHTML = '<p class="eyebrow eyebrow-muted" style="margin-top:2rem">Economia anual possível, por cenário (faixas = incerteza)</p>' +
        cenarios.map(function (c) {
          return '<div style="margin-top:1rem"><div class="flex items-baseline justify-between"><p style="font-size:0.875rem;font-weight:600;margin:0">' + c.nome + '</p>' +
            '<p class="tnum" style="font-size:0.875rem;color:rgba(28,32,36,0.7);margin:0">' + BRL(c.min) + ' — ' + BRL(c.max) + ' · retorno de ' + c.roi.toFixed(1).replace('.',',') + '× o investimento</p></div>' +
            '<div style="position:relative;margin-top:0.5rem;height:1.5rem;width:100%;background:var(--sand)">' +
              '<div style="position:absolute;top:50%;height:0.5rem;transform:translateY(-50%);background:rgba(20,80,92,0.25);left:' + (c.min/maxEco*100) + '%;width:' + ((c.max-c.min)/maxEco*100) + '%"></div>' +
              '<div style="position:absolute;top:0;height:100%;background:var(--petrol);width:' + (c.economia/maxEco*100) + '%"></div>' +
            '</div></div>';
        }).join('');

      sensBox.innerHTML = '<div class="grid-2" style="margin-top:2rem">' +
        '<div style="background:var(--ivory);padding:1.25rem"><p class="eyebrow eyebrow-muted">Sensibilidade</p><p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">A variável que mais move o resultado é <strong>' + sens[0].nome.toLowerCase() + '</strong>. Comece medindo-a bem antes de investir.</p></div>' +
        '<div style="background:var(--ivory);padding:1.25rem"><p class="eyebrow eyebrow-muted">Prazo e acompanhamento</p><p style="margin:0.5rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">Sinais em 1–2 trimestres; efeitos financeiros em 3–6. Acompanhe indicadores antecedentes (relatos de erro, adesão, pulso) além dos financeiros.</p></div>' +
      '</div>';

      testBox.innerHTML = '<div style="margin-top:1.5rem;border:1px solid rgba(28,32,36,0.2);background:var(--sand);padding:1.25rem"><p class="eyebrow eyebrow-muted">Como testar de verdade</p><ul style="margin:0.5rem 0 0;padding-left:1rem;font-size:0.875rem;line-height:1.7;color:rgba(28,32,36,0.8)"><li>Piloto em algumas equipes, com linha de base registrada antes.</li><li>Grupo de comparação semelhante que não recebe a intervenção.</li><li>Séries históricas para separar tendência de efeito.</li><li>Diferenças-em-diferenças para estimar o efeito incremental.</li></ul></div>' +
        '<p class="notice-amber flex" style="margin-top:1.5rem"><span>⚠</span><span>Estimativas ilustrativas, não fatos. Os multiplicadores são premissas didáticas; a sua organização precisa estimá-los com os próprios dados.</span></p>';
    }
    root.style.display = 'grid';
    root.style.gap = '2.5rem';
    root.style.gridTemplateColumns = '1fr';
    var mq = window.matchMedia('(min-width:1024px)');
    function applyGrid() { root.style.gridTemplateColumns = mq.matches ? '4fr 8fr' : '1fr'; }
    applyGrid(); mq.addEventListener('change', applyGrid);
    root.appendChild(left);
    root.appendChild(right);
    compute();
  }

  /* ---------- Glossário ---------- */
  function initGlossario() {
    var root = document.getElementById('gloss-root');
    if (!root) return;
    var busca = '';
    var search = el('input');
    search.type = 'search';
    search.placeholder = 'Buscar termo…';
    search.setAttribute('aria-label','Buscar no glossário');
    search.style.cssText = 'height:2.75rem;width:100%;max-width:28rem;border:1px solid rgba(28,32,36,0.25);background:transparent;padding:0 0.75rem 0 2.25rem;font-size:0.875rem;font-family:inherit';
    var wrap = el('div');
    wrap.style.cssText = 'position:relative;max-width:28rem;margin-top:2rem';
    wrap.innerHTML = '<span style="position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:rgba(28,32,36,0.4)">⌕</span>';
    wrap.appendChild(search);
    root.appendChild(wrap);
    var dl = el('dl');
    dl.style.marginTop = '2rem';
    root.appendChild(dl);
    function render() {
      var termos = D.GLOSSARIO.filter(function (g) { return !busca || (g.termo + ' ' + g.definicao).toLowerCase().indexOf(busca.toLowerCase()) >= 0; })
        .sort(function (a, b) { return a.termo.localeCompare(b.termo, 'pt-BR'); });
      if (!termos.length) {
        dl.innerHTML = '<p style="border:1px solid rgba(28,32,36,0.2);padding:2rem;font-size:0.875rem;color:rgba(28,32,36,0.7)">Nenhum termo encontrado para "' + busca + '".</p>';
        return;
      }
      dl.innerHTML = termos.map(function (g) {
        return '<div style="display:grid;gap:0.5rem;border-top:1px solid rgba(28,32,36,0.15);padding:1.25rem 0;grid-template-columns:1fr">' +
          '<dt class="serif italic" style="font-size:1.25rem">' + g.termo + '</dt>' +
          '<dd style="margin:0"><p style="margin:0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + g.definicao + '</p>' +
          '<p style="margin:0.375rem 0 0;border-left:2px solid var(--teal);padding-left:0.75rem;font-size:0.875rem;font-style:italic;line-height:1.6;color:rgba(28,32,36,0.65)">' + g.exemplo + '</p></dd></div>';
      }).join('');
      if (window.matchMedia('(min-width:768px)').matches) {
        Array.prototype.forEach.call(dl.children, function (d) { d.style.gridTemplateColumns = '4fr 8fr'; });
      }
    }
    search.addEventListener('input', function () { busca = search.value; render(); });
    render();
  }

  /* ---------- Casos ---------- */
  function initCasos() {
    var root = document.getElementById('casos-root');
    if (!root) return;
    root.innerHTML = D.CASOS.map(function (c, idx) {
      var rows = [['Problema',c.problema],['Hipótese',c.hipotese],['Dados utilizados',c.dados],['Método',c.metodo],['Intervenção',c.intervencao],['Resultados informados',c.resultados]];
      return '<article style="display:grid;gap:2rem;border-top:2px solid var(--graphite);padding-top:2rem;margin-top:4rem;grid-template-columns:1fr">' +
        '<div><span class="badge ' + D.TIPO_CORES[c.tipo] + '">' + c.tipo + '</span>' +
        '<h2 class="serif italic" style="font-size:1.875rem;margin:0.75rem 0 0">' + c.titulo + '</h2>' +
        '<p class="eyebrow eyebrow-muted" style="margin-top:0.5rem">' + c.organizacao + ' · ' + c.ano + '</p>' +
        '<p style="margin-top:1rem;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.75)">' + c.resumo + '</p>' +
        '<a href="' + c.fonte.url + '" target="_blank" rel="noopener noreferrer" style="display:inline-flex;margin-top:1rem;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.14em;color:var(--petrol)">Fonte original ↗</a></div>' +
        '<div><dl style="display:grid;gap:1.25rem;grid-template-columns:1fr">' +
          rows.map(function (r) {
            return '<div style="border-top:1px solid rgba(28,32,36,0.1);padding-top:0.75rem"><dt class="eyebrow eyebrow-muted"><span class="tnum" style="margin-right:0.5rem;color:rgba(28,32,36,0.35)">' + String(idx+1).padStart(2,'0') + '</span>' + r[0] + '</dt><dd style="margin:0.375rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + r[1] + '</dd></div>';
          }).join('') +
        '</dl>' +
        '<div class="grid-2" style="margin-top:1.25rem">' +
          '<div style="background:rgba(201,114,26,0.1);padding:1rem"><p class="eyebrow text-amber">Limitações</p><p style="margin:0.375rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + c.limitacoes + '</p></div>' +
          '<div style="background:rgba(31,110,92,0.1);padding:1rem"><p class="eyebrow eyebrow-teal">O que pode ser aprendido</p><p style="margin:0.375rem 0 0;font-size:0.875rem;line-height:1.6;color:rgba(28,32,36,0.8)">' + c.aprendizado + '</p></div>' +
        '</div></div>' +
      '</article>';
    }).join('');
    if (window.matchMedia('(min-width:1024px)').matches) {
      Array.prototype.forEach.call(root.children, function (a) { a.style.gridTemplateColumns = '4fr 8fr'; });
    }
  }

  function init() {
    renderHeader();
    renderFooter();
    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    else if (page === 'disciplinas') initDisciplinas();
    else if (page === 'catalogo') initCatalogo();
    else if (page === 'matriz') initMatriz();
    else if (page === 'laboratorio') initLaboratorio();
    else if (page === 'glossario') initGlossario();
    else if (page === 'casos') initCasos();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
