async function getPokemons() {
  // Limpia el contenido anterior
  const pokemonList = document.getElementById('pokemonList');
  pokemonList.innerHTML = '';
  document.getElementById("searching").style.display = "block";
  // Construye la URL con los parámetros adecuados
  let url = `https://pokeapi.co/api/v2/pokemon?limit=${document.getElementById('limit').value}`;
  if(document.getElementById('limit').value === ''){
    url = `https://pokeapi.co/api/v2/pokemon?limit=100000`;
  }
  let urlS = '';
  if (document.getElementById('search').value != '') {
    urlS = `https://pokeapi.co/api/v2/pokemon/${document.getElementById('search').value}`;
  }
  console.log(url);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    // Obtener detalles de todos los Pokémon
    const detailsPromises = data.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()));
    const details = await Promise.all(detailsPromises);
    
    //Obetener el valor de search
    if(urlS != ''){
      const responseS= await fetch(urlS);
      if (!responseS.ok) {
        throw new Error(`HTTP error! Status: ${responseS.status}`);
      }
      const dataS = await responseS.json();
      //Añade al Array
      details.push(dataS);
    }

    // Ordenar alfabéticamente por el nombre del Pokémon
    const sortedDetails = details.sort((a, b) => (a.name > b.name ? 1 : -1));

    // Itera sobre los detalles ordenados y crea elementos de lista
    sortedDetails.forEach((pokemon) => {
      const listItem = document.createElement('li');
      listItem.textContent = `Nombre: ${pokemon.name}, No: ${pokemon.id}, Altura: ${pokemon.height}, Peso: ${pokemon.weight}`;
      // Añade el elemento de lista al contenedor
      pokemonList.appendChild(listItem);
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  document.getElementById("searching").style.display = "none";
}
  
async function generatePdf() {
  const pokemonName = document.getElementById('pokemonName').value;
  if(pokemonName !==''){
    try {
      fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`, {
        method: 'GET',
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(`Pokemon not found!`);
          }
          return response.json();
        })
        .then(pokemonData => {
          console.log(pokemonData)
          generatePokemonPdf(pokemonData);
          alert('Pokemon ATRAPADO! PDF generado.');
        })
        .catch(error => {
          alert(`Error: ${error.message}`);
        });
    } catch (error) {
      alert('Pokémon ha escapado! error:',error);
    }
  }else{
    alert('Campo nombre vacio!');
  }
  
}

//
function generatePokemonPdf(pokemonData) {
  const pdfContent = `
    <h1>Pokemon Details - ${pokemonData.name}</h1>
    <p><strong>Nombre:</strong> ${pokemonData.name}</p>
    <p><strong>Altura:</strong> ${pokemonData.height}</p>
    <p><strong>Peso:</strong> ${pokemonData.weight}</p>
  `;

  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pokemon Details - ${pokemonData.name}</title>
      </head>
      <body>
        ${pdfContent}
      </body>
    </html>
  `);

  newWindow.document.close();
  newWindow.print();
}
