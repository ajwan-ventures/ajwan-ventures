// AJWAN Ventures Featured Product Data
const DEFAULT_PRODUCTS = [
    {
        id: "1",
        title: "Ajwan White Steam Puttu Podi (1kg)",
        category: "Breakfast Flours",
        brand: "Ajwan",
        desc: "Authentic double-roasted steam puttu podi crafted from select white rice. Steam-treated for soft, fragrant, fluffy traditional Malabar puttu.",
        image: "assets/puttu_podi_packet.jpg",
        avatarImage: "assets/puttu_mascot_avatar.jpg",
        themeRgb: "22, 163, 74" // Green
    }
];

// Render Products Showcase
function renderCatalog() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    DEFAULT_PRODUCTS.forEach(product => {
        const container = document.createElement("div");
        container.className = "product-card-container";
        
        container.innerHTML = `
            <div class="product-card" style="--card-theme-rgb: ${product.themeRgb || '22, 163, 74'}">
                <div class="product-img-wrapper">
                    <div class="product-img-bg"></div>
                    <img src="${product.image}" class="product-img" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-details">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-desc">${product.desc}</p>
                    <div class="product-badges">
                        <span class="badge">🌾 100% Pure Rice</span>
                        <span class="badge">🔥 Double Roasted</span>
                        <span class="badge">✨ Steam Treated</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">Net Weight: 1kg</span>
                    </div>
                </div>
            </div>
            
            <div class="product-avatar-wrapper">
                <div class="speech-bubble">
                    <span>Try our soft & fluffy Malabar Puttu! 👍</span>
                </div>
                <div class="avatar-glow"></div>
                <img src="${product.avatarImage || 'assets/puttu_mascot_avatar.jpg'}" class="animated-avatar-img" alt="Ajwan Hero Mascot">
            </div>
        `;
        grid.appendChild(container);
    });
}

// App Initialization
document.addEventListener("DOMContentLoaded", () => {
    renderCatalog();

    // 1. Dynamic Floating Leaves around the Mascot
    const mascotWrapper = document.querySelector(".mascot-wrapper");
    if (mascotWrapper) {
        const leafEmojis = ["🍃", "🌱", "🌿"];
        for (let i = 0; i < 8; i++) {
            const leaf = document.createElement("div");
            leaf.className = "floating-leaf";
            leaf.textContent = leafEmojis[Math.floor(Math.random() * leafEmojis.length)];
            
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
            const x = e.clientX - rect.left - (rect.width / 2);
            const y = e.clientY - rect.top - (rect.height / 2);
            
            const tiltX = (y / (rect.height / 2)) * -12;
            const tiltY = (x / (rect.width / 2)) * 12;
            
            mascotImg.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px) scale(1.02)`;
            mascotImg.style.boxShadow = "0 20px 45px rgba(21, 62, 37, 0.15), 0 0 35px rgba(22, 163, 74, 0.25)";
            
            if (mascotGlow) {
                mascotGlow.style.transform = `translate(${x * -0.04}px, ${y * -0.04}px) scale(1.05)`;
            }
        });
        
        heroSection.addEventListener("mouseleave", () => {
            mascotImg.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)";
            mascotImg.style.boxShadow = "0 15px 35px rgba(21, 62, 37, 0.1), 0 0 30px rgba(22, 163, 74, 0.1)";
            
            if (mascotGlow) {
                mascotGlow.style.transform = "translate(0px, 0px) scale(1)";
            }
        });
    }
});
