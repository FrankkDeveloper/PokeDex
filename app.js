const pokemonList = document.getElementById("pokemon-list");
const container = document.getElementById("container");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const PokeAPI = "https://pokeapi.co/api/v2/pokemon";
let currentOffset = 0;
const limit = 12;

function fetchPokemons(offset) {
  fetch(`${PokeAPI}?limit=${limit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => {
      pokemonList.innerHTML = "";
      data.results.forEach((pokemon) => {
        fetch(pokemon.url)
          .then((response) => response.json())
          .then((data) => showPokemon(data));
      });
      managePaginationButtons(data.previous, data.next);
    })
    .catch((error) => {
      container.innerHTML = `<h1 class="py-3">Error al cargar los datos:</h1>
                              <div class="alert alert-danger" role="alert">
                               ${error}
                              </div>`;
    });
}

function showPokemon(data) {
  let types = data.types.map((type) => type.type.name).join(" ");
  const abilities = data.abilities.map((ability) => ability.ability.name).join(" ");

  const card = document.createElement("div");
  const col = document.createElement("div");

  col.className = "col";
  card.className = "card my-3";
  card.style = "width: 18rem";
  card.innerHTML = `<img
              src="${data.sprites.other.home.front_default}"
              class="card-img-top"
              alt="pokemon-img"
            />
            <div class="card-body">
              <h5 class="card-title">${data.name}</h5>
              <p class="card-text">
                <span class="fw-bold">Especie: </span><span class="type-${types}">${types}</span><br>
                <span class="fw-bold">Habilidad: </span>${abilities}<br/>
              </p>
              <a href="#" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#description-modal" onclick="showModal('${data.name}')">Ver descripción</a>
            </div>`;
  col.appendChild(card);
  pokemonList.appendChild(col);
}

function showModal(name) {
  const modalName = document.getElementById("descriptionModalLabel");
  const modalDescription = document.getElementById("modal-description");
  const wikiLink = `https://pokemon.fandom.com/es/wiki/${name}`

  fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
    .then((response) => response.json())
    .then((data) => {
      const flavorTextEntry = data.flavor_text_entries.find(
        (entry) => entry.language.name === "es"
      );
      const description = flavorTextEntry
        ? flavorTextEntry.flavor_text.replace(/\s+/g, " ")
        : "Descripción no disponible en español.";

      modalName.textContent = name.toUpperCase();
      modalDescription.innerHTML = `<p>${description}</p><br><a href="${wikiLink}" target="_blank">Ver mas</a>`;
    })
    .catch((error) => {
      console.error("Error al obtener la descripción:", error);
      modalDescription.innerHTML = "<p>Error al cargar la descripción.</p>";
    });
}

function managePaginationButtons(prev, next) {
  prevBtn.disabled = !prev;
  nextBtn.disabled = !next;
}

prevBtn.addEventListener("click", () => {
  if (currentOffset >= limit) {
    currentOffset -= limit;
    fetchPokemons(currentOffset);
    scrollToTop();
  }
});

nextBtn.addEventListener("click", () => {
  currentOffset += limit;
  fetchPokemons(currentOffset);
  scrollToTop();
});

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

fetchPokemons(currentOffset);
