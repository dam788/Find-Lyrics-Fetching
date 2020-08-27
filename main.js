  const form = document.getElementById('form');
  const search = document.getElementById('search');
  const result = document.getElementById('result');
  const more = document.getElementById('more');
  const bolitaButton = document.querySelector('[aria-switch]');
  const bodyColor = document.querySelector('body');

  bolitaButton.addEventListener('click', ({target})=>{
    const toggleBtn = target.getAttribute('aria-switch') === "true" || false;
    bolitaButton.setAttribute('aria-switch', !toggleBtn);
    console.log(`toogle button: ${toggleBtn}`)
    if(toggleBtn){
      bodyColor.classList.add('active');
      return bolitaButton.classList.add('active');
    }else{
      bodyColor.classList.remove('active');
      bolitaButton.classList.remove('active');
    }
  });
    
  const API_URL = 'https://api.lyrics.ovh';
  
  const searchSongs = async (value) => {
    const res = await fetch(`${API_URL}/suggest/${value}`);
    const data = await res.json();
    console.log(data);
    showData(data);
  };
  
  const showData = ({ data, next, prev }) => {
    result.innerHTML = `
      <div class="artist">
        <img class="imgArtist" src="${data[0].artist.picture_medium}">
        <div class="infoArtista">
          <h2>
            <strong>Artista:</strong> ${data[0].artist.name}
          </h2>
        </div>
      </div>
      <ul class="songs">
      ${data
        .map(
          (song) =>
            `<li>
              <div class="infoArt">
                <img class="imgAlbum" src="${song.album.cover_small}">
                <span class="songTitle">
                  <strong>Artista:</strong> ${data[0].artist.name}
                  <br>
                  <strong>Tema:</strong> ${song.title}
                  <br>
                  <strong>Album:</strong> ${song.album.title}
                </span>
              </div>  
              <button class="btn btn--tema" data-artist="${song.artist.name}" data-songtitle="${song.title}" data-audio="${song.preview}">Letra</  button>
            </li>
            `
        )
        .join('')}
      
      </ul>
      `;
  
    if (prev || next) {
      more.innerHTML = `
              ${
                prev
                  ? `<button class="btn" onclick="getMoreSongs('${prev}')">Anterior</button>`
                  : ''
              }
              ${
                next
                  ? `<button class="btn" onclick="getMoreSongs('${next}')">Siguiente</button>`
                  : ''
              }
          
          `;
    } else {
      more.innerHTML = '';
    }
  };
  
  const getMoreSongs = async (url) => {
    console.log(url);
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    // console.log(data);
    showData(data);
  };
  
  const getLyrics = async (artist, songTilte, sound) => {
    
    try{
      const res = await fetch(`${API_URL}/v1/${artist}/${songTilte}`);
      const data = await res.json();
      //\r return value \n new line | or g global -> remplazo por un <br>
      const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
        result.innerHTML = ` 
          <div class="lyricCenter">
          <h2><strong>${artist}</strong> - ${songTilte} </h2>
          <br>
          <audio controls>
          <source src="${sound}" type="audio/mpeg">
          </audio>
          </div>
          <span class="lyricCenter borderLyrics">${lyrics}</span>
          <br>
          <br>
          <hr>
          <br>
          <button id="btnVolver" class="btn" onclick="volverBoton">volver</button>
          `;
        more.innerHTML = ''
    }catch(e){
      console.log(e);
    }
  }
  

  //INIT
  function init() {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchValue = search.value.trim();
      if (!searchValue) {
        return;
      }
      searchSongs(searchValue);
    });
  
    result.addEventListener('click', (e) => {
      const element = e.target;
      if (element.nodeName === 'BUTTON') {
        console.dir(element);
        const artist = element.dataset.artist;
        const songTilte = element.dataset.songtitle;
        const sound = element.dataset.audio;
        getLyrics(artist, songTilte, sound);
      }
    });
  }
  
  init();


