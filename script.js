/* =========================
   LOGIN USERS
========================= */

const users = [

{
customerId:"101",
username:"nikolmanager",
password:"1234"
},

{
customerId:"2612",
username:"ankitsinh",
password:"2612"
}

];

/* =========================
   LOGIN
========================= */

function login(){

const customerId =
document.getElementById("customerId").value;

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const user =
users.find(u =>
u.customerId === customerId &&
u.username === username &&
u.password === password
);

if(user){

localStorage.setItem(
"outlet",
username
);

document.getElementById("loginPage")
.style.display = "none";

document.getElementById("billingPage")
.style.display = "block";

showCategory("Tea Products");

}else{

alert("Invalid Login");

}

}

window.login = login;

/* =========================
   LOGOUT
========================= */

function logout(){

localStorage.clear();

document.getElementById("billingPage")
.style.display = "none";

document.getElementById("loginPage")
.style.display = "flex";

}

window.logout = logout;

/* =========================
   ITEMS
========================= */

const items = [

{
name:"Amrutam Special Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:10},
{type:"Kullad",price:20}
]
},

{
name:"Masala Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Adrak Pudina Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Adrak Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Pudina Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Elaichi Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Chocolate Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Lemon Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Gud Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
},

{
name:"Sugar Free Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
]
}

];

/* =========================
   CART
========================= */

let cart = [];

let selectedItem = null;

/* =========================
   SHOW CATEGORY
========================= */

function showCategory(category){

const productGrid =
document.getElementById("productGrid");

productGrid.innerHTML = "";

items
.filter(item => item.category === category)
.forEach(item=>{

const card =
document.createElement("div");

card.className = "card";

card.innerHTML = `
<h3>${item.name}</h3>
<p>From ₹${item.variations[0].price}</p>
`;

card.onclick = ()=>{

openSizePopup(item);

};

productGrid.appendChild(card);

});

}

window.showCategory = showCategory;

/* =========================
   SIZE POPUP
========================= */

function openSizePopup(item){

selectedItem = item;

document.getElementById("sizePopup")
.style.display = "flex";

const sizeOptions =
document.getElementById("sizeOptions");

sizeOptions.innerHTML = "";

item.variations.forEach(v=>{

sizeOptions.innerHTML += `
<button
class="popupBtn"
style="background:#00c853"
onclick="addToCart(
'${item.name}',
'${v.type}',
${v.price}
)">
${v.type} - ₹${v.price}
</button>
`;

});

}

function closeSizePopup(){

document.getElementById("sizePopup")
.style.display = "none";

}

window.closeSizePopup =
closeSizePopup;

/* =========================
   ADD TO CART
========================= */

function addToCart(
name,
type,
price
){

const existing =
cart.find(c =>
c.name === name &&
c.type === type
);

if(existing){

existing.qty++;

}else{

cart.push({
name,
type,
price,
qty:1
});

}

closeSizePopup();

renderCart();

}

window.addToCart = addToCart;

/* =========================
   CHANGE QTY
========================= */

function changeQty(index,change){

cart[index].qty += change;

if(cart[index].qty <= 0){

cart.splice(index,1);

}

renderCart();

}

window.changeQty = changeQty;

/* =========================
   RENDER CART
========================= */

function renderCart(){

const cartItems =
document.getElementById("cartItems");

const totalEl =
document.getElementById("total");

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total +=
item.price * item.qty;

cartItems.innerHTML += `

<div class="cartItem">

<b>${item.name}</b>

<br>

${item.type}

<br><br>

<button
onclick="changeQty(${index},-1)">
-
</button>

${item.qty}

<button
onclick="changeQty(${index},1)">
+
</button>

&nbsp;&nbsp;

₹${item.price * item.qty}

</div>

`;

});

totalEl.innerText = total;

}

/* =========================
   PAYMENT
========================= */

function openPaymentPopup(){

document.getElementById("paymentPopup")
.style.display = "flex";

}

function closePaymentPopup(){

document.getElementById("paymentPopup")
.style.display = "none";

}

window.openPaymentPopup =
openPaymentPopup;

window.closePaymentPopup =
closePaymentPopup;

/* =========================
   SAVE BILL
========================= */

function saveBill(){

alert("Bill Saved");

}

window.saveBill = saveBill;

/* =========================
   UPI
========================= */

function payUPI(){

alert("UPI Payment");

}

window.payUPI = payUPI;

/* =========================
   QR
========================= */

function showQR(){

alert("QR Payment");

}

window.showQR = showQR;

/* =========================
   CASH
========================= */

function cashPayment(){

alert("Cash Payment");

}

window.cashPayment =
cashPayment;

/* =========================
   WHATSAPP
========================= */

function sendWhatsApp(){

alert("WhatsApp Bill");

}

window.sendWhatsApp =
sendWhatsApp;