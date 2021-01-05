const sendBtn = document.getElementById('formBtn')
const form = document.getElementById('form')
const formName = document.getElementById('nameInput')
const input = document.getElementById('userName')
const cardContainer = document.getElementById('cardContainer')
const navBar = document.querySelector('nav')
const burger = document.querySelector('.burger')
const linea = document.getElementById('line')
const lineDos = document.getElementById('line2')
const lineTres = document.getElementById('line3')


burger.addEventListener('click', ()=>{
    navBar.classList.toggle('active')
    linea.classList.toggle('linea')
    lineDos.classList.toggle('linea2')
    lineTres.classList.toggle('linea3')

})

if(document.title == 'Juguetería | Franco - Petshop' || document.title == 'Farmacia | Franco - Petshop'){
    const div = document.createElement('div')
    div.classList.add('loader')
    div.innerHTML = `
    <span class="circle circle-1"></span>
    <span class="circle circle-2"></span>
    <span class="circle circle-3"></span>
    <span class="circle circle-4"></span>
    <span class="circle circle-5"></span>
    <span class="circle circle-6"></span>
    <span class="circle circle-7"></span>
    <span class="circle circle-8"></span>
    `
    cardContainer.appendChild(div)
fetch('https://apipetshop.herokuapp.com/api/articulos')
    .then(res => res.json())
    .then(data =>{
        const products = data.response
        showCards(products) //mapea productos segun la pagina
        div.style.display = 'none'
        
    })
    if(localStorage.getItem('myCart') != null){ //Si no existe, creo el key en local storage cuyo value, será un array vacío
        var storage = JSON.parse(localStorage.getItem('myCart'));
        updateNumber(storage) //para que al cambiar de pagina no me muestre inicialmente el numero 0 en el carrito

    }
}

function cards(producto){ //creo la estructura de las cards y su contenido
    const newCard = document.createElement('div')
    newCard.innerHTML = `
    <div class="card">
    <div class="cardTop" style="background-image: url(${producto.imagen})">
    <div class="cardInfo">
    <div class="iconcontainer">
    <img src="../assets/images/info.svg" class="info">
    </div>
    <div class="infoContent">
    <h4 class="nombres">${producto.nombre}</h4>
    <h4 class="stock">Stock: ${producto.stock = producto.stock > 5 ? producto.stock : producto.stock + ' <br><br><span class="alert">¡Últimas unidades!</span>'}</h4>
    <p class="description">${producto.descripcion}</p>
    </div>
    </div>
    <div class="contador">
    <button class="botonLess">-</button><input type="number"  name="" class="cuantityInput"><button class="botonMore">+</button>
    </div>
    <div>${producto.stock > 5 ? '' : '<h4 class="ribbon">¡Últimas unidades!</h4>'}</div>
    </div>
    <div class="cardBottom">
    <div class="priceContainer">
    <p>${producto.nombre}</p>
    <h6 class="priceTag"><strong>Precio:</strong> $<span>${producto.precio}</span></h6>
    </div>
    <div class="cartContainer">
    <span class="material-icons md-light md-48 cartIcon">add_shopping_cart</span>
    </div>
    </div>
    `
    cardContainer.appendChild(newCard)
}

function showCards(products){
    products.map(product =>{
        if(product.tipo =="Juguete" && document.title == "Juguetería | Franco - Petshop"){
            cards(product) //muestra en el DOM las tarjetas
        }
        if(product.tipo =="Medicamento" && document.title == "Farmacia | Franco - Petshop"){
            cards(product)//muestra en el DOM las tarjetas
        }
    }
    )
    buy() //Estilos del boton de compra
    quantity()
    if(localStorage.getItem('myCart') != null){
        doneOnLoad() //recupera los estilos del boton de compra al cambiar de pagina
    }
}

function buy(){  //Acá manejo estilos del boton de comprar. 
    const buyBtn = document.querySelectorAll('.cartIcon')
    for(i=0; i<buyBtn.length; i++){
        buyBtn[i].addEventListener('click', (e)=>{
            e.target.innerText = 'done'
            e.target.parentElement.classList.add('done')
            addItemtoCart(e)
        })
    }
}   

function addItemtoCart(e){ //En esta funcion voy a hacer dom traversing para buscar el nombre y precio del producto y pushearlos a un array que se llama cartArray, Obviamente la invoco al hacer click (linea 73)
    const productName = e.target.parentElement.parentElement.firstElementChild.firstElementChild.innerText
    const productPrice = parseFloat(e.target.parentElement.parentElement.firstElementChild.lastElementChild.lastElementChild.innerText)
    const productQuantity = parseFloat(e.target.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.value)
    var productObj = {
        name: productName, 
        price: productPrice,
        quantity: productQuantity,
    }

    if(localStorage.getItem('myCart') == null){ //Si no existe, creo el key en local storage cuyo value, será un array vacío
        localStorage.setItem('myCart', '[]')
    }
    var storage = JSON.parse(localStorage.getItem('myCart'));
    var exists = false
    for(i=0; i<storage.length; i++){
        if(storage[i].name == productObj.name){
            exists = true
            alert('Este producto ya se encuentra en tu carrito')
        }
                
    }
    if(exists == false){
        storage.push(productObj) 
        localStorage.setItem('myCart', JSON.stringify(storage))
        updateNumber(storage)
    }
}

function quantity(){ //botoncitos que hice para elegir cantidad
    const quantityinputs = document.querySelectorAll('.cuantityInput') //capturo inputs
    const botonMore = document.querySelectorAll('.botonMore')
    const botonLess = document.querySelectorAll('.botonLess')
    for (i=0; i<quantityinputs.length; i++){ //loopeo inputs
        quantityinputs[i].value = 1  //asigno valor por defecto
    }
    for(i=0; i<botonLess.length;i++){
        botonLess[i].addEventListener('click', (e)=>{//Acá cambio el valor del input con el boton mas y menos
            var inputValue = e.target.nextSibling
            --inputValue.value
       })
    }
    for(i=0; i<botonMore.length;i++){
        botonMore[i].addEventListener('click', (e)=>{
            var inputValue = e.target.previousSibling
             ++inputValue.value
        })
    }
}

function updateNumber(storage){ //este es el contador del carrito que flota. Se ejecuta al cargar, al comprar producto, al vaciar.
    document.getElementById('counter').innerText = storage.length
}

function displayCartOnScroll(){
    addEventListener('scroll', () =>{
        var scroll = this.scrollY
        if(scroll < 100){
            document.getElementById('checkout').style.display = 'none'
            document.getElementById('counter').style.display = 'none'
        }else{
            document.getElementById('checkout').style.display = 'block'
            document.getElementById('counter').style.display = 'block'
            
        }
    })
}
//Funcion para abrir el carrito de compras. Su invocación sera con un addeventlistener desde el carrito. En el modal tengo q mostrar lo de localStorage
if((document.title == 'Juguetería | Franco - Petshop' || document.title == 'Farmacia | Franco - Petshop')){
    const shoppingCart = document.getElementById('checkout')
    shoppingCart.addEventListener('click', ()=>{
        if(localStorage.getItem('myCart') != null){ //si ya existe myCart en el socal storage
            const storageArray = localStorage.getItem('myCart') //lo almaceno en una variable
            const parsedStorage =JSON.parse(storageArray) //lo convierto porque se almacena como string
            const checkoutModal = document.getElementById('test') //Ventana Modal
            checkoutModal.innerHTML = ''
            for(i=0;i<parsedStorage.length;i++){
                const cartItmes = document.createElement('tr')
                cartItmes.classList.add('trow')
                cartItmes.innerHTML = `
                <td class="cartData">${parsedStorage[i].name}</td>
                <td>${parsedStorage[i].price}</td>
                <td><input type="number" value=${parsedStorage[i].quantity} min="1" class="cartNumberInput"></td>
                <td><i class="fas fa-trash"></i></td>
                `
                checkoutModal.appendChild(cartItmes)
            }
        printTotal() //precio total
        deleteITem() //borrar un producto del carrito
        displayCartModal() //abre el modal
        purchase() //boton sinbólico con un mensaje y vacía el local storage
    }
    })
    displayCartOnScroll()
}
//funcion de eliminar item
function deleteITem(){
    const trashIcon = document.querySelectorAll('.fa-trash')
    for(i=0;i<trashIcon.length;i++){
    trashIcon[i].addEventListener('click', (e)=>{
        e.target.parentElement.parentElement.remove()
        var storedName = JSON.parse(localStorage.getItem('myCart'))
        var productName = e.target.parentElement.parentElement.firstElementChild.innerText
        
        for(i=0; i<storedName.length; i++){
            if(storedName[i].name == productName){
                storedName.splice(i, 1)  //eliminar del local Storage(ahora array) ESE item y no solo de la lista del DOM
            }
        }
        localStorage.setItem('myCart', JSON.stringify(storedName)) //reemplazo en la memoria el carrito que ahora tiene un item menos
        printTotal() //actualiza el precio final
        updateNumber(storedName) //actualiza el numero de items en el carrito
        removeclass(e)
    })
    }
}

function displayCartModal(){ //Funcion para mostrar la ventana modal del carrito
    var modal = document.getElementById("checkoutModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "flex";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    updateQuantity()
    vaciar()
}

//Aqui voy a trabajar con los nuevos inputs de cantidad q se generan al abrir el carrito con el evento change
function updateQuantity(){
    const numberinputs = document.querySelectorAll('.cartNumberInput')
    for(i=0; i<numberinputs.length; i++){
          numberinputs[i].addEventListener('change', ()=>{
          printTotal()
        })
    }
}

function printTotal(){ //Funcion para imprimir el total de la compra y actualizarse al cambiar la cantidad o borrar un item
    var sumPrice = 0
    const totalPrice = document.querySelector('.modal-footer')
    const row = document.getElementsByClassName('cartData')
    for(i=0;i<row.length; i++){
        var price = parseFloat(row[i].nextElementSibling.innerText)
        var nextQuantity = parseFloat(row[i].nextElementSibling.nextElementSibling.firstElementChild.value)
        if(nextQuantity <= 0 || isNaN(nextQuantity)){
            nextQuantity = 1
        }
        sumPrice = sumPrice + (price * nextQuantity)
    }
    totalPrice.innerHTML = `
        <p class="total"><span class="bolder">Total:</span>$${sumPrice}</p>
    `
}

function restoreCarts(){ //restaura los iconos de las cards
    const cartIcon = document.querySelectorAll('.cartIcon')
    const cartContainer =  document.querySelectorAll('.cartContainer')
    for(i=0; i<cartIcon.length; i++){
        cartIcon[i].innerText = 'add_shopping_cart' //vuelve al icono original (el de comprar)
    }
    for(i=0; i<cartContainer.length; i++){
        cartContainer[i].classList.remove('done') //vuelve al color original del boton de comprar
    } 
}


function vaciar(){ //funcion de vaciar el carrito, elimina todas las filas, cierra el modal, saca el check de las tarjetas, reimprime el monto total, limpia memoria, reinicia el contador del c arrito
    const trow = document.querySelectorAll('.trow')
    var modal = document.getElementById("checkoutModal");
    var btnDanger = document.querySelector('.btn-danger')
    btnDanger.addEventListener('click', ()=>{
        modal.style.display = "none"
         for(i=0; i<trow.length; i++){
            trow[i].remove()
        }
        restoreCarts() 
        printTotal()
        localStorage.clear('MyCart')
        document.getElementById('counter').innerText = 0
    })
}
//Boton de finalizar la compra, limpia la memoria, hace un txt de agradecimiento, limpia la lista del dom, vuelve a cero el contador del carrito, saca los "check" de las cards
function purchase(){
    document.getElementById('purchase').addEventListener('click', ()=>{
        vaciar()
        document.getElementById('thanks').innerHTML = `¡Muchas Gracias por tu compra!<i class="fas fa-paw huella"></i>`
        localStorage.clear('MyCart')
        document.getElementById('counter').innerText = 0
        restoreCarts()
    })
}
//Ventana modal luego de llenar el formulario
function formModal(){
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("closeModal")[0];
    modal.style.display = "flex";
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}
//Foormulario de contacto
if(document.title== 'Contacto | Franco - Petshop'){
    const inputs = document.querySelectorAll('.inputField')
    const user = document.getElementById('name')
    const lastName = document.getElementById('lastName')
    const mail = document.getElementById('mail')
    sendBtn.addEventListener('click', (e)=>{
        e.preventDefault()
        checkInputs()
        for(i=0;i<inputs.length;i++){
            if(inputs[i].value==''){
                inputs[i].focus()
                break
            }
        }
        if(user.value != '' && lastName.value != '' && mail.value != '') {
            document.getElementById('nameInput').innerText = inputs[0].value+'. '
            formModal()
            form.reset()
        }
        })

    function checkInputs(){
        const nameValue = user.value
        const lastNameValue = lastName.value
        const phoneValue = phone.value
        const mailValue = mail.value
            displayError(nameValue, user, 'Debes ingresar tu nombre')   
            displayError(lastNameValue, lastName, 'Debes ingresar tu apellido')   
            displayError(phoneValue, phone, 'Debes ingresar tu teléfono')   
            displayError(mailValue, mail, 'Debes ingresar tu e-mail')   
            
        }
    function displayError(value, field, message){
        const input = field.parentElement
         if(value == ''){
            input.classList.add('error')
            input.querySelector('small').innerText = message
            input.classList.remove('success')

        } else{
            input.classList.remove('error')
            input.classList.add('success')
            input.querySelector('small').style.visibility = 'hidden'
                }
            }
}

function backToTop(){
    addEventListener('scroll', () =>{
        var scroll = this.scrollY
        if(scroll < 800){
            document.querySelector('.backToTop').style.display = 'none'
            }else{
            document.querySelector('.backToTop').style.display = 'block'
            }
        })
    }

if(document.title== 'Home | Franco - Petshop'){  //En index
    var myCarousel = document.querySelector('#carouselExampleIndicators') //Corrusel de fotos
    var carousel = new bootstrap.Carousel(myCarousel, {
        interval: 3500,
        wrap: true
        })
    backToTop() //display del backt to top
}

function removeclass(e){ //al borrar un elemento del carrito, vuelve a verse "comprable"
    const cartProductName = e.target.parentElement.parentElement.firstElementChild.innerText
    const namesInCards = document.getElementsByClassName('nombres')
    for(i=0;i<namesInCards.length;i++){
        if(namesInCards[i].innerText == cartProductName){
            namesInCards[i].parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.classList.remove('done')
            namesInCards[i].parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.innerText = 'add_shopping_cart'
        }
    }
}

function doneOnLoad(){ //funcion para no perder los "checked" de las tarjetas al cambiar de pagina
    var stored = JSON.parse(localStorage.getItem('myCart'))
    var productOnCard = document.getElementsByClassName('nombres')
    for(i=0; i<stored.length; i++){
        for(j=0; j<productOnCard.length;j++){
            if(stored[i].name == productOnCard[j].innerText){
                productOnCard[j].parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.classList.add('done')
                productOnCard[j].parentElement.parentElement.parentElement.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.innerText = 'done'
            }
    }    
}
}