const nav = document.querySelector("#nav");
const abrir = document.querySelector("#abrir");
const cerrar = document.querySelector("#cerrar")

//cuando hacemos click en los botones
//para boton abrir
abrir.addEventListener("click", ()=>{
    nav.classList.add("visible")  //agrega la clase visible
    
})

//para boton cerrar 
cerrar.addEventListener("click", ()=>{
    nav.classList.remove("visible");
})

