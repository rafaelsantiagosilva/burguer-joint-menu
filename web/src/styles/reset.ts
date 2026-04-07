export const ResetStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'VarelaRound', Verdana, Geneva, Tahoma, sans-serif;
  }

  /* Remove a formatação padrão de fontes */
  body {
    font-family: 'Arial', sans-serif;
    line-height: 1.5;
    color: #333;
  }

  /* Remove estilos padrão de listas e links */
  ol, ul {
    list-style: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  /* Reset das tabelas */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Remover as bordas padrão de input e botão */
  input, button {
    border: none;
    background: transparent;
  }

  /* Reseta o estilo de imagens para impedir que elas se expandam automaticamente */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Reset para elementos de formatação, como blockquote */
  blockquote {
    margin: 0;
    padding: 0;
    quotes: none;
  }

  /* Adicionando algum espaço básico para o conteúdo da página */
  body {
    background-color: #f8f9fa;
  }
`;