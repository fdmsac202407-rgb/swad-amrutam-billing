const API_URL = "https://script.google.com/macros/s/AKfycbwC3Gg9gSLKBCD40EMzqfQxb63NjF4IeeaOxZJ9SJ4ROz1d1ok6iLSUV0lzorGbjxJx/exec";

let items = [];
let cart = [];
let paymentMode = "Cash";

/* LOGIN */

async function login(){

const customerId =
document.getElementById("customerId").value;

const username =
document.getElementById("username").value;

const password =
document.getElementById("password").value;

const res =
await fetch(API_URL + "?type=users");

const users =
await res.json();

const user =
users.find(u =>

u.customerId === customerId &&
u.username === username &&
u.password === password &&
u.active === "Yes"

);

if(user){

localStorage.setItem("outlet",username);
localStorage.setItem("customerId",customerId);
localStorage.setItem("isLoggedIn","true");

document.getElementById("loginPage").style.display="none";
document.getElementById("billingPage").style.display="block";

loadMenu();

}else{

alert("Invalid Login");

}

}

window.login = login;
function logout(){

localStorage.clear();
location.reload();

}

window.logout = logout;

/* LOAD MENU */

async function loadMenu(){

const res = await fetch(API_URL);
const data = await res.json();

const grouped = {};

data.forEach(row=>{

if(row.active !== "Yes") return;

const key = row.itemName;

if(!grouped[key]){

grouped[key] = {
name: row.itemName,
category: row.category,
image: row.imageUrl || "https://via.placeholder.com/150",
variations:[]
};

}

grouped[key].variations.push({
type: row.size || "Single",
price: Number(row.price)
});

});

items = Object.values(grouped);

loadCategories();

}

/* SHOW CATEGORY */

function showCategory(category){

const grid =
document.getElementById("productGrid");

grid.innerHTML = "";

items
.filter(item=>item.category===category)
.forEach(item=>{

const card =
document.createElement("div");

card.className="card";

card.innerHTML=`
<img
src="${item.image}"
style="
width:100%;
height:120px;
object-fit:cover;
border-radius:10px;
">

<h3>${item.name}</h3>

<p>
From ₹${item.variations[0].price}
</p>
`;

card.onclick=()=>{

if(item.variations.length===1){

addToCart(
item.name,
item.variations[0].type,
item.variations[0].price
);

}else{

openSizePopup(item);

}

};

grid.appendChild(card);

});

}

window.showCategory=showCategory;

/* POPUP */

function openSizePopup(item){

document.getElementById("sizePopup")
.style.display="flex";

const options =
document.getElementById("sizeOptions");

options.innerHTML="";

item.variations.forEach(v=>{

options.innerHTML += `
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
.style.display="none";

}

window.closeSizePopup=closeSizePopup;

/* CART */

function addToCart(name,type,price){

const existing =
cart.find(c =>
c.name===name &&
c.type===type
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

window.addToCart=addToCart;

function changeQty(index,change){

cart[index].qty += change;

if(cart[index].qty<=0){

cart.splice(index,1);

}

renderCart();

}

window.changeQty=changeQty;

function renderCart(){

const cartItems =
document.getElementById("cartItems");

cartItems.innerHTML="";

let total=0;

cart.forEach((item,index)=>{

total += item.price*item.qty;

cartItems.innerHTML += `
<div class="cartItem">

<b>${item.name}</b>

<br>

${item.type}

<br><br>

<button onclick="changeQty(${index},-1)">-</button>

${item.qty}

<button onclick="changeQty(${index},1)">+</button>

₹${item.price*item.qty}

</div>
`;

});

document.getElementById("total")
.innerText=total;

}

/* PAYMENT */

function payUPI(){

paymentMode="UPI";

closePaymentPopup();

alert("UPI Selected");

}

function showQR(){

paymentMode="QR";

closePaymentPopup();

alert("QR Selected");

}

function cashPayment(){

paymentMode="Cash";

closePaymentPopup();

alert("Cash Selected");

}

window.payUPI=payUPI;
window.showQR=showQR;
window.cashPayment=cashPayment;
function openPaymentPopup(){

document.getElementById("paymentPopup")
.style.display="flex";

}

function closePaymentPopup(){

document.getElementById("paymentPopup")
.style.display="none";

}

window.openPaymentPopup=openPaymentPopup;
window.closePaymentPopup=closePaymentPopup;

/* SAVE BILL */

async function saveBill(){

const customerName =
document.getElementById("customerName").value;

const mobile =
document.getElementById("customerNumber").value;

const total =
document.getElementById("total").innerText;

const data = {

customerId:
localStorage.getItem("customerId"),

outlet:
localStorage.getItem("outlet"),

customerName,
mobile,

items:
cart.map(i=>i.name).join(","),

qty:
cart.map(i=>i.qty).join(","),

total,
paymentMode

};

await fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
});

alert("Bill Saved");

}

window.saveBill=saveBill;

/* WHATSAPP */

function sendWhatsApp(){

const number =
document.getElementById("customerNumber").value;

let msg =
"☕ Swad Amrutam Bill%0A%0A";

let total=0;

cart.forEach(item=>{

msg +=
`${item.name} (${item.type}) x${item.qty} = ₹${item.price*item.qty}%0A`;

total += item.price*item.qty;

});

msg += `%0ATotal : ₹${total}`;

window.open(
`https://wa.me/91${number}?text=${msg}`
);

}

window.sendWhatsApp=sendWhatsApp;
function loadCategories(){

const categories = [...new Set(
items.map(item => item.category)
)];

const categoryList =
document.getElementById("categoryList");

categoryList.innerHTML = "";

categories.forEach(category => {

categoryList.innerHTML += `
<button
class="categoryBtn"
onclick="showCategory('${category}')">
${category}
</button>
`;

});

if(categories.length > 0){
showCategory(categories[0]);
}

}
window.onload = function(){

if(localStorage.getItem("isLoggedIn") === "true"){

document.getElementById("loginPage").style.display="none";
document.getElementById("billingPage").style.display="block";

loadMenu();

}

};

/* SALES DASHBOARD */

async function openSalesDashboard(){

const customerId =
localStorage.getItem("customerId");

const res =
await fetch(
API_URL +
"?action=sales&customerId=" +
customerId
);

const data =
await res.json();

document.getElementById("salesData").innerHTML = `

<div style="text-align:left">

<h3>📅 Today</h3>
<p>Revenue : ₹${data.today}</p>
<p>Bills : ${data.todayBills}</p>

<hr>

<h3>📆 This Week</h3>
<p>Revenue : ₹${data.week}</p>
<p>Bills : ${data.weekBills}</p>

<hr>

<h3>🗓 This Month</h3>
<p>Revenue : ₹${data.month}</p>
<p>Bills : ${data.monthBills}</p>

</div>

`;

document.getElementById("salesPopup")
.style.display = "flex";

}

function closeSalesPopup(){

document.getElementById("salesPopup")
.style.display = "none";

}

window.openSalesDashboard =
openSalesDashboard;

window.closeSalesPopup =
closeSalesPopup;