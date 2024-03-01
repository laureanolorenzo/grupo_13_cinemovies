window.addEventListener('load',() => {
    // const dropItems = document.querySelectorAll('#seleccion-categoria');
    let tituloCategoria = document.querySelector('.titulo-categoria');
    const dropBtn = document.querySelector('.dropbtn');
    // let dropBtnText = dropBtn.children[0];
    const url = location.pathname;
    let categoria = url.split('/').slice(-1)[0];
    const categsConAcento = {'Accion':'Acción','Animacion': "Animación",'Fantasia':"Fantasía",'Película de TV':"Película de TV",'Belica':"Bélica"};
    categoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    if (Object.keys(categsConAcento).includes(categoria)){
        categoria = categsConAcento[categoria];
    }
    tituloCategoria.innerText = categoria;
    // dropBtn.addEventListener('click', ()=> {
    //     console.log('se cliqueo')
    // })
    // dropBtnText.innerText = categoria;
    // dropItems.forEach(
    //     x => {
    //         x.addEventListener('click', () => {
    //             if (dropBtnText.innerText !== categoria) {
    //                 dropBtnText.innerText = categoria;
    //             }
    //             localStorage.setItem('botonCambiado','true')
    //         })
    //     }
    // )
})
