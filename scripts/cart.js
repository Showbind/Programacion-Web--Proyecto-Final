import { loadUserSession } from "./products.js";
import { fetchGetOneProduct } from "./edit_product.js";
export { loadCart };

async function loadCart() {
    // Cargar datos del usuario
    const userData = loadUserSession();
    const userToken = userData["access_token"];

    await displayCartProducts(userToken);
}

// Cargar productos del carrito en la tabla
async function displayCartProducts(userToken) {

    // Elementos HTML
    let productTemplate = document.getElementById("product_table_row_template");
    const tableDataDiv = document.querySelector("#cart_table_data");
    tableDataDiv.innerHTML = "";

    const emptyCartMessage = document.createElement("p");
    const buyDiv = document.querySelector(".totalPriceDiv");
    const price = document.getElementById("total_price");
    const payButton = document.getElementById("pay_button");

    const tableDiv = document.querySelector(".cartProductsDiv");
    const table = document.querySelector(".table");
    
    // Productos en el carrito (LocalStorage)
    const shoppingCartKey = "shoppingCart";
    let shoppingCart = JSON.parse(localStorage.getItem(shoppingCartKey)) || { "products": [] };

    // Carrito vacío
    if (shoppingCart["products"].length == 0) {

        // Eliminar tabla
        tableDiv.removeChild(table);

        // Mensaje de carrito vacío  
        emptyCartMessage.textContent = "El carrito está vacío.";
        emptyCartMessage.id = "empty_cart_message";
        tableDiv.appendChild(emptyCartMessage);

        buyDiv.textContent = "";
    }
    else {

        let totalPrice = 0;

        // Crear una fila por cada producto en el carrito
        for (const id of shoppingCart["products"]) {
            let productContent = productTemplate.content.cloneNode(true);
            let removeProductButton = productContent.querySelector(".remove_from_cart_button");
            const item = await fetchGetOneProduct(userToken, id);

            // Info del Producto
            productContent.querySelector(".product_image").src = item["image"];
            productContent.querySelector(".product_name").textContent = item["name"];
            productContent.querySelector(".product_category").textContent = `Estado: ${item["category"]}`;
            productContent.querySelector(".product_price").textContent = `${item["price"]} €`;

            totalPrice += parseInt(item["price"]);
            tableDataDiv.appendChild(productContent);

            removeProductButton.addEventListener("click", () => {
                // Actualizar LocalStorage
                shoppingCart["products"] = shoppingCart["products"].filter(item_id => item_id != id);
                localStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));
                
                loadCart();
            })
        };

        price.textContent = `Total: ${totalPrice} €`;

        payButton.addEventListener("click", () => {
            // Eliminar tabla
            const table = document.querySelector(".table");
            tableDiv.removeChild(table);

            // Fetch al Servidor
            let shoppingCart = JSON.parse(localStorage.getItem(shoppingCartKey)) || { "products": [] };
            for (const id of shoppingCart["products"]) { fetchBuyProduct(userToken, id) }

            // Borrar Carrito (LocalStorage)
            shoppingCart["products"] = [];
            localStorage.setItem(shoppingCartKey, JSON.stringify(shoppingCart));

            // Mensaje de Compra Realizada
            emptyCartMessage.textContent = "Pedido Confirmado. Gracias por tu Compra !";
            emptyCartMessage.id = "empty_cart_message";
            tableDiv.appendChild(emptyCartMessage);

            buyDiv.textContent = "";
        });
    }
}

async function fetchBuyProduct(authToken, productId) {
    try {
        const response = await fetch(`https://practicaprogramacionweb.duckdns.org/products/buy/${productId}`, {
            method: 'POST',
            headers: {
                "accept": "*/*",
                "Authorization": `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            if (response.status == 401) { // Token no válido o caducado
                localStorage.clear();
                window.location.href = "login.html";
            }
            else if (response.status == 500) { // ID del Producto Invalido
                console.error(`Error ${response.status}`)
            }

            return false;
        };

        // HTTP OK
        return true;
    }
    catch (error) {
        console.error("Error: ", error);
        return false;
    };
}