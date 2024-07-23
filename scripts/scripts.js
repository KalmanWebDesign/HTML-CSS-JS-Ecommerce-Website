const cartStorage = {
    get: () => JSON.parse(localStorage.getItem('cartProducts')) || [],
    set: (cartProducts) => localStorage.setItem('cartProducts', JSON.stringify(cartProducts))
};

const isIndexPage = window.location.pathname.includes('index.html');
const isCartPage = window.location.pathname.includes('cart.html');

const items = [
    {
        id: 1,
        desc: "Robust stainless steel watch for all terrains",
        title: "Stainless Steel Mechanical Watch",
        img: '../images/watch1.png',
        alt: 'stainless steel watch',
        price: 349.99
    },
    {
        id: 2,
        desc: "Gold plated watch for those special occasions",
        title: "Gold Plated Mechanical Watch",
        img: '../images/watch2.png',
        alt: 'gold watch',
        price: 639.99
    },
    {
        id: 3,
        desc: "Flashy gold watch on a gentleman's budget",
        title: "Faux Gold Mechanical Watch",
        img: '../images/watch3.png',
        alt: 'faux gold watch',
        price: 225.99
    }
];

const formatPrice = (price) => {
    const formattedPrice = parseFloat(price.toFixed(2)).toLocaleString();
    return formattedPrice;
}

const calculateTotal = () => {
    let totalPrice = 0;
    const cartGridItems = document.querySelectorAll('.product-in-cart');

    cartGridItems.forEach(item => {
        const priceElement = item.querySelector('.price');
        const quantityElement = item.querySelector('.quantity-select');
        const unitPrice = parseFloat(priceElement.getAttribute('data-unit-price'));
        const quantity = parseInt(quantityElement.value);
        const itemTotal = unitPrice * quantity;

        totalPrice += itemTotal;
    });

    const pricingContainer = document.querySelector('.pricing-container');
    if (pricingContainer) {
        const displayPricing = `
                <h3>Order Summary</h3>
                <div class="subtotal">
                    <h3>Subtotal:</h3>
                    <div>$${formatPrice(totalPrice)}</div>
                </div>
                <div class="shipping">
                    <h3>Estimated Shipping:</h3>
                    <div>FREE</div>
                </div>
                <div class="tax">
                    <h3>Estimated Tax</h3>
                    <div>$${formatPrice(totalPrice * .08)}</div>
                </div>
                <div class="total">
                    <h3>Estimated Total</h3>
                    <div>$${formatPrice(totalPrice * 1.08)}</div>
                </div>
                <div>
                    <button class="checkout-btn">Checkout</button>
                </div>
        `;
        pricingContainer.innerHTML = displayPricing;
    }
}

const updateQuantity = (event) => {
    const quanVal = parseInt(event.target.value);
    const prod = event.target.closest('.product-in-cart');
    const prodId = parseInt(prod.getAttribute('data-id'));

    let newCartItems = cartStorage.get();

    newCartItems = newCartItems.map(item => {
        if (item.id === prodId) {
            item.quantity = quanVal;
        }
        return item;
    });

    cartStorage.set(newCartItems);
    calculateTotal();
}

const removeItem = (event) => {
    const prodRemove = event.target.closest('.product-in-cart').getAttribute('data-id');
    let cartItems = cartStorage.get();
    cartItems = cartItems.filter(item => item.id !== parseInt(prodRemove));
    cartStorage.set(cartItems);
    event.target.closest('.product-in-cart').remove();

    if (cartItems.length === 0) {
        document.querySelector('.cart-items').innerHTML = '<h2>Your cart is empty</h2>';
    }

    calculateTotal();
}


document.addEventListener('change', event => {
    if (event.target.classList.contains('quantity-select')) {
        updateQuantity(event);
    }
});

if (isIndexPage) {

    const productContainer = document.querySelector('.product-grid');

    items.forEach(item => {
        const newProd = `
        <div class="product" data-id="${item.id}">
            <div class="img-container">
                <img src="${item.img}" alt="${item.alt}" loading="lazy">
            </div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <p>$${item.price}</p>
            <button class="add-to-cart">Add to Cart</button>
        </div>`
        productContainer.insertAdjacentHTML('beforeend', newProd)
    });

    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', event => {
            const productId = event.target.closest('.product').getAttribute('data-id');
            const productData = items.find(item => item.id === parseInt(productId));

            let cartItems = cartStorage.get();
            const existingItemIndex = cartItems.findIndex(item => item.id === productData.id);
            console.log(existingItemIndex)

            if (existingItemIndex !== -1) {
                alert("Item is already in the cart.")
            } else {
                cartItems.push({...productData, quantity: 1});
                cartStorage.set(cartItems);
                alert("Item added to your cart");
            }
        })
    })
}


if (isCartPage) {
    const cartGrid = document.querySelector('.cart-items');
    const cartItems = cartStorage.get();

    if (cartItems.length === 0) {
        cartGrid.innerHTML = '<h2>Your cart is empty</h2>';
        calculateTotal();
    } else {
        cartItems.forEach(item => {
            const addProd = `
                    <div class="product-in-cart" data-id="${item.id}">
                        <div class="product-in-cart-left">
                            <img src="${item.img}" alt="${item.alt}">
                            <div class="product-info">
                                <p>${item.title}</p>
                                <p>Item #: ${item.id}</p>
                            </div>
                        </div>
                        <div class="product-in-cart-right">
                            <div>
                                <p>Each</p>
                                <div class="price" data-unit-price="${item.price}">$${(item.price)}</div>
                            </div>
                            <div class="quantity">
                                <label for="quantity">Qty:</label>
                                <select name="quantity" class="quantity-select" id="quantity">
                                    <option value="1" ${item.quantity === 1 ? "selected" : ''}>1</option>
                                    <option value="2" ${item.quantity === 2 ? "selected" : ''}>2</option>
                                    <option value="3" ${item.quantity === 3 ? "selected" : ''}>3</option>
                                    <option value="4" ${item.quantity === 4 ? "selected" : ''}>4</option>
                                </select>
                            </div>
                            <i class="fa-solid fa-x"></i>
                        </div>
                    </div>`;
            cartGrid.insertAdjacentHTML('beforeend', addProd);
        });
        calculateTotal();
    }

    const faX = document.querySelectorAll('.fa-x');
    faX.forEach(item => {
        item.addEventListener('click', event => {
            removeItem(event);
        })
    })
    
}





























// navigation
function on() {
    const turnOn = document.getElementById("overlay");
    // turnOn.classList.add("fade-in");
    turnOn.style.display = "block";
    turnOn.classList.add("fade-in");
    const overflow = document.querySelector("body");
    overflow.style.overflow = "hidden";
}

function off() {
    const turnOff = document.getElementById("overlay");
    turnOff.style.display = "none";

    const overflow = document.querySelector("body");
    overflow.style.overflow = "";
}


const nav = document.querySelector("nav");

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        nav.classList.add("shrink-nav")
    } else {
        nav.classList.remove("shrink-nav")
    }
})