
const API_URL = "https://script.google.com/macros/s/AKfycbwC3Gg9gSLKBCD40EMzqfQxb63NjF4IeeaOxZJ9SJ4ROz1d1ok6iLSUV0lzorGbjxJx/exec";

let items = [];
let cart = [];
let paymentMode = "Cash";

let sendWhatsapp = false;

let tables = {};
let selectedTable = null;

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

/* NEW */
document.getElementById("customerHeader").innerHTML =
`${username} (ID: ${customerId})`;

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

const currentCustomerId =
String(localStorage.getItem("customerId")).trim();

console.log("Current Login ID:", currentCustomerId);
console.log("Menu Data:", data);

const filteredData = data.filter(row => {

  if(row.active !== "Yes")
    return false;

  const customerId =
  String(row.customerId || "").trim();

  if(customerId === "")
  return true;

const ids = customerId.split(",").map(id => id.trim());

return ids.includes(currentCustomerId);

});

console.log("Filtered Data:", filteredData);

const grouped = {};

filteredData.forEach(row=>{

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

const today =
new Date().toISOString().split("T")[0];

document.getElementById("fromDate").value = today;
document.getElementById("toDate").value = today;

loadDashboard();

document
.getElementById("searchBox")
.addEventListener("input", searchProducts);

document.getElementById("searchBox").value = "";
document.getElementById("productGrid").innerHTML = "";
document.getElementById("emptyState").style.display = "block";
document.getElementById("searchArea").style.display = "none";

goHome();

}

/* SHOW CATEGORY */

function showCategory(category){

document.getElementById("emptyState").style.display = "none";
document.getElementById("searchArea").style.display = "flex";

document
.querySelectorAll(".menuCategory")
.forEach(btn => btn.classList.remove("active"));

const activeBtn =
Array.from(document.querySelectorAll(".menuCategory"))
.find(btn => btn.innerText === category);

if(activeBtn){
activeBtn.classList.add("active");
}

const grid =
document.getElementById("productGrid");

grid.innerHTML = "";

items
.filter(item=>item.category===category)
.forEach(item=>{

const card =
document.createElement("div");

card.className="card";

card.innerHTML = `
<img
src="${item.image}"
class="productImage">

<h3>${item.name}</h3>

<p class="priceText">
₹${item.variations[0].price}
</p>

<div class="productActions">

<button class="addOrderBtn">
Add Order
</button>

</div>
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

card.querySelector(".addOrderBtn").onclick = (e)=>{

e.stopPropagation();

if(item.variations.length > 1){

openSizePopup(item);

}else{

addToCart(
item.name,
item.variations[0].type,
item.variations[0].price
);

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

if(selectedTable){

if(!tables[selectedTable]){
tables[selectedTable] = [];
}

cart = tables[selectedTable];

}

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

const table =
document.getElementById("tableSelect")?.value;

if(table){

if(!tables[table]){
tables[table] = [];
}

cart = tables[table];

}

const cartItems =
document.getElementById("cartItems");

cartItems.innerHTML="";

let total=0;

cart.forEach((item,index)=>{

total += item.price*item.qty;

cartItems.innerHTML += `
<div class="cartItem">

<div class="cartTop">

<div>
<b>${item.name}</b>
<br>
<small>${item.type}</small>
</div>

<div>
₹${item.price * item.qty}
</div>

</div>

<div class="cartQty">

<button class="qtyBtn"
onclick="changeQty(${index},-1)">
−
</button>

<span>${item.qty}</span>

<button class="qtyBtn"
onclick="changeQty(${index},1)">
+
</button>

</div>

</div>
`;

});

document.getElementById("total")
.innerText=total;

}

/* PAYMENT */

function payUPI(){

paymentMode = "UPI";
closePaymentPopup();
confirmSaveBill(sendWhatsapp);

}

function showQR(){

paymentMode = "QR";
closePaymentPopup();
confirmSaveBill(sendWhatsapp);

}

function cashPayment(){

paymentMode = "Cash";
closePaymentPopup();
confirmSaveBill(sendWhatsapp);

}

window.payUPI = payUPI;
window.showQR = showQR;
window.cashPayment = cashPayment;

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

function confirmSaveBillChoice(send){

    sendWhatsapp = send;

    document.getElementById("saveBillPopup").style.display = "none";

    if(send){

        document.getElementById("customerNumber").focus();

        document.getElementById("customerNumber")
        .style.border = "3px solid red";

    }else{

        openPaymentPopup();

    }
}

function continueAfterNumber(){

    const number =
    document.getElementById("customerNumber").value;

    if(number.trim() === ""){

        alert("Please Enter WhatsApp Number");
        document.getElementById("customerNumber").focus();
        return;

    }

    openPaymentPopup();
}

window.continueAfterNumber = continueAfterNumber;

function checkPaymentMode(){

if(sendWhatsapp){

const number =
document.getElementById("customerNumber").value;

if(number.trim() === ""){

alert("Please Enter WhatsApp Number First");
document.getElementById("customerNumber").focus();
return;

}

}

openPaymentPopup();

}

window.checkPaymentMode = checkPaymentMode;

window.confirmSaveBillChoice = confirmSaveBillChoice;

function closeSaveBillPopup(){

    document.getElementById("saveBillPopup").style.display = "none";

    sendWhatsapp = false;

}

window.closeSaveBillPopup = closeSaveBillPopup;

function saveBill(){

    if(cart.length === 0){
        alert("Please add item in cart");
        return;
    }

    document.getElementById("saveBillPopup").style.display = "flex";

}

window.saveBill = saveBill;

window.saveBill = saveBill;

async function confirmSaveBill(sendWhatsapp){

const customerName =
document.getElementById("customerName").value;

const mobile =
document.getElementById("customerNumber").value;

const total =
document.getElementById("total").innerText;
const tableNo = selectedTable;
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
paymentMode,
tableNo

};

await fetch(API_URL,{
method:"POST",
body:JSON.stringify(data)
});

alert("✅ Bill Saved Successfully");

if(sendWhatsapp){

sendWhatsApp();

}

cart = [];
renderCart();

document.getElementById("customerName").value = "";
document.getElementById("customerNumber").value = "";

paymentMode = "Cash";

sendWhatsapp = false;

loadDashboard();
}

window.confirmSaveBill =
confirmSaveBill;

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

function holdBill(){

    if(!selectedTable){

        alert("Please Select Table");
        return;
    }

    if(cart.length === 0){

        alert("Cart Empty");
        return;
    }

    const holdData = {

        customerName:
        document.getElementById("customerName").value,

        mobile:
        document.getElementById("customerNumber").value,

        cart: cart

    };

    localStorage.setItem(
        "table_" + selectedTable,
        JSON.stringify(holdData)
    );

    alert(
        "Table " + selectedTable +
        " Hold Successfully"
    );

    updateTableCards();

    cart = [];

    renderCart();

}
window.holdBill = holdBill;

document.getElementById("customerName").value = "";
document.getElementById("customerNumber").value = "";

}

function clearCart(){

if(cart.length === 0){
return;
}

if(confirm("Clear all items from cart?")){

cart = [];
renderCart();

document.getElementById("customerName").value = "";
document.getElementById("customerNumber").value = "";

}

}

window.clearCart = clearCart;

function loadCategories(){

const categories = [...new Set(
items.map(item => item.category)
)];

const categoryList =
document.getElementById("menuDropdown");

categoryList.innerHTML = "";

categories.forEach(category => {

const icons = {
"Tea":"☕",
"Coffee":"☕",
"Snacks":"🍔",
"Cold Drinks":"🥤",
"Shake":"🥤",
"Hot":"🔥",
"Cold":"❄️"
};

categoryList.innerHTML += `
<button
class="menuCategory"
onclick="showCategory('${category}')">
${icons[category] || ""} ${category}
</button>
`;

});

document.getElementById("productGrid").innerHTML = "";
document.getElementById("emptyState").style.display = "block";

}

window.onload = function(){

if(localStorage.getItem("isLoggedIn") === "true"){

document.getElementById("loginPage").style.display="none";
document.getElementById("billingPage").style.display="block";

document.getElementById("customerHeader").innerHTML =
`${localStorage.getItem("outlet")} (ID: ${localStorage.getItem("customerId")})`;

loadMenu();

}

};

/* SALES DASHBOARD */

async function openSalesDashboard(){

document.getElementById("menuDropdown").style.display = "none";

document.getElementById("productGrid").innerHTML = "";

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

async function loadCustomSales(){

const customerId =
localStorage.getItem("customerId");

const fromDate =
document.getElementById("fromDate").value;

const toDate =
document.getElementById("toDate").value;

if(!fromDate || !toDate){

alert("Select Date Range");
return;

}

const res = await fetch(
API_URL +
"?action=dashboard" +
"&customerId=" + customerId +
"&fromDate=" + fromDate +
"&toDate=" + toDate
);

const data = await res.json();

/* Dashboard Cards */

document.getElementById("todayRevenue").innerText =
`₹${data.revenue || 0}`;

document.getElementById("todayBills").innerText =
data.bills || 0;

document.getElementById("upiSales").innerText =
`₹${data.upiSales || 0}`;

document.getElementById("highestBill").innerText =
`₹${data.highestBill || 0}`;

/* Top Selling */

const topDiv =
document.getElementById("topItems");

topDiv.innerHTML = "";

if(!data.topSelling || data.topSelling.length === 0){

topDiv.innerHTML =
"<p>No Sales Found</p>";

return;

}

data.topSelling.slice(0,5).forEach((item,index)=>{

topDiv.innerHTML += `
<div class="top-item">
<span>${index+1}. ${item.item}</span>
<span>${item.qty}</span>
</div>
`;

});

}

window.loadCustomSales =
loadCustomSales;

function resetDashboard(){

const today =
new Date().toISOString().split("T")[0];

document.getElementById("fromDate").value = today;
document.getElementById("toDate").value = today;

loadDashboard();

}

window.resetDashboard = resetDashboard;

function goHome(){

    // Dashboard Show
    document.getElementById("emptyState").style.display = "block";

    // Tables Hide
    document.getElementById("tablesPage").style.display = "none";

    // Product Section Show
    document.querySelector(".productSection").style.display = "block";

    // Product Grid Clear
    document.getElementById("productGrid").innerHTML = "";

    // Search Hide
    document.getElementById("searchArea").style.display = "none";

    // Billing Menu Close
    document.getElementById("menuDropdown").style.display = "none";

    document
    .querySelectorAll(".menuCategory")
    .forEach(btn => btn.classList.remove("active"));

    loadDashboard();
}

window.goHome = goHome;

function setActiveMenu(el){

document
.querySelectorAll(".homeBtn, .menuHeader")
.forEach(btn => btn.classList.remove("active"));

el.classList.add("active");

}

window.setActiveMenu = setActiveMenu;


function toggleMenu(){

    const menu =
    document.getElementById("menuDropdown");

    // Dashboard Hide
    document.getElementById("emptyState").style.display = "none";

    // Tables Hide
    document.getElementById("tablesPage").style.display = "none";

    // Product Section Show
    document.querySelector(".productSection").style.display = "block";

    if(menu.style.display === "block"){

        menu.style.display = "none";

        document.getElementById("searchArea").style.display = "none";

    }else{

        menu.style.display = "block";

        document.getElementById("searchArea").style.display = "flex";

    }

}

window.toggleMenu = toggleMenu;

function searchProducts(){

const search =
document.getElementById("searchBox")
.value
.toLowerCase();

const grid =
document.getElementById("productGrid");

grid.innerHTML = "";

document.getElementById("emptyState").style.display = "none";

items
.filter(item =>
item.name.toLowerCase().includes(search)
)
.forEach(item=>{

const card =
document.createElement("div");

card.className="card";

card.innerHTML = `
<img
src="${item.image}"
class="productImage">

<h3>${item.name}</h3>

<p class="priceText">
₹${item.variations[0].price}
</p>

<div class="productActions">

<button
class="qtyBtn"
onclick="event.stopPropagation();
addToCart(
'${item.name}',
'${item.variations[0].type}',
${item.variations[0].price}
)">
+
</button>

<button
class="addOrderBtn"
onclick="event.stopPropagation();
addToCart(
'${item.name}',
'${item.variations[0].type}',
${item.variations[0].price}
)">
Add
</button>

</div>
`;

grid.appendChild(card);

});

}

async function loadDashboard(){

function printKOT(){

if(cart.length===0){

alert("Cart Empty");

return;

}

let html = `
<h2>SWAD AMRUTAM CHAI</h2>
<h3>KOT</h3>
<hr>
`;

cart.forEach(item=>{

html += `
<p>
${item.name}
(${item.type})
x ${item.qty}
</p>
`;

});

const win =
window.open("","","width=400,height=600");

win.document.write(html);

win.print();

}

function printBill(){

if(cart.length===0){

alert("Cart Empty");

return;

}

let total = 0;

let html = `
<h2>SWAD AMRUTAM CHAI</h2>
<hr>
`;

cart.forEach(item=>{

let amount =
item.price * item.qty;

total += amount;

html += `
<p>
${item.name}
x${item.qty}
=
₹${amount}
</p>
`;

});

html += `
<hr>
<h2>Total : ₹${total}</h2>
`;

const win =
window.open("","","width=400,height=700");

win.document.write(html);

win.print();

}

const customerId =
localStorage.getItem("customerId");

const fromDate =
document.getElementById("fromDate").value;

const toDate =
document.getElementById("toDate").value;

let url =
API_URL +
"?action=dashboard&customerId=" +
customerId;

if(fromDate && toDate){

url +=
"&fromDate=" + fromDate +
"&toDate=" + toDate;

}

const res = await fetch(url);

const data = await res.json();

/* Cards */

document.getElementById("todayRevenue").innerText =
`₹${data.revenue || 0}`;

document.getElementById("todayBills").innerText =
data.bills || 0;

document.getElementById("upiSales").innerText =
`₹${data.upiSales || 0}`;

document.getElementById("highestBill").innerText =
`₹${data.highestBill || 0}`;

/* Top Selling */

const topDiv =
document.getElementById("topItems");

topDiv.innerHTML = "";

if(!data.topSelling ||
data.topSelling.length === 0){

topDiv.innerHTML =
"<p>No Sales Found</p>";

return;

}

data.topSelling.slice(0,5).forEach((item,index)=>{

topDiv.innerHTML += `
<div class="top-item">
<span>${index+1}. ${item.item}</span>
<span>${item.qty}</span>
</div>
`;

});

}

function openTablesPage(){

    // Dashboard Hide
    document.getElementById("emptyState").style.display = "none";

    // Billing Close
    document.getElementById("menuDropdown").style.display = "none";

    // Search Hide
    document.getElementById("searchArea").style.display = "none";

    // Product Section Hide
    document.querySelector(".productSection").style.display = "none";

    // Tables Show
    document.getElementById("tablesPage").style.display = "block";

}

window.openTablesPage = openTablesPage;

function openTable(tableNo){

    selectedTable = tableNo;

    document.getElementById("selectedTable").innerText =
    "Table " + tableNo;

    document.getElementById("tablesPage").style.display = "none";

    document.querySelector(".productSection").style.display = "block";

    document.getElementById("searchArea").style.display = "flex";

    document.getElementById("menuDropdown").style.display = "block";

    if(!tables[tableNo]){
        tables[tableNo] = [];
    }

    cart = tables[tableNo];

    renderCart();

    const firstCategory =
    document.querySelector(".menuCategory");

    if(firstCategory){

        showCategory(
            firstCategory.innerText
            .replace(/^[^\w]+/,'')
            .trim()
        );

    }

}

window.openTable = openTable;

function updateTableCards(){

    for(let i=1;i<=20;i++){

        const data =
        localStorage.getItem("table_" + i);

        const status =
        document.getElementById("status_" + i);

        if(!status) continue;

        if(data){

            status.innerHTML =
            '<span style="color:#ff9800">Hold</span>';

        }else{

            status.innerHTML =
            '<span style="color:#00c853">Available</span>';
        }

    }
}

function viewTable(tableNo){

    const data =
    localStorage.getItem("table_" + tableNo);

    if(!data){

        alert("No Hold Order Found");
        return;
    }

    const order =
    JSON.parse(data);

    selectedTable = tableNo;

    cart = order.cart || [];

    document.getElementById("customerName").value =
    order.customerName || "";

    document.getElementById("customerNumber").value =
    order.mobile || "";

    renderCart();

    document.getElementById("tablesPage").style.display = "none";

    document.querySelector(".productSection").style.display = "block";

}

window.viewTable = viewTable;