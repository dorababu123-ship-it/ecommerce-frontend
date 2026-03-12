/* ===== SWE 1.5 FAST VERSION - OPTIMIZED E-COMMERCE ===== */

// Configuration
const API_BASE = 'http://localhost:5000/api';
const CACHE_KEY = 'shopmate_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fast state management
const state = new Proxy({
  products: [],
  filtered: [],
  categories: [],
  cart: [],
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  cache: {}
}, {
  set(target, prop, value) {
    target[prop] = value;
    if (prop === 'products' || prop === 'filtered') {
      renderProducts();
    }
    return true;
  }
});

// Fast cache system
const cache = {
  get(key) {
    const item = state.cache[key];
    if (item && Date.now() - item.timestamp < CACHE_DURATION) {
      return item.data;
    }
    return null;
  },
  set(key, data) {
    state.cache[key] = { data, timestamp: Date.now() };
  }
};

// Optimized API calls with caching
async function fastFetch(endpoint, options = {}) {
  const cacheKey = `${endpoint}_${JSON.stringify(options)}`;
  const cached = cache.get(cacheKey);
  if (cached && !options.method) return cached;

  try {
    state.loading = true;
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(state.token && { Authorization: `Bearer ${state.token}` }),
        ...options.headers
      },
      ...options
    });

    if (!response.ok) throw new Error('API Error');
    const data = await response.json();
    
    if (!options.method) cache.set(cacheKey, data);
    return data;
  } catch (error) {
    showNotification(error.message, 'error');
    throw error;
  } finally {
    state.loading = false;
  }
}

// Fast product loading with caching
async function loadProducts(params = {}) {
  const cached = cache.get('products');
  if (cached && Object.keys(params).length === 0) {
    state.products = cached.products || [];
    state.categories = cached.categories || [];
    return;
  }

  const data = await fastFetch(`/products?${new URLSearchParams(params)}`);
  state.products = data.products || [];
  state.categories = data.categories || [];
  
  if (Object.keys(params).length === 0) {
    cache.set('products', data);
  }
}

// Fast cart operations
const cartOps = {
  async get() {
    if (!state.token) return;
    const data = await fastFetch('/cart');
    state.cart = data.items || [];
  },
  
  async add(productId, qty = 1) {
    if (!state.token) {
      showNotification('Login required', 'warning');
      return;
    }
    const data = await fastFetch('/cart', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity: qty })
    });
    state.cart = data.items || [];
    showNotification('Added to cart', 'success');
  },
  
  async update(productId, qty) {
    if (!state.token) return;
    const data = await fastFetch(`/cart/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity: qty })
    });
    state.cart = data.items || [];
  },
  
  async remove(productId) {
    if (!state.token) return;
    await fastFetch(`/cart/${productId}`, { method: 'DELETE' });
    state.cart = state.cart.filter(item => item.product._id !== productId);
    showNotification('Removed from cart', 'success');
  }
};

// Fast auth operations
const auth = {
  async login(email, password) {
    const data = await fastFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    state.token = data.token;
    state.user = data;
    localStorage.setItem('token', data.token);
    
    updateUI();
    await cartOps.get();
    showNotification('Login success', 'success');
    closeModal('loginModal');
  },
  
  async register(name, email, password) {
    const data = await fastFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    state.token = data.token;
    state.user = data;
    localStorage.setItem('token', data.token);
    
    updateUI();
    showNotification('Registration success', 'success');
    closeModal('registerModal');
  },
  
  logout() {
    state.token = null;
    state.user = null;
    state.cart = [];
    localStorage.removeItem('token');
    updateUI();
    showNotification('Logged out', 'success');
  }
};

// Fast DOM operations
const dom = {
  get: (id) => document.getElementById(id),
  create: (tag) => document.createElement(tag),
  template: (id) => document.getElementById(id).content,
  
  render: {
    products() {
      const grid = dom.get('productsGrid');
      if (!grid) return;
      
      if (state.loading) {
        grid.innerHTML = '<div class="loading">Loading...</div>';
        return;
      }
      
      if (state.filtered.length === 0) {
        grid.innerHTML = '<div class="empty">No products found</div>';
        return;
      }
      
      grid.innerHTML = state.filtered.map(product => `
        <article class="product-card">
          <div class="thumb-wrap">
            <img src="${product.image || 'https://via.placeholder.com/300x200'}" alt="${product.name}" loading="lazy">
          </div>
          <div class="product-body">
            <h4 class="product-title">${product.name}</h4>
            <div class="meta">
              <span class="product-category">${product.category}</span>
              <span class="product-price">₹${product.price}</span>
            </div>
            <p class="product-desc">${product.description || ''}</p>
            <div class="product-actions">
              <button class="btn add-to-cart" onclick="cartOps.add('${product._id}')">Add to cart</button>
              <button class="btn secondary view-detail" onclick="viewProduct('${product._id}')">View</button>
            </div>
          </div>
        </article>
      `).join('');
      
      dom.get('resultsCount').textContent = `${state.filtered.length} results`;
    },
    
    categories() {
      const list = dom.get('categoryList');
      if (!list) return;
      
      list.innerHTML = `
        <li><label><input type="radio" name="cat" value="all" checked> All</label></li>
        ${state.categories.map(cat => 
          `<li><label><input type="radio" name="cat" value="${cat}"> ${cat}</label></li>`
        ).join('')}
      `;
    },
    
    cart() {
      const items = dom.get('cartItems');
      const count = dom.get('cartCount');
      const total = dom.get('cartTotal');
      
      if (!items || !count || !total) return;
      
      const cartTotal = state.cart.reduce((sum, item) => 
        sum + (item.product?.price || 0) * item.quantity, 0
      );
      const cartCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      
      count.textContent = cartCount;
      total.textContent = cartTotal;
      
      if (state.cart.length === 0) {
        items.innerHTML = '<div class="cart-empty">Cart is empty</div>';
      } else {
        items.innerHTML = state.cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.product?.name}</div>
              <div class="cart-item-price">₹${item.product?.price}</div>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="cartOps.update('${item.product._id}', ${item.quantity - 1})">−</button>
              <span>${item.quantity}</span>
              <button class="qty-btn" onclick="cartOps.update('${item.product._id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="remove-btn" onclick="cartOps.remove('${item.product._id}')">×</button>
          </div>
        `).join('');
      }
    },
    
    auth() {
      const authSection = dom.get('authSection');
      const userSection = dom.get('userSection');
      const userName = dom.get('userName');
      
      if (state.user) {
        authSection?.classList.add('hidden');
        userSection?.classList.remove('hidden');
        if (userName) userName.textContent = state.user.name;
      } else {
        authSection?.classList.remove('hidden');
        userSection?.classList.add('hidden');
      }
    }
  }
};

// Fast filtering with debouncing
const filter = debounce(() => {
  const search = dom.get('searchInput')?.value.toLowerCase() || '';
  const category = document.querySelector('input[name="cat"]:checked')?.value || 'all';
  const maxPrice = parseInt(dom.get('priceRange')?.value || 999999);
  const sort = dom.get('sortSelect')?.value || 'default';
  
  state.filtered = state.products.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search) || 
      p.category.toLowerCase().includes(search);
    const matchCategory = category === 'all' || p.category === category;
    const matchPrice = p.price <= maxPrice;
    return matchSearch && matchCategory && matchPrice;
  });
  
  if (sort === 'price-asc') state.filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') state.filtered.sort((a, b) => b.price - a.price);
}, 300);

// Fast UI updates
function updateUI() {
  dom.render.auth();
  dom.render.cart();
}

// Fast notifications
function showNotification(message, type = 'info') {
  const notification = dom.create('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; z-index: 10000;
    padding: 12px 20px; border-radius: 6px; color: white;
    background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
    transform: translateX(100%); transition: transform 0.3s;
  `;
  
  document.body.appendChild(notification);
  setTimeout(() => notification.style.transform = 'translateX(0)', 10);
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Modal management
function showModal(id) {
  dom.get(id)?.classList.remove('hidden');
}

function closeModal(id) {
  dom.get(id)?.classList.add('hidden');
}

// Fast initialization
async function init() {
  try {
    // Load products
    await loadProducts();
    
    // Setup event listeners
    dom.get('searchInput')?.addEventListener('input', filter);
    dom.get('sortSelect')?.addEventListener('change', filter);
    dom.get('priceRange')?.addEventListener('input', () => {
      dom.get('priceValue').textContent = `Max: ₹${dom.get('priceRange').value}`;
      filter();
    });
    
    // Auth events
    dom.get('loginBtn')?.addEventListener('click', () => showModal('loginModal'));
    dom.get('registerBtn')?.addEventListener('click', () => showModal('registerModal'));
    dom.get('logoutBtn')?.addEventListener('click', auth.logout);
    
    dom.get('loginForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = dom.get('loginEmail').value;
      const password = dom.get('loginPassword').value;
      await auth.login(email, password);
    });
    
    dom.get('registerForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = dom.get('registerName').value;
      const email = dom.get('registerEmail').value;
      const password = dom.get('registerPassword').value;
      await auth.register(name, email, password);
    });
    
    // Cart events
    dom.get('cartBtn')?.addEventListener('click', () => showModal('cartModal'));
    dom.get('closeCart')?.addEventListener('click', () => closeModal('cartModal'));
    
    // Initial render
    dom.render.categories();
    dom.render.products();
    updateUI();
    
    // Load cart if logged in
    if (state.token) {
      await cartOps.get();
    }
    
    // Expose globals
    window.cartOps = cartOps;
    window.auth = auth;
    window.showModal = showModal;
    window.closeModal = closeModal;
    window.viewProduct = (id) => showNotification(`View product ${id}`, 'info');
    
  } catch (error) {
    showNotification('Initialization failed', 'error');
  }
}

// Fast render products function
function renderProducts() {
  dom.render.products();
}

// Utility functions
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
