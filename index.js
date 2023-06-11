import { Pokemon } from "./pokemon.js";

let sigPag;
let antPag;
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





const buscarPersonajes = async () => {
  try {
    const respuesta = await fetch(api);
    personajes = await respuesta.json();

    if (respuesta.status === 200) {
        if (personajes.results != null) {
            sigPag = personajes.next;
            antPag = personajes.previous;
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

document.getElementById("cargarPokemones").addEventListener("click", function () {
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

document.getElementById("buscar").addEventListener("keyup", function () {
  let x = document.getElementById("buscar").value.toLowerCase();

  personajesActivos = [];
  personajes.results.forEach((personaje) => {
    if (personaje.name.toLowerCase().includes(x)) {
      personajesActivos.push(personaje);
    }
  });

  cargarPersonajes();
});

let cargarPersonajes = function () {
  buscarInfoPersonaje().then(() => {
    console.log(pokeInfo);
    container.innerHTML = "";

    pokeInfo.forEach((personaje) => {
      const card = document.createElement("div");
      card.classList.add("card","m-1");
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

      button.onclick = function () {
        // Aquí puedes acceder a la información del personaje
        duelistas.push(personaje);
        // Hacer algo con la información del personaje
        console.log(duelistas);
        duelo()

      };

      cardBody.appendChild(title);
      cardBody.appendChild(description);
      cardBody.appendChild(button);

      card.appendChild(image);
      card.appendChild(cardBody);

      container.appendChild(card);
    });
  });
};

async function buscarInfoPersonaje() {
    if(personajesActivos.length >0){
        const promises = personajesActivos.map((personaje) => {
        let apiPokemon = personaje.url;
        return infoPokemon(apiPokemon);
        });
        await Promise.all(promises);

    }else{
        let tipos = [];
        personajesActivos.types.forEach((tipo) => {
          tipos.push(tipo.type.name);
        });
        let pokemon = new Pokemon(
          personajesActivos.id,
          personajesActivos.name,
          personajesActivos.height,
          personajesActivos.weight,
          personajesActivos.sprites.front_default,
          tipos
        );
        pokeInfo.push(pokemon);
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
      let pokemon = new Pokemon(
        resp.id,
        resp.name,
        resp.height,
        resp.weight,
        resp.sprites.front_default,
        tipos
      );
      pokeInfo.push(pokemon);
    }
  } catch (error) {}
};

document.getElementById("busquedaEnApi").addEventListener("click", function () {
    let x = document.getElementById("buscar").value.toLowerCase();
    let apiX = "https://pokeapi.co/api/v2/pokemon/" + x;
  api = apiX;
  buscarPersonajes();
});

function duelo() {
    if(duelistas.length > 2){
        return alert("Solo puedes elegir 2 duelistas");
    }

  for(let i = 0;duelistas.length; i++ ){
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

      if(i==0){
        duelistaUno.innerHTML = "";
      duelistaUno.appendChild(card);
      }
      else if(i==1){ 
            duelistaDos.innerHTML = "";  
        duelistaDos.appendChild(card);
        }


    console.log(duelistas[0]);
  }
     
  }
  