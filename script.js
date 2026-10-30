async function puxarDados(latitude, longitude) {
  const elError = document.getElementById("erro");
  const mensagem = document.getElementById("mensagem");

  elError.textContent = "";
  mensagem.textContent = "Carregando...";

  try {
    const dadosResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m&timezone=auto`,
    );

    if (dadosResponse.ok === false) {
      throw new Error(`Erro na API: ${dadosResponse.status}`);
    }

    const dadosJSON = await dadosResponse.json();

    const atual = dadosJSON.current;
    const unidadesAtuais = dadosJSON.current_units;

    const elTemperatura = document.getElementById("temperatura");
    elTemperatura.textContent = `Temperatura atual: ${atual.temperature_2m} ${unidadesAtuais.temperature_2m}`;

    const elVento = document.getElementById("vento");
    elVento.textContent = `Vento atual: ${atual.wind_speed_10m} ${unidadesAtuais.wind_speed_10m}`;

    mensagem.textContent = "";
  } catch (e) {
    console.log(e);
    mensagem.textContent = "";
    elError.textContent = "Não foi possível carregar o clima.";
  }
}

async function buscarCoordenadas(cidade) {
  const elError = document.getElementById("erro");
  const elMensagem = document.getElementById("mensagem");

  elError.textContent = "";
  elMensagem.textContent = "Carregando...";

  try {
    const dadosCoordenadas = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt`,
    );

    if (dadosCoordenadas.ok === false) {
      throw new Error(`Erro na API: ${dadosCoordenadas.status}`);
    }

    const coordenadasJson = await dadosCoordenadas.json();

    if (!coordenadasJson.results) {
      throw new Error("Cidade não encontrada");
    }

    const latitude = coordenadasJson.results[0].latitude;
    const longitude = coordenadasJson.results[0].longitude;

    elMensagem.textContent = "";
    return { latitude, longitude };
  } catch (e) {
    console.log(e.message);
    elMensagem.textContent = "";
    elError.textContent = "Não foi possível encontrar a cidade.";
  }
}

async function buscarClima(cidade) {
  document.getElementById("temperatura").textContent = "";
  document.getElementById("vento").textContent = "";

  const coords = await buscarCoordenadas(cidade);

  if (!coords) {
    return;
  }
  await puxarDados(coords.latitude, coords.longitude);
}

const inputCidade = document.getElementById("cidade");
const btnBuscar = document.getElementById("buscar");

btnBuscar.addEventListener("click", () => {
  const cidade = inputCidade.value.trim();

  if (!cidade) {
    const elError = document.getElementById("erro");
    elError.textContent = "Digite uma cidade!";
    return;
  }

  buscarClima(cidade);
});

inputCidade.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    btnBuscar.click();
  }
});
