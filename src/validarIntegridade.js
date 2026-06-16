function validarIntegridade() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const ABA_PROCESSADA = "dados";
  const ABA_ORIGINAL = "backup";

  const REGISTROS_ESPERADOS_POR_GRUPO = 6;

  const abaProcessada = ss.getSheetByName(ABA_PROCESSADA);
  const abaOriginal = ss.getSheetByName(ABA_ORIGINAL);

  if (!abaProcessada) {
    SpreadsheetApp.getUi().alert(`Aba "${ABA_PROCESSADA}" não encontrada.`);
    return;
  }

  if (!abaOriginal) {
    SpreadsheetApp.getUi().alert(`Aba "${ABA_ORIGINAL}" não encontrada.`);
    return;
  }

  const dadosProcessados = abaProcessada.getDataRange().getValues();
  const dadosOriginais = abaOriginal.getDataRange().getValues();

  const erros = [];
  const avisos = [];

  if (JSON.stringify(dadosProcessados[0]) !== JSON.stringify(dadosOriginais[0])) {
    erros.push("O cabeçalho da base processada diverge da base original.");
  } else {
    Logger.log("Cabeçalho validado com sucesso.");
  }

  const gruposProcessados = agruparPorIdentificador(dadosProcessados);
  const gruposOriginais = agruparPorIdentificador(dadosOriginais);

  Logger.log(`Grupos na base processada : ${gruposProcessados.length}`);
  Logger.log(`Grupos na base original   : ${gruposOriginais.length}`);

  if (gruposProcessados.length !== gruposOriginais.length) {
    erros.push(
      `Quantidade de grupos divergente: processada=${gruposProcessados.length}, original=${gruposOriginais.length}`
    );
  } else {
    Logger.log(`Quantidade de grupos validada: ${gruposOriginais.length}`);
  }

  let gruposOk = 0;
  let gruposComErro = 0;

  const total = Math.min(gruposProcessados.length, gruposOriginais.length);

  for (let g = 0; g < total; g++) {
    const grupoProcessado = gruposProcessados[g];
    const grupoOriginal = gruposOriginais[g];

    if (String(grupoProcessado.identificador) !== String(grupoOriginal.identificador)) {
      erros.push(
        `Posição ${g + 1}: base processada possui o grupo "${grupoProcessado.identificador}", ` +
        `mas a base original possui o grupo "${grupoOriginal.identificador}".`
      );
      gruposComErro++;
      continue;
    }

    const identificador = grupoOriginal.identificador;

    if (grupoProcessado.linhas.length < grupoOriginal.linhas.length) {
      erros.push(
        `Grupo ${identificador}: base original possui ${grupoOriginal.linhas.length} registros, ` +
        `mas a base processada possui apenas ${grupoProcessado.linhas.length}.`
      );
      gruposComErro++;
      continue;
    }

    if (grupoProcessado.linhas.length > REGISTROS_ESPERADOS_POR_GRUPO) {
      avisos.push(
        `Grupo ${identificador}: possui ${grupoProcessado.linhas.length} registros, ` +
        `acima do esperado (${REGISTROS_ESPERADOS_POR_GRUPO}).`
      );
    }

    let grupoOk = true;

    for (let i = 0; i < grupoOriginal.linhas.length; i++) {
      const linhaOriginal = grupoOriginal.linhas[i].map(valor => String(valor).trim());
      const linhaProcessada = grupoProcessado.linhas[i].map(valor => String(valor).trim());

      const maxColunas = Math.max(linhaOriginal.length, linhaProcessada.length);

      const linhaOriginalNormalizada = linhaOriginal.concat(
        Array(maxColunas - linhaOriginal.length).fill("")
      );

      const linhaProcessadaNormalizada = linhaProcessada.concat(
        Array(maxColunas - linhaProcessada.length).fill("")
      );

      if (
        JSON.stringify(linhaOriginalNormalizada) !==
        JSON.stringify(linhaProcessadaNormalizada)
      ) {
        erros.push(
          `Grupo ${identificador}, registro ${i + 1} diverge:\n` +
          `  ORIGINAL    : ${JSON.stringify(linhaOriginalNormalizada)}\n` +
          `  PROCESSADO  : ${JSON.stringify(linhaProcessadaNormalizada)}`
        );

        grupoOk = false;
        gruposComErro++;
        break;
      }
    }

    for (let i = grupoOriginal.linhas.length; i < grupoProcessado.linhas.length; i++) {
      const linhaProcessada = grupoProcessado.linhas[i];
      const colunaIdentificador = String(linhaProcessada[0]).trim();

      const demaisColunasPreenchidas = linhaProcessada
        .slice(1)
        .map(valor => String(valor).trim())
        .filter(valor => valor !== "");

      if (colunaIdentificador !== String(identificador).trim()) {
        erros.push(
          `Grupo ${identificador}, registro inserido ${i + 1}: ` +
          `identificador esperado "${identificador}", encontrado "${colunaIdentificador}".`
        );

        grupoOk = false;
        gruposComErro++;
      }

      if (demaisColunasPreenchidas.length > 0) {
        avisos.push(
          `Grupo ${identificador}, registro inserido ${i + 1}: ` +
          `colunas adicionais não estão vazias -> ${JSON.stringify(demaisColunasPreenchidas)}`
        );
      }
    }

    if (grupoOk) {
      gruposOk++;
    }
  }

  Logger.log("-----------------------------");
  Logger.log(`Total verificado : ${total}`);
  Logger.log(`Grupos OK        : ${gruposOk}`);
  Logger.log(`Com erro         : ${gruposComErro}`);
  Logger.log(`Avisos           : ${avisos.length}`);

  if (avisos.length) {
    avisos.forEach(aviso => Logger.log(aviso));
  }

  if (erros.length) {
    erros.forEach(erro => Logger.log(erro));
  }

  const mensagem =
    erros.length > 0
      ? `${erros.length} erro(s) encontrado(s) e ${avisos.length} aviso(s).\n\n` +
        `Veja os detalhes em:\nExtensões → Apps Script → Registros de execução.`
      : `Validação concluída sem erros.\n\n` +
        `Grupos verificados : ${total}\n` +
        `Grupos OK          : ${gruposOk}\n` +
        `Avisos             : ${avisos.length}`;

  SpreadsheetApp.getUi().alert(mensagem);
}

function agruparPorIdentificador(dados) {
  const grupos = [];
  let i = 1;

  while (i < dados.length) {
    const identificador = String(dados[i][0]).trim();

    if (!identificador) {
      i++;
      continue;
    }

    const linhas = [];

    while (
      i < dados.length &&
      String(dados[i][0]).trim() === identificador
    ) {
      linhas.push(dados[i]);
      i++;
    }

    grupos.push({
      identificador,
      linhas
    });
  }

  return grupos;
}
