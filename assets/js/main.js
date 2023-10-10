const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const modalContainer = document.getElementById('modal-container')

const maxRecords = 151
const limit = 12
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
        
}

const detailsFunction = (pokemonList) => {
    const list = pokemonList.children;
  
    for (let i = 0; i < list.length; i += 1) {
      list[i].addEventListener('click', async () => {
        pokemonName = list[i].children[1].innerHTML;
        pokemonDetails = await getPokemonsDetailed(pokemonName);
        modalContainer.innerHTML = `
                <section class="modal">
                  <section class="modal-inner-container">
                      <header>
                          
                          <div class="superior ${pokemonDetails.types[0].type.name}">
                          <article class="title-container">
                              <h2 class="name">${pokemonDetails.species.name}</h2>
                              <button onclick="modalClose()" class="close-btn">&nbspX&nbsp</button>
                          </article>
                              <img src=${ pokemonDetails.sprites.other['official-artwork'].front_default } alt="pokemon-img" />
                          </div>
                      </header>
                      
                      
                      <section class="pokemonStats">
                          <h3>Bases Stats</h3>
                          <article >
                              <ul>
                                ${pokemonDetails.stats.map(
                                (stat, index) => `
                                
                                        <li class="stats-container">
                                            <span key=${index} class="stats">${stat.stat.name}</span>
                                            <span>${stat.base_stat}</span>
                                            <div class="progress-bar" style="--progress: ${stat.base_stat};"></div>
                                        </li>
                                    `).join('')}
                              </ul>
                          </article>
                      </section>
                  </section>
              </section>
          `;                 
      });
    }
  };



  async function loadPokemonItens(offset, limit) {
    const pokemons = await pokeApi.getPokemons(offset, limit);
    const newHtml = pokemons.map(convertPokemonToLi).join('');
    pokemonList.innerHTML += newHtml;
  
    const modal = await detailsFunction(pokemonList);
    // modalContainer.appendChild(modal)
  }
    const pokemons = loadPokemonItens(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNexPage = offset + limit;
  
    if (qtdRecordsWithNexPage >= maxRecords) {
      const newLimit = maxRecords - offset;
      loadPokemonItens(offset, newLimit);
  
      loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
      loadPokemonItens(offset, limit);
    }
  });
  
  const modalClose = async () => {
    modalContainer.lastElementChild.remove();
  };