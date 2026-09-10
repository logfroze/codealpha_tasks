/**
 * CodeAlpha Frontend Development Internship — Task 01: Image Gallery
 * Pure Vanilla JavaScript Implementation
 * 
 * Features:
 * - Responsive Grid Gallery with curated editorial photography
 * - Dynamic Category Filtering with live item counters
 * - Filter-aware Lightbox Modal (navigates strictly through active category items)
 * - Keyboard navigation (ArrowRight, ArrowLeft, Escape)
 * - Looping navigation (First <-> Last)
 * - Mobile Touch Swipe support
 * - Accessible focus management & ARIA states
 */

// --- Curated Image Dataset ---
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Morning Mist on Lake Braies",
    category: "nature",
    categoryLabel: "Nature",
    location: "South Tyrol, Italy",
    photographer: "Luca Bravo",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80",
    alt: "Serene alpine emerald lake surrounded by dramatic Dolomite mountain peaks under soft morning mist"
  },
  {
    id: 2,
    title: "Symphony in Concrete",
    category: "architecture",
    categoryLabel: "Architecture",
    location: "Valencia, Spain",
    photographer: "Joel Filipe",
    aspect: "tall",
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
    alt: "Modern white curved architectural structure rising toward clear blue Mediterranean sky"
  },
  {
    id: 3,
    title: "The Artisan Potter",
    category: "people",
    categoryLabel: "People",
    location: "Kyoto, Japan",
    photographer: "Clay Banks",
    aspect: "square",
    src: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80",
    alt: "Experienced artisan hands shaping raw stoneware clay on an authentic Japanese potter's wheel"
  },
  {
    id: 4,
    title: "Amalfi Cliffside Perch",
    category: "travel",
    categoryLabel: "Travel",
    location: "Positano, Italy",
    photographer: "Sean Oulashin",
    aspect: "tall",
    src: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    alt: "Pastel Mediterranean cliffside villas overlooking turquoise waters of the Amalfi Coast"
  },
  {
    id: 5,
    title: "Morning Espresso Ritual",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    location: "Milan, Italy",
    photographer: "Nathan Dumlao",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
    alt: "Artisan poured latte in ceramic cup on rustic timber cafe tabletop with scattered beans"
  },
  {
    id: 6,
    title: "Sahara Ridge Lines",
    category: "nature",
    categoryLabel: "Nature",
    location: "Erg Chebbi, Morocco",
    photographer: "Jeremy Bishop",
    aspect: "square",
    src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
    alt: "Golden hour sunlight casting sharp shadows across rolling desert sand dune ridges"
  },
  {
    id: 7,
    title: "The Spiral Ascendant",
    category: "architecture",
    categoryLabel: "Architecture",
    location: "Munich, Germany",
    photographer: "Christian Perner",
    aspect: "tall",
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    alt: "Geometric perspective looking directly down a white architectural spiral staircase"
  },
  {
    id: 8,
    title: "Nordic Solitude",
    category: "travel",
    categoryLabel: "Travel",
    location: "Reine, Lofoten Islands",
    photographer: "Roberto Nickson",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    alt: "Red wooden rorbu fisherman cabins reflected in the still fjord below snow-capped peaks"
  },
  {
    id: 9,
    title: "The Portrait in Shadow",
    category: "people",
    categoryLabel: "People",
    location: "Paris, France",
    photographer: "Valerie Elash",
    aspect: "tall",
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    alt: "Natural light portrait of a contemplative young woman with soft shadow play"
  },
  {
    id: 10,
    title: "The Quiet Cascade",
    category: "nature",
    categoryLabel: "Nature",
    location: "Oregon, USA",
    photographer: "Thomas Tucker",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80",
    alt: "Long exposure waterfall tumbling through lush temperate rainforest and mossy rocks"
  },
  {
    id: 11,
    title: "The Architect's Workspace",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    location: "Copenhagen, Denmark",
    photographer: "Bench Accounting",
    aspect: "square",
    src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
    alt: "Minimalist Scandinavian design workspace bathed in warm morning window light"
  },
  {
    id: 12,
    title: "Tokyo Midnight Facade",
    category: "architecture",
    categoryLabel: "Architecture",
    location: "Ginza, Tokyo",
    photographer: "Liam Wong",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    alt: "Geometric exterior glass panels of a contemporary Tokyo commercial tower at twilight"
  },
  {
    id: 13,
    title: "Dusk over Kyoto Alleyways",
    category: "travel",
    categoryLabel: "Travel",
    location: "Gion, Kyoto",
    photographer: "Clay Banks",
    aspect: "tall",
    src: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=800&q=80",
    alt: "Atmospheric stone-paved Kyoto street with warm paper lantern glow at twilight"
  },
  {
    id: 14,
    title: "The Old Watchmaker",
    category: "people",
    categoryLabel: "People",
    location: "Prague, Czech Republic",
    photographer: "Ales Krivec",
    aspect: "square",
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    alt: "Focused horologist delicately assembling antique mechanical watch escapement"
  },
  {
    id: 15,
    title: "Sunday Vinyl Session",
    category: "lifestyle",
    categoryLabel: "Lifestyle",
    location: "London, UK",
    photographer: "Austin Neill",
    aspect: "wide",
    src: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1600&q=85",
    thumb: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
    alt: "Analog vinyl player spinning record beside stacked art books in a warm study"
  }
];

// --- Application State ---
const LOCAL_STORAGE_KEY = "codealpha_custom_gallery_items_v1";

function loadStoredItems() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to parse custom gallery items from storage", e);
  }
  return [];
}

function saveStoredItems(items) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save gallery items to storage", e);
  }
}

// Master list combines custom uploaded photos with curated collection
let allGalleryItems = [...loadStoredItems(), ...GALLERY_ITEMS];

const state = {
  activeCategory: "all",
  filteredItems: [...allGalleryItems],
  activeLightboxIndex: 0,
  isLightboxOpen: false,
  lastFocusedElement: null,

  // Add Image Modal state
  isUploadModalOpen: false,
  uploadedImageDataUrl: "",
  activeSourceTab: "upload", // "upload" | "camera"
  cameraStream: null,
  selectedAspect: "standard" // "standard" (4:3) | "tall" (3:4) | "wide" (16:10) | "square" (1:1)
};

// --- DOM Element References ---
let DOM = {};

/**
 * Initialize Application on DOM Ready
 */
document.addEventListener("DOMContentLoaded", () => {
  cacheDOM();
  renderCategoryButtons();
  renderGallery(state.filteredItems);
  bindEvents();
});

/**
 * Cache frequently accessed DOM nodes
 */
function cacheDOM() {
  DOM = {
    filterTabsWrapper: document.getElementById("filterTabsWrapper"),
    filterSummaryText: document.getElementById("filterSummaryText"),
    galleryGrid: document.getElementById("galleryGrid"),
    galleryCountBadge: document.getElementById("galleryCountBadge"),
    openAddImageBtn: document.getElementById("openAddImageBtn"),
    
    // Lightbox elements
    lightboxModal: document.getElementById("lightboxModal"),
    lightboxImage: document.getElementById("lightboxImage"),
    lightboxCounter: document.getElementById("lightboxCounter"),
    lightboxFilterBadge: document.getElementById("lightboxFilterBadge"),
    lightboxTitle: document.getElementById("lightboxTitle"),
    lightboxSubtext: document.getElementById("lightboxSubtext"),
    lightboxCloseBtn: document.getElementById("lightboxCloseBtn"),
    lightboxPrevBtn: document.getElementById("lightboxPrevBtn"),
    lightboxNextBtn: document.getElementById("lightboxNextBtn"),
    
    // Upload Modal elements
    addImageModal: document.getElementById("addImageModal"),
    uploadFormScrollable: document.getElementById("uploadFormScrollable"),
    addImageForm: document.getElementById("addImageForm"),
    closeAddImageModalBtn: document.getElementById("closeAddImageModalBtn"),
    cancelAddImageBtn: document.getElementById("cancelAddImageBtn"),
    submitAddImageBtn: document.getElementById("submitAddImageBtn"),
    tabUploadDevice: document.getElementById("tabUploadDevice"),
    tabLiveCamera: document.getElementById("tabLiveCamera"),
    uploadFileArea: document.getElementById("uploadFileArea"),
    liveCameraArea: document.getElementById("liveCameraArea"),
    uploadDropzone: document.getElementById("uploadDropzone"),
    fileInputElement: document.getElementById("fileInputElement"),
    dropzoneEmpty: document.getElementById("dropzoneEmpty"),
    dropzonePreview: document.getElementById("dropzonePreview"),
    previewImgElement: document.getElementById("previewImgElement"),
    btnChangeImage: document.getElementById("btnChangeImage"),
    cameraVideo: document.getElementById("cameraVideo"),
    cameraCanvas: document.getElementById("cameraCanvas"),
    cameraStatus: document.getElementById("cameraStatus"),
    btnSnapPhoto: document.getElementById("btnSnapPhoto"),
    btnRetakePhoto: document.getElementById("btnRetakePhoto"),
    inputImageTitle: document.getElementById("inputImageTitle"),
    selectCategory: document.getElementById("selectCategory"),
    inputPhotographer: document.getElementById("inputPhotographer"),
    inputLocation: document.getElementById("inputLocation"),
    uploadFormError: document.getElementById("uploadFormError"),

    // Navigation elements
    mobileMenuBtn: document.getElementById("mobileMenuBtn"),
    mobileNavDrawer: document.getElementById("mobileNavDrawer"),
    backToTopBtn: document.getElementById("backToTopBtn")
  };
}

/**
 * Dynamically render category buttons with accurate item counts
 */
function renderCategoryButtons() {
  if (!DOM.filterTabsWrapper) return;

  const categories = [
    { key: "all", label: "All" },
    { key: "nature", label: "Nature" },
    { key: "architecture", label: "Architecture" },
    { key: "travel", label: "Travel" },
    { key: "people", label: "People" },
    { key: "lifestyle", label: "Lifestyle" }
  ];

  DOM.filterTabsWrapper.innerHTML = "";

  categories.forEach(cat => {
    const count = cat.key === "all" 
      ? allGalleryItems.length 
      : allGalleryItems.filter(item => item.category === cat.key).length;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `filter-btn ${cat.key === state.activeCategory ? "active" : ""}`;
    btn.setAttribute("data-category", cat.key);
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", cat.key === state.activeCategory ? "true" : "false");
    btn.id = `filter-tab-${cat.key}`;

    btn.innerHTML = `
      <span>${cat.label}</span>
      <span class="filter-count">${count}</span>
    `;

    btn.addEventListener("click", () => handleCategoryChange(cat.key));
    DOM.filterTabsWrapper.appendChild(btn);
  });

  if (DOM.galleryCountBadge) {
    DOM.galleryCountBadge.textContent = `${allGalleryItems.length} Photographs`;
  }
}

/**
 * Handle category change, filter images, and update states
 * @param {string} categoryKey 
 */
function handleCategoryChange(categoryKey) {
  state.activeCategory = categoryKey;

  // Update active button classes & ARIA
  const buttons = DOM.filterTabsWrapper.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-category") === categoryKey;
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  // Filter dataset
  if (categoryKey === "all") {
    state.filteredItems = [...allGalleryItems];
  } else {
    state.filteredItems = allGalleryItems.filter(item => item.category === categoryKey);
  }

  // Update status summary text
  updateFilterSummary();

  // Smooth grid transition
  DOM.galleryGrid.style.opacity = "0.35";
  setTimeout(() => {
    renderGallery(state.filteredItems);
    DOM.galleryGrid.style.opacity = "1";
  }, 140);
}

/**
 * Update summary label above grid
 */
function updateFilterSummary() {
  if (!DOM.filterSummaryText) return;
  const count = state.filteredItems.length;
  const catName = state.activeCategory === "all" ? "all categories" : state.activeCategory;
  DOM.filterSummaryText.textContent = `Showing ${count} ${count === 1 ? 'photograph' : 'photographs'} in ${catName}`;
}

/**
 * Render gallery cards into DOM
 * @param {Array} items 
 */
function renderGallery(items) {
  if (!DOM.galleryGrid) return;
  DOM.galleryGrid.innerHTML = "";

  if (items.length === 0) {
    DOM.galleryGrid.innerHTML = `
      <div class="empty-state">
        <h3>No photographs found</h3>
        <p>There are currently no items in this category.</p>
      </div>
    `;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "gallery-card";
    card.setAttribute("data-aspect", item.aspect);
    card.setAttribute("data-id", item.id);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View photograph: ${item.title}, ${item.location}`);

    card.innerHTML = `
      <div class="card-media">
        <img 
          class="card-img" 
          src="${item.thumb}" 
          alt="${item.alt}" 
          loading="lazy" 
          decoding="async"
        />
        <div class="card-overlay" aria-hidden="true">
          <div class="card-overlay-top">
            <span class="expand-icon-badge" title="Expand view">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </span>
          </div>
          <div class="card-overlay-bottom">
            <span class="overlay-tag">${item.categoryLabel}</span>
            <h3 class="overlay-title">${item.title}</h3>
          </div>
        </div>
      </div>
      <div class="card-content">
        <div class="card-meta">
          <h4 class="card-title">${item.title}</h4>
          <span class="card-location">${item.location} • Photo by ${item.photographer}</span>
        </div>
        <span class="card-category-badge">${item.categoryLabel}</span>
      </div>
    `;

    // Click handler: opens filtered index in lightbox
    card.addEventListener("click", () => {
      openLightbox(index);
    });

    // Keyboard accessibility: Enter or Space opens lightbox
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(index);
      }
    });

    DOM.galleryGrid.appendChild(card);
  });
}

/**
 * Open Lightbox with specified index within current filtered dataset
 * @param {number} index 
 */
function openLightbox(index) {
  if (state.filteredItems.length === 0) return;

  state.activeLightboxIndex = index;
  state.isLightboxOpen = true;
  state.lastFocusedElement = document.activeElement;

  // Prevent background page scrolling
  document.body.style.overflow = "hidden";

  // Update image and caption
  updateLightboxContent();

  // Show modal
  DOM.lightboxModal.classList.add("active");
  DOM.lightboxModal.setAttribute("aria-hidden", "false");

  // Focus close button for accessibility
  DOM.lightboxCloseBtn.focus();
}

/**
 * Close Lightbox and restore focus
 */
function closeLightbox() {
  if (!state.isLightboxOpen) return;

  state.isLightboxOpen = false;
  DOM.lightboxModal.classList.remove("active");
  DOM.lightboxModal.setAttribute("aria-hidden", "true");

  // Restore body scrolling
  document.body.style.overflow = "";

  // Return focus to previously focused card
  if (state.lastFocusedElement) {
    state.lastFocusedElement.focus();
  }
}

/**
 * Update Lightbox Image and Caption details
 */
function updateLightboxContent() {
  const currentItem = state.filteredItems[state.activeLightboxIndex];
  if (!currentItem) return;

  // Fade transition for smooth image change
  DOM.lightboxImage.classList.add("loading");

  const tempImg = new Image();
  tempImg.src = currentItem.src;
  tempImg.onload = () => {
    DOM.lightboxImage.src = currentItem.src;
    DOM.lightboxImage.alt = currentItem.alt;
    DOM.lightboxImage.classList.remove("loading");
  };
  tempImg.onerror = () => {
    DOM.lightboxImage.src = currentItem.thumb;
    DOM.lightboxImage.alt = currentItem.alt;
    DOM.lightboxImage.classList.remove("loading");
  };

  // Preload adjacent items for instantaneous browsing
  if (state.filteredItems.length > 1) {
    const nextIdx = (state.activeLightboxIndex + 1) % state.filteredItems.length;
    const prevIdx = (state.activeLightboxIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
    new Image().src = state.filteredItems[nextIdx].src;
    new Image().src = state.filteredItems[prevIdx].src;
  }

  // Update text & counters
  DOM.lightboxTitle.textContent = currentItem.title;
  DOM.lightboxSubtext.textContent = `${currentItem.location} • Captured by ${currentItem.photographer}`;
  
  // Format counter: e.g. "3 / 15"
  DOM.lightboxCounter.textContent = `${state.activeLightboxIndex + 1} / ${state.filteredItems.length}`;
  DOM.lightboxFilterBadge.textContent = currentItem.categoryLabel;
}

/**
 * Navigate to Next Image (loops circularly)
 */
function showNextImage() {
  if (!state.isLightboxOpen || state.filteredItems.length === 0) return;
  state.activeLightboxIndex = (state.activeLightboxIndex + 1) % state.filteredItems.length;
  updateLightboxContent();
}

/**
 * Navigate to Previous Image (loops circularly)
 */
function showPrevImage() {
  if (!state.isLightboxOpen || state.filteredItems.length === 0) return;
  state.activeLightboxIndex = (state.activeLightboxIndex - 1 + state.filteredItems.length) % state.filteredItems.length;
  updateLightboxContent();
}

/**
 * Global Event Listeners
 */
function bindEvents() {
  // Lightbox Close button
  DOM.lightboxCloseBtn.addEventListener("click", closeLightbox);

  // Lightbox Navigation buttons
  DOM.lightboxNextBtn.addEventListener("click", showNextImage);
  DOM.lightboxPrevBtn.addEventListener("click", showPrevImage);

  // Close when clicking backdrop (outside image and buttons)
  DOM.lightboxModal.addEventListener("click", (e) => {
    // If click is on the modal backdrop itself or stage container outside controls
    if (e.target === DOM.lightboxModal || e.target.classList.contains("lightbox-stage") || e.target.classList.contains("lightbox-image-container")) {
      closeLightbox();
    }
  });

  // Keyboard navigation & Accessibility Focus Trap
  document.addEventListener("keydown", (e) => {
    if (!state.isLightboxOpen) return;

    switch (e.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowRight":
        showNextImage();
        break;
      case "ArrowLeft":
        showPrevImage();
        break;
      case "Tab": {
        const focusableElements = [DOM.lightboxCloseBtn, DOM.lightboxPrevBtn, DOM.lightboxNextBtn];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
        break;
      }
    }
  });

  // Mobile Touch Swipe support for Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  DOM.lightboxModal.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  DOM.lightboxModal.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipeGesture();
  }, { passive: true });

  function handleSwipeGesture() {
    const threshold = 50; // Minimum distance to register swipe
    if (touchEndX < touchStartX - threshold) {
      // Swiped Left -> Next Image
      showNextImage();
    } else if (touchEndX > touchStartX + threshold) {
      // Swiped Right -> Previous Image
      showPrevImage();
    }
  }

  // Mobile Navigation Toggle
  if (DOM.mobileMenuBtn && DOM.mobileNavDrawer) {
    DOM.mobileMenuBtn.addEventListener("click", () => {
      const isOpen = DOM.mobileNavDrawer.classList.toggle("open");
      DOM.mobileMenuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close mobile drawer when clicking nav links
    const mobileLinks = DOM.mobileNavDrawer.querySelectorAll(".mobile-nav-link");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        DOM.mobileNavDrawer.classList.remove("open");
        DOM.mobileMenuBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Back to top smooth scroll
  if (DOM.backToTopBtn) {
    DOM.backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- Add Image Modal Events (Feature 1 & Feature 2) ---
  if (DOM.openAddImageBtn) {
    DOM.openAddImageBtn.addEventListener("click", openAddImageModal);
  }

  if (DOM.closeAddImageModalBtn) {
    DOM.closeAddImageModalBtn.addEventListener("click", closeAddImageModal);
  }

  if (DOM.cancelAddImageBtn) {
    DOM.cancelAddImageBtn.addEventListener("click", closeAddImageModal);
  }

  // Close modal when clicking on backdrop
  if (DOM.addImageModal) {
    DOM.addImageModal.addEventListener("click", (e) => {
      if (e.target === DOM.addImageModal) {
        closeAddImageModal();
      }
    });
  }

  // Source toggle tabs: Device Upload vs Live Camera
  if (DOM.tabUploadDevice) {
    DOM.tabUploadDevice.addEventListener("click", () => switchSourceTab("upload"));
  }

  if (DOM.tabLiveCamera) {
    DOM.tabLiveCamera.addEventListener("click", () => switchSourceTab("camera"));
  }

  // Dropzone click & file change
  if (DOM.uploadDropzone && DOM.fileInputElement) {
    DOM.uploadDropzone.addEventListener("click", (e) => {
      // Don't re-trigger if clicking the change button (handled separately)
      if (e.target === DOM.btnChangeImage || DOM.btnChangeImage?.contains(e.target)) {
        return;
      }
      DOM.fileInputElement.click();
    });

    DOM.uploadDropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        DOM.fileInputElement.click();
      }
    });

    DOM.fileInputElement.addEventListener("change", handleFileSelect);

    // Drag and drop handling
    ["dragenter", "dragover"].forEach(eventName => {
      DOM.uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        DOM.uploadDropzone.classList.add("dragover");
      });
    });

    ["dragleave", "drop"].forEach(eventName => {
      DOM.uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        DOM.uploadDropzone.classList.remove("dragover");
      });
    });

    DOM.uploadDropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files.length > 0) {
        processUploadedFile(files[0]);
      }
    });
  }

  if (DOM.btnChangeImage) {
    DOM.btnChangeImage.addEventListener("click", (e) => {
      e.stopPropagation();
      DOM.fileInputElement.click();
    });
  }

  // Camera snap photo
  if (DOM.btnSnapPhoto) {
    DOM.btnSnapPhoto.addEventListener("click", snapLivePhoto);
  }

  // Camera retake photo
  if (DOM.btnRetakePhoto) {
    DOM.btnRetakePhoto.addEventListener("click", retakeLivePhoto);
  }

  // Aspect ratio radio selector change (Feature 2)
  const aspectRadios = document.querySelectorAll('input[name="aspectRatio"]');
  aspectRadios.forEach(radio => {
    radio.addEventListener("change", (e) => {
      state.selectedAspect = e.target.value;
    });
  });

  // Form submission
  if (DOM.addImageForm) {
    DOM.addImageForm.addEventListener("submit", handleAddImageSubmit);
  }
}

/**
 * Open the Add Image Modal
 */
function openAddImageModal() {
  state.isUploadModalOpen = true;
  DOM.addImageModal.classList.add("active");
  DOM.addImageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  resetAddImageForm();

  // Ensure scroll is positioned right at the top so the user starts from the beginning
  if (DOM.uploadFormScrollable) {
    DOM.uploadFormScrollable.scrollTop = 0;
  }

  // Focus the first source tab or close button without causing unwanted scroll jumps
  setTimeout(() => {
    if (DOM.uploadFormScrollable) {
      DOM.uploadFormScrollable.scrollTop = 0;
    }
    if (DOM.tabUploadDevice) {
      DOM.tabUploadDevice.focus({ preventScroll: true });
    }
  }, 50);
}

/**
 * Close the Add Image Modal and cleanup video streams
 */
function closeAddImageModal() {
  state.isUploadModalOpen = false;
  DOM.addImageModal.classList.remove("active");
  DOM.addImageModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  // Stop camera tracks if running
  stopCameraStream();
}

/**
 * Switch source tab between File Upload and Live Camera
 * @param {"upload" | "camera"} tab 
 */
function switchSourceTab(tab) {
  state.activeSourceTab = tab;

  if (tab === "upload") {
    DOM.tabUploadDevice.classList.add("active");
    DOM.tabUploadDevice.setAttribute("aria-selected", "true");
    DOM.tabLiveCamera.classList.remove("active");
    DOM.tabLiveCamera.setAttribute("aria-selected", "false");

    DOM.uploadFileArea.classList.remove("hidden");
    DOM.liveCameraArea.classList.add("hidden");
    stopCameraStream();
  } else {
    DOM.tabLiveCamera.classList.add("active");
    DOM.tabLiveCamera.setAttribute("aria-selected", "true");
    DOM.tabUploadDevice.classList.remove("active");
    DOM.tabUploadDevice.setAttribute("aria-selected", "false");

    DOM.liveCameraArea.classList.remove("hidden");
    DOM.uploadFileArea.classList.add("hidden");
    startCameraStream();
  }
}

/**
 * Start Live Camera Stream using browser MediaDevices API
 */
async function startCameraStream() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showFormError("Live camera access is not supported by your browser. Please upload an image file instead.");
    return;
  }

  DOM.cameraStatus.textContent = "Requesting camera access...";

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "environment",
        width: { ideal: 1280 },
        height: { ideal: 960 }
      },
      audio: false
    });

    state.cameraStream = stream;
    DOM.cameraVideo.srcObject = stream;
    DOM.cameraVideo.classList.remove("hidden");
    DOM.cameraStatus.textContent = "Camera active • Tap capture";

    DOM.btnSnapPhoto.classList.remove("hidden");
    DOM.btnRetakePhoto.classList.add("hidden");
  } catch (err) {
    console.warn("Camera access error:", err);
    DOM.cameraStatus.textContent = "Camera unavailable";
    showFormError("Could not access camera. Please check permissions or upload from your device.");
  }
}

/**
 * Stop active camera stream
 */
function stopCameraStream() {
  if (state.cameraStream) {
    state.cameraStream.getTracks().forEach(track => track.stop());
    state.cameraStream = null;
  }
  if (DOM.cameraVideo) {
    DOM.cameraVideo.srcObject = null;
  }
}

/**
 * Snap photo from video feed and render to canvas
 */
function snapLivePhoto() {
  if (!state.cameraStream || !DOM.cameraVideo) return;

  const video = DOM.cameraVideo;
  const canvas = DOM.cameraCanvas;
  
  // Set canvas dimensions to match video stream
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to high quality image data URL
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  state.uploadedImageDataUrl = dataUrl;

  // Show captured snapshot in the file preview
  setUploadedImagePreview(dataUrl);

  // Update camera controls
  DOM.cameraStatus.textContent = "Photo captured!";
  DOM.btnSnapPhoto.classList.add("hidden");
  DOM.btnRetakePhoto.classList.remove("hidden");

  // Pause video feed
  video.pause();
  clearFormError();
}

/**
 * Retake live camera photo
 */
function retakeLivePhoto() {
  state.uploadedImageDataUrl = "";
  DOM.previewImgElement.src = "";
  DOM.dropzonePreview.classList.add("hidden");
  DOM.dropzoneEmpty.classList.remove("hidden");

  DOM.btnSnapPhoto.classList.remove("hidden");
  DOM.btnRetakePhoto.classList.add("hidden");
  DOM.cameraStatus.textContent = "Camera active • Tap capture";

  if (DOM.cameraVideo) {
    DOM.cameraVideo.play();
  }
}

/**
 * File input change event handler
 */
function handleFileSelect(e) {
  const file = e.target.files?.[0];
  if (file) {
    processUploadedFile(file);
  }
}

/**
 * Process and validate image file from file picker or drag/drop
 * @param {File} file 
 */
function processUploadedFile(file) {
  if (!file.type.startsWith("image/")) {
    showFormError("Please select a valid image file (JPG, PNG, WEBP, or AVIF).");
    return;
  }

  // 15MB limit check
  if (file.size > 15 * 1024 * 1024) {
    showFormError("Image file size exceeds the 15MB limit. Please choose a smaller file.");
    return;
  }

  clearFormError();

  const reader = new FileReader();
  reader.onload = (event) => {
    const dataUrl = event.target?.result;
    if (dataUrl) {
      state.uploadedImageDataUrl = dataUrl;
      setUploadedImagePreview(dataUrl);
    }
  };
  reader.onerror = () => {
    showFormError("Failed to read image file. Please try another image.");
  };
  reader.readAsDataURL(file);
}

/**
 * Set and display image preview inside dropzone
 * @param {string} src 
 */
function setUploadedImagePreview(src) {
  DOM.previewImgElement.src = src;
  DOM.dropzoneEmpty.classList.add("hidden");
  DOM.dropzonePreview.classList.remove("hidden");
}

/**
 * Reset Add Image Form to initial default state
 */
function resetAddImageForm() {
  state.uploadedImageDataUrl = "";
  state.selectedAspect = "standard";

  if (DOM.addImageForm) {
    DOM.addImageForm.reset();
  }

  // Reset aspect ratio radio buttons
  const standardRadio = document.querySelector('input[name="aspectRatio"][value="standard"]');
  if (standardRadio) standardRadio.checked = true;

  if (DOM.dropzonePreview) DOM.dropzonePreview.classList.add("hidden");
  if (DOM.dropzoneEmpty) DOM.dropzoneEmpty.classList.remove("hidden");
  if (DOM.previewImgElement) DOM.previewImgElement.src = "";
  if (DOM.fileInputElement) DOM.fileInputElement.value = "";

  clearFormError();
  switchSourceTab("upload");
}

/**
 * Display inline error message in upload modal
 * @param {string} message 
 */
function showFormError(message) {
  if (!DOM.uploadFormError) return;
  DOM.uploadFormError.textContent = message;
  DOM.uploadFormError.classList.remove("hidden");
}

/**
 * Clear error message
 */
function clearFormError() {
  if (!DOM.uploadFormError) return;
  DOM.uploadFormError.textContent = "";
  DOM.uploadFormError.classList.add("hidden");
}

/**
 * Handle form submission to add new photo to the gallery
 */
function handleAddImageSubmit(e) {
  e.preventDefault();

  // Validate image
  if (!state.uploadedImageDataUrl) {
    showFormError("Please upload an image file or capture a photo with your camera first.");
    return;
  }

  const title = DOM.inputImageTitle.value.trim();
  if (!title) {
    showFormError("Please enter a title for your photograph.");
    DOM.inputImageTitle.focus();
    return;
  }

  const category = DOM.selectCategory.value;
  const photographer = DOM.inputPhotographer.value.trim() || "Anonymous Contributor";
  const location = DOM.inputLocation.value.trim() || "Unknown Location";

  // Map category code to human readable label
  const categoryLabels = {
    nature: "Nature",
    architecture: "Architecture",
    travel: "Travel",
    people: "People",
    lifestyle: "Lifestyle"
  };

  const newPhotoItem = {
    id: Date.now(),
    title: title,
    category: category,
    categoryLabel: categoryLabels[category] || "Photography",
    location: location,
    photographer: photographer,
    aspect: state.selectedAspect, // "standard" | "tall" | "wide" | "square"
    src: state.uploadedImageDataUrl,
    thumb: state.uploadedImageDataUrl,
    alt: `${title} - Photographed by ${photographer} in ${location}`
  };

  // Add to beginning of master list
  allGalleryItems.unshift(newPhotoItem);

  // Persist user-added item to local storage
  const storedItems = loadStoredItems();
  storedItems.unshift(newPhotoItem);
  saveStoredItems(storedItems);

  // Re-render category tabs with updated count
  renderCategoryButtons();

  // Switch to All category or newly added category so the user sees their photo right away
  state.activeCategory = "all";
  state.filteredItems = [...allGalleryItems];

  // Update tabs UI
  const buttons = DOM.filterTabsWrapper.querySelectorAll(".filter-btn");
  buttons.forEach(btn => {
    const isTarget = btn.getAttribute("data-category") === "all";
    btn.classList.toggle("active", isTarget);
    btn.setAttribute("aria-selected", isTarget ? "true" : "false");
  });

  updateFilterSummary();
  renderGallery(state.filteredItems);

  // Close modal
  closeAddImageModal();

  // Smooth scroll to gallery and briefly highlight the new first card
  const galleryEl = document.getElementById("gallery");
  if (galleryEl) {
    galleryEl.scrollIntoView({ behavior: "smooth" });
  }

  setTimeout(() => {
    const firstCard = DOM.galleryGrid.querySelector(".gallery-card");
    if (firstCard) {
      firstCard.style.transition = "outline 0.3s ease, box-shadow 0.3s ease";
      firstCard.style.outline = "2px solid var(--accent-color)";
      firstCard.style.boxShadow = "0 8px 24px rgba(184, 90, 60, 0.35)";
      setTimeout(() => {
        firstCard.style.outline = "";
        firstCard.style.boxShadow = "";
      }, 2500);
    }
  }, 400);
}
