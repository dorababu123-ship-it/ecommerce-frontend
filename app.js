/* ====== DEBOUNCE HELPER ====== */
function debounce(fn, ms = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ====== PRODUCTS ====== */
const products = [
  {
    id: 1,
    title: "Classic White T-Shirt",
    price: 399,
    category: "Clothing",
    img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  },
  {
    id: 2,
    title: "Black Hoodie",
    price: 899,
    category: "Clothing",
    img: "https://images.meesho.com/images/products/59924591/k7m0s_512.avif?width=512",
  },
  {
    id: 3,
    title: "Blue Denim Jacket",
    price: 1499,
    category: "Clothing",
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  },
  {
    id: 4,
    title: "Running Shoes",
    price: 2499,
    category: "Footwear",
    img: "https://images.meesho.com/images/products/478801134/qnmek_512.avif?width=512",
  },
  {
    id: 5,
    title: "White Sneakers",
    price: 1999,
    category: "Footwear",
    img: "https://m.media-amazon.com/images/I/6157WaPyAyL._SY625_.jpg",
  },
  {
    id: 6,
    title: "Formal Leather Shoes",
    price: 2999,
    category: "Footwear",
    img: "https://images.meesho.com/images/products/431549111/chg4a_512.avif?width=51",
  },
  {
    id: 7,
    title: "Smart Watch",
    price: 4999,
    category: "Electronics",
    img: "https://m.media-amazon.com/images/I/41cSg6D19-L._SY300_SX300_QL70_FMwebp_.jpg",
  },
  {
    id: 8,
    title: "Wireless Earbuds",
    price: 1299,
    category: "Electronics",
    img: "https://images.meesho.com/images/products/627505365/ihfru_512.avif?width=512",
  },
  {
    id: 9,
    title: "Bluetooth Speaker",
    price: 1799,
    category: "Electronics",
    img: "https://images.meesho.com/images/products/631055675/githf_512.avif?width=512",
  },
  {
    id: 10,
    title: "Gaming Headset",
    price: 2599,
    category: "Electronics",
    img: "https://images.meesho.com/images/products/594784483/xqh0a_512.avif?width=512",
  },
  {
    id: 11,
    title: "Leather Wallet",
    price: 799,
    category: "Accessories",
    img: "https://images.meesho.com/images/products/526208129/hhubw_512.avif?width=512",
  },
  {
    id: 12,
    title: "Sunglasses",
    price: 599,
    category: "Accessories",
    img: "https://images.meesho.com/images/products/427941968/ftiye_512.avif?width=512",
  },
  {
    id: 13,
    title: "Sports Cap",
    price: 349,
    category: "Accessories",
    img: "https://images.meesho.com/images/products/324567677/r9dgb_512.avif?width=512",
  },
  {
    id: 14,
    title: "Backpack",
    price: 1299,
    category: "Bags",
    img: "https://images.meesho.com/images/products/264055314/rcyne_512.avif?width=512",
  },
  {
    id: 15,
    title: "Laptop Bag",
    price: 1699,
    category: "Bags",
    img: "https://images.meesho.com/images/products/486645145/gntup_512.avif?width=512",
  },
  {
    id: 16,
    title: "Analog Watch",
    price: 1499,
    category: "Watches",
    img: "https://images.meesho.com/images/products/530562811/4zp30_512.avif?width=512",
  },
  {
    id: 17,
    title: "Digital Sports Watch",
    price: 2199,
    category: "Watches",
    img: "https://images.meesho.com/images/products/621788275/3xk7u_512.avif?width=512",
  },
  {
    id: 18,
    title: "Perfume Spray",
    price: 999,
    category: "Beauty",
    img: "https://m.media-amazon.com/images/I/61qEs8fxOEL._SX522_.jpg",
  },
  {
    id: 19,
    title: "Face Moisturizer",
    price: 499,
    category: "Beauty",
    img: "https://m.media-amazon.com/images/I/51EeuzB4Q7L._SX522_.jpg",
  },
  {
    id: 20,
    title: "Hair Styling Gel",
    price: 299,
    category: "Beauty",
    img: "https://m.media-amazon.com/images/I/61nXspkTebL._SX522_.jpg",
  },
  {
    id: 21,
    title: "Coffee Mug",
    price: 199,
    category: "Home",
    img: "https://m.media-amazon.com/images/I/61qkm65hJOL._SX679_.jpg",
  },
  {
    id: 22,
    title: "Water Bottle",
    price: 249,
    category: "Home",
    img: "https://m.media-amazon.com/images/I/6120dYM+dkL._SX679_.jpg",
  },
  {
    id: 23,
    title: "Table Lamp",
    price: 799,
    category: "Home",
    img: "https://m.media-amazon.com/images/I/71aKrx8vb4L._SX425_.jpg",
  },
  {
    id: 24,
    title: "Yoga Mat",
    price: 699,
    category: "Fitness",
    img: "https://m.media-amazon.com/images/I/611PpwmX45L._SX679_.jpg",
  },
  {
    id: 25,
    title: "Dumbbells Set",
    price: 1499,
    category: "Fitness",
    img: "https://m.media-amazon.com/images/I/51ocjLjjPDL._SY300_SX300_QL70_FMwebp_.jpg",
  },
];

/* ===== App state (include pagination) ===== */
let state = {
  products,
  filtered: [...products],
  categories: [],
  cart: JSON.parse(localStorage.getItem("cart_v1") || "[]"),
  maxPrice: 0,
  page: 1,
  pageSize: 12,
};

/* ===== DOM refs ===== */
const productsGrid = document.getElementById("productsGrid");
const productTpl = document.getElementById("productTpl");
const categoryList = document.getElementById("categoryList");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");
const resultsCount = document.getElementById("resultsCount");

/* ===== Initialize AFTER DOM is ready ===== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  // defensive: ensure products loaded
  if (!Array.isArray(state.products) || state.products.length === 0) {
    console.error("No products found in state.products");
    if (productsGrid)
      productsGrid.innerHTML = `<div style="padding:20px;color:#666">No products available.</div>`;
    return;
  }

  state.categories = [
    ...new Set(state.products.map((p) => p.category || "Other")),
  ];
  state.maxPrice = Math.max(...state.products.map((p) => p.price || 0));

  if (priceRange) {
    priceRange.max = state.maxPrice;
    priceRange.value = state.maxPrice;
  }
  if (priceValue) priceValue.textContent = `Max: ₹${state.maxPrice}`;

  renderCategories();
  // initial render with pagination
  renderWithPagination(state.products);
  updateCartUI();

  // Events
  if (searchInput)
    searchInput.addEventListener("input", debounce(onSearch, 300));
  if (sortSelect) sortSelect.addEventListener("change", onSort);
  if (priceRange) priceRange.addEventListener("input", onPrice);
  if (cartBtn)
    cartBtn.addEventListener("click", () =>
      cartModal.classList.remove("hidden")
    );
  if (closeCart)
    closeCart.addEventListener("click", () =>
      cartModal.classList.add("hidden")
    );

  // expose functions used by inline onclick attributes
  window.changeQty = changeQty;
  window.removeFromCart = removeFromCart;
}

/* ===== Render category filters ===== */
function renderCategories() {
  if (!categoryList) return;
  categoryList.innerHTML = "";
  const allItem = document.createElement("li");
  allItem.innerHTML = `<label><input type="radio" name="cat" value="all" checked /> All</label>`;
  categoryList.appendChild(allItem);

  state.categories.forEach((cat) => {
    const li = document.createElement("li");
    li.innerHTML = `<label><input type="radio" name="cat" value="${cat}" /> ${cat}</label>`;
    categoryList.appendChild(li);
  });

  categoryList.querySelectorAll('input[name="cat"]').forEach((inp) => {
    inp.addEventListener("change", onCategoryChange);
  });
}

/* ===== Render products to grid (single page content) ===== */
function renderProducts(list) {
  if (!productsGrid) return;
  productsGrid.innerHTML = "";
  if (!list || list.length === 0) {
    productsGrid.innerHTML = `<div style="padding:20px;color:#666">No products match your filters.</div>`;
    if (resultsCount) resultsCount.textContent = `0 results`;
    return;
  }

  list.forEach((p) => {
    const node = productTpl.content.cloneNode(true);
    const imgEl = node.querySelector(".product-img");
    const titleEl = node.querySelector(".product-title");
    const priceEl = node.querySelector(".product-price");
    const catEl = node.querySelector(".product-category");
    const descEl = node.querySelector(".product-desc");
    const addBtn = node.querySelector(".add-to-cart");
    const viewBtn = node.querySelector(".view-detail");

    if (imgEl) {
      imgEl.loading = "lazy";
      imgEl.decoding = "async";
      imgEl.src = p.img ? p.img + "?auto=format&fit=crop&w=800&q=60" : "";
      imgEl.alt = p.title || "product";
    }
    if (titleEl) titleEl.textContent = p.title || "Untitled";
    if (priceEl) priceEl.textContent = `₹${p.price || 0}`;
    if (catEl) catEl.textContent = p.category || "";
    if (descEl) descEl.textContent = p.description || "";

    if (addBtn) addBtn.addEventListener("click", () => addToCart(p));
    if (viewBtn)
      viewBtn.addEventListener("click", () =>
        alert(`${p.title}\n₹${p.price}\nCategory: ${p.category}`)
      );

    productsGrid.appendChild(node);
  });

  if (resultsCount)
    resultsCount.textContent = `${list.length} result${
      list.length > 1 ? "s" : ""
    }`;
}

/* ===== Pagination helpers ===== */
function renderWithPagination(list) {
  // reset page if out of range
  const totalPages = Math.max(1, Math.ceil(list.length / state.pageSize));
  if (state.page > totalPages) state.page = 1;

  const start = (state.page - 1) * state.pageSize;
  const paged = list.slice(start, start + state.pageSize);

  renderProducts(paged);
  renderPaginationControls(totalPages);
}

function renderPaginationControls(totalPages) {
  let ctrl = document.getElementById("paginationCtrl");
  if (!ctrl) {
    ctrl = document.createElement("div");
    ctrl.id = "paginationCtrl";
    ctrl.className = "pagination";
    const container = document.querySelector(".product-area");
    if (container) container.appendChild(ctrl);
    else document.body.appendChild(ctrl);
  }

  ctrl.innerHTML = "";
  if (totalPages <= 1) return;

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === state.page ? "active-page" : "";
    btn.addEventListener("click", () => {
      state.page = i;
      renderWithPagination(state.filtered);
      // scroll to top of product area for better UX
      const area = document.querySelector(".product-area");
      if (area) area.scrollIntoView({ behavior: "smooth" });
    });
    ctrl.appendChild(btn);
  }
}

/* ===== Filters & search handlers ===== */
function onSearch(e) {
  applyFilters();
}
function onSort() {
  applyFilters();
}
function onPrice(e) {
  if (priceValue) priceValue.textContent = `Max: ₹${e.target.value}`;
  applyFilters();
}
function onCategoryChange() {
  applyFilters();
}

function applyFilters() {
  const q = (searchInput?.value || "").trim().toLowerCase();
  const sort = sortSelect?.value || "default";
  const maxP = Number(priceRange?.value || state.maxPrice);
  const selectedCat =
    document.querySelector('input[name="cat"]:checked')?.value || "all";

  let filtered = state.products.filter((p) => (p.price || 0) <= maxP);

  if (selectedCat !== "all")
    filtered = filtered.filter((p) => p.category === selectedCat);
  if (q)
    filtered = filtered.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );

  if (sort === "price-asc")
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sort === "price-desc")
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));

  state.filtered = filtered;
  state.page = 1; // reset to first page on filter/search
  renderWithPagination(filtered);
}

/* ===== Cart management ===== */
function addToCart(product) {
  if (!product) return;
  const existing = state.cart.find((i) => i.id === product.id);
  if (existing) existing.qty += 1;
  else state.cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartUI();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((i) => i.id !== id);
  saveCart();
  updateCartUI();
}

function changeQty(id, delta) {
  const item = state.cart.find((i) => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  saveCart();
  updateCartUI();
}

function saveCart() {
  localStorage.setItem("cart_v1", JSON.stringify(state.cart));
}

function updateCartUI() {
  if (!cartCount || !cartItems || !cartTotal) return;
  cartCount.textContent = state.cart.reduce((s, i) => s + (i.qty || 0), 0);
  cartItems.innerHTML = "";
  let total = 0;
  state.cart.forEach((item) => {
    total += (item.price || 0) * (item.qty || 0);

    // build cart item element cleanly (avoid inline string bugs)
    const div = document.createElement("div");
    div.className = "cart-item";

    const img = document.createElement("img");
    img.src = item.img ? item.img + "?auto=format&fit=crop&w=400&q=60" : "";
    img.alt = item.title || "product";
    img.loading = "lazy";
    img.decoding = "async";

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = item.title || "";

    const priceLine = document.createElement("div");
    priceLine.textContent = `₹${item.price} × ${item.qty}`;

    const qtyControls = document.createElement("div");
    qtyControls.className = "qty-controls";

    const minusBtn = document.createElement("button");
    minusBtn.textContent = "−";
    minusBtn.onclick = () => changeQty(item.id, -1);

    const plusBtn = document.createElement("button");
    plusBtn.textContent = "+";
    plusBtn.onclick = () => changeQty(item.id, 1);

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.style.marginLeft = "8px";
    removeBtn.onclick = () => removeFromCart(item.id);

    qtyControls.appendChild(minusBtn);
    qtyControls.appendChild(plusBtn);
    qtyControls.appendChild(removeBtn);

    info.appendChild(title);
    info.appendChild(priceLine);
    info.appendChild(qtyControls);

    div.appendChild(img);
    div.appendChild(info);

    cartItems.appendChild(div);
  });

  cartTotal.textContent = total;
}
