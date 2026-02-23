
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const delivery = 80;

function addToCart(name, price){
    const item = cart.find(p=>p.name===name);
    if(item) item.quantity++;
    else cart.push({name,price,quantity:1});
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart");
}

function renderCart(){
    const container=document.getElementById("cartItems");
    if(!container) return;
    let subtotal=0;
    container.innerHTML="";
    cart.forEach(item=>{
        subtotal+=item.price*item.quantity;
        container.innerHTML+=`<p>${item.quantity}x ${item.name} - R${item.price*item.quantity}</p>`;
    });
    document.getElementById("subtotal").innerHTML="Subtotal: R"+subtotal;
    document.getElementById("total").innerHTML="Total: R"+(subtotal+delivery);
}

document.addEventListener("DOMContentLoaded",function(){
renderCart();
const form=document.getElementById("checkoutForm");
if(form){
form.addEventListener("submit",function(e){
e.preventDefault();
let name=document.getElementById("name").value;
let phone=document.getElementById("phone").value;
let email=document.getElementById("email").value;
let address=document.getElementById("address").value;
let subtotal=0;
let message="New Luxury Order:%0A%0A";
cart.forEach(item=>{
subtotal+=item.price*item.quantity;
message+=item.quantity+"x "+item.name+" - R"+(item.price*item.quantity)+"%0A";
});
let total=subtotal+delivery;
message+="%0ASubtotal: R"+subtotal+"%0ADelivery: R"+delivery+"%0ATotal: R"+total+"%0A%0AName:"+name+"%0APhone:"+phone+"%0AEmail:"+email+"%0AAddress:"+address;
window.open("https://wa.me/27792102215?text="+message,"_blank");
localStorage.removeItem("cart");
alert("Order submitted successfully!");
});
}
});
