# Pontes & Serafini Advocacia Previdenciária

Site institucional (landing page) do escritório Pontes & Serafini Advocacia Previdenciária, em São Fidélis/RJ.

Feito em HTML, CSS e JavaScript puros: não há dependências nem etapa de build.

## Visualizar localmente

```bash
python -m http.server 8080
```

Depois é só abrir http://localhost:8080.

## Onde editar

| O quê | Arquivo |
|---|---|
| WhatsApp, mensagem inicial, nota e avaliações do Google | `js/main.js` → objeto `SITE` |
| Textos e seções | `index.html` |
| Cores, fontes e layout | `css/style.css` (variáveis em `:root`) |
| Imagens e vídeos | `assets/img/` e `assets/video/` |

## Pendências (placeholders no código)

Para encontrar cada uma, busque o texto entre colchetes no código:

- `[GOOGLE_RATING]` e `[GOOGLE_REVIEWS_COUNT]`: preencher em `js/main.js` depois de confirmar no Google.
- `[FORMAÇÃO]`, `[ESPECIALIZAÇÃO]`, `[ÁREA DE ATUAÇÃO]` e `[EXPERIÊNCIA]`: dados de Gláucia Serafini.
- `[E-MAIL]` e `[OAB]`: no rodapé.
- Link da Política de Privacidade.
