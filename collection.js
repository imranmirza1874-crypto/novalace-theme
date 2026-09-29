/* ==========================================================================
   NOVALACE | Collection & Catalog Interactive Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Product Catalog Dataset
  const products = [
    {
      id: 'novalace-sphere',
      title: 'Novalace Sphère 2-in-1 Scratcher',
      category: 'scratchers',
      materials: ['oak', 'walnut', 'sisal'],
      price: 148,
      rating: 4.96,
      reviews: 348,
      badge: 'Bestseller',
      badgeClass: 'gold',
      materialsText: 'FSC Solid Oak / Smoked Walnut &bull; Handcrafted Sisal',
      image: 'assets/images/hero_oak.jpg',
      hoverImage: 'assets/images/hero_walnut.jpg',
      inStock: true,
      description: 'Architectural solid wood arch with ultra-smooth 360° rotating natural sisal sphere for kinetic play and claw conditioning.',
      swatches: ['#D5BA98', '#5A4331', '#F0E8DC'],
      link: 'index.html'
    },
    {
      id: 'novalace-cat-tree',
      title: 'Kanso Architectural Feline Tower',
      category: 'towers',
      materials: ['oak', 'boucle', 'sisal'],
      price: 320,
      rating: 4.98,
      reviews: 112,
      badge: 'Atelier Edition',
      badgeClass: 'gold',
      materialsText: 'Solid European Oak &bull; Wool Bouclé Perches',
      image: 'assets/images/hero_oak.jpg',
      hoverImage: 'assets/images/detail_craft.jpg',
      inStock: true,
      description: 'Triple-tier minimalist climbing tower featuring cantilevered perches lined with removable Italian wool bouclé cushions.',
      swatches: ['#D5BA98', '#EAE6DF'],
      link: 'index.html'
    },
    {
      id: 'novalace-fountain',
      title: 'Lotus Matte Ceramic Water Vessel',
      category: 'hydration',
      materials: ['ceramic', 'brass'],
      price: 135,
      rating: 4.92,
      reviews: 184,
      badge: 'Whisper-Quiet',
      badgeClass: '',
      materialsText: 'Matte Glazed Stoneware &bull; Brushed Champagne Brass',
      image: 'assets/images/detail_craft.jpg',
      hoverImage: 'assets/images/lifestyle_cat.jpg',
      inStock: true,
      description: 'Sculpted stoneware drinking fountain with continuous oxygenating aeration and medical-grade quadruple carbon filtration.',
      swatches: ['#F5F1EB', '#C5A059'],
      link: 'index.html'
    },
    {
      id: 'novalace-cloud-bed',
      title: 'Nuage Wool Bouclé Cloud Daybed',
      category: 'daybeds',
      materials: ['boucle', 'oak'],
      price: 110,
      rating: 4.95,
      reviews: 230,
      badge: 'Orthopedic',
      badgeClass: '',
      materialsText: 'Organic Ivory Bouclé &bull; Memory Foam Core',
      image: 'assets/images/lifestyle_cat.jpg',
      hoverImage: 'assets/images/hero_oak.jpg',
      inStock: true,
      description: 'Deep-nesting orthopedic lounger wrapped in certified organic wool bouclé with dual-density ergonomic support.',
      swatches: ['#F7F4EE', '#DCD4C7'],
      link: 'index.html'
    },
    {
      id: 'novalace-solis-perch',
      title: 'Solis Cantilevered Wall Perch',
      category: 'towers',
      materials: ['walnut', 'brass'],
      price: 88,
      rating: 4.89,
      reviews: 76,
      badge: 'Space-Saving',
      badgeClass: '',
      materialsText: 'Smoked Walnut &bull; Champagne Brass Mounting',
      image: 'assets/images/hero_walnut.jpg',
      hoverImage: 'assets/images/detail_craft.jpg',
      inStock: true,
      description: 'Floating architectural sun-perch supporting up to 18kg with hidden structural hardware and plush felt inset.',
      swatches: ['#5A4331', '#C5A059'],
      link: 'index.html'
    },
    {
      id: 'novalace-botanica-mist',
      title: 'Botanica Feline Aromatherapy Mist',
      category: 'care',
      materials: ['organic'],
      price: 24,
      rating: 4.97,
      reviews: 415,
      badge: '100% Organic',
      badgeClass: 'gold',
      materialsText: '100ml Frosted Amber Glass &bull; Steam-Distilled Catnip',
      image: 'assets/images/detail_craft.jpg',
      hoverImage: 'assets/images/hero_oak.jpg',
      inStock: true,
      description: 'Therapeutic organic catnip hydrolat for instant sisal conditioning, relaxation, and positive behavior reinforcement.',
      swatches: ['#5B422B'],
      link: 'index.html'
    }
  ];

  // Collection State
  const state = {
    selectedCategory: 'all',
    maxPrice: 400,
    selectedMaterials: [],
    inStockOnly: false,
    sortBy: 'featured',
    currency: 'USD',
    rates: {
      USD: { symbol: '$', rate: 1.0 },
      EUR: { symbol: '€', rate: 0.92 },
      GBP: { symbol: '£', rate: 0.79 },
      JPY: { symbol: '¥', rate: 155.0 }
    },
    cart: [
      {
        id: 'novalace-sphere',
        title: 'Novalace Sphère 2-in-1 Scratcher',
        finishName: 'Natural FSC Oak',
        sizeName: 'Grand Classique',
        unitPrice: 148,
        qty: 1,
        image: 'assets/images/hero_oak.jpg'
      }
    ]
  };

  // DOM References
  const productsGrid = document.getElementById('catalogProductsGrid');
  const resultsCountEl = document.getElementById('resultsCount');
  const priceSlider = document.getElementById('priceRangeSlider');
  const priceDisplayMax = document.getElementById('priceDisplayMax');
  const sortSelect = document.getElementById('sortSelect');
  const categoryFilters = document.querySelectorAll('.filter-category-input');
  const materialChips = document.querySelectorAll('.mat-swatch-chip');
  const inStockCheckbox = document.getElementById('inStockFilter');
  const btnResetFilters = document.getElementById('btnResetFilters');
  const gridViewBtns = document.querySelectorAll('.view-btn');
  const currencySelector = document.getElementById('currencySelector');
  const toastEl = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Quick View Modal References
  const quickViewModal = document.getElementById('quickViewModal');
  const btnCloseQuickView = document.getElementById('btnCloseQuickView');
  const qvImage = document.getElementById('qvImage');
  const qvTitle = document.getElementById('qvTitle');
  const qvPrice = document.getElementById('qvPrice');
  const qvRating = document.getElementById('qvRating');
  const qvDescription = document.getElementById('qvDescription');
  const qvMaterials = document.getElementById('qvMaterials');
  const btnQvAddToCart = document.getElementById('btnQvAddToCart');
  let currentQvProduct = null;

  // Format Money helper
  function formatMoney(amountUSD) {
    const cur = state.currency;
    const info = state.rates[cur] || state.rates.USD;
    const converted = amountUSD * info.rate;
    if (cur === 'JPY') {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toFixed(2)}`;
  }

  // Toast Helper
  function showToast(msg) {
    if (!toastEl) return;
    toastMessage.textContent = msg;
    toastEl.classList.add('active');
    setTimeout(() => {
      toastEl.classList.remove('active');
    }, 2800);
  }

  // Filter & Sort Logic
  function getFilteredProducts() {
    return products.filter(p => {
      // Category
      if (state.selectedCategory !== 'all' && p.category !== state.selectedCategory) {
        return false;
      }
      // Price
      if (p.price > state.maxPrice) {
        return false;
      }
      // Materials
      if (state.selectedMaterials.length > 0) {
        const hasMaterial = state.selectedMaterials.some(m => p.materials.includes(m));
        if (!hasMaterial) return false;
      }
      // In Stock
      if (state.inStockOnly && !p.inStock) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (state.sortBy === 'price-low') return a.price - b.price;
      if (state.sortBy === 'price-high') return b.price - a.price;
      if (state.sortBy === 'rating') return b.rating - a.rating;
      if (state.sortBy === 'reviews') return b.reviews - a.reviews;
      return 0; // featured default
    });
  }

  // Render Product Cards
  function renderProducts() {
    const list = getFilteredProducts();
    resultsCountEl.textContent = `Showing ${list.length} of ${products.length} Sanctuary Objects`;
    productsGrid.innerHTML = '';

    if (list.length === 0) {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--surface-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-medium);">
          <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: var(--text-primary); margin-bottom: 0.5rem;">No Matching Objects Found</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem;">Try adjusting your price range or clearing active material filters.</p>
          <button class="btn-primary-add" style="margin: 0 auto; display: inline-flex;" onclick="document.getElementById('btnResetFilters').click();">Reset All Filters</button>
        </div>
      `;
      return;
    }

    list.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="card-media-wrapper">
          <span class="card-badge-tag ${p.badgeClass}">${p.badge}</span>
          <img src="${p.image}" alt="${p.title}" class="card-main-img" data-hover="${p.hoverImage}">
          
          <div class="card-quick-actions">
            <button class="btn-card-quick-add" data-id="${p.id}">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              <span>+ Quick Add</span>
            </button>
            <button class="btn-card-quick-view" data-id="${p.id}" title="Quick View">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div>
            <div class="card-rating-row">
              <span class="card-stars">★★★★★</span>
              <span>${p.rating} (${p.reviews})</span>
            </div>
            <a href="${p.link}" class="card-title">${p.title}</a>
            <div class="card-materials-tag">${p.materialsText}</div>
          </div>

          <div class="card-footer-row">
            <div class="card-price">${formatMoney(p.price)}</div>
            <div class="card-swatch-dots">
              ${p.swatches.map(color => `<span class="swatch-dot" style="background: ${color};"></span>`).join('')}
            </div>
          </div>
        </div>
      `;

      // Hover Image Switcher
      const imgEl = card.querySelector('.card-main-img');
      const originalSrc = p.image;
      const hoverSrc = p.hoverImage;
      card.addEventListener('mouseenter', () => {
        imgEl.src = hoverSrc;
      });
      card.addEventListener('mouseleave', () => {
        imgEl.src = originalSrc;
      });

      // Quick Add Button Event
      card.querySelector('.btn-card-quick-add').addEventListener('click', (e) => {
        e.stopPropagation();
        handleQuickAdd(p);
      });

      // Quick View Button Event
      card.querySelector('.btn-card-quick-view').addEventListener('click', (e) => {
        e.stopPropagation();
        openQuickView(p);
      });

      productsGrid.appendChild(card);
    });
  }

  // Quick Add handler
  function handleQuickAdd(product) {
    const existing = state.cart.find(i => i.id === product.id);
    if (existing) {
      existing.qty += 1;
    } else {
      state.cart.push({
        id: product.id,
        title: product.title,
        finishName: 'Signature Finish',
        sizeName: 'Standard',
        unitPrice: product.price,
        qty: 1,
        image: product.image
      });
    }
    renderCart();
    openCart();
    showToast(`Added ${product.title} to bag!`);
  }

  // Quick View Modal
  function openQuickView(product) {
    currentQvProduct = product;
    qvImage.src = product.image;
    qvTitle.textContent = product.title;
    qvPrice.textContent = formatMoney(product.price);
    qvRating.textContent = `★★★★★ ${product.rating} (${product.reviews} Verified Reviews)`;
    qvDescription.textContent = product.description;
    qvMaterials.textContent = product.materialsText;
    
    quickViewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    quickViewModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (btnCloseQuickView) {
    btnCloseQuickView.addEventListener('click', closeQuickView);
  }
  if (btnQvAddToCart) {
    btnQvAddToCart.addEventListener('click', () => {
      if (currentQvProduct) {
        handleQuickAdd(currentQvProduct);
        closeQuickView();
      }
    });
  }

  // Cart Drawer Logic
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const freeShippingProgress = document.getElementById('freeShippingProgress');
  const freeShippingText = document.getElementById('freeShippingText');

  function openCart() {
    renderCart();
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.add('active');
      cartDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeCart() {
    if (cartOverlay && cartDrawer) {
      cartOverlay.classList.remove('active');
      cartDrawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (cartTriggerBtn) cartTriggerBtn.addEventListener('click', openCart);
  if (btnCloseCart) btnCloseCart.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;

    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 1rem; opacity: 0.5;">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
          </svg>
          <p style="font-family: var(--font-serif); font-size: 1.25rem; margin-bottom: 0.5rem; color: var(--text-primary);">Your Bag is Empty</p>
          <p style="font-size: 0.85rem;">Discover handcrafted furniture for refined felines.</p>
        </div>
      `;
    } else {
      state.cart.forEach((item, index) => {
        total += item.unitPrice * item.qty;
        count += item.qty;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="cart-item-img">
          <div class="cart-item-details">
            <div>
              <div class="cart-item-title">${item.title}</div>
              <div class="cart-item-variant">${item.finishName} &bull; ${item.sizeName}</div>
            </div>
            <div class="cart-item-footer">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 0.8rem; color: var(--text-muted);">Qty: ${item.qty}</span>
                <span class="cart-remove-link" data-index="${index}">Remove</span>
              </div>
              <div class="cart-item-price">${formatMoney(item.unitPrice * item.qty)}</div>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(row);
      });
    }

    if (cartCountBadge) cartCountBadge.textContent = count;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatMoney(total);

    const threshold = 150;
    if (freeShippingProgress && freeShippingText) {
      if (total >= threshold) {
        freeShippingProgress.style.width = '100%';
        freeShippingText.innerHTML = `✨ <strong>Unlocked:</strong> Complimentary VIP Carbon-Neutral Delivery!`;
      } else {
        const diff = threshold - total;
        const pct = Math.min(100, Math.round((total / threshold) * 100));
        freeShippingProgress.style.width = `${pct}%`;
        freeShippingText.innerHTML = `Add <strong>${formatMoney(diff)}</strong> more to unlock Free VIP Delivery`;
      }
    }

    document.querySelectorAll('.cart-remove-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        state.cart.splice(idx, 1);
        renderCart();
      });
    });
  }

  // Filter Listeners
  categoryFilters.forEach(radio => {
    radio.addEventListener('change', (e) => {
      state.selectedCategory = e.target.value;
      renderProducts();
    });
  });

  if (priceSlider) {
    priceSlider.addEventListener('input', (e) => {
      state.maxPrice = parseInt(e.target.value, 10);
      priceDisplayMax.textContent = formatMoney(state.maxPrice);
      renderProducts();
    });
  }

  materialChips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      const mat = chip.dataset.material;
      if (chip.classList.contains('active')) {
        state.selectedMaterials.push(mat);
      } else {
        state.selectedMaterials = state.selectedMaterials.filter(m => m !== mat);
      }
      renderProducts();
    });
  });

  if (inStockCheckbox) {
    inStockCheckbox.addEventListener('change', (e) => {
      state.inStockOnly = e.target.checked;
      renderProducts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderProducts();
    });
  }

  if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
      state.selectedCategory = 'all';
      state.maxPrice = 400;
      state.selectedMaterials = [];
      state.inStockOnly = false;
      state.sortBy = 'featured';

      document.querySelector('.filter-category-input[value="all"]').checked = true;
      if (priceSlider) priceSlider.value = 400;
      if (priceDisplayMax) priceDisplayMax.textContent = formatMoney(400);
      materialChips.forEach(c => c.classList.remove('active'));
      if (inStockCheckbox) inStockCheckbox.checked = false;
      if (sortSelect) sortSelect.value = 'featured';

      renderProducts();
      showToast('Filters reset to default view.');
    });
  }

  // Grid column switches
  gridViewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gridViewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cols = btn.dataset.cols;
      if (cols === '2') {
        productsGrid.classList.add('grid-2col');
      } else {
        productsGrid.classList.remove('grid-2col');
      }
    });
  });

  // Currency Selector
  if (currencySelector) {
    currencySelector.addEventListener('change', (e) => {
      state.currency = e.target.value;
      priceDisplayMax.textContent = formatMoney(state.maxPrice);
      renderProducts();
      renderCart();
      showToast(`Currency converted to ${state.currency}`);
    });
  }

  // FAQ Items Handler
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });

  // Presentation 9:16 Mode Toggle
  const btnToggleFigma916 = document.getElementById('btnToggleFigma916');
  if (btnToggleFigma916) {
    btnToggleFigma916.addEventListener('click', () => {
      document.body.classList.toggle('mode-mockup-916');
      btnToggleFigma916.classList.toggle('active');
      const is916 = document.body.classList.contains('mode-mockup-916');
      showToast(is916 ? 'Switched to Figma 9:16 Mockup Frame View' : 'Returned to Full Viewport Mode');
    });
  }

  // Initial render
  renderProducts();
  renderCart();
});
