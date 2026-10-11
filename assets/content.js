/* Psiconometria — conteúdo das páginas (textos que não vêm de data.js).
   Os blocos marcados "original" foram migrados literalmente das páginas anteriores;
   os demais são conteúdo novo da home. */
window.PSICO_PAGES = (function () {

  /* Home — termos da equação (novo) */
  var EQ = [
    { id:'kpi', disc:'O resultado', titulo:'KPI: o indicador que a empresa quer mover',
      texto:'Retrabalho, turnover, NPS, vendas por loja. A Psiconometria parte sempre de um indicador de negócio concreto, nunca de um teste procurando aplicação.',
      ex:'Exemplo: taxa de retrabalho de cada equipe, por trimestre.' },
    { id:'alpha', disc:'Econometria', titulo:'α: o ponto de partida',
      texto:'O nível do indicador que existiria sem o fator estudado. Serve de referência para saber se algo mudou.',
      ex:'Exemplo: o retrabalho médio esperado de uma equipe qualquer da rede.' },
    { id:'beta', disc:'Econometria', titulo:'β: quanto o fator humano pesa, e com que certeza',
      texto:'O efeito estimado do fator sobre o indicador. A econometria entrega β com intervalo de confiança e diz se é associação ou efeito causal. Um β sem intervalo é opinião com número.',
      ex:'Exemplo: cada ponto a mais no índice de segurança psicológica associa-se a 1,5 ponto percentual a menos de retrabalho, com intervalo entre 0,2 e 2,9.' },
    { id:'fator', disc:'Psicometria', titulo:'Fator: a característica humana, medida de verdade',
      texto:'Liderança, segurança psicológica, carga de trabalho, clareza de papel. A psicometria garante que a medida tem definição, confiabilidade e validade para esse uso. Se o fator for mal medido, nenhum modelo salva a conclusão.',
      ex:'Exemplo: escala curta e validada, aplicada por equipe e analisada só como média do grupo.' },
    { id:'gamma', disc:'Econometria', titulo:'γ · Contexto: o que também explica o resultado',
      texto:'Volume, tempo de casa, região, ferramenta, sazonalidade. Controlar o contexto evita atribuir às pessoas o que é efeito do processo ou do mercado.',
      ex:'Exemplo: equipes mais experientes podem ter, ao mesmo tempo, mais segurança e menos erros.' },
    { id:'eps', disc:'Psicometria e econometria', titulo:'ε: o que não sabemos',
      texto:'Erro de medida e fatores não observados. Declarar o tamanho do erro é o que separa uma análise honesta de uma narrativa convincente.',
      ex:'Exemplo: no caso ilustrativo, o fator explica cerca de 20% da variação do retrabalho; os outros 80% estão em outro lugar.' }
  ];

  /* Home — exemplo didático (novo; dados fictícios, 24 equipes) */
  var EXEMPLO = {
    pontos: [[2.4,10.2],[3.48,7.4],[3.75,8.2],[3.68,6.7],[3.72,7.8],[3.8,9.8],[4.58,8.8],[4.24,7.8],[3.21,10.9],[3.57,11.7],[3.57,6],[3.67,6.8],[3.67,11.3],[3.25,9.6],[4.61,7.7],[3.06,10.4],[2.63,12.4],[3.4,6.6],[3.13,11.1],[3.54,7.7],[3.53,9.2],[2.89,8.9],[3.58,10.6],[2.95,10]],
    a: 14.37, b: -1.52, lo: -2.87, hi: -0.17, r2: 0.20
  };

  /* Home — dores (novo) */
  var DORES = [
    { titulo:'Investimos em treinamento, benefícios e clima, mas não sabemos o que voltou.',
      sintoma:'O orçamento de pessoas é aprovado por convicção e cortado na primeira crise, porque ninguém consegue mostrar efeito.',
      abordagem:'Cada iniciativa vira uma hipótese com linha de base, grupo de comparação e indicador acompanhado. A resposta pode ser "não funcionou", e isso também economiza dinheiro.',
      passo:'Escolher uma iniciativa em curso e registrar a linha de base antes do próximo ciclo.',
      link:{ href:'laboratorio.html', texto:'Estimar o impacto no Laboratório' } },
    { titulo:'Perdemos gente boa e só descobrimos o motivo na entrevista de desligamento.',
      sintoma:'O turnover é medido depois que acontece, e as causas ficam registradas como "proposta melhor".',
      abordagem:'Acompanhar antecedentes por equipe (liderança direta, carga, clareza de papel, segurança psicológica) e relacioná-los às saídas dos meses seguintes.',
      passo:'Cruzar o histórico de saídas por gestor com uma medida curta e validada de liderança.',
      link:{ href:'matriz.html', texto:'Ver os mecanismos na Matriz Pessoas × KPIs' } },
    { titulo:'A pesquisa de clima sobe dois pontos, cai três, e ninguém sabe se algo mudou.',
      sintoma:'O índice é tratado como placar, e variações pequenas geram planos de ação.',
      abordagem:'Toda medida tem erro. A psicometria diz quanto da variação é ruído; a econometria diz se a diferença entre equipes ou períodos é real.',
      passo:'Calcular a confiabilidade dos itens atuais e o intervalo de confiança do índice por área.',
      link:{ href:'as-duas-disciplinas.html#psi-2', texto:'Entender confiabilidade e erro de medida' } },
    { titulo:'Usamos um teste de perfil para contratar e promover.',
      sintoma:'Decisões de alto impacto apoiadas em tipologias populares, sem evidência de validade para esse uso.',
      abordagem:'Cada instrumento é avaliado pelo que mede, para que uso tem evidência e quais riscos traz. Perfis apoiam conversas de desenvolvimento; não decidem sozinhos sobre pessoas.',
      passo:'Listar os instrumentos em uso e conferir no catálogo o nível de evidência de cada um.',
      link:{ href:'catalogo.html', texto:'Consultar o catálogo de avaliações' } },
    { titulo:'O retrabalho aumentou e o processo já foi revisado três vezes.',
      sintoma:'Mudanças de procedimento não resolvem, e os erros continuam aparecendo tarde.',
      abordagem:'Depois de descartar causas de processo, volume e ferramenta, testar hipóteses humanas: fadiga, clareza de papel, disposição para relatar erros cedo.',
      passo:'Medir, por equipe, o tempo entre um erro acontecer e ser relatado.',
      link:{ href:'metodo.html', texto:'Ver o exemplo do retrabalho no Método' } },
    { titulo:'Unidades com o mesmo processo têm resultados muito diferentes.',
      sintoma:'Lojas, filiais ou franquias seguem o mesmo manual e mostram diferenças grandes de vendas, satisfação ou perdas.',
      abordagem:'Modelos multinível separam o que é efeito do mercado local, do gestor da unidade e da equipe, e mostram onde a variação humana pesa de fato.',
      passo:'Reunir os indicadores por unidade junto com dados de contexto: região, porte, tempo de casa do gestor.',
      link:{ href:'as-duas-disciplinas.html#eco-5', texto:'Entender dados em painel e análise longitudinal' } },
    { titulo:'Temos dados de pessoas, mas medo de usá-los.',
      sintoma:'As informações estão espalhadas entre RH, operação e finanças, e há receio legítimo com a LGPD e com expor indivíduos.',
      abordagem:'Finalidade declarada, coleta mínima, análise agregada por grupo com tamanho mínimo e nenhum resultado individual em painéis.',
      passo:'Mapear quais dados já existem e qual pergunta de negócio justificaria cruzá-los.',
      link:{ href:'sobre.html#principios', texto:'Ler os princípios de ética e privacidade' } }
  ];

  /* O que é — original */
  var HUMANA = [
    {id:'caracteristicas',nome:'Características individuais',desc:'Traços, capacidades, valores e experiências que cada pessoa traz.',ligacoes:['decisoes','produtividade']},
    {id:'estados',nome:'Estados psicológicos',desc:'Motivação, confiança, segurança psicológica e fadiga — variáveis que flutuam com o contexto.',ligacoes:['decisoes','processos']},
    {id:'comportamentos',nome:'Comportamentos observáveis',desc:'O que de fato acontece: relatar erros, dar feedback, cooperar, aprender, decidir.',ligacoes:['processos','cliente']},
    {id:'dinamica',nome:'Dinâmica coletiva',desc:'Como a equipe funciona junta: coordenação, conflito, coesão e aprendizagem.',ligacoes:['processos','produtividade']}
  ];
  var EMPRESARIAL = [
    { id: 'decisoes', nome: 'Decisões', desc: 'Escolhas de alocação, prioridade e risco — tomadas por pessoas, sob incerteza.' },
    { id: 'processos', nome: 'Processos', desc: 'O trabalho organizado: fluxos, handoffs, controles e rituais.' },
    { id: 'cliente', nome: 'Experiência do cliente', desc: 'O que o cliente percebe: qualidade, confiança e continuidade.' },
    { id: 'produtividade', nome: 'Produtividade', desc: 'Output por unidade de recurso — gente, tempo, capital.' },
    { id: 'financeiros', nome: 'Resultados financeiros', desc: 'Receita, margens, custos — consequência de muitas causas.' },
    { id: 'valor', nome: 'Valor', desc: 'Resultado distal: valuation e rentabilidade dependem também de estratégia, mercado e capital.' }
  ];
  var DISTINCOES = [
    {t:'Diagnóstico organizacional',d:'Lê sistemas: processos, clima agregado, dinâmicas de equipe. Não avalia indivíduos clinicamente.'},
    {t:'Avaliação psicológica',d:'Prática privativa de psicólogos, regulamentada no Brasil, com instrumentos verificados no SATEPSI. A Psiconometria não a substitui.'},
    {t:'Teste comportamental',d:'Instrumento de autodescrição ou preferência. Pode apoiar conversas de desenvolvimento; não deve decidir contratação, promoção ou demissão isoladamente.'},
    {t:'Correlação',d:'Duas variáveis se movem juntas. Útil para gerar hipóteses e prever — insuficiente para afirmar causa.'},
    {t:'Causalidade',d:'Um fator produz mudança em outro. Exige experimento, quase-experimento ou desenho de identificação — sempre com contexto e limites declarados.'}
  ];

  /* Método — original */
  var ETAPAS = [
    {t:'Definir a pergunta de negócio',d:'Tudo começa de uma pergunta empresarial concreta — nunca de um teste procurando aplicação.'},
    {t:'Mapear o processo e os KPIs',d:'Entender o fluxo de trabalho, seus indicadores atuais e onde a pergunta vive no processo.'},
    {t:'Formular hipóteses humanas e organizacionais',d:'Transformar intuições em hipóteses falsificáveis sobre comportamentos, relações e condições de trabalho.'},
    {t:'Selecionar medidas válidas e proporcionais',d:'Escolher instrumentos com evidência para aquele propósito, população e idioma — nem mais, nem menos invasivos que o necessário.'},
    {t:'Estabelecer linha de base',d:'Medir antes de intervir. Sem linha de base, toda "melhora" é narrativa.'},
    {t:'Testar intervenção e acompanhar resultados',d:'Pilotos com grupo de comparação quando possível; indicadores antecedentes e resultantes monitorados.'},
    {t:'Aprender, recalibrar e documentar limites',d:'Registrar o que funcionou, o que não funcionou e até onde a conclusão pode ir.'}
  ];
  var VERIFICAR = ['definição do processo','mudança de volume','ferramentas','treinamento','metas','qualidade dos insumos','comunicação','composição da equipe','liderança','incentivos','fadiga','segurança psicológica','qualidade da mensuração'];

  /* Sobre — original */
  var BLOCOS = [
    {titulo:'Princípios metodológicos',items:['Toda afirmação factual indica fonte, ano e tipo de evidência.','Correlação e causalidade são sempre separadas.','Estimativas vêm com intervalos e premissas visíveis.','Nenhum instrumento decide sozinho sobre pessoas.','Contexto, população e propósito limitam toda conclusão.','Hipóteses são registradas antes dos resultados.']},
    {titulo:'Política de fontes',items:['Prioridade a fontes acadêmicas, institucionais e primárias.','Resumimos e contextualizamos — nunca copiamos textos.','Distinguimos dado global de dado brasileiro.','Sinalizamos quando a evidência é observacional.','Não transportamos conclusões entre contextos sem ressalva.']},
    {titulo:'Ética, privacidade e uso responsável',items:['Psiconometria não substitui avaliação psicológica profissional.','Testes de uso privativo exigem profissionais habilitados; o SATEPSI deve ser consultado de forma atualizada.','Perfis não são diagnósticos.','Dados comportamentais exigem finalidade legítima, minimização, segurança e governança (LGPD).','Decisões automatizadas que afetam pessoas precisam de transparência e revisão.','Resultados individuais nunca aparecem em dashboards coletivos; usamos anonimização e limites mínimos de grupo.','Este site não coleta dados psicológicos antes de consentimento, governança e segurança adequados.']}
  ];

  /* Contato — opções idênticas ao formulário da versão React */
  var INTERESSES = [
    { value: 'diagnostico', label: 'Diagnóstico organizacional (não clínico)' },
    { value: 'projeto-piloto', label: 'Propor um projeto-piloto' },
    { value: 'conteudo-pesquisa', label: 'Conteúdo e pesquisa' },
    { value: 'consultoria', label: 'Consultoria' },
    { value: 'colaboracao-academica', label: 'Colaboração acadêmica' },
    { value: 'newsletter', label: 'Apenas receber novos estudos' }
  ];

  return { EQ:EQ, EXEMPLO:EXEMPLO, DORES:DORES, HUMANA:HUMANA, EMPRESARIAL:EMPRESARIAL, DISTINCOES:DISTINCOES, ETAPAS:ETAPAS, VERIFICAR:VERIFICAR, BLOCOS:BLOCOS, INTERESSES:INTERESSES };
})();
