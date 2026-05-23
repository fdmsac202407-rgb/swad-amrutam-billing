const items = [

{
category: "Tea Product Regular",
name: "Amrutam Special Tea (Regular)",
price: 10,
image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574"
},

{
category: "Tea Product Regular",
name: "Masala Tea (Regular)",
price: 20,
image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7"
},

{
category: "Tea Product Regular",
name: "Adrak Tea (Regular)",
price: 20,
image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
},

{
category: "Hot Product Regular",
name: "Coffee (Regular)",
price: 20,
image: "https://images.unsplash.com/photo-1511920170033-f8396924c348"
},

{
category: "Cold Product Small",
name: "Cold Coffee (Small)",
price: 29,
image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735"
},

{
category: "Cold Product Large",
name: "Oreo Milkshake (Large)",
price: 89,
image: "https://images.unsplash.com/photo-1577805947697-89e18249d767"
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

window.location.href = upi;

}