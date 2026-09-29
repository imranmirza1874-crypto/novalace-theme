/* ==========================================================================
   NOVALACE | Warm Luxury Interactive E-Commerce Architecture
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    finish: 'oak', // 'oak' | 'walnut' | 'ash'
    size: 'grand', // 'petite' | 'grand'
    quantity: 1,
    addOnCatnip: false,
    addOnCore: false,
    currency: 'USD',
    rates: {
      USD: { symbol: '$', rate: 1.0 },
      EUR: { symbol: '€', rate: 0.92 },
      GBP: { symbol: '£', rate: 0.79 },
      JPY: { symbol: '¥', rate: 155.0 }
    },
    basePrices: {
      petite: 128,
      grand: 148,
      catnip: 18,
      core: 34
    },
    compareMultiplier: 1.18,
    cart: [
      {
        id: 'novalace-grand-oak',
        title: 'Novalace Sphère 2-in-1 Sisal Scratcher',
        finishName: 'Natural FSC Oak',
        sizeName: 'Grand Classique (Ø 24cm)',
        unitPrice: 148,
        qty: 1,
        image: 'assets/images/hero_oak.jpg'
      }
    ],
    galleryImages: {
      oak: [
        { src: 'assets/images/hero_oak.jpg', label: 'Studio Front' },
        { src: 'assets/images/lifestyle_cat.jpg', label: 'Sanctuary Lifestyle' },
        { src: 'assets/images/detail_craft.jpg', label: 'Artisan Joint' },
        { src: 'assets/images/hero_walnut.jpg', label: 'Walnut Finish' }
      ],
      walnut: [
        { src: 'assets/images/hero_walnut.jpg', label: 'Smoked Walnut Front' },
        { src: 'assets/images/detail_craft.jpg', label: 'Precision Brass Joinery' },
        { src: 'assets/images/lifestyle_cat.jpg', label: 'Living Room Aesthetic' },
        { src: 'assets/images/hero_oak.jpg', label: 'Natural Oak Comparison' }
      ],
      ash: [
        { src: 'assets/images/hero_oak.jpg', label: 'Nordic White Ash Tone' },
        { src: 'assets/images/lifestyle_cat.jpg', label: 'Pet Sanctuary' },
        { src: 'assets/images/detail_craft.jpg', label: 'Handcrafted Sisal' },
        { src: 'assets/images/hero_walnut.jpg', label: 'Side Profile' }
      ]
    }
  };

  // DOM Element References
  const mainImageEl = document.getElementById('mainProductImage');
  const thumbsContainer = document.getElementById('galleryThumbsContainer');
  const currentPriceEl = document.getElementById('productPriceDisplay');
  const comparePriceEl = document.getElementById('productCompareDisplay');
  const selectedFinishLabel = document.getElementById('selectedFinishLabel');
  const woodSwatches = document.querySelectorAll('.wood-swatch-card');
  const sizeOptions = document.querySelectorAll('.size-option-card');
  const qtyInput = document.getElementById('qtyInput');
  const qtyDecBtn = document.getElementById('qtyDec');
  const qtyIncBtn = document.getElementById('qtyInc');
  const addAddonCatnip = document.getElementById('addonCatnip');
  const btnAddToCart = document.getElementById('btnAddToCart');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const btnCloseCart = document.getElementById('btnCloseCart');
  const cartTriggerBtn = document.getElementById('cartTriggerBtn');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const freeShippingProgress = document.getElementById('freeShippingProgress');
  const freeShippingText = document.getElementById('freeShippingText');
  const currencySelector = document.getElementById('currencySelector');
  const stickyAtcBar = document.getElementById('stickyAtcBar');
  const stickyAddBtn = document.getElementById('stickyAddBtn');
  const stickyPriceDisplay = document.getElementById('stickyPriceDisplay');
  const toastEl = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Modal References
  const modalSpin = document.getElementById('modalSpin');
  const btnOpenSpin = document.getElementById('btnOpenSpin');
  const btnCloseSpin = document.getElementById('btnCloseSpin');
  const spinCanvasImage = document.getElementById('spinCanvasImage');
  const spinVisualFrame = document.getElementById('spinVisualFrame');
  const modalSizeGuide = document.getElementById('modalSizeGuide');
  const btnOpenSizeGuide = document.getElementById('btnOpenSizeGuide');
  const btnCloseSizeGuide = document.getElementById('btnCloseSizeGuide');

  // Helper: Format Currency
  function formatMoney(amountUSD) {
    const cur = state.currency;
    const info = state.rates[cur] || state.rates.USD;
    const converted = amountUSD * info.rate;
    if (cur === 'JPY') {
      return `${info.symbol}${Math.round(converted).toLocaleString()}`;
    }
    return `${info.symbol}${converted.toFixed(2)}`;
  }

  // Calculate Unit Base Price
  function calculateCurrentUnitTotal() {
    let price = state.size === 'petite' ? state.basePrices.petite : state.basePrices.grand;
    if (state.addOnCatnip) {
      price += state.basePrices.catnip;
    }
    return price;
  }

  // Update UI Pricing
  function updatePricingUI() {
    const unitPrice = calculateCurrentUnitTotal();
    const comparePrice = unitPrice * state.compareMultiplier;
    
    currentPriceEl.textContent = formatMoney(unitPrice);
    comparePriceEl.textContent = formatMoney(comparePrice);
    stickyPriceDisplay.textContent = formatMoney(unitPrice);
    
    // Update Add to Cart Button Text
    btnAddToCart.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span>Add to Bag — ${formatMoney(unitPrice * state.quantity)}</span>
    `;

    // Update Sticky Bar Text
    const finishNames = {
      oak: 'Natural FSC Oak',
      walnut: 'Smoked Walnut',
      ash: 'Nordic White Ash'
    };
    const sizeNames = {
      petite: 'Petite (Ø 18cm)',
      grand: 'Grand Classique (Ø 24cm)'
    };
    document.getElementById('stickyVariantLabel').textContent = `${finishNames[state.finish]} / ${sizeNames[state.size]}`;
  }

  // Render Thumbnails based on Finish
  function renderGallery(finishKey) {
    const images = state.galleryImages[finishKey] || state.galleryImages.oak;
    thumbsContainer.innerHTML = '';
    
    images.forEach((imgObj, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `thumb-item ${idx === 0 ? 'active' : ''}`;
      thumb.innerHTML = `
        <img src="${imgObj.src}" alt="${imgObj.label}">
        <span class="thumb-label">${imgObj.label}</span>
      `;
      thumb.addEventListener('click', () => {
        document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        mainImageEl.style.opacity = '0.3';
        setTimeout(() => {
          mainImageEl.src = imgObj.src;
          mainImageEl.style.opacity = '1';
        }, 150);
      });
      thumbsContainer.appendChild(thumb);
    });

    // Set main image to first image
    mainImageEl.src = images[0].src;
  }

  // Finish Swatch Clicks
  woodSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      woodSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const val = swatch.dataset.finish;
      const name = swatch.dataset.name;
      state.finish = val;
      selectedFinishLabel.textContent = name;
      renderGallery(val);
      updatePricingUI();
      showToast(`Selected Finish: ${name}`);
    });
  });

  // Size Options Clicks
  sizeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      sizeOptions.forEach(s => s.classList.remove('active'));
      opt.classList.add('active');
      state.size = opt.dataset.size;
      updatePricingUI();
      showToast(`Selected Size: ${opt.querySelector('.size-option-name').textContent}`);
    });
  });

  // Add-on Checkbox
  if (addAddonCatnip) {
    addAddonCatnip.addEventListener('change', (e) => {
      state.addOnCatnip = e.target.checked;
      updatePricingUI();
    });
  }

  // Quantity Stepper
  qtyDecBtn.addEventListener('click', () => {
    if (state.quantity > 1) {
      state.quantity -= 1;
      qtyInput.value = state.quantity;
      updatePricingUI();
    }
  });

  qtyIncBtn.addEventListener('click', () => {
    if (state.quantity < 10) {
      state.quantity += 1;
      qtyInput.value = state.quantity;
      updatePricingUI();
    }
  });

  // Currency Switcher
  currencySelector.addEventListener('change', (e) => {
    state.currency = e.target.value;
    updatePricingUI();
    renderCart();
    showToast(`Currency converted to ${state.currency}`);
  });

  // Toast Notification Trigger
  function showToast(msg) {
    toastMessage.textContent = msg;
    toastEl.classList.add('active');
    setTimeout(() => {
      toastEl.classList.remove('active');
    }, 2800);
  }

  // Cart Drawer Logic
  function openCart() {
    renderCart();
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartTriggerBtn.addEventListener('click', openCart);
  btnCloseCart.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  // Add To Cart Action
  function handleAddToCart() {
    const finishNames = {
      oak: 'Natural FSC Oak',
      walnut: 'Smoked Walnut',
      ash: 'Nordic White Ash'
    };
    const sizeNames = {
      petite: 'Petite (Ø 18cm)',
      grand: 'Grand Classique (Ø 24cm)'
    };
    const images = {
      oak: 'assets/images/hero_oak.jpg',
      walnut: 'assets/images/hero_walnut.jpg',
      ash: 'assets/images/hero_oak.jpg'
    };

    const unitPrice = state.size === 'petite' ? state.basePrices.petite : state.basePrices.grand;
    const itemId = `novalace-${state.finish}-${state.size}`;

    const existing = state.cart.find(i => i.id === itemId);
    if (existing) {
      existing.qty += state.quantity;
    } else {
      state.cart.push({
        id: itemId,
        title: 'Novalace Sphère 2-in-1 Sisal Scratcher',
        finishName: finishNames[state.finish],
        sizeName: sizeNames[state.size],
        unitPrice: unitPrice,
        qty: state.quantity,
        image: images[state.finish]
      });
    }

    // If add-on catnip selected
    if (state.addOnCatnip) {
      const addonId = 'novalace-catnip-mist';
      const existingAddon = state.cart.find(i => i.id === addonId);
      if (existingAddon) {
        existingAddon.qty += 1;
      } else {
        state.cart.push({
          id: addonId,
          title: 'Organic Feline Catnip Infusion Mist',
          finishName: '100ml Frosted Amber Glass',
          sizeName: 'Aromatherapy Grade',
          unitPrice: 18,
          qty: 1,
          image: 'assets/images/detail_craft.jpg'
        });
      }
    }

    // Button animation feedback
    btnAddToCart.style.transform = 'scale(0.96)';
    setTimeout(() => {
      btnAddToCart.style.transform = '';
      openCart();
      showToast('Added to your Novalace bag!');
    }, 200);
  }

  btnAddToCart.addEventListener('click', handleAddToCart);
  stickyAddBtn.addEventListener('click', handleAddToCart);

  // Render Cart Items
  function renderCart() {
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

    cartCountBadge.textContent = count;
    cartSubtotalEl.textContent = formatMoney(total);

    // Free shipping calculation (threshold $150)
    const threshold = 150;
    if (total >= threshold) {
      freeShippingProgress.style.width = '100%';
      freeShippingText.innerHTML = `✨ <strong>Unlocked:</strong> Complimentary VIP Carbon-Neutral Delivery & Care Oil!`;
    } else {
      const diff = threshold - total;
      const pct = Math.min(100, Math.round((total / threshold) * 100));
      freeShippingProgress.style.width = `${pct}%`;
      freeShippingText.innerHTML = `Add <strong>${formatMoney(diff)}</strong> more to unlock Free VIP White-Glove Delivery`;
    }

    // Attach Remove Listeners
    document.querySelectorAll('.cart-remove-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        state.cart.splice(idx, 1);
        renderCart();
      });
    });
  }

  // Sticky Bar Scroll Trigger
  window.addEventListener('scroll', () => {
    const heroBtnRect = btnAddToCart.getBoundingClientRect();
    if (heroBtnRect.bottom < 0) {
      stickyAtcBar.classList.add('visible');
    } else {
      stickyAtcBar.classList.remove('visible');
    }
  });

  // Accordions Handler
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('open');
    });
  });

  // FAQ Items Handler
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      item.classList.toggle('open');
    });
  });

  // Hotspots Interactive Highlight
  const hotspotPins = document.querySelectorAll('.hotspot-pin');
  const featureCards = document.querySelectorAll('.feature-point-card');

  hotspotPins.forEach(pin => {
    pin.addEventListener('click', () => {
      const target = pin.dataset.target;
      hotspotPins.forEach(p => p.classList.remove('active'));
      featureCards.forEach(c => c.classList.remove('active'));
      pin.classList.add('active');
      const matched = document.getElementById(target);
      if (matched) {
        matched.classList.add('active');
        matched.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const id = card.id;
      featureCards.forEach(c => c.classList.remove('active'));
      hotspotPins.forEach(p => p.classList.remove('active'));
      card.classList.add('active');
      const pin = document.querySelector(`.hotspot-pin[data-target="${id}"]`);
      if (pin) pin.classList.add('active');
    });
  });

  // Reviews Filter Pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      showToast(`Showing reviews filtered by: ${pill.textContent.trim()}`);
    });
  });

  // Modal 360 Spin Simulation
  if (btnOpenSpin) {
    btnOpenSpin.addEventListener('click', () => {
      modalSpin.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (btnCloseSpin) {
    btnCloseSpin.addEventListener('click', () => {
      modalSpin.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // 360 Spin Drag Interaction
  let isDragging = false;
  let startX = 0;
  let currentRotation = 0;

  if (spinVisualFrame) {
    spinVisualFrame.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startX;
      currentRotation += deltaX * 0.8;
      spinCanvasImage.style.transform = `rotate(${currentRotation}deg)`;
      startX = e.clientX;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch support
    spinVisualFrame.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
    });
    window.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - startX;
      currentRotation += deltaX * 0.8;
      spinCanvasImage.style.transform = `rotate(${currentRotation}deg)`;
      startX = e.touches[0].clientX;
    });
    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Size Guide Modal
  if (btnOpenSizeGuide) {
    btnOpenSizeGuide.addEventListener('click', () => {
      modalSizeGuide.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (btnCloseSizeGuide) {
    btnCloseSizeGuide.addEventListener('click', () => {
      modalSizeGuide.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close modals on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Showcase Mode Toggle (Figma / Dribbble Mode)
  const btnToggleGrid = document.getElementById('btnToggleGrid');
  const btnToggleInspector = document.getElementById('btnToggleInspector');
  const inspectorModal = document.getElementById('inspectorModal');
  const btnCloseInspector = document.getElementById('btnCloseInspector');

  if (btnToggleInspector && inspectorModal) {
    btnToggleInspector.addEventListener('click', () => {
      inspectorModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }
  if (btnCloseInspector && inspectorModal) {
    btnCloseInspector.addEventListener('click', () => {
      inspectorModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Initialize Gallery & Pricing
  renderGallery('oak');
  updatePricingUI();
  renderCart();
});
