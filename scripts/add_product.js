import { logUser } from "./products.js";
export { addProduct };

async function addProduct() {

    const userData = logUser();
    const userToken = userData["access_token"];
    const userId = userData["email"];

    // Obtener datos del producto
    const productName = document.getElementById("product_name");
    const productPrice = document.getElementById("product_price");
    const productImage = document.getElementById("image_url");
    const productCategory = document.getElementById("product_category");

    const form = document.querySelector('.editForm');
    const formStatusMsg = document.getElementById("form_status_message");

    // Regex validación
    const priceRegex = /^\d+$/;

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {

        // Resetear mensaje de error servidor
        formStatusMsg.innerText = "";

        // Cancelar la recarga de pagina para manejar el "SUBMIT" 
        event.preventDefault();
        event.stopPropagation();

        // Validar formulario
        if (form.checkValidity()) {
            const productData = {
                name: productName.value.trim(),
                price: parseInt(productPrice.value.trim()),
                category: productCategory.value,
                image: productImage.value.trim(),
                idUser: userId,
            };

            fetchCreateProduct(userToken, productData)
                .then(ResponseOk => {
                    if (ResponseOk) {
                        formStatusMsg.className = "success_msg"
                        formStatusMsg.innerText = "Producto creado con éxito";

                        setTimeout(() => {
                            window.location.href = "my_products.html";
                        }, 1500);
                    }
                    else {
                        formStatusMsg.className = "error_msg"
                        formStatusMsg.innerText = "Hay campos vacíos.";
                    }
                });

        }
        else { // DATOS NO VÁLIDOS

            // Clase validación datos Bootstrap
            form.classList.add('was-validated');
        }
    }, false);

    // Validar input precio (un número positivo con 2 decimales maximo)
    productPrice.addEventListener('input', () => {

        let errorMsg = 'Número no válido';

        if (priceRegex.test(productPrice.value) || productPrice.value.trim() === '') {
            productPrice.setCustomValidity('');
        }
        else {
            productPrice.setCustomValidity(errorMsg);
        }
    });

    productName.addEventListener('input', () => {
        if (productName.value.trim() === '') { productName.setCustomValidity('El producto no puede estar vacío.') }
        else { productName.setCustomValidity('') };
    });

    productImage.addEventListener('input', () => {
        if (productName.value.trim() === '') { productName.setCustomValidity('La URL de la Imagen no puede estar vacía.') }
        else { productName.setCustomValidity('') };
    });

}

async function fetchCreateProduct(authToken, curlBody) {
    try {
        const response = await fetch(`https://practicaprogramacionweb.duckdns.org/products/`, {
            method: 'POST',
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
            else if (response.status == 400) { // Datos invalidos
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