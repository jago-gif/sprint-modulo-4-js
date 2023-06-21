import { Pokemon } from "./pokemon.js";

let sigPag;
let personajes;
let personajesActivos = [];
let pokeInfo = [];
let api = "https://pokeapi.co/api/v2/pokemon/";
let duelistas = [];
const container = document.getElementById("personaje");
const campoBatalla = document.getElementById("generar-duelo");
const duelistaUno = document.getElementById("duelistaUno");
const duelistaDos = document.getElementById("duelistaDos");
const masPokes = document.getElementById("Siguiente");
const btnBorrarPokemones = document.getElementById("borrar");
const btnCargarPokemones = document.getElementById("cargarPokemones");
const btnBatalla = document.getElementById("batalla");
const pokemon = document.getElementById("pokemon");

let primerPeleador;
let segundoPeleador;
var myChart;

const buscarPersonajes = async () => {
  try {
    const respuesta = await fetch(api);
    personajes = await respuesta.json();

    if (respuesta.status === 200) {
      if (personajes.results != null) {
        sigPag = personajes.next;
        personajesActivos = personajes.results;
        if (sigPag == null) {
          document.querySelector("#Siguiente").disabled = true;
        }
      } else {
        personajesActivos = personajes;
      }
      cargarPersonajes();
    }
  } catch (error) {
    console.log(error);
  }
};

document
  .getElementById("cargarPokemones")
  .addEventListener("click", function () {
    buscarPersonajes();
    masPokes.classList.remove("d-none");
    btnCargarPokemones.classList.add("d-none");
    btnBorrarPokemones.classList.remove("d-none");
  });
document.getElementById("Siguiente").addEventListener("click", function () {
  api = sigPag;
  document.getElementById("buscar").value = "";

  buscarPersonajes();
});

document.getElementById("borrar").addEventListener("click", function () {
  pokeInfo = [];
  api = "https://pokeapi.co/api/v2/pokemon/";
  const divElement = document.getElementById("personaje");
  while (divElement.firstChild) {
    divElement.removeChild(divElement.firstChild);
  }
  masPokes.classList.add("d-none");
  btnCargarPokemones.classList.remove("d-none");
  btnBorrarPokemones.classList.add("d-none");
});



let cargarPersonajes = function () {
  buscarInfoPersonaje().then(() => {
    console.log(pokeInfo);
    container.innerHTML = "";

    pokeInfo.forEach((personaje) => {
      const card = document.createElement("div");
      card.classList.add("card", "m-1");
      card.style.width = "18rem";

      const image = document.createElement("img");
      image.src = personaje.imagen;
      image.classList.add("card-img-top");
      image.alt = personaje.nombre;

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const title = document.createElement("h5");
      title.classList.add("card-title");
      title.textContent = personaje.nombre;

      const description = document.createElement("p");
      description.classList.add("card-text");
      description.innerHTML =
        "<b>Alto=</b> " +
        personaje.alto +
        " <br><b>ancho=</b> " +
        personaje.ancho +
        " <br><b>tipo=</b> " +
        personaje.tipo;

      const button = document.createElement("button");
      button.classList.add("btn", "btn-primary");
      button.textContent = "Seleccionar";

      const btnModal = document.createElement("button");
      btnModal.value = personaje.id;
      btnModal.classList.add("btn", "btn-secondary");
      btnModal.textContent = "Estadisticar";

      button.onclick = function () {
        // Aquí puedes acceder a la información del personaje
        duelistas.push(personaje);
        primerPeleador = duelistas[0] != null ? duelistas[0] : null;
        segundoPeleador = duelistas[1] != null ? duelistas[1] : null;
        // Hacer algo con la información del personaje
        console.log(duelistas);
        duelo();
      };

      btnModal.onclick = function () {
        if (typeof myChart !== "undefined") {
          myChart.destroy();
        }
        let estePokemon = pokeInfo.find((pokemon) => {
          return pokemon.id == this.value;
        });
        console.log(estePokemon);
        let nombres = [];
        let datos = [];

        estePokemon._estadisticas.forEach((estadistica) => {
          nombres.push(estadistica.nombre);
          datos.push(estadistica.nivel);
        });

        let modalEstadisticas = new bootstrap.Modal(
          document.getElementById("modalEstadisticas")
        );

        pokemon.innerHTML = "";

        const card = document.createElement("div");
        card.classList.add("card", "m-1");
        card.style.width = "18rem";

        const image = document.createElement("img");
        image.src = estePokemon.imagen;
        image.classList.add("card-img-top");
        image.alt = estePokemon.nombre;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = estePokemon.nombre;

        const description = document.createElement("p");
        description.classList.add("card-text");
        description.innerHTML =
          "<b>Alto=</b> " +
          estePokemon.alto +
          " <br><b>ancho=</b> " +
          estePokemon.ancho +
          " <br><b>tipo=</b> " +
          estePokemon.tipo;

        cardBody.appendChild(title);
        cardBody.appendChild(description);

        card.appendChild(image);
        card.appendChild(cardBody);

        pokemon.appendChild(card);
        
        var ctx = document.getElementById("chartEstadisticas").getContext("2d");
        myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: nombres,
            datasets: [
              {
                label: "Estadísticas de Pokémon",
                data: datos,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });

        // Abre el modal
        modalEstadisticas.show();
      };

      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(button);
      cardBody.appendChild(btnModal);

      card.appendChild(image);
      card.appendChild(cardBody);

      container.appendChild(card);
    });
  });
};

async function buscarInfoPersonaje() {
  if (personajesActivos.length > 0) {
    const promises = personajesActivos.map((personaje) => {
      let apiPokemon = personaje.url;
      return infoPokemon(apiPokemon);
    });
    await Promise.all(promises);
  } else {
    let tipos = [];
    personajesActivos.types.forEach((tipo) => {
      tipos.push(tipo.type.name);
    });
    let estadisticas = [];
    personajesActivos.stats.forEach((stat) => {
      let estadistica = {
        nombre: stat.stat.name,
        nivel: stat.base_stat,
      };
      estadisticas.push(estadistica);
    });
    let pokemon = new Pokemon(
      personajesActivos.id,
      personajesActivos.name,
      personajesActivos.height,
      personajesActivos.weight,
      personajesActivos.sprites.front_default,
      tipos,
      estadisticas
    );
    pokeInfo.push(pokemon);
    console.log(pokemon);
  }
}

let infoPokemon = async (apiPokemon) => {
  try {
    const respuesta = await fetch(apiPokemon);
    let resp = await respuesta.json();

    if (respuesta.status === 200) {
      let tipos = [];
      resp.types.forEach((tipo) => {
        tipos.push(tipo.type.name);
      });
      let estadisticas = [];
      resp.stats.forEach((stat) => {
        let estadistica = {
          nombre: stat.stat.name,
          nivel: stat.base_stat,
        };
        estadisticas.push(estadistica);
      });
      let pokemon = new Pokemon(
        resp.id,
        resp.name,
        resp.height,
        resp.weight,
        resp.sprites.front_default,
        tipos,
        estadisticas
      );
      pokeInfo.push(pokemon);
    }
  } catch (error) {}
};

document.getElementById("busquedaEnApi").addEventListener("click", function () {
  let x = document.getElementById("buscar").value.toLowerCase();
  let apiX = "https://pokeapi.co/api/v2/pokemon/" + x;
  api = apiX;
  personajes = null;
  personajesActivos = null;
  pokeInfo = [];
  buscarPersonajes();
});

function duelo() {
  if (duelistas.length > 2) {
    return alert("Solo puedes elegir 2 duelistas");
  }
  if (duelistas.length == 1) {
    btnBatalla.classList.remove("d-none");
  }

  for (let i = 0; duelistas.length>i; i++) {
    console.log("tenemos un duelista");
    campoBatalla.classList.remove("d-none");
    const card = document.createElement("div");
    card.classList.add("card", "m-1");
    card.style.width = "18rem";

    const image = document.createElement("img");
    image.src = duelistas[i].imagen;
    image.classList.add("card-img-top");
    image.alt = duelistas[i].nombre;

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = duelistas[i].nombre;

    cardBody.appendChild(title);

    card.appendChild(image);
    card.appendChild(cardBody);

    if (i == 0) {
      duelistaUno.innerHTML = "";
      duelistaUno.appendChild(card);
    } else if (i == 1) {
      duelistaDos.innerHTML = "";
      duelistaDos.appendChild(card);
    }

    console.log(duelistas[0]);
  }
}
document
  .getElementById("batallaPokemon")
  .addEventListener("click", function () {
    if (duelistas.length < 2) {
      return alert("Debes elegir 2 duelistas");
    }

    let piedra = 1;
    let papel = 2;
    let tijera = 3;

    let player1 = Math.floor(Math.random() * 3) + 1;
    let player2 = Math.floor(Math.random() * 3) + 1;

    let unoElije =
      player1 == piedra ? "piedra" : player1 == papel ? "papel" : "tijera";
    let dosElije =
      player2 == piedra ? "piedra" : player2 == papel ? "papel" : "tijera";
    alert(
      primerPeleador.nombre +
        " elije =" +
        unoElije +
        " " +
        segundoPeleador.nombre +
        " elije =" +
        dosElije
    );

    if (player1 == piedra && player2 == papel) {
      alert(primerPeleador.nombre + " gana");
    }
    if (player1 == piedra && player2 == tijera) {
      alert(segundoPeleador.nombre + " gana");
    }

    if (player1 == papel && player2 == piedra) {
      alert(primerPeleador.nombre + " gana");
    }

    if (player1 == papel && player2 == tijera) {
      alert(segundoPeleador.nombre + " gana");
    }

    if (player1 == tijera && player2 == piedra) {
      alert(segundoPeleador.nombre + " gana");
    }

    if (player1 == tijera && player2 == papel) {
      alert(primerPeleador.nombre + " gana");
    }

    if (player1 == player2) {
      alert("Empate");
    }
  });
