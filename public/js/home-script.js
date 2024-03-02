window.addEventListener('load', () => {
    let upcomingSection = document.querySelector('.upcoming');
    const loader = document.querySelector('.loader');
    let apiPropiaURL = 'http://localhost:3000/api/upcoming';
    let loadUpcoming = async () => {
        // upcomingSection.styles.display = 'none';
        let res = await fetch(apiPropiaURL, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
            });
        res = await res.json()
        // await new Promise(resolve => {
        //     setTimeout(resolve, 4000);
        // })
        for (const movie of res) {
            upcomingSection.innerHTML += `
            <a href="/proximamente/${movie.tmdbId}" class="contenido-categoria">
            <h3 class="titulo-categ">${movie.titulo}</h3>
            <div class="contenido-ch-categ">
                <img class="poster-categoria" src="${movie.poster}">
                <b>Estrena: ${movie.fecha_estreno}</b>
            </div>
            </a>
            `
        }
        upcomingSection.innerHTML += '</div>'
        await new Promise(resolve => setTimeout(resolve,1000)) //D
        loader.style.display = 'none';
        upcomingSection.style.display = 'flex';

        // loader.
    }
    loadUpcoming()
})