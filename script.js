
document.addEventListener("DOMContentLoaded", function() {

emailjs.init("qAmqQzV-3vAXL3nLb");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const delivery = 80;

function generateOrderNumber() {
    return "HSO-" + new Date().getFullYear() + "-" + Math.floor(Math.random()*10000);
}

function addToCart(name, price) {
    const item = cart.find(p => p.name === name);
    if(item) item.quantity++;
    else cart.push({name:name,price:price,quantity:1});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
}

window.addToCart = addToCart;

function renderCart() {
    const container=document.getElementById("cartItems");
    if(!container) return;

    let subtotal=0;
    container.innerHTML="";

    cart.forEach(function(item) {
        subtotal+=item.price*item.quantity;
        container.innerHTML += "<p>"+item.quantity+"x "+item.name+" - R"+(item.price*item.quantity)+"</p>";
    });

    document.getElementById("subtotal").innerHTML="Subtotal: R"+subtotal;
    document.getElementById("total").innerHTML="Total: R"+(subtotal+delivery);
}

renderCart();

const form=document.getElementById("checkoutForm");
if(form){
form.addEventListener("submit",function(e){
e.preventDefault();

let name=document.getElementById("name").value.trim();
let phone=document.getElementById("phone").value.trim();
let email=document.getElementById("email").value.trim();
let address=document.getElementById("address").value.trim();

if(name.length < 3) return alert("Enter valid name");
if(!/^\d{10}$/.test(phone)) return alert("Enter valid 10-digit phone number");
if(!email.includes("@")) return alert("Enter valid email");
if(address.length < 5) return alert("Enter valid address");

let orderNumber = generateOrderNumber();
let subtotal=0;
let orderDetails="";

cart.forEach(function(item){
subtotal+=item.price*item.quantity;
orderDetails+=item.quantity+"x "+item.name+" - R"+(item.price*item.quantity)+"\n";
});

let total=subtotal+delivery;

let whatsappMessage =
"Order #: "+orderNumber+"%0A%0A"+
orderDetails.replace(/\n/g,"%0A")+
"%0ATotal: R"+total+
"%0A%0AName: "+name+
"%0APhone: "+phone+
"%0AEmail: "+email+
"%0AAddress: "+address;

window.open("https://wa.me/27792102215?text="+whatsappMessage,"_blank");

emailjs.send("service_rtqgkgc","template_3hh2nw6",{
order_number: orderNumber,
order_details: orderDetails,
customer_name: name,
customer_phone: phone,
customer_email: email,
customer_address: address,
order_total: "R"+total
}).then(function() {
alert("Order "+orderNumber+" placed successfully!");
localStorage.removeItem("cart");
}, function() {
alert("Email failed but WhatsApp sent.");
});

});
}

});
