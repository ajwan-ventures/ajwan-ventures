// default mock products data for AJWAN Ventures
const DEFAULT_PRODUCTS = [
    {
        id: "1",
        title: "Kashmiri Chilly Powder",
        category: "Spices",
        desc: "Made from premium grade sun-dried Kashmiri chillies. Delivers a vibrant red color and a mild, rich warmth to your dishes.",
        image: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80",
        themeRgb: "239, 68, 68" // Red
    },
    {
        id: "2",
        title: "Double Roasted Puttu Powder",
        category: "Breakfast Powders",
        desc: "Crafted from select high-quality white rice, steam-treated and double-roasted for soft, fluffy, traditional Malabar puttu.",
        image: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=600&q=80",
        themeRgb: "245, 158, 11" // Gold
    },
    {
        id: "3",
        title: "Pure Turmeric Powder",
        category: "Spices",
        desc: "High-curcumin turmeric roots, finely ground. Gives your curries a warm earthy aroma and a rich golden hue.",
        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80",
        themeRgb: "234, 179, 8" // Yellow
    }
];

const DEFAULT_CATEGORIES = ["Spices", "Breakfast Powders", "Grain Flours", "Other"];

// Initialize catalog products storage
function getProducts() {
    const products = localStorage.getItem("products");
    if (!products) {
        localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    return JSON.parse(products);
}

function saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

// Initialize categories storage
function getCategories() {
    const categories = localStorage.getItem("categories");
    if (!categories) {
        localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
        return DEFAULT_CATEGORIES;
    }
    return JSON.parse(categories);
}

function saveCategories(categories) {
    localStorage.setItem("categories", JSON.stringify(categories));
}

// Check admin authentication state
function isAdminLoggedIn() {
    return sessionStorage.getItem("adminLoggedIn") === "true";
}

// UI State Management
function updateAuthStateUI() {
    const isLoggedIn = isAdminLoggedIn();
    const loginBtn = document.getElementById("login-nav-btn");
    const logoutBtn = document.getElementById("logout-nav-btn");
    const adminPanel = document.getElementById("admin-panel");

    if (isLoggedIn) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "block";
        adminPanel.style.display = "flex";
    } else {
        loginBtn.style.display = "block";
        logoutBtn.style.display = "none";
        adminPanel.style.display = "none";
    }
}

// Toast notification helper
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastMsg = document.getElementById("toast-message");
    
    toastMsg.textContent = message;
    toast.className = `toast show toast-${type}`;
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Render dynamic categories inside filter bar & product create dropdown
function renderCategoriesUI() {
    const filtersContainer = document.getElementById("filters-container");
    const selectDropdown = document.getElementById("prod-category");
    const categories = getCategories();
    
    // Check which filter is active
    const activeFilterBtn = filtersContainer.querySelector(".filter-btn.active");
    const activeCategory = activeFilterBtn ? activeFilterBtn.getAttribute("data-category") : "all";
    
    // 1. Render Category Filter buttons
    filtersContainer.innerHTML = `
        <button class="filter-btn ${activeCategory === "all" ? "active" : ""}" data-category="all">All Products</button>
    `;
    
    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = `filter-btn ${activeCategory.toLowerCase() === cat.toLowerCase() ? "active" : ""}`;
        btn.setAttribute("data-category", cat);
        btn.textContent = cat;
        filtersContainer.appendChild(btn);
    });
    
    // 2. Render dropdown options
    selectDropdown.innerHTML = `<option value="" disabled selected>Select category...</option>`;
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        selectDropdown.appendChild(opt);
    });
}

// Map categories to dynamic theme RGB colors
function getThemeRgbForCategory(category) {
    if (category === "Spices") return "239, 68, 68"; // Red
    if (category === "Breakfast Powders") return "245, 158, 11"; // Gold
    if (category === "Grain Flours") return "20, 184, 166"; // Teal
    if (category === "Other") return "249, 115, 22"; // Orange
    
    // Compute simple deterministic hash for custom category colors
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
        hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        "249, 115, 22",  // Orange
        "168, 85, 247",  // Purple
        "59, 130, 246",  // Blue
        "236, 72, 153",  // Pink
        "20, 184, 166",  // Teal
        "234, 179, 8",    // Yellow
        "14, 165, 233"   // Sky blue
    ];
    return colors[Math.abs(hash) % colors.length];
}

// Render Products Grid
function renderCatalog(categoryFilter = "all") {
    const grid = document.getElementById("products-grid");
    const products = getProducts();
    const isLoggedIn = isAdminLoggedIn();
    
    grid.innerHTML = "";
    
    const filtered = categoryFilter === "all" 
        ? products 
        : products.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
        
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                <p style="font-size: 1.2rem;">No products found in this category.</p>
                ${isLoggedIn ? '<p style="margin-top: 0.5rem; font-size: 0.95rem;">Click the "+ Add Product" button above to list a new one.</p>' : ''}
            </div>
        `;
        return;
    }
    
    filtered.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.setProperty("--card-theme-rgb", product.themeRgb || "249, 115, 22");
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <div class="product-img-bg"></div>
                <img src="${product.image}" class="product-img" alt="${product.title}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=300&q=80'">
            </div>
            <div class="product-details">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-footer">
                    <span class="product-price">Premium Quality</span>
                </div>
                ${isLoggedIn ? `
                    <div class="admin-card-actions">
                        <button class="btn btn-danger btn-sm delete-product-btn" data-id="${product.id}">Delete</button>
                    </div>
                ` : ""}
            </div>
        `;
        grid.appendChild(card);
    });
    
    // Add delete event listeners
    if (isLoggedIn) {
        document.querySelectorAll(".delete-product-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idToDelete = e.target.getAttribute("data-id");
                deleteProduct(idToDelete);
            });
        });
    }
}

// Delete product
function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product from the catalog?")) {
        let products = getProducts();
        products = products.filter(p => p.id !== id);
        saveProducts(products);
        
        // Re-render
        const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-category");
        renderCatalog(activeFilter);
        showToast("Product deleted successfully", "success");
    }
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Clear old localStorage if it contains old demo data (to force initialization of new branded spices data)
    if (localStorage.getItem("products") && JSON.parse(localStorage.getItem("products"))[0]?.title.includes("Golden Crisp")) {
        localStorage.removeItem("products");
        localStorage.removeItem("categories");
    }

    // Initial Setup
    updateAuthStateUI();
    renderCategoriesUI();
    renderCatalog();

    // 1. Dynamic Floating Leaves around the Mascot
    const mascotWrapper = document.querySelector(".mascot-wrapper");
    if (mascotWrapper) {
        const leafEmojis = ["🍃", "🌱", "🌿"];
        for (let i = 0; i < 8; i++) {
            const leaf = document.createElement("div");
            leaf.className = "floating-leaf";
            leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
            
            // Random initial placement & sizes
            leaf.style.left = `${Math.random() * 80 + 10}%`;
            leaf.style.top = `${Math.random() * 80 + 10}%`;
            leaf.style.fontSize = `${Math.random() * 0.8 + 0.8}rem`;
            leaf.style.animationDelay = `${Math.random() * 6}s`;
            leaf.style.animationDuration = `${Math.random() * 8 + 6}s`;
            
            mascotWrapper.appendChild(leaf);
        }
    }

    // 2. Interactive Mascot Mouse 3D Tilt Parallax
    const heroSection = document.getElementById("hero-section");
    const mascotImg = document.querySelector(".mascot-img");
    const mascotGlow = document.querySelector(".mascot-glow");

    if (heroSection && mascotImg) {
        heroSection.addEventListener("mousemove", (e) => {
            const rect = heroSection.getBoundingClientRect();
            // Calculate mouse position relative to center of the hero section
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            // Calculate tilt: max 12 degrees
            const tiltX = (y / (rect.height / 2)) * -12;
            const tiltY = (x / (rect.width / 2)) * 12;
            
            mascotImg.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
            mascotImg.style.boxShadow = "0 20px 45px rgba(21, 62, 37, 0.15), 0 0 35px rgba(22, 163, 74, 0.25)";
            
            if (mascotGlow) {
                // Move glow background slightly in opposite direction for parallax
                mascotGlow.style.transform = `translate(${x * -0.04}px, ${y * -0.04}px) scale(1.05)`;
            }
        });
        
        heroSection.addEventListener("mouseleave", () => {
            // Smoothly snap back to origin
            mascotImg.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
            mascotImg.style.boxShadow = "0 15px 35px rgba(21, 62, 37, 0.1), 0 0 30px rgba(22, 163, 74, 0.1)";
            
            if (mascotGlow) {
                mascotGlow.style.transform = "translate(0px, 0px) scale(1)";
            }
        });
    }
    
    // Setup dialog backdrop auto-close
    const dialogs = document.querySelectorAll("dialog");
    dialogs.forEach(dialog => {
        dialog.addEventListener("click", (e) => {
            const rect = dialog.getBoundingClientRect();
            const isInDialog = (
                rect.top <= e.clientY && 
                e.clientY <= rect.top + rect.height &&
                rect.left <= e.clientX && 
                e.clientX <= rect.left + rect.width
            );
            if (!isInDialog) {
                dialog.close();
            }
        });
    });

    // Login Dialog Selectors
    const loginDialog = document.getElementById("login-dialog");
    const loginBtn = document.getElementById("login-nav-btn");
    const closeLoginBtn = document.getElementById("close-login-btn");
    const cancelLoginBtn = document.getElementById("cancel-login-btn");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error-msg");
    
    // Open login dialog
    loginBtn.addEventListener("click", () => {
        loginForm.reset();
        loginError.style.display = "none";
        loginDialog.showModal();
    });
    
    // Close login dialog
    const closeLogin = () => loginDialog.close();
    closeLoginBtn.addEventListener("click", closeLogin);
    cancelLoginBtn.addEventListener("click", closeLogin);
    
    // Login Submit Handler
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usernameInput = document.getElementById("username").value.trim();
        const passwordInput = document.getElementById("password").value;
        
        if (usernameInput === "admin" && passwordInput === "password") {
            sessionStorage.setItem("adminLoggedIn", "true");
            updateAuthStateUI();
            
            // Re-render catalog & categories UI (to show delete buttons)
            const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-category");
            renderCategoriesUI();
            renderCatalog(activeFilter);
            
            loginDialog.close();
            showToast("Successfully signed in as admin", "success");
        } else {
            loginError.style.display = "block";
        }
    });
    
    // Logout Handler
    const logoutBtn = document.getElementById("logout-nav-btn");
    logoutBtn.addEventListener("click", () => {
        sessionStorage.removeItem("adminLoggedIn");
        updateAuthStateUI();
        
        // Re-render
        const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-category");
        renderCategoriesUI();
        renderCatalog(activeFilter);
        
        showToast("Logged out successfully", "success");
    });
    
    // Category Filters delegation event listener
    const filtersContainer = document.getElementById("filters-container");
    filtersContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        
        const category = btn.getAttribute("data-category");
        renderCatalog(category);
    });
    
    // Add Product Dialog Selectors
    const addProductDialog = document.getElementById("add-product-dialog");
    const addProductBtn = document.getElementById("add-product-btn");
    const closeAddProductBtn = document.getElementById("close-add-product-btn");
    const cancelAddProductBtn = document.getElementById("cancel-add-product-btn");
    const addProductForm = document.getElementById("add-product-form");
    
    const fileInput = document.getElementById("prod-image-file");
    const uploadWrapper = document.getElementById("upload-wrapper");
    const uploadText = document.getElementById("upload-text");
    const imgPreview = document.getElementById("img-preview");
    const fileError = document.getElementById("file-error-msg");
    
    let base64ImageString = "";
    
    // Open Add Product Dialog
    addProductBtn.addEventListener("click", () => {
        addProductForm.reset();
        imgPreview.style.display = "none";
        uploadText.textContent = "Click or drag image file here";
        fileError.style.display = "none";
        base64ImageString = "";
        addProductDialog.showModal();
    });
    
    // Close Add Product Dialog
    const closeAddProduct = () => addProductDialog.close();
    closeAddProductBtn.addEventListener("click", closeAddProduct);
    cancelAddProductBtn.addEventListener("click", closeAddProduct);
    
    // Handle File Input Change / Preview
    fileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                fileError.textContent = "Please select a valid image file.";
                fileError.style.display = "block";
                fileInput.value = "";
                imgPreview.style.display = "none";
                uploadText.textContent = "Click or drag image file here";
                return;
            }
            
            fileError.style.display = "none";
            uploadText.textContent = file.name;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                base64ImageString = event.target.result;
                imgPreview.src = base64ImageString;
                imgPreview.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Add Product Form Submit Handler
    addProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const title = document.getElementById("prod-title").value.trim();
        const category = document.getElementById("prod-category").value;
        const desc = document.getElementById("prod-desc").value.trim();
        
        if (!base64ImageString) {
            fileError.textContent = "Product image is required.";
            fileError.style.display = "block";
            return;
        }
        
        const newProduct = {
            id: Date.now().toString(),
            title: title,
            category: category,
            desc: desc,
            image: base64ImageString,
            themeRgb: getThemeRgbForCategory(category)
        };
        
        const products = getProducts();
        products.push(newProduct);
        saveProducts(products);
        
        // Reset and Close
        addProductForm.reset();
        addProductDialog.close();
        
        // Re-render active category catalog
        const activeFilter = document.querySelector(".filter-btn.active").getAttribute("data-category");
        renderCatalog(activeFilter);
        
        showToast("Product added successfully!", "success");
    });

    // Add Category Dialog Selectors
    const addCategoryDialog = document.getElementById("add-category-dialog");
    const addCategoryBtn = document.getElementById("add-category-btn");
    const closeAddCategoryBtn = document.getElementById("close-add-category-btn");
    const cancelAddCategoryBtn = document.getElementById("cancel-add-category-btn");
    const addCategoryForm = document.getElementById("add-category-form");
    const catError = document.getElementById("cat-error-msg");

    // Open Add Category Dialog
    addCategoryBtn.addEventListener("click", () => {
        addCategoryForm.reset();
        catError.style.display = "none";
        addCategoryDialog.showModal();
    });

    // Close Add Category Dialog
    const closeAddCategory = () => addCategoryDialog.close();
    closeAddCategoryBtn.addEventListener("click", closeAddCategory);
    cancelAddCategoryBtn.addEventListener("click", closeAddCategory);

    // Add Category Form Submit Handler
    addCategoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const catNameInput = document.getElementById("cat-name").value.trim();
        
        if (!catNameInput) return;

        let categories = getCategories();
        
        // Check case-insensitive duplication
        const duplicate = categories.some(cat => cat.toLowerCase() === catNameInput.toLowerCase());
        if (duplicate) {
            catError.style.display = "block";
            return;
        }

        categories.push(catNameInput);
        saveCategories(categories);

        // Reset forms and UI
        addCategoryForm.reset();
        addCategoryDialog.close();

        renderCategoriesUI();
        showToast(`Category "${catNameInput}" created!`, "success");
    });
});
