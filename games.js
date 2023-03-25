const listaHtml$$ = document.querySelector("#games");
let pagina = 1;
let elementosPagina =25;
let direccionBase = "http://localhost:5000/games";
let token=undefined;

// Get con el token
const get = async (direccionIndividual) => {

  try {
    const respuesta = await fetch(direccionIndividual,{
      headers: {Authentication: 'Bearer '+token}});
      
  console.log(token)
    const res = await respuesta.json();
    return res;
  } catch (error) {
    console.log(error);
  }
};

const pintar = (listaHtml$$, games) => {
  listaHtml$$.innerHTML = "";
  for (const game of games) {
    const li$$ = document.createElement("li");
    li$$.setAttribute("class", "card");
    let contenido = `
        <p class="card-title">${game.title}</p>
        <div class="div1">
        <img class="card-image" src="${game.image}" alt="" /></div>
        <p class="card-p-1">${game.genre}</p>
        <p class="card-p-2">${game.short_description}</p>
        <p class="card-p-3">${game.publisher}</p>



        <ul class = card__ul>
        `;
        game.playedInPlatform.map((plataforma) => {
          let tipo = plataforma.trim();
          let codgoNuevo = `<li class = "card__type ">
          <button name="buttonCard" id="buttonCard"`;
    
          let claseTipo = ` class = "colorNull `;
          if (tipo == "PS5") {
            claseTipo = ` class = "colorFire `;
          } else if (tipo == "Xbox Series X") {
            claseTipo = ` class = "colorWater `;
          } else if (tipo == "PC") {
            claseTipo = ` class = "colorFlying `;
          } 
    
          let codigoNuevoFinal = `card__button">${tipo}</button></li>`;
          contenido = contenido + codgoNuevo + claseTipo + codigoNuevoFinal;
        });
    li$$.innerHTML = contenido;
    listaHtml$$.appendChild(li$$);
  }
};
let habilitarBotones = (juegos) => {
  const navButtons$$ = document.querySelectorAll("button");
  filtroNav(navButtons$$, juegos);
};
let habilitarBotonesCard = (juegos) => {
  const navButtons$$ = document.querySelectorAll("#buttonCard");
  filtroNav(navButtons$$, juegos);
};
//Busqueda por titulo
const busqueda = (filtro, juegos) => {
  let juegosFiltrados = juegos.filter((juego) =>
    juego.title.toLowerCase().includes(filtro.toLowerCase())
  );
  pintar(listaHtml$$, juegosFiltrados);

  habilitarBotones(juegos);
};
//Busqueda `por plataforma
const busquedaTipo = (filtro, juegos) => {
  if (filtro == "All") {
    init();
  } else if (!filtro.includes("img") &&filtro != "Anterior" && filtro != "Siguiente") {
    let juegosFiltrados = juegos.filter((juego) =>
      juego.playedInPlatform.includes(filtro)
    );
    pintar(listaHtml$$, juegosFiltrados);

    habilitarBotones(juegos);
  } else {
    let barra = document.querySelector("#navBar");
    if (!barra.getAttribute("class").includes("hidden")) {
      barra.setAttribute("class", "hidden");
    } else {
      barra.setAttribute("class", "navbar__subindex");
    }
  }
};

const cargarElementos = async (desde, hasta) => {
  const results = [];
  for (let index = desde; index <= hasta; index++) {
    let direccionBase = "http://localhost:5000/games";
    direccionIndividual = direccionBase + `?page=${index}`;
    const result = await get(direccionIndividual);

    results.push(result);
  }

  const juegos = results[0].results.map((result) => ({
    title: result.title,
    genre: result.genre,
    short_description: result.short_description,
    release_date: result.release_date,
    playedInPlatform:result.playedInPlatform,
    publisher:result.publisher,
    image:result.image
  }));

  pintar(listaHtml$$, juegos);

  habilitarBotonesCard(juegos);
};
//funcion del boton Anterior
const retroceder = async () => {
  if (pagina > 1) {
    cargarElementos((pagina - 2) + 1, (pagina - 1));
    pagina -= 1;
  }
};
//funscion del boton siguiente
const avanzar = async (totalPaginas) => {
  if (pagina < (totalPaginas ) ) {
    cargarElementos( pagina + 1, (pagina + 1));
    pagina += 1;
  } 
};
const filtroNav = (navButtons$$, juegos) => {
  const navArray = [...navButtons$$];

  navArray.map((navButton) => {
    navButton.addEventListener("click", () =>
      busquedaTipo(navButton.innerHTML, juegos)
    );
  });
};

const initGames = async (token) => {
  token=token;
  const results = [];
    direccionIndividual = direccionBase + `?page=1`;
    const result = await get(direccionIndividual);

    results.push(result);
  elemento = elementosPagina+1;
  const juegos = results[0].results.map((result) => ({
    name: result.name,
    title: result.title,
        genre: result.genre,
        short_description:  result.short_description,
        release_date:result.release_date,
        playedInPlatform:result.playedInPlatform,
        publisher: result.publisher,
        image:result.image
  }));

  pintar(listaHtml$$, juegos);
  const input$$ = document.querySelector("input");
  input$$.addEventListener("input", () => busqueda(input$$.value, juegos));
//listener del boton anterior
  const botonAnterior$$ = document.querySelector(".container__button--ant");
  botonAnterior$$.addEventListener("click", () => retroceder());
  //calculamos el total de paginas a partir del numero de elementos y el limit que nos ha dado back
  const resultTotal = await get(direccionBase);
  let totalElementos =resultTotal.info.numTotal;
  let limit =resultTotal.info.limit;
   let totalPaginas =
   totalElementos % limit > 0 ? totalElementos / limit + 1 : totalElementos / limit;
   //listener del boton siguiente
  const botonSiguiente$$ = document.querySelector(".container__button--sig");
  botonSiguiente$$.addEventListener("click", () => avanzar(totalPaginas));

  habilitarBotones(juegos);

};

const postLoginOp = async (mail,pass) => {
  const location = window.location.hostname;
  const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "email" : mail,
          "password" : pass,
          "role": "user"
       })
  };
  try {
      const fetchResponse = await fetch(`http://localhost:5000/user/login`, settings);
      const data = await fetchResponse.json();
      console.log(data.token);
if(data.token !=undefined){
      let divLogin = document.querySelector("#divLogin");
      let divPage = document.querySelector("#divPage");
      divLogin.innerHTML="";
      //quito el hidden a los juegos
      divPage.setAttribute("class", "noexiste");
      //paso el token del login a la pagina de los juegos
     initGames(data.token);

      return data;
}
  } catch (e) {
      return e;
  }    

}

const postSignOp = async (mail,pass) => {
  const location = window.location.hostname;
  const settings = {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          "email" : mail,
          "password" : pass,
          "role": "user"
       })
  };
  try {
      const fetchResponse = await fetch(`http://localhost:5000/user/register`, settings);
      const data = await fetchResponse.json();

      return data;
  } catch (e) {
      return e;
  }    

}


const postLogin = async  (mail, pass) => {
const result = await postLoginOp(mail,pass);

};


const postSignin = async (mail, pass) => {
const result = await postSignOp(mail,pass);

};



const init = async () => {
const inputMail$$ = document.querySelector("#mail");
//inputMail$$.addEventListener("input", () => validateMail(input$$.value));

const inputPass$$ = document.querySelector("#pass");
//inputPass$$.addEventListener("input", () => validatePass(input$$.value));

const buttonLogin$$ = document.querySelector("#login");
buttonLogin$$.addEventListener("click", () =>
postLogin(inputMail$$.value, inputPass$$.value)
);

const buttonSignin$$ = document.querySelector("#signin");
buttonSignin$$.addEventListener("click", () =>
postSignin(inputMail$$.value, inputPass$$.value)
);
};

init();
