let urlApi = "http://localhost:3000/users";
const lista = document.getElementById("userList");
const botonEnviar = document.querySelector("button[type=submit]");
let users = [];

async function getUsersApi() {
try {
const response = await fetch(urlApi);
if (response.ok) {
const dataUsers = await response.json();
users = dataUsers;
users.forEach(user => {
mostrarListaHtml(user);
});
} else {
console.log('Error en la petición HTTP:', response.status);
}
} catch (err) {
console.error('Error en la petición HTTP:', err);
}
}

async function deleteUsersApi(id, listItem) {
try {
const response = await fetch(urlApi + "/" + id, {
method: "DELETE",
headers: {
"Content-type": "application/json"
}
});
if (response.ok) {
listItem.remove();
} else {
console.log('Error en la petición HTTP:', response.status);
}
} catch (err) {
console.error('Error en la petición HTTP:', err);
}
}

async function addUserApi(user) {
try {
const response = await fetch(urlApi, {
method: "POST",
body: JSON.stringify(user),
headers: {
"Content-type": "application/json"
}
});
if (response.ok) {
const newUser = await response.json();
mostrarListaHtml(newUser);
} else {
console.log('Error en la petición HTTP:', response.status);
}
} catch (err) {
console.error('Error en la petición HTTP:', err);
}
}

async function modifyUser(user) {
try {
const response = await fetch(urlApi + "?email=" + user.email);
if (response.ok) {
const usersPeticion = await response.json();
const existingUser = usersPeticion.find(userP => userP.id !== user.id);
if (existingUser) {
alert("Ese mail ya existe");
} else {
const updateResponse = await fetch(urlApi + "/" + user.id, {
method: "PUT",
body: JSON.stringify(user),
headers: {
"Content-type": "application/json"
}
});
if (updateResponse.ok) {
location.reload();
} else {
console.log('Error en la petición HTTP:', updateResponse.status);
}
}
} else {
console.log('Error en la petición HTTP:', response.status);
}
} catch (err) {
console.error('Error en la petición HTTP:', err);
}
}

getUsersApi();

botonEnviar.addEventListener("click", function (event) {
//event.preventDefault();
let name = document.getElementById("name").value;
let address = document.getElementById("address").value;
let email = document.getElementById("email").value;

if (name && address && email) {
addUserApi({ name, address, email });
}
});

function mostrarListaHtml(user) {
let li = document.createElement("LI");

let buttonDel = document.createElement("BUTTON");
buttonDel.textContent = "Borrar";
buttonDel.classList.add("del");
buttonDel.setAttribute("data-id", user.id);

let buttonEdit = document.createElement("BUTTON");
buttonEdit.textContent = "Editar";
buttonEdit.classList.add("mod");
buttonEdit.setAttribute("data-id", user.id);

li.innerHTML = `${user.name}:${user.address}:${user.email}:`;

li.appendChild(buttonEdit);
li.appendChild(buttonDel);
lista.appendChild(li);
}

lista.addEventListener("click", function (event) {
const li = event.target.parentElement;
if (event.target.classList.contains("del")) {
deleteUsersApi(li.getElementsByClassName("del")[0].dataset.id, li);
}

if (event.target.classList.contains("mod")) {
let datosLi = li.textContent.split(":");
let email = datosLi[2];
const user = users.find(user => user.email === email);
if (user) {
document.getElementById("name").value = user.name;
document.getElementById("address").value = user.address;
document.getElementById("email").value = user.email;

botonEnviar.setAttribute("disabled", "true");

let botonEditar = document.createElement("BUTTON");
botonEditar.textContent = "Editar usuario";
botonEditar.setAttribute("id", "editar");

if (document.querySelectorAll("#editar").length < 1) {
document.getElementById("userForm").appendChild(botonEditar);
}
modificar(user);
}
}
});

function modificar(user) {
document.getElementById("editar").addEventListener("click", async function (event) {
event.preventDefault();
let name = document.getElementById("name").value;
let address = document.getElementById("address").value;
let email = document.getElementById("email").value;

if (name && address && email) {
user.name = name;
user.address = address;
user.email = email;

await modifyUser(user);
}
});
}