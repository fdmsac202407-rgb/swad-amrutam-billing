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
   MENU
========================= */

items.forEach(item => {

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
font-size:28px;
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

<button onclick="addToCart('${item.name}')"
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

menu.appendChild(card);

});

/* =========================
   ADD TO CART
========================= */

function addToCart(itemName) {

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

renderCart();

}

/* =========================
   UPDATE QTY
========================= */

function updateQty(index, change) {

cart[index].qty += change;

if (cart[index].qty <= 0) {

cart.splice(index, 1);

}

renderCart();

}

/* =========================
   RENDER CART
========================= */

function renderCart() {

cartItems.innerHTML = '';

let total = 0;

cart.forEach((item, index) => {

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
gap:15px;
color:white;
">

<div>

<b style="
font-size:18px;
color:white;
">
${item.name}
</b>

<br>

<span style="
color:#cccccc;
font-size:16px;
">
₹${item.price} x ${item.qty}
</span>

</div>

<div style="
display:flex;
align-items:center;
gap:10px;
">

<button onclick="updateQty(${index}, -1)"
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
min-width:25px;
text-align:center;
">
${item.qty}
</span>

<button onclick="updateQty(${index}, 1)"
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

</div>

`;

cartItems.appendChild(div);

});

totalElement.textContent = total;

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

/* =========================
   PAY NOW
========================= */

function payNow() {

if (cart.length === 0) {

alert('Cart is Empty');

return;

}

let total = 0;

cart.forEach(item => {

total += item.price * item.qty;

});

/* YOUR UPI */

const upi = `upi://pay?pa=rajput.ankit101-3@okicici&pn=Swad Amrutam&am=${total}&cu=INR`;

/* OPEN PAYMENT */

window.open(upi);

}
