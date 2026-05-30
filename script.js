/* =========================
   GOOGLE SHEET URL
========================= */

const scriptURL =
"https://script.google.com/macros/s/AKfycbxTcsv84_fCcPTZNqvj_-TQfKNx2rdmbPHcolJx2NfjmPnCpSNkKi_SZ-sOh8TYxGww/exec";

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

if(

(customerId=="101" &&
username=="nikolmanager" &&
password=="1234")

||

(customerId=="2612" &&
username=="ankitsinh" &&
password=="2612")

||

(customerId=="102" &&
username=="vastralmanager" &&
password=="1234")

||

(customerId=="103" &&
username=="maninagarmanager" &&
password=="1234")

){

localStorage.setItem(
"outlet",
username
);

document.getElementById("loginPage")
.style.display = "none";

document.getElementById("billingPage")
.style.display = "block";

}else{

alert("Invalid Login");

}

}

window.login = login;

/* =========================
   ITEMS
========================= */

const items = [

/* TEA */

{
name:"Amrutam Special Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:10},
{type:"Kullad",price:20}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/1.-AMRUTAM-S.P-TEA-scaled-1.jpg"
},

{
name:"Masala Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/7.-MASALA-MILK-scaled-1-2048x1414.jpg"
},

{
name:"Adrak Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/2.-GENGER-TEA.jpg"
},

{
name:"Pudina Tea",
category:"Tea Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/2.-GENGER-TEA.jpg"
},

/* HOT */

{
name:"Coffee",
category:"Hot Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/8.-COFFE-scaled-1.jpg"
},

{
name:"Bournvita",
category:"Hot Products",
variations:[
{type:"Regular",price:20},
{type:"Kullad",price:25}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/8.-COFFE-scaled-1.jpg"
},

/* COLD */

{
name:"Nimboo Pani",
category:"Cold Products",
price:20,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/14.-COLD-COFFEE-scaled-1.jpg"
},

{
name:"Lemon Ice Tea",
category:"Cold Products",
price:40,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/14.-COLD-COFFEE-scaled-1.jpg"
},

/* SHAKES */

{
name:"Cold Coffee",
category:"Shakes",
variations:[
{type:"Small",price:29},
{type:"Large",price:59}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/14.-COLD-COFFEE-scaled-1.jpg"
},

{
name:"Oreo Milkshake",
category:"Shakes",
variations:[
{type:"Small",price:44},
{type:"Large",price:89}
],
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/21.-OREO-SHAKE.jpg"
}

];

/* =========================
   HTML ELEMENTS
========================= */

const menu =
document.getElementById("menu");

const cartItems =
document.getElementById("cart-items");

const totalElement =
document.getElementById("total");

let cart = [];

/* =========================
   CATEGORY BUTTONS
========================= */

const categories =
[...new Set(items.map(item=>item.category))];

categories.forEach(category=>{

const button =
document.createElement("button");

button.innerHTML = category;

button.style.padding = "15px";
button.style.margin = "10px";
button.style.border = "none";
button.style.borderRadius = "10px";
button.style.background = "#00c853";
button.style.color = "white";
button.style.fontSize = "20px";
button.style.cursor = "pointer";

button.onclick = ()=>{

showCategory(category);

};

menu.appendChild(button);

});

/* =========================
   SHOW CATEGORY ITEMS
========================= */

function showCategory(category){

menu.innerHTML = "";

const backBtn =
document.createElement("button");

backBtn.innerHTML = "⬅ Back";

backBtn.style.padding = "12px";
backBtn.style.marginBottom = "20px";
backBtn.style.background = "red";
backBtn.style.color = "white";
backBtn.style.border = "none";
backBtn.style.borderRadius = "10px";

backBtn.onclick = ()=>{

menu.innerHTML = "";

loadCategories();

};

menu.appendChild(backBtn);

items
.filter(item=>item.category===category)
.forEach((item,index)=>{

const card =
document.createElement("div");

card.className = "card";

let priceText = "";

if(item.variations){

priceText =
"From ₹" + item.variations[0].price;

}else{

priceText =
"₹" + item.price;

}

card.innerHTML = `

<img src="${item.image}">

<h3>${item.name}</h3>

<div class="price">
${priceText}
</div>

<button class="addBtn"
onclick="selectItem(${index})">

Select

</button>

`;

menu.appendChild(card);

});

}

/* =========================
   SELECT ITEM
========================= */

function selectItem(index){

const item = items[index];

if(item.variations){

let options = "";

item.variations.forEach(v=>{

options +=
`${v.type} - ₹${v.price}\n`;

});

const selected =
prompt(
`Select Option:\n\n${options}\nType exact option name`
);

const variation =
item.variations.find(
v=>v.type.toLowerCase() ===
selected.toLowerCase()
);

if(!variation){

alert("Invalid Option");
return;

}

addToCart(
item.name,
variation.type,
variation.price
);

}else{

addToCart(
item.name,
"",
item.price
);

}

}

/* =========================
   ADD TO CART
========================= */

function addToCart(name,type,price){

const existing =
cart.find(c=>
c.name===name &&
c.type===type
);

if(existing){

existing.qty += 1;

}else{

cart.push({
name,
type,
price,
qty:1
});

}

renderCart();

}

/* =========================
   RENDER CART
========================= */

function renderCart(){

cartItems.innerHTML = "";

let total = 0;

cart.forEach((item,index)=>{

total += item.price * item.qty;

const div =
document.createElement("div");

div.className = "cartItem";

div.innerHTML = `

<div style="
display:flex;
justify-content:space-between;
align-items:center;
">

<div>

<b>${item.name}</b>

<br>

${item.type}

<br>

₹${item.price} × ${item.qty}

</div>

<div>

<button onclick="changeQty(${index},-1)">
-</button>

${item.qty}

<button onclick="changeQty(${index},1)">
+</button>

</div>

</div>

`;

cartItems.appendChild(div);

});

totalElement.innerText = total;

}

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
   SAVE DATA
========================= */

function saveData(paymentMode){

let total = 0;

let itemNames = "";

cart.forEach(item=>{

total += item.price * item.qty;

itemNames +=
item.name +
" " +
item.type +
" x " +
item.qty +
", ";

});

const data = {

billNo:"BILL"+Date.now(),

outlet:
localStorage.getItem("outlet"),

date:
new Date().toLocaleDateString(),

time:
new Date().toLocaleTimeString(),

customerName:
document.getElementById("customerName").value,

customerId:
document.getElementById("customerId").value,

items:itemNames,

total:total,

payment:paymentMode,

customerNumber:
document.getElementById("customerNumber").value

};

fetch(scriptURL,{
method:"POST",
body:JSON.stringify(data)
});

}

/* =========================
   SAVE BILL
========================= */

function saveBill(){

if(cart.length===0){

alert("Cart Empty");
return;

}

saveData("Saved");

alert("Bill Saved");

}

window.saveBill = saveBill;

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
   UPI
========================= */

function payUPI(){

saveData("UPI");

let total = 0;

cart.forEach(item=>{

total += item.price * item.qty;

});

window.location.href =
`upi://pay?pa=rajput.ankit101-3@okicici&pn=Swad%20Amrutam&am=${total}&cu=INR`;

}

window.payUPI = payUPI;

/* =========================
   QR
========================= */

function showQR(){

document.getElementById("qrImage")
.style.display = "block";

saveData("QR");

}

window.showQR = showQR;

/* =========================
   CASH
========================= */

function cashPayment(){

saveData("Cash");

alert("Cash Payment Success");

}

window.cashPayment =
cashPayment;

/* =========================
   WHATSAPP
========================= */

function sendWhatsApp(){

let total = 0;

let message =
"🧾 *SWAD AMRUTAM*%0A%0A";

cart.forEach(item=>{

message +=
`${item.name} ${item.type}
x ${item.qty}
= ₹${item.price * item.qty}%0A`;

total +=
item.price * item.qty;

});

message +=
`%0A💰 Total: ₹${total}`;

const number =
document.getElementById("customerNumber")
.value;

window.open(
`https://wa.me/91${number}?text=${message}`
);

}

window.sendWhatsApp =
sendWhatsApp;