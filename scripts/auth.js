
// ----------------------------------------------------------

//                  INICIAR SESIÓN

// ----------------------------------------------------------

function loginFormValidation() {
    const form = document.querySelector('.signForm')
    const passwordInput = document.getElementById('password_create')

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {
        event.preventDefault();
        event.stopPropagation();

        // Validar formulario
        if (form.checkValidity()) {
            // Enviar datos al servidor
                // Si datos usuario OK -> redirigir a la pagina principal 
                // Si datos usuario INCORRECTOS -> Mostrar error en el form
        }

        // Clase validación datos Bootstrap
        form.classList.add('was-validated');
    }, false)

    // Bloquear el uso de espacios en la contraseña
    passwordInput.addEventListener('input', () => {
        let passwordRemoveSpaces = passwordInput.value.replace(/\s/g, '');
        passwordInput.classList.remove('is-valid')

        if (passwordRemoveSpaces != passwordInput.value) {
            passwordInput.value = passwordRemoveSpaces
        }
    });
}

// ----------------------------------------------------------

//                  CREAR CUENTA

// ----------------------------------------------------------

function signInFormValidation() {

    const form = document.querySelector('.signForm');

    // Datos usuario del formulario
    const userNameInput = document.getElementById('username');
    const emailInput = document.getElementById('email')
    const passwordInput = document.getElementById('password');
    const repeatPasswordInput = document.getElementById('password_repeat');
    const coordinatesInput = document.getElementById('coordinates');

    // Regex nombre de usuario: mínimo 4 caracteres
    const userNameRegex = /^.{4,}$/;

    // Regex contraseña: mínimo 8 caracteres, una letra, un número y un carácter especial (#?!@$%^&*-)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/;

    // Regex coordenadas: formato decimal "latitud, longitud" (e.g: "40.4168, -3.7038")
    const coordinatesRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;


    // Al hacer "SUBMIT" en el form
    form.addEventListener('submit', event => {
        
        // Cancelar la recarga de pagina para manejar el "SUBMIT" 
        event.preventDefault();
        event.stopPropagation();

        // Validar formulario
        if (form.checkValidity()) { // EXITO
            
            // JSON a enviar en el POST
            const userData = {
                username: userNameInput.value,
                email: emailInput.value,
                password: passwordInput.value,
                coordinates: coordinatesInput.value
            };
            
            // hacer un fetch
            // SI HTTP 200 (OK)   -> usuario creado con exito -> redirigir a la pagina de productos 
            // SI usuario existe -> mostrar en el form

            // Redirigir a la pagina principal
            window.location.replace("/");
        }
        else { // DATOS NO VÁLIDOS

            // Clase validación datos Bootstrap
            form.classList.add('was-validated');
        }

    }, false)

    // Validar contraseña 
    passwordInput.addEventListener('input', () => {

        removeInputSpaces(passwordInput);

        let errorMsg = 'La contraseña no cumple los requisitos.';
        validateInputValue(passwordInput, passwordRegex, errorMsg);
    });

    // Verificar que las contraseñas coinciden 
    repeatPasswordInput.addEventListener('input', () => {

        removeInputSpaces(repeatPasswordInput)

        if (passwordInput.value === repeatPasswordInput.value) {
            repeatPasswordInput.setCustomValidity('');
        }
        else {
            repeatPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
        }
    });

    // Validar nombre del usuario 
    userNameInput.addEventListener('input', () => {

        removeInputSpaces(userNameInput);

        let errorMsg = 'El nombre del usuario no cumple los requisitos.';
        validateInputValue(userNameInput, userNameRegex, errorMsg);
    });

    // Validar coordenadas 
    coordinatesInput.addEventListener('input', () => {

        let errorMsg = 'Coordenadas no válidas. Formato: "latitud, longitud" (e.g: "40.4168, -3.7038")';
        validateInputValue(coordinatesInput, coordinatesRegex, errorMsg);
    });
}

// ----------------------------------------------------------

//                  FUNCIONES AUXILIARES

// ----------------------------------------------------------

// Elimina y bloquea los espacios dentro del input
function removeInputSpaces(inputElement) {
    inputElement.value = inputElement.value.replace(/\s/g, '');
}

// Valida un input y muestra un error en el formulario si no es válido 
function validateInputValue(inputElement, regex, errorMsg = "Datos no válidos.") {
    if (regex.test(inputElement.value)) {
        inputElement.setCustomValidity('');
    }
    else {
        inputElement.setCustomValidity(errorMsg);
    }
}
