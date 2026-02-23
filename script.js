
// Initialize EmailJS safely
if (typeof emailjs !== "undefined") {
    emailjs.init("qAmqQzV-3vAXL3nLb");
}

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const delivery = 80;

function updateCartCount() {
    const count = cart.reduce((sum,item)=>sum+item.quantity,0);
    const badge = document.getElementById("cart-count");
    if(badge) badge.innerText = count;
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(name, price) {
    const existing = cart.find(p => p.name === name);
    if(existing) existing.quantity++;
    else cart.push({name, price, quantity:1});
    saveCart();
    alert("Added to cart");
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if(!container) return;

    container.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item,index)=>{
        subtotal += item.price * item.quantity;

        container.innerHTML += `
        <div>
            <p>${item.name} - R${item.price}</p>
            <button class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
            <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
            <hr>
        </div>`;
    });

    document.getElementById("subtotal").innerText = "Subtotal: R" + subtotal;
    document.getElementById("total").innerText = "Total: R" + (subtotal + delivery);
}

function changeQty(index, change) {
    cart[index].quantity += change;
    if(cart[index].quantity <= 0) cart.splice(index,1);
    saveCart();
    renderCart();
}

function removeItem(index) {
    cart.splice(index,1);
    saveCart();
    renderCart();
}

function generateOrderNumber() {
    return "HSO-" + new Date().getFullYear() + "-" + Math.floor(Math.random()*10000);
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    renderCart();

    const form = document.getElementById("checkoutForm");
    if(form){
        form.addEventListener("submit", function(e){
            e.preventDefault();

            let name = document.getElementById("name").value.trim();
            let phone = document.getElementById("phone").value.trim();
            let email = document.getElementById("email").value.trim();
            let address = document.getElementById("address").value.trim();

            if(name.length < 3) return alert("Enter valid name");
            if(!/^\d{10}$/.test(phone)) return alert("Enter valid phone number");
            if(!email.includes("@")) return alert("Enter valid email");
            if(address.length < 5) return alert("Enter valid address");

            let orderNumber = generateOrderNumber();
            let subtotal = 0;
            let orderDetails = "";

            cart.forEach(item=>{
                subtotal += item.price * item.quantity;
                orderDetails += item.quantity + "x " + item.name +
                " - R" + (item.price * item.quantity) + "\n";
            });

            let total = subtotal + delivery;

            // WhatsApp
            let whatsappMessage =
            "Order #: " + orderNumber + "%0A%0A" +
            orderDetails.replace(/\n/g,"%0A") +
            "%0ATotal: R" + total +
            "%0A%0AName: " + name +
            "%0APhone: " + phone +
            "%0AEmail: " + email +
            "%0AAddress: " + address;

            window.open("https://wa.me/27792102215?text=" + whatsappMessage,"_blank");

            // EmailJS
            emailjs.send("service_rtqgkgc","template_3hh2nw6",{
                order_number: orderNumber,
                order_details: orderDetails,
                customer_name: name,
                customer_phone: phone,
                customer_email: email,
                customer_address: address,
                order_total: "R" + total
            }).then(function() {
                document.getElementById("success-message").innerText =
                "Order " + orderNumber + " placed successfully!";
                cart = [];
                saveCart();
                renderCart();
            }).catch(function(error){
                console.log(error);
                alert("Email failed. Check EmailJS settings.");
            });
        });
    }
});
