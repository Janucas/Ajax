document.addEventListener("DOMContentLoaded",function(){
    let botonEnviar = document.querySelector("button[type=submit]");
    let lista = document.getElementById("userList");
    let usuarios = [];
    function anniadirUsuarioApi(usuario){
    const peticion = new XMLHttpRequest();
    peticion.open("POST",url);
    peticion.setRequestHeader("Content-type","application/json");
    peticion.addEventListener("load",function(){
    if(peticion.status == 201){
    let nuevoUsuario = JSON.parse(peticion.responseText);
    anniadirUsuarioLista(nuevoUsuario);
    }
    });
    peticion.send(JSON.stringify(usuario));
    }
    function getUsuariosApi(){
    const peticion = new XMLHttpRequest();
    peticion.open("GET",url + "?_sort=name&_order=asc");
    peticion.setRequestHeader("Accept","application/json");
    peticion.addEventListener("load",function(){
    if(peticion.status == 200){
    usuarios = JSON.parse(peticion.responseText);
    usuarios.forEach(usuario => {
    anniadirUsuarioLista(usuario);
    });
    }
    });
    peticion.send();
    }
    function borrarUsuarioApi(id){
    const peticion = new XMLHttpRequest();
    peticion.open("DELETE",url + "/" + id);
    peticion.setRequestHeader("Content-type","application/json");
    peticion.send();
    }
    function cambiarUsuarioApi(id,usuario){
    const peticion = new XMLHttpRequest();
    peticion.open("PUT",url + "/" + id);
    peticion.setRequestHeader("Content-type","application/json");
    peticion.addEventListener("load",function(){
    if(peticion.status == 200){
    console.log("200 OK")
    }
    });
    peticion.send(JSON.stringify(usuario));
    }
    
    function anniadirUsuarioApiSinDuplicados(usuario){
    const peticion = new XMLHttpRequest();
    peticion.open("GET",url + "?email=" + usuario.email);
    peticion.setRequestHeader("Accept","application/json");
    peticion.send();
    peticion.addEventListener("load",function(){
    if(peticion.status == 200){
    if(JSON.parse(peticion.responseText).length == 0){
    anniadirUsuarioApi(usuario);
    }else{
    alert("El email introducido ya existe");
    }
    }
    })
    }
    function enviarDatos(){
    botonEnviar.addEventListener("click",function(event){
    event.preventDefault();
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;
    if(name && address && email){ 
    if(validateEmail(email)){
    const user = {name,address,email};
    anniadirUsuarioApiSinDuplicados(user); 
    }else if(!validateEmail(email)){
    alert("El email introducido no es válido");
    }
    }
    document.getElementById("userForm").reset();
    });
    }
    function anniadirUsuarioLista(usuario){
    let li = document.createElement("LI");
    li.appendChild(document.createTextNode(`${usuario.name}:${usuario.address}:${usuario.email}:`));
    let botonBorrar = document.createElement("BUTTON");
    botonBorrar.textContent = "Borrar";
    botonBorrar.classList.add("del");
    botonBorrar.setAttribute("data-id",usuario.id);
    let botonEditar = document.createElement("BUTTON");
    botonEditar.textContent = "Editar";
    botonEditar.classList.add("mod");
    botonEditar.setAttribute("data-id",usuario.id);
    li.appendChild(botonBorrar);
    li.appendChild(botonEditar);
    lista.appendChild(li);
    }
    function borrar(){
    lista.addEventListener("click",function(event){
    if(event.target.classList.contains("del")){
    const li = event.target.parentElement;
    borrarUsuarioApi(li.getElementsByClassName("del")[0].dataset.id);
    li.remove();
    }
    })
    }
    function mostrarDatosEditar(){
    lista.addEventListener("click",function(event){
    if(event.target.classList.contains("mod")){
    const li = event.target.parentElement;
    let email = li.textContent.split(":")[2];
    usuarios.map((usuario) => {
    if(email == usuario.email){
    document.getElementById("name").value = usuario.name;
    document.getElementById("address").value = usuario.address;
    document.getElementById("email").value = usuario.email;
    botonEnviar.setAttribute("disabled","true");
    let editar = document.createElement("BUTTON");
    editar.setAttribute("id","editar");
    editar.textContent = "Editar usuario";
    if(document.querySelectorAll("#editar").length < 1){
    document.getElementById("userForm").appendChild(editar);
    }
    modificar(usuario);
    }
    })
    }
    })
    }
    function modificar(usuario){
    document.getElementById("editar").addEventListener("click",function(){
    let name = document.getElementById("name").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;
    
    if(name && address && email){ 
    if(validateEmail(email)){
    usuario.name = name;
    usuario.address = address;
    usuario.email = email;
    cambiarUsuarioApi(usuario.id,usuario); 
    }else if(!validateEmail(email)){
    alert("El email introducido no es válido");
    }
    }
    
    })
    }
    
    
    
    function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
    }
    
    enviarDatos();
    mostrarDatosEditar();
    getUsuariosApi();
    borrar();
    
    });