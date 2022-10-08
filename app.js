const root = document.querySelector(".root");
const clearCartBtn = document.querySelector(".clear-cart-btn");
const footer = document.querySelector(".footer");
const totalItemsDOM = document.querySelector("#totalItems");
const totalCartPriceDOM = document.querySelector("#totalCart");
const loader = document.querySelector(".loader");
let amountDOM;

clearCartBtn.addEventListener("click", clearCart);
const url = "https://course-api.com/react-useReducer-cart-project";

//  <<========= fetch cart data >>=========>>
let cart = [];

fetchData();

async function fetchData() {
  root.classList.add("loading");
  root.innerHTML = `<h1>Loading...</h1>`;
  // loader.style.visibility = "visible";

  footer.style.visibility = "hidden";
  const response = await fetch(url);
  cart = await response.json();
  setLocalStorage(cart);

  // console.log(cart);

  displayCart(cart);
  root.classList.remove("loading");
  footer.style.visibility = "visible";
}

// displayCart(data);

//  <<========= display cart data >>=========>>

function displayCart(cart) {
  if (cart.length === 0) {
    root.classList.add("loading");
    footer.style.visibility = "hidden";
    totalItemsDOM.textContent = "0";

    return (root.innerHTML = `<h3> You cart is empy</h3>`);
  }
  root.classList.remove("loading");

  const html = cart
    .map((item) => {
      // console.log(item);
      let { id, title, price, img, amount } = item;

      return ` 

      <section class="container">
        <section class="left">

         <div class="img-container">
            <img src="${img}" alt="${title}">
          </div>
         <div class="details">
          <h3>${title}</h3>
          <h3>$${price}</h3>
          <button onclick="removeCartElement('${id}')" class="btn remove-btn">remove</button>
          </div>
   </section>
   <section class="right">
    <button data-id="${id}" class="increase-btn"><i class="fa-solid fa-chevron-up"></i></button>
    <div class="amount">${amount}</div>
    <button data-id='${id}' class="decrease-btn"><i class="fa-solid fa-chevron-down"></i></button>

   </section>

  </section>
    `;
    })
    .join("");

  root.innerHTML = html;
  amountDOM = root.querySelector(".amount");
  let amountNO = [...root.querySelectorAll(".amount")];

  function getCartTotals(cart) {
    let cartTotals = cart.reduce(
      (cartTotals, cartItem) => {
        let { price, amount } = cartItem;
        let itemTotal = price * amount;
        console.log(itemTotal);
        cartTotals.totalAmount += amount;
        cartTotals.totalPrice += itemTotal;
        return cartTotals;
      },
      {
        totalPrice: 0,
        totalAmount: 0,
      }
    );
    cartTotals.totalPrice = parseFloat(cartTotals.totalPrice.toFixed(2));
    console.log(cartTotals.totalAmount);
    totalItemsDOM.textContent = cartTotals.totalAmount;
    totalCartPriceDOM.textContent = cartTotals.totalPrice;
  }
  getCartTotals(cart);

  // console.log(cartTotals);
  const increaseBtn = [...root.querySelectorAll(".increase-btn")];
  const decreaseBtn = [...root.querySelectorAll(".decrease-btn")];
  // console.log(increaseBtn);
  increaseBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // console.log(e.currentTarget.nextElementSibling);
      // let amount = e.currentTarget.nextElementSibling;
      // let amount = cart.map((item) => item.amount);
      // console.log(amount);
      let cart = getLocalStorage();

      let id = e.currentTarget.dataset.id;

      let tempCart = cart.map((cartItem) => {
        if (cartItem.id === id) {
          return { ...cartItem, amount: cartItem.amount + 1 };
        }
        return cartItem;
      });
      console.log(tempCart);

      // console.log(newCart);
      setLocalStorage(tempCart);
      displayCart(tempCart);
    });
  });
  decreaseBtn.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // console.log(e.currentTarget.previousElementSibling);
      let id = e.currentTarget.dataset.id;

      let tempCart = cart.map((cartItem) => {
        if (cartItem.id === id) {
          return { ...cartItem, amount: cartItem.amount - 1 };
        }
        return cartItem;
      });
      tempCart = tempCart.filter((cartItem) => cartItem.amount !== 0);
      setLocalStorage(tempCart);
      displayCart(tempCart);

      // console.log(tempCart);
    });
  });
}

//  <<========= clear cart  >>=========>>

function clearCart() {
  cart = [];
  displayCart(cart);
  totalItemsDOM.textContent = "0";

  footer.style.visibility = "hidden";
}

//  <<========= Remove cart  >>=========>>

function removeCartElement(id) {
  cart = getLocalStorage();
  let newCart = cart.filter((cartItem) => cartItem.id !== id);
  console.log(newCart);
  setLocalStorage(newCart);
  // console.log(newCart);
  displayCart(newCart);
}

function increaseAmount() {}

//  <<========= Toggle cart amount >>=========>>

function getLocalStorage() {
  let cart = JSON.parse(localStorage.getItem("cart"));
  return cart;
}
function setLocalStorage(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
