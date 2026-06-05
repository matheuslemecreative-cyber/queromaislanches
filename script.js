// --- Gerenciamento dos Menus Laterais ---
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

function closeAllMenus() {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}

function toggleSubmenu(event) {
    event.stopPropagation(); 
    event.currentTarget.classList.toggle('active');
    document.getElementById('lanches-submenu').classList.toggle('active');
}

// --- Lógica do Carrossel de Banners ---
const slides = document.querySelectorAll('.slide');
const carouselContainer = document.querySelector('.carousel-container');
let currentSlide = 0;
const slideInterval = 4000;
let autoSlideTimer;
let touchStartX = 0;
let touchEndX = 0;

function showSlide(index) {
    slides[currentSlide].classList.remove('active');
    if (index >= slides.length) currentSlide = 0;
    else if (index < 0) currentSlide = slides.length - 1;
    else currentSlide = index;
    slides[currentSlide].classList.add('active');
    resetTimer();
}

function nextSlide() { showSlide(currentSlide + 1); }
function prevSlide() { showSlide(currentSlide - 1); }
function resetTimer() { clearInterval(autoSlideTimer); autoSlideTimer = setInterval(nextSlide, slideInterval); }

carouselContainer.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
carouselContainer.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipe(); }, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchStartX - touchEndX > swipeThreshold) nextSlide();
    if (touchEndX - touchStartX > swipeThreshold) prevSlide();
}
autoSlideTimer = setInterval(nextSlide, slideInterval);


// ==========================================================================
// SITEMA COMPLETO DO CARRINHO DE COMPRAS
// ==========================================================================

let cart = [];

// Função para adicionar item ao carrinho e executar a animação de voo
function addToCart(buttonElement, name, price) {
    // 1. Lógica da Animação Fly
    const card = buttonElement.closest('.product-card');
    const imgToFly = card.querySelector('.product-img');
    const cartIcon = document.querySelector('.cart-icon-container');

    // Obtém as posições do produto e do carrinho na tela atual do cliente
    const imgRect = imgToFly.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Cria o elemento fantasma para voar
    const flyer = document.createElement('img');
    flyer.src = imgToFly.src;
    flyer.classList.add('flying-img');
    flyer.style.top = `${imgRect.top}px`;
    flyer.style.left = `${imgRect.left}px`;
    flyer.style.width = `${imgRect.width}px`;
    flyer.style.height = `${imgRect.height}px`;
    flyer.style.borderRadius = "12px";

    document.body.appendChild(flyer);

    // Força o navegador a reconhecer a posição inicial antes de iniciar a transição
    requestAnimationFrame(() => {
        flyer.style.top = `${cartRect.top + 5}px`;
        flyer.style.left = `${cartRect.left + 5}px`;
        flyer.style.width = '20px';
        flyer.style.height = '20px';
        flyer.style.borderRadius = '50%';
        flyer.style.opacity = '0.4';
    });

    // Remove do documento assim que terminar a animação CSS (800ms)
    setTimeout(() => {
        flyer.remove();
        // Efeito sutil de pulso no ícone do carrinho ao receber o item
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
    }, 800);

    // 2. Lógica interna de armazenamento
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartUI();
}

// Atualiza as quantidades e renderiza a lista visual do carrinho
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCountElement = document.getElementById('cart-count');
    const cartTotalElement = document.getElementById('cart-total-price');
    
    cartItemsContainer.innerHTML = '';
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;

        // Renderiza cada card de item dentro do menu lateral
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="changeQuantity('${item.name}', -1)">-</button>
                <span>${item.quantity}</span>
                <button class="qty-btn" onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    // Atualiza cabeçalho e rodapé do carrinho
    cartCountElement.textContent = totalItems;
    cartTotalElement.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
}

// Altera a quantidade interna e remove o item se chegar a zero
function changeQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
        updateCartUI();
    }
}

// Envia a lista consolidada direto para o WhatsApp
function checkoutWhatsApp() {
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const phoneNumber = "5514988004853";
    let message = `*NOVO PEDIDO - QUERO MAIS*\n`;
    message += `──────────────────────\n\n`;
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• *${item.quantity}x* ${item.name}\n`;
        message += `  _Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}_\n\n`;
    });

    message += `──────────────────────\n`;
    message += `*VALOR TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n\n`;
    message += `Por favor, envie o seu endereço completo e a forma de pagamento para finalizarmos!`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
}