
async function main() {

    // Variables
    const logOut = document.getElementById("log_out");
    let userDataInLocalStorage = localStorage.getItem("userData");
    document.getElementById("search_input").value = "";

    if (!userDataInLocalStorage) {
        console.error("Error: Acceso no autorizado");
        window.location.href = "login.html";
    };

    const userData = JSON.parse(userDataInLocalStorage);
    const userToken = userData["access_token"];
    const userId = userData["email"];

    // Mostrar Nombre del Usuario
    const usernameTag = document.getElementById("username_tag");
    usernameTag.innerHTML = userData["user"];

    // Botón Cerrar Sesión
    logOut.addEventListener('click', (event) => {
        event.preventDefault();
        localStorage.clear();
        window.location.href = "login.html";
    });

    // Cargar productos
    const products = await fetchProducts(userToken);
    if (products) { displayProducts(userToken, products, userId) };

    // Eventos Filter, Search y Sort  
    document.getElementById("filter_by_category").addEventListener("change", () => {
        displayProducts(userToken, products, userId);
    });

    document.querySelector(".search_button").addEventListener("click", () => {
        displayProducts(userToken, products, userId);
    });

    document.getElementById("sort_by_price").addEventListener("change", () => {
        displayProducts(userToken, products, userId);
    });
};

// Filtrar, Ordenar y Mostrar los productos según el usuario
function displayProducts(userToken, products, userId) {

    // FILTROS
    let filterProducts = products.filter((item) => {
        return (item["idUser"] != userId) && (item["state"].toLowerCase() == "en venta");
    });

    filterProducts = filterByCategory(filterProducts);
    filterProducts = filterBySearch(filterProducts)

    // ORDENAR
    let sortProducts = sortByPrice(filterProducts);

    createProductsCards(sortProducts)
};

// Añadir productos al DOM
function createProductsCards(products) {

    // Elementos html
    const productsContainer = document.querySelector(".scrollabe_products");
    productsContainer.innerHTML = "";
    let productTemplate = document.getElementById("product_card_template");

    // Iniciar LocalStorage del "Shopping Cart" si no existe
    const shoppingCartKey = "shoppingCart";
    let shoppingCart = JSON.parse(localStorage.getItem(shoppingCartKey)) || { "products": [] };

    // Crear tarjetas de cada producto
    for (const item of products) {
        let productContent = productTemplate.content.cloneNode(true);
        let addToCartButton = productContent.querySelector(".add_to_cart_btn");
        const productId = item["_id"];

        // Características del Producto
        productContent.querySelector(".product_image").src = item["image"];
        productContent.querySelector(".product_title").textContent = item["name"];
        productContent.querySelector(".product_category").textContent = `Estado: ${item["category"]}`;
        productContent.querySelector(".product_status").textContent = item["state"];
        productContent.querySelector(".product_price").textContent = `${item["price"]} €`;

        // Deshabilitar botón de compra en objetos del carrito
        if (shoppingCart["products"].includes(productId)) {
            addToCartButton.disabled = true
        }
        else {

            // Boton añadir al carrito
            addToCartButton.addEventListener("click", () => {

                addToCartButton.disabled = true;

                // Guardar IDs de los articulos del carrito al Local Storage
                shoppingCart["products"].push(productId);
                localStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
            });
        };

        productsContainer.appendChild(productContent);
    };
}

async function fetchProducts(authToken) {
    try {

        let response = await fetch("https://practicaprogramacionweb.duckdns.org/products", {
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${authToken}`
            },
        });

        if (!response.ok) {
            if (response.status == 401) { // Token no válido o caducado
                localStorage.clear();
                window.location.href = "login.html";
            };

            return false;
        };

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error("Error: ", error);
    }
}

async function fetchEditProduct(authToken, productId, curlBody) {
    try {
        const response = await fetch(`https://practicaprogramacionweb.duckdns.org/products/${productId}`, {
            method: 'PUT',
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${authToken}`,
                "content-type": "application/json"
            },
            body: JSON.stringify(curlBody)
        });

        if (!response.ok) {
            if (response.status == 401) { // Token no válido o caducado
                localStorage.clear();
                window.location.href = "login.html";
            }
            else if (response.status == 500) { // Datos invalidos
                console.error(`Error ${response.status}`)
            }

            return false;
        };

        // HTTP OK
        const data = response.json();
        return data;
    }
    catch (error) {
        console.error("Error: ", error);
        return false;
    };
}

function filterByCategory(products) {
    const category = document.getElementById("filter_by_category").value;
    let filteredProducts = structuredClone(products);

    if (category != "none") {
        filteredProducts = filteredProducts.filter((product) =>
            product["category"].toLowerCase() == category.toLowerCase()
        );
    }

    return filteredProducts;
}

function filterBySearch(products) {
    const searchValue = document.getElementById("search_input").value.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); // Ignorar acentos y tildes
    let filteredProducts = structuredClone(products);

    if (searchValue != "") {
        filteredProducts = filteredProducts.filter((product) => {
            const productName = product["name"].trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            return productName.includes(searchValue);
        }
        );
    }

    return filteredProducts;
}

function sortByPrice(products) {
    const order = document.getElementById("sort_by_price").value;
    let sortProducts = structuredClone(products);

    if (order == "asc") {
        sortProducts = sortProducts.sort((a, b) => a["price"] - b["price"]);
    }
    else if (order == "desc") {
        sortProducts = sortProducts.sort((a, b) => b["price"] - a["price"]);
    }

    return sortProducts;
}