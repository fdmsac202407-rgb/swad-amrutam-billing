const items = [

{
category: "Tea Product Regular",
name: "Amrutam Special Tea (Regular)",
price: 10,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/1.-AMRUTAM-S.P-TEA-scaled-1.jpg"
},

{
category: "Tea Product Regular",
name: "Masala Tea (Regular)",
price: 20,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/7.-MASALA-MILK-scaled-1-2048x1414.jpg"
},

{
category: "Tea Product Regular",
name: "Adrak Tea (Regular)",
price: 20,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/2.-GENGER-TEA.jpg"
},

{
category: "Hot Product Regular",
name: "Coffee (Regular)",
price: 20,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/8.-COFFE-scaled-1.jpg"
},

{
category: "Cold Product Small",
name: "Cold Coffee (Small)",
price: 29,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/14.-COLD-COFFEE-scaled-1.jpg"
},

{
category: "Cold Product Large",
name: "Oreo Milkshake (Large)",
price: 89,
image: "https://swadamrutamchai.com/wp-content/uploads/2025/10/21.-OREO-SHAKE.jpg"
}

];

/* =========================
   ELEMENTS
========================= */

const menu = document.getElementById('menu');
const cartItems = document.getElementById('cart-items');
const totalElement = document.getElementById('total');

let cart = [];

/* =========================
   MENU ITEMS
========================= */

items.forEach((item, index) => {

const card = document.createElement('div');

card.className = 'card';

card.innerHTML = `

<img src="${item.image}" style="
width:100%;
height:180px;
object-fit:cover;
border-radius:12px;
">

<h3 style="
color:white;
margin-top:15px;
font-size:20px;
line-height:1.4;
">
${item.name}
</h3>

<p style="
font-size:24px;
font-weight:bold;
color:#00e676;
">
₹${item.price}
</p>

<div id="controls-${index}">

<button onclick="addToCart('${item.name}', ${index})"
style="
width:100%;
background:black;
color:white;
border:none;
padding:12px;
border-radius:10px;
font-size:18px;
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

function addToCart(itemName, index) {

const item = items.find(i => i.name === itemName);

const existing = cart.find(c => c.name === item.name);

if (existing) {

existing.qty += 1;

} else {

cart.push({
...item,
qty: 1
});

}

updateControls(itemName, index);

renderCart();

}

/* =========================
   CHANGE QUANTITY
========================= */

function changeQty(itemName, change, index) {

const item = cart.find(c => c.name === itemName);

item.qty += change;

if (item.qty <= 0) {

cart = cart.filter(c => c.name !== itemName);

}

updateControls(itemName, index);

renderCart();

}

/* =========================
   UPDATE BUTTON CONTROLS
========================= */

function updateControls(itemName, index) {

const cartItem = cart.find(c => c.name === itemName);

const controls = document.getElementById(`controls-${index}`);

if (!cartItem) {

controls.innerHTML = `

<button onclick="addToCart('${itemName}', ${index})"
style="
width:100%;
background:black;
color:white;
border:none;
padding:12px;
border-radius:10px;
font-size:18px;
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

<button onclick="changeQty('${itemName}', -1, ${index})"
style="
width:40px;
height:40px;
border:none;
background:red;
color:white;
border-radius:50%;
font-size:22px;
cursor:pointer;
">
-
</button>

<span style="
font-size:22px;
font-weight:bold;
color:white;
min-width:20px;
text-align:center;
">
${cartItem.qty}
</span>

<button onclick="changeQty('${itemName}', 1, ${index})"
style="
width:40px;
height:40px;
border:none;
background:green;
color:white;
border-radius:50%;
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

function renderCart() {

cartItems.innerHTML = '';

let total = 0;

cart.forEach(item => {

total += item.price * item.qty;

const div = document.createElement('div');

div.style.background = '#2a2a2a';
div.style.padding = '15px';
div.style.borderRadius = '12px';
div.style.marginBottom = '12px';

div.innerHTML = `

<div style="
display:flex;
justify-content:space-between;
align-items:center;
color:white;
">

<div>

<b style="
font-size:18px;
">
${item.name}
</b>

<br>

<span style="
color:#cccccc;
">
₹${item.price} x ${item.qty}
</span>

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
   PAY NOW
========================= */

function payNow() {

if (cart.length === 0) {

alert('Cart is Empty');

return;

}

document.getElementById('paymentOptions').style.display = 'block';

}

/* =========================
   UPI PAYMENT
========================= */

function payUPI() {

let total = 0;

cart.forEach(item => {

total += item.price * item.qty;

});

const upi =
`upi://pay?pa=rajput.ankit101-3@okicici&pn=Swad Amrutam&am=${total}&cu=INR`;

window.location.href = upi;

}

/* =========================
   SHOW QR
========================= */

function showQR() {

document.getElementById('qrBox').style.display = 'block';

}

/* =========================
   CASH PAYMENT
========================= */

function cashPayment() {

alert('Cash Payment Selected');

}

/* =========================
   WHATSAPP BILL
========================= */

function sendWhatsApp() {

const number = document.getElementById('customerNumber').value;

if (!number) {

alert('Enter Customer Number');

return;

}

if (cart.length === 0) {

alert('Cart is Empty');

return;

}

let message =
'🧾 *SWAD AMRUTAM* %0A' +
'━━━━━━━━━━━━%0A%0A';

let total = 0;

cart.forEach(item => {

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
'%0A━━━━━━━━━━━━%0A' +
'💰 *Total: ₹' +
total +
'*%0A%0A' +
'🙏 Thank You Visit Again';

window.open(`https://wa.me/91${number}?text=${message}`);

}
