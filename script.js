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

const menu = document.getElementById('menu');

const cartItems = document.getElementById('cart-items');

const totalElement = document.getElementById('total');

let cart = [];

items.forEach(item => {

const card = document.createElement('div');

card.className = 'card';

card.innerHTML = `
<img src="${item.image}">
<h3>${item.name}</h3>
<p>₹${item.price}</p>
<button>Add</button>
`;

card.querySelector('button').addEventListener('click', () => {

addToCart(item);

});

menu.appendChild(card);

});

function addToCart(item) {

cart.push(item);

renderCart();

}

function renderCart() {

cartItems.innerHTML = '';

let total = 0;

cart.forEach(item => {

total += item.price;

const div = document.createElement('div');

div.innerHTML = `
${item.name} - ₹${item.price}
`;

cartItems.appendChild(div);

});

totalElement.textContent = total;

}

function sendWhatsApp() {

const number = document.getElementById('customerNumber').value;

if (!number) {

alert('Enter Customer Number');

return;

}

let message =
'🧾 *SWAD AMRUTAM* %0A' +
'━━━━━━━━━━━━%0A%0A';

let total = 0;

cart.forEach(item => {

message +=
'☕ ' + item.name +
' - ₹' + item.price + '%0A';

total += item.price;

});

message +=
'%0A━━━━━━━━━━━━%0A' +
'💰 *Total: ₹' + total + '*%0A%0A' +
'🙏 Thank You Visit Again';

window.open(`https://wa.me/91${number}?text=${message}`);

}

function payNow() {

let total = 0;

cart.forEach(item => {

total += item.price;

});

const upi =
`upi://pay?pa=9313677679@ibl&pn=Swad Amrutam&am=${total}&cu=INR`;

window.location.href = UPI;

}