const ADMIN_USER = "admin";
const ADMIN_PASS = "123456789";

let products = JSON.parse(localStorage.getItem('products')) || [];
let isAdmin = false;

// Elementos del DOM
const loginSection = document.getElementById('login-section');
const adminSection = document.getElementById('admin-section');
const productsGrid = document.getElementById('products-grid');
const productForm = document.getElementById('product-form');
const btnShowLogin = document.getElementById('btn-show-login');
const btnLogout = document.getElementById('btn-logout');

// Mostrar/ocultar login
btnShowLogin.addEventListener('click', () => loginSection.classList.toggle('hidden'));

// Login
document.getElementById('btn-login').addEventListener('click', () => {
    const user = document.getElementById('user-input').value;
    const pass = document.getElementById('pass-input').value;

    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        isAdmin = true;
        loginSection.classList.add('hidden');
        adminSection.classList.remove('hidden');
        btnShowLogin.classList.add('hidden');
        btnLogout.classList.remove('hidden');
        renderProducts();
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
});

// Logout
btnLogout.addEventListener('click', () => {
    isAdmin = false;
    adminSection.classList.add('hidden');
    btnLogout.classList.add('hidden');
    btnShowLogin.classList.remove('hidden');
    renderProducts();
});

// Guardar producto (crear o editar)
productForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('prod-name').value;
    const description = document.getElementById('prod-description').value;
    const price = parseFloat(document.getElementById('prod-price').value);
    const coupon = document.getElementById('prod-descuent').value.trim().toUpperCase();
    const img = document.getElementById('prod-img').value;
    const editIndex = document.getElementById('edit-index').value;

    const newProduct = { name, description, price, coupon, img };

    if (editIndex === "") {
        products.push(newProduct);
    } else {
        products[editIndex] = newProduct;
        document.getElementById('edit-index').value = "";
    }

    saveAndRender();
    productForm.reset();
});

// Eliminar
function deleteProduct(index) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
        products.splice(index, 1);
        saveAndRender();
    }
}

// Cargar datos en el form para editar
function editProduct(index) {
    const prod = products[index];
    document.getElementById('prod-name').value = prod.name;
    document.getElementById('prod-description').value = prod.description || '';
    document.getElementById('prod-price').value = prod.price;
    document.getElementById('prod-descuent').value = prod.coupon || '';
    document.getElementById('prod-img').value = prod.img;
    document.getElementById('edit-index').value = index;
    window.scrollTo(0, 0);
}

// Guardar en localStorage y re-renderizar
function saveAndRender() {
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
}

// Renderizar tarjetas
function renderProducts() {
    productsGrid.innerHTML = '';

    products.forEach((prod, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Lógica del cupón DES50
        const tieneDescuento = prod.coupon === 'DESC50';
        const precioFinal = tieneDescuento ? (prod.price * 0.5).toFixed(2) : prod.price;

        const precioHTML = tieneDescuento
            ? `<p><s>$${prod.price}</s> <strong style="color:red;">$${precioFinal} Felicitaciones 50% OFF </strong></p>`
            : `<p><strong>Precio: </strong>$${prod.price}</p>`;

        card.innerHTML = `
            <img src="${prod.img}" alt="${prod.name}" style="width:100%; height:150px; object-fit:cover; border-radius:5px;">
            <h3>${prod.name}</h3>
            <p>${prod.description || ''}</p>
            ${precioHTML}
            ${isAdmin ? `
                <button class="btn-edit" onclick="editProduct(${index})">Editar</button>
                <button class="btn-delete" onclick="deleteProduct(${index})">Eliminar</button>
            ` : ''}
        `;

        productsGrid.appendChild(card);
    });
}

// Cargar productos al iniciar
renderProducts();