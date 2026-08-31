

## Correção de escopo — landing page de tráfego pago

- [x] Reutilizar a logo real da Kriaat da página original.
- [x] Reproduzir as cores, tipografia e linguagem visual do site original.
- [x] Remover a identidade visual Radar Local e os elementos decorativos excessivos.
- [x] Reduzir a página para uma estrutura curta e objetiva.
- [x] Manter um único objetivo principal: levar o visitante ao formulário de lead.
- [x] Escrever headline e CTA centrados em contratação de tráfego pago para negócios locais.
- [x] Validar mobile, contraste, formulário e caminho de conversão.
- [x] Salvar checkpoint e atualizar o repositório GitHub existente.


## Leads e integração futura com Supabase

- [x] Explicar a oferta do PDF de forma breve: gestão Meta Ads, Google Ads, Meta + Google, criativos e Perfil da Empresa no Google.
- [x] Deixar implantação inicial e verba de mídia claramente separadas da mensalidade.
- [x] Fazer todos os CTAs abrirem o formulário conversacional em modal.
- [x] Perguntar nome, telefone/WhatsApp, negócio, sem exigir cidade/região, se já investe em tráfego pago, objetivo e faixa de investimento.
- [x] Preparar payload de lead com origem, campanha/UTM, data e consentimento.
- [x] Preparar integração segura para persistência posterior no Supabase, sem expor chave secreta no frontend.
- [x] Validar estados de carregamento, sucesso, erro, teclado e mobile.


## Pendências identificadas na validação final

- [x] Incluir timestamp explícito no payload enviado ao backend.
- [x] Exibir estado visível de carregamento enquanto o lead é enviado.
- [x] Testar manualmente o modal conversacional e todos os CTAs após a integração tRPC.
- [x] Executar e registrar uma checagem objetiva de contraste dos CTAs e campos do formulário.
- [x] Salvar novo checkpoint após as mudanças de leads/backend e atualizar o GitHub.

- [x] Corrigir contraste do verde de CTA/preço para atingir leitura WCAG adequada sem alterar a paleta da marca.

- [x] Reexecutar a checagem final de contraste com os valores aplicados e cobrir campos, labels, placeholders e foco do formulário.
- [x] Medir explicitamente contraste de placeholder e pergunta/label visível do formulário com os valores finais do CSS.

- [x] Testar no navegador todos os CTAs principais; 8 de 8 abriram o modal conversacional via teste CDP.
- [x] Percorrer no navegador as etapas do chat; campos avançaram, opções foram selecionadas e a última etapa permaneceu bloqueada até o consentimento, sem inserir lead fictício.


## Ajuste de posicionamento geográfico

- [x] Remover menções a Camboriú, Balneário Camboriú, Itajaí, cidade, região e atendimento local da copy e dos metadados da página.
- [x] Ajustar campos e textos do formulário para não exigir cidade ou região.
- [x] Validar a ausência de referências geográficas na página final.
- [x] Salvar checkpoint e atualizar o repositório GitHub após a remoção.
- [ ] Salvar um novo checkpoint contendo a versão sem referências geográficas.
- [ ] Atualizar o repositório GitHub com o commit/checkpoint da versão sem referências geográficas.
