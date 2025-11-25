
async function editProduct() {
    // Coger token del local storage
    let userDataInLocalStorage = localStorage.getItem("userData");

    if (!userDataInLocalStorage) {
        console.error("Error: Acceso no autorizado");
        window.location.href = "login.html";
    };

    const userData = JSON.parse(userDataInLocalStorage);
    const userToken = userData["access_token"];
    const userId = userData["email"];

    // Coger id del producto de los parametros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    // Obtener datos del producto antes de editarlo 
    const oldProductData = await fetchGetOneProduct(userToken, productId)
    const productName = document.getElementById("product_name");
    const productPrice = document.getElementById("product_price");
    const productImage = document.getElementById("image_url");
    const productCategory = document.getElementById("product_category");

    if (oldProductData) {
        // Usar datos del producto como placeholder
        productName.placeholder = oldProductData.name;
        productPrice.placeholder = oldProductData.price;
        productImage.placeholder = "http://image.com"; // placheholder genérico (poner la url real queda feo)
    }

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

            // Si los campos estan vacios -> usar datos por defecto
            if (productName.value.trim() === '') { productName.value = oldProductData.name }
            if (productPrice.value.trim() === '') { productPrice.value = oldProductData.price }
            if (productImage.value.trim() === '') { productImage.value = oldProductData.image }

            const productData = {
                name: productName.value.trim(),
                price: parseInt(productPrice.value.trim()),
                category: productCategory.value,
                image: productImage.value.trim(),
                idUser: userId,
            };

            fetchEditProduct(userToken, productId, productData)
                .then(ResponseOk => {
                    if (ResponseOk) {
                        formStatusMsg.className = "success_msg"
                        formStatusMsg.innerText = "Producto editado con éxito";

                        setTimeout(() => {
                            window.location.href = "my_products.html";
                        }, 1500);
                    }
                    else{
                        console.error("Error desconocido al editar el producto");
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
}

async function fetchGetOneProduct(authToken, productId) {
    try {
        const response = await fetch(`https://practicaprogramacionweb.duckdns.org/products/${productId}`, {
            method: 'GET',
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
            else if (response.status == 500) { // Id del producto incorrecto
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
        return true;
    }
    catch (error) {
        console.error("Error: ", error);
        return false;
    };
}