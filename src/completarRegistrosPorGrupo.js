function completarRegistrosPorGrupo() {
  const REGISTROS_POR_GRUPO = 6;
  const NOME_ABA = "dados";

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const aba = ss.getSheetByName(NOME_ABA);

  if (!aba) {
    SpreadsheetApp.getUi().alert(`Aba "${NOME_ABA}" não encontrada.`);
    return;
  }

  const dadosOriginais = aba.getDataRange().getValues();
  const numColunas = dadosOriginais[0].length;
  const linhaVazia = Array(numColunas).fill("");

  const resultado = [];

  // Preserva o cabeçalho
  resultado.push(dadosOriginais[0]);

  let i = 1;
  let totalGrupos = 0;
  let totalLinhasInseridas = 0;

  while (i < dadosOriginais.length) {
    const identificador = dadosOriginais[i][0];

    if (
      identificador === "" ||
      identificador === null ||
      identificador === undefined
    ) {
      i++;
      continue;
    }

    // Coleta todas as linhas pertencentes ao mesmo grupo
    const linhasDoGrupo = [];

    while (
      i < dadosOriginais.length &&
      dadosOriginais[i][0] === identificador
    ) {
      linhasDoGrupo.push(dadosOriginais[i]);
      i++;
    }

    // Mantém os registros originais
    linhasDoGrupo.forEach(linha => resultado.push(linha));

    // Completa até atingir a quantidade padrão
    const faltam = REGISTROS_POR_GRUPO - linhasDoGrupo.length;

    for (let f = 0; f < faltam; f++) {
      const novaLinha = linhaVazia.slice();
      novaLinha[0] = identificador;

      resultado.push(novaLinha);
      totalLinhasInseridas++;
    }

    totalGrupos++;
  }

  // Reescreve toda a planilha em uma única operação
  aba.clearContents();
  aba.getRange(1, 1, resultado.length, numColunas).setValues(resultado);

  Logger.log("-----------------------------");
  Logger.log(`Grupos processados : ${totalGrupos}`);
  Logger.log(`Linhas inseridas   : ${totalLinhasInseridas}`);
  Logger.log(`Total de linhas    : ${resultado.length}`);

  SpreadsheetApp.getUi().alert(
    `Processamento concluído!\n\n` +
    `Grupos processados : ${totalGrupos}\n` +
    `Linhas inseridas   : ${totalLinhasInseridas}\n` +
    `Total de linhas    : ${resultado.length}`
  );
}
