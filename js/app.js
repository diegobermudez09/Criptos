const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

// Crear un Promise
const obtenerCroptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})


document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);
    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(resultado => obtenerCroptomonedas(resultado.Data))
    //     .then(criptomonedas => selectCriptomonedas(criptomonedas));

    try{
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            const criptomonedas = await obtenerCroptomonedas(resultado.Data);
            selectCriptomonedas(criptomonedas);     
    }catch(error){
        console.log(error);
    }
}



function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);

    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    // Validar

    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar la API con los resultados
    consultarAPI();
}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('.error');
    if (!existeError) {

        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        // Mensaje de error 
        divMensaje.textContent = mensaje;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    // fetch(url)
    //     .then(respuesta => respuesta.json())
    //     .then(cotizacion => {
    //         mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);//. para leer JSON & [] para leer arreglo
    //     })

        try{
            const respuesta = await fetch(url);
            const cotizacion = await respuesta.json();
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);//. para leer JSON & [] para leer arreglo
        }catch(error){
            console.log(error);
        }

}

function mostrarCotizacionHTML(cotizacion) {

    limpiarHTML(resultado);

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más alto del día: <span>${HIGHDAY}</span>`;

    const lowDay = document.createElement('P');
    lowDay.innerHTML = `Precio más bajo del día: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Última Actualización: <span>${LASTUPDATE}</span>`;



    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(lowDay);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function mostrarSpinner() {
    limpiarHTML(resultado);

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    
     <div class="bounce1"></div>
     <div class="bounce2"></div>
     <div class="bounce3"></div>

    `
    resultado.appendChild(spinner);
}


function limpiarHTML(resultado) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}