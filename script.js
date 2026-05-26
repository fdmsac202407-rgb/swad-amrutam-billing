/* =========================
   LOGIN
========================= */

function login(){

const customerId =
document.getElementById('customerId').value;

const username =
document.getElementById('username').value;

const password =
document.getElementById('password').value;

if(

customerId === '101' &&
username === 'nikolmanager' &&
password === '1234'

){

localStorage.setItem(
'customerId',
customerId
);

localStorage.setItem(
'username',
username
);

document.getElementById('loginPage').style.display =
'none';

document.getElementById('billingPage').style.display =
'block';

}else{

alert('Invalid Login');

}

}

window.login = login;

/* =========================
   ITEMS
========================= */

const items = [

{
name:"Amrutam Special Tea",
price:10,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/1.-AMRUTAM-S.P-TEA-scaled-1.jpg"
},

{
name:"Masala Tea",
price:20,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/7.-MASALA-MILK-scaled-1-2048x1414.jpg"
},

{
name:"Adrak Tea",
price:20,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/2.-GENGER-TEA.jpg"
},

{
name:"Coffee",
price:20,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/8.-COFFE-scaled-1.jpg"
},

{
name:"Cold Coffee",
price:29,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/14.-COLD-COFFEE-scaled-1.jpg"
},

{
name:"Oreo Milkshake",
price:89,
image:"https://swadamrutamchai.com/wp-content/uploads/2025/10/21.-OREO-SHAKE.jpg"
}

];

/* =========================
   ELEMENTS
========================= */

const menu =
document.getElementById('menu');

const cartItems =
document.getElementById('cart-items');

const totalElement =
document.getElementById('total');

let cart = [];

/* =========================
   CREATE MENU
========================= */

items.forEach((item,index)=>{

const card =
document.createElement('div');

card.className = 'card';

card.innerHTML = `

<img src="${item.image}" style="
width:100%;
height:180px;
object-fit:cover;
border-radius:12px;
">

<h3 style="
margin-top:15px;
">
${item.name}
</h3>

<p style="
font-size:22px;
color:#00e676;
margin-top:10px;
font-weight:bold;
">
₹${item.price}
</p>

<div id="controls-${index}">

<button onclick="addToCart('${item.name}',${index})"
style="
width:100%;
padding:12px;
border:none;
border-radius:10px;
background:black;
color:white;
font-size:18px;
margin-top:10px;
cursor:pointer;
">
Add
</button>

</div>

`;

menu.appendChild(card);

});

/* =========================
   ADD TO CART
========================= */

function addToCart(itemName,index){

const item =
items.find(i=>i.name===itemName);

const existing =
cart.find(c=>c.name===item.name);

if(existing){

existing.qty += 1;

}else{

cart.push({
...item,
qty:1
});

}

updateControls(itemName,index);

renderCart();

}

window.addToCart = addToCart;

/* =========================
   CHANGE QTY
========================= */

function changeQty(itemName,change,index){

const item =
cart.find(c=>c.name===itemName);

item.qty += change;

if(item.qty <= 0){

cart =
cart.filter(c=>c.name!==itemName);

}

updateControls(itemName,index);

renderCart();

}

window.changeQty = changeQty;

/* =========================
   UPDATE BUTTONS
========================= */

function updateControls(itemName,index){

const cartItem =
cart.find(c=>c.name===itemName);

const controls =
document.getElementById(`controls-${index}`);

if(!cartItem){

controls.innerHTML = `

<button onclick="addToCart('${itemName}',${index})"
style="
width:100%;
padding:12px;
border:none;
border-radius:10px;
background:black;
color:white;
font-size:18px;
margin-top:10px;
cursor:pointer;
">
Add
</button>

`;

return;

}

controls.innerHTML = `

<div style="
display:flex;
justify-content:center;
align-items:center;
gap:15px;
margin-top:10px;
">

<button onclick="changeQty('${itemName}',-1,${index})"
style="
width:40px;
height:40px;
border:none;
border-radius:50%;
background:red;
color:white;
font-size:22px;
cursor:pointer;
">
-
</button>

<span style="
font-size:22px;
font-weight:bold;
">
${cartItem.qty}
</span>

<button onclick="changeQty('${itemName}',1,${index})"
style="
width:40px;
height:40px;
border:none;
border-radius:50%;
background:green;
color:white;
font-size:22px;
cursor:pointer;
">
+
</button>

</div>

`;

}

/* =========================
   RENDER CART
========================= */

function renderCart(){

cartItems.innerHTML = '';

let total = 0;

cart.forEach(item=>{

total += item.price * item.qty;

const div =
document.createElement('div');

div.style.background = '#2a2a2a';
div.style.padding = '15px';
div.style.borderRadius = '12px';
div.style.marginTop = '10px';

div.innerHTML = `

<div style="
display:flex;
justify-content:space-between;
align-items:center;
">

<div>

<b>${item.name}</b>

<br>

₹${item.price} x ${item.qty}

</div>

<div style="
font-size:20px;
font-weight:bold;
color:#00e676;
">
₹${item.price * item.qty}
</div>

</div>

`;

cartItems.appendChild(div);

});

totalElement.textContent = total;

}

/* =========================
   PAYMENT POPUP
========================= */

function payNow(){

if(cart.length===0){

alert('Cart Empty');

return;

}

document.getElementById('paymentOptions').style.display =
'flex';

}

window.payNow = payNow;

function closePayment(){

document.getElementById('paymentOptions').style.display =
'none';

}

window.closePayment = closePayment;

/* =========================
   SAVE TO GOOGLE SHEET
========================= */

function saveSale(paymentMode){

let total = 0;

let itemsText = "";

let qtyText = "";

cart.forEach(item=>{

total += item.price * item.qty;

itemsText += item.name + " | ";

qtyText += item.qty + " | ";

});

const data = {

billNo:
"INV" + Date.now(),

outlet:
localStorage.getItem('username'),

date:
new Date().toLocaleDateString(),

time:
new Date().toLocaleTimeString(),

customerName:
document.getElementById('customerName').value || "Walk In",

customerId:
localStorage.getItem('customerId'),

items:
itemsText,

qty:
qtyText,

total:
total,

payment:
paymentMode,

customerNumber:
document.getElementById('customerNumber').value || ""

};

fetch(
"https://script.google.com/macros/s/AKfycbxj-BXzKh7ekZcRjSSpOZGXCehN9sgUwThsICvgHWHN6cAWU_WLjPrLZnw13nW0NTH9/exec",",
{

method:"POST",

mode:"no-cors",

headers:{
"Content-Type":"application/json"
},

body: JSON.stringify(data)

}

)

.then(()=>{

console.log("Saved");

})

.catch(error=>{

console.log(error);

});

}

/* =========================
   SAVE BILL
========================= */

function saveOnlyBill(){

saveSale("Saved");

alert("Bill Saved");

}

window.saveOnlyBill = saveOnlyBill;

/* =========================
   CASH PAYMENT
========================= */

function cashPayment(){

saveSale("Cash");

alert("Cash Payment Saved");

closePayment();

}

window.cashPayment = cashPayment;

/* =========================
   QR PAYMENT
========================= */

function showQR(){

saveSale("QR");

document.getElementById('qrBox').style.display =
'block';

closePayment();

}

window.showQR = showQR;

/* =========================
   PAY UPI
========================= */

function payUPI(){

let total = 0;

cart.forEach(item=>{

total += item.price * item.qty;

});

saveSale("UPI");

const upi =
`upi://pay?pa=rajput.ankit101-3@okicici&pn=Swad Amrutam&am=${total}&cu=INR`;

window.location.href = upi;

}

window.payUPI = payUPI;

/* =========================
   SEND WHATSAPP BILL
========================= */

function sendWhatsApp(){

const number =
document.getElementById('customerNumber').value;

let total = 0;

let message =
'🧾 *SWAD AMRUTAM* %0A%0A';

cart.forEach(item=>{

message +=
'☕ ' +
item.name +
' x ' +
item.qty +
' = ₹' +
(item.price * item.qty) +
'%0A';

total += item.price * item.qty;

});

message +=
'%0A💰 *Total: ₹' +
total +
'*%0A%0A🙏 Thank You';

saveSale("WhatsApp");

if(number){

window.open(
`https://wa.me/91${number}?text=${message}`
);

}else{

alert("Bill Saved");

}

}

window.sendWhatsApp = sendWhatsApp;
