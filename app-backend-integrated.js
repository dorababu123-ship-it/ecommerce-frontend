/* ====== DEBOUNCE HELPER ====== */
function debounce(fn, ms = 250) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ====== API CONFIGURATION ====== */
const API_BASE = 'http://localhost:5000/api';

/* ====== App state ====== */
let state = {
  products: [],
  filtered: [],
  categories: [],
  cart: JSON.parse(localStorage.getItem("cart_v1") || "[]"),
  maxPrice: 0,
  page: 1,
  pageSize: 12,
  currentUser: null,
  token: localStorage.getItem('token') || null
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

/* ===== API HELPER FUNCTIONS ===== */
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

/* ===== PRODUCTS API ===== */
async function fetchProducts(params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    const data = await apiCall(endpoint);
    
    state.products = data.products || [];
    state.categories = data.categories || [];
    state.filtered = [...state.products];
    state.maxPrice = Math.max(...state.products.map((p) => p.price || 0));
    
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    showNotification('Failed to load products', 'error');
    return { products: [], categories: [] };
  }
}

/* ===== CART API ===== */
async function fetchCart() {
  if (!state.token) return;
  
  try {
    const data = await apiCall('/cart');
    state.cart = data.items || [];
    updateCartUI();
    return data;
  } catch (error) {
    console.error('Failed to fetch cart:', error);
    // Fallback to localStorage if API fails
    updateCartUI();
  }
}

async function addToCart(productId, quantity = 1) {
  if (!state.token) {
    showNotification('Please login to add items to cart', 'warning');
    return;
  }

  try {
    const data = await apiCall('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity })
    });
    
    state.cart = data.items || [];
    updateCartUI();
    showNotification('Item added to cart', 'success');
    return data;
  } catch (error) {
    console.error('Failed to add to cart:', error);
    showNotification('Failed to add item to cart', 'error');
  }
}

async function updateCartItem(productId, quantity) {
  if (!state.token) return;

  try {
    const data = await apiCall(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity })
    });
    
    state.cart = data.items || [];
    updateCartUI();
    return data;
  } catch (error) {
    console.error('Failed to update cart:', error);
    showNotification('Failed to update cart', 'error');
  }
}

async function removeFromCart(productId) {
  if (!state.token) return;

  try {
    const data = await apiCall(`/cart/${productId}`, {
      method: 'DELETE'
    });
    
    state.cart = data.items || [];
    updateCartUI();
    showNotification('Item removed from cart', 'success');
    return data;
  } catch (error) {
    console.error('Failed to remove from cart:', error);
    showNotification('Failed to remove item', 'error');
  }
}

/* ===== AUTH API ===== */
async function login(email, password) {
  try {
    const data = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    state.token = data.token;
    state.currentUser = data;
    localStorage.setItem('token', data.token);
    
    // Update UI
    updateAuthUI();
    
    // Fetch cart after login
    await fetchCart();
    
    showNotification('Login successful!', 'success');
    closeModal('loginModal');
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    showNotification('Login failed: ' + error.message, 'error');
    throw error;
  }
}

async function register(name, email, password) {
  try {
    const data = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    state.token = data.token;
    state.currentUser = data;
    localStorage.setItem('token', data.token);
    
    // Update UI
    updateAuthUI();
    
    showNotification('Registration successful!', 'success');
    closeModal('registerModal');
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    showNotification('Registration failed: ' + error.message, 'error');
    throw error;
  }
}

function logout() {
  state.token = null;
  state.currentUser = null;
  state.cart = [];
  localStorage.removeItem('token');
  updateAuthUI();
  updateCartUI();
  showNotification('Logged out successfully', 'success');
}

/* ===== AUTH UI ===== */
function updateAuthUI() {
  const authSection = document.getElementById('authSection');
  const userSection = document.getElementById('userSection');
  const userName = document.getElementById('userName');
  
  if (state.token && state.currentUser) {
    // Show user info, hide login/register
    if (authSection) authSection.classList.add('hidden');
    if (userSection) {
      userSection.classList.remove('hidden');
      if (userName) userName.textContent = state.currentUser.name;
    }
  } else {
    // Show login/register, hide user info
    if (authSection) authSection.classList.remove('hidden');
    if (userSection) userSection.classList.add('hidden');
  }
}

function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
  }
}

/* ===== NOTIFICATION SYSTEM ===== */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 4px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  `;
  
  const colors = {
    success: '#22c55e',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

/* ===== Initialize AFTER DOM is ready ===== */
document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  try {
    // Show loading state
    if (productsGrid) {
      productsGrid.innerHTML = `<div style="padding:40px;text-align:center;color:#666">Loading products...</div>`;
    }

    // Setup auth event listeners
    setupAuthListeners();

    // Fetch products from API
    await fetchProducts();
    
    // Initialize UI
    if (priceRange) {
      priceRange.max = state.maxPrice;
      priceRange.value = state.maxPrice;
    }
    if (priceValue) priceValue.textContent = `Max: ₹${state.maxPrice}`;

    renderCategories();
    renderWithPagination(state.products);
    updateCartUI();
    updateAuthUI();

    // Fetch cart if user is logged in
    if (state.token) {
      await fetchCart();
    }

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
    window.addToCart = addToCart;
    window.login = login;
    window.register = register;
    window.logout = logout;
    window.showModal = showModal;
    window.closeModal = closeModal;
    
  } catch (error) {
    console.error('Initialization failed:', error);
    if (productsGrid) {
      productsGrid.innerHTML = `<div style="padding:40px;text-align:center;color:#ef4444">Failed to load products. Please try again.</div>`;
    }
  }
}

/* ===== AUTH EVENT LISTENERS ===== */
function setupAuthListeners() {
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  if (loginBtn) {
    loginBtn.addEventListener('click', () => showModal('loginModal'));
  }

  if (registerBtn) {
    registerBtn.addEventListener('click', () => showModal('registerModal'));
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;
      await login(email, password);
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('registerName').value;
      const email = document.getElementById('registerEmail').value;
      const password = document.getElementById('registerPassword').value;
      await register(name, email, password);
    });
  }

  // Close modals when clicking outside
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.add('hidden');
    }
  });
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
      imgEl.src = p.image || "https://via.placeholder.com/300x200?text=No+Image";
      imgEl.alt = p.name || "Product image";
    }
    if (titleEl) titleEl.textContent = p.name || "Unnamed Product";
    if (priceEl) priceEl.textContent = `₹${p.price || 0}`;
    if (catEl) catEl.textContent = p.category || "Other";
    if (descEl) descEl.textContent = p.description || "No description available.";
    
    if (addBtn) {
      addBtn.onclick = () => addToCart(p._id, 1);
    }
    
    if (viewBtn) {
      viewBtn.onclick = () => viewProduct(p._id);
    }

    productsGrid.appendChild(node);
  });

  if (resultsCount) resultsCount.textContent = `${list.length} result${list.length !== 1 ? "s" : ""}`;
}

/* ===== Pagination render ===== */
function renderWithPagination(list) {
  const start = (state.page - 1) * state.pageSize;
  const pageData = list.slice(start, start + state.pageSize);
  renderProducts(pageData);
  renderPagination(list.length);
}

/* ===== Pagination controls ===== */
function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / state.pageSize);
  const paginationContainer = document.querySelector(".pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  if (totalPages <= 1) return;

  // Previous button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "←";
  prevBtn.className = "page-btn";
  prevBtn.disabled = state.page === 1;
  prevBtn.onclick = () => {
    if (state.page > 1) {
      state.page--;
      applyFilters();
    }
  };
  paginationContainer.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= state.page - 2 && i <= state.page + 2)
    ) {
      const pageBtn = document.createElement("button");
      pageBtn.textContent = i;
      pageBtn.className = i === state.page ? "page-btn active" : "page-btn";
      pageBtn.onclick = () => {
        state.page = i;
        applyFilters();
      };
      paginationContainer.appendChild(pageBtn);
    } else if (i === state.page - 3 || i === state.page + 3) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.className = "page-dots";
      paginationContainer.appendChild(dots);
    }
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "→";
  nextBtn.className = "page-btn";
  nextBtn.disabled = state.page === totalPages;
  nextBtn.onclick = () => {
    if (state.page < totalPages) {
      state.page++;
      applyFilters();
    }
  };
  paginationContainer.appendChild(nextBtn);
}

/* ===== Event handlers ===== */
function onSearch(e) {
  state.page = 1;
  applyFilters();
}

function onSort(e) {
  state.page = 1;
  applyFilters();
}

function onPrice(e) {
  state.page = 1;
  const val = parseInt(e.target.value);
  if (priceValue) priceValue.textContent = `Max: ₹${val}`;
  applyFilters();
}

function onCategoryChange(e) {
  state.page = 1;
  applyFilters();
}

/* ===== Filter logic ===== */
function applyFilters() {
  const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const sortVal = sortSelect ? sortSelect.value : "default";
  const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;
  const selectedCat =
    document.querySelector('input[name="cat"]:checked')?.value || "all";

  let filtered = state.products.filter((p) => {
    const matchSearch =
      !searchTerm ||
      (p.name && p.name.toLowerCase().includes(searchTerm)) ||
      (p.description && p.description.toLowerCase().includes(searchTerm)) ||
      (p.category && p.category.toLowerCase().includes(searchTerm));
    const matchCat = selectedCat === "all" || p.category === selectedCat;
    const matchPrice = p.price <= maxPrice;
    return matchSearch && matchCat && matchPrice;
  });

  // Sort
  if (sortVal === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  state.filtered = filtered;
  renderWithPagination(state.filtered);
}

/* ===== Cart UI ===== */
function updateCartUI() {
  if (!cartCount || !cartTotal) return;

  let total = 0;
  let count = 0;

  if (state.token && state.cart.length > 0) {
    // Use backend cart data
    state.cart.forEach((item) => {
      total += (item.product?.price || 0) * item.quantity;
      count += item.quantity;
    });
  } else if (!state.token) {
    // Fallback to localStorage cart
    const localCart = JSON.parse(localStorage.getItem("cart_v1") || "[]");
    localCart.forEach((item) => {
      total += (item.price || 0) * item.quantity;
      count += item.quantity;
    });
  }

  cartCount.textContent = count;
  cartTotal.textContent = total;

  if (cartItems) {
    if (state.token && state.cart.length > 0) {
      // Render backend cart
      cartItems.innerHTML = state.cart
        .map((item) => `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.product?.name || "Unknown Product"}</div>
              <div class="cart-item-price">₹${item.product?.price || 0}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="changeQty('${item.product?._id}', -1)">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="changeQty('${item.product?._id}', 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.product?._id}')">×</button>
          </div>
        `)
        .join("");
    } else if (!state.token) {
      // Render localStorage cart
      const localCart = JSON.parse(localStorage.getItem("cart_v1") || "[]");
      if (localCart.length === 0) {
        cartItems.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
      } else {
        cartItems.innerHTML = localCart
          .map((item) => `
            <div class="cart-item">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.title || "Unknown Product"}</div>
                <div class="cart-item-price">₹${item.price || 0}</div>
              </div>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
              </div>
              <button class="remove-btn" onclick="removeFromCart('${item.id}')">×</button>
            </div>
          `)
          .join("");
      }
    } else {
      cartItems.innerHTML = `<div class="cart-empty">Your cart is empty</div>`;
    }
  }
}

/* ===== Cart operations ===== */
async function changeQty(productId, delta) {
  if (state.token) {
    // Update backend cart
    const item = state.cart.find(item => item.product._id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        await updateCartItem(productId, newQuantity);
      } else {
        await removeFromCart(productId);
      }
    }
  } else {
    // Update localStorage cart
    const localCart = JSON.parse(localStorage.getItem("cart_v1") || "[]");
    const item = localCart.find((i) => i.id === productId);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        localCart.splice(localCart.indexOf(item), 1);
      }
      localStorage.setItem("cart_v1", JSON.stringify(localCart));
      updateCartUI();
    }
  }
}

async function removeFromCart(productId) {
  if (state.token) {
    await removeFromCart(productId);
  } else {
    const localCart = JSON.parse(localStorage.getItem("cart_v1") || "[]");
    const index = localCart.findIndex((i) => i.id === productId);
    if (index > -1) {
      localCart.splice(index, 1);
      localStorage.setItem("cart_v1", JSON.stringify(localCart));
      updateCartUI();
    }
  }
}

function viewProduct(productId) {
  // This would typically navigate to a product detail page
  // For now, just show a notification
  showNotification(`Viewing product ${productId}`, 'info');
}

/* ===== Checkout ===== */
if (document.getElementById('checkoutBtn')) {
  document.getElementById('checkoutBtn').addEventListener('click', async () => {
    if (!state.token) {
      showNotification('Please login to checkout', 'warning');
      showModal('loginModal');
      return;
    }
    
    if (state.cart.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }
    
    // This would typically navigate to checkout page
    showNotification('Proceeding to checkout...', 'info');
  });
}
