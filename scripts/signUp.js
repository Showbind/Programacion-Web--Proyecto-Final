
function signInFormValidation() {
    const form = document.querySelector('.signForm')
    const passwordInput = document.getElementById('password_create')
    const repeatPasswordInput = document.getElementById('password_repeat')
    const userNameInput = document.getElementById('username_create')
    const coordinatesInput = document.getElementById('coordinates')

    // Regex nombre de usuario: mínimo 4 caracteres
    const userNameRegex = /^.{4,}$/

    // Regex contraseña: mínimo 8 caracteres, una letra, un número y un carácter especial (#?!@$%^&*-)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/

    // Regex coordenadas: formato decimal "latitud, longitud" (e.g: "40.4168, -3.7038")
    const coordinatesRegex = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {

        // Validar contraseña, nombre de usuario y coordenadas
        validateInputValue(passwordInput, passwordRegex, 'La contraseña no cumple los requisitos.');
        validateInputValue(userNameInput, userNameRegex, 'El nombre del usuario no cumple los requisitos.');
        validateInputValue(coordinatesInput, coordinatesRegex, 'Coordenadas no válidas. Formato: "latitud, longitud" (e.g: "40.4168, -3.7038")');

        // Validar que las contraseñas coincidan
        if (passwordInput.value !== repeatPasswordInput.value) {
            repeatPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
        }

        // Validar formulario
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Clase validación datos Bootstrap
        form.classList.add('was-validated');
    }, false)

    // Validar contraseña mientras el usuario escribe
    passwordInput.addEventListener('input', () => {

        removeInputSpaces(passwordInput);

        let errorMsg = 'La contraseña no cumple los requisitos.';
        validateInputValue(passwordInput, passwordRegex, errorMsg);
    });

    // Validar repetir contraseña mientras el usuario escribe
    repeatPasswordInput.addEventListener('input', () => {

        removeInputSpaces(repeatPasswordInput)

        // Comparar las contraseñas
        if (passwordInput.value === repeatPasswordInput.value) {
            repeatPasswordInput.setCustomValidity('');
        }
        else {
            repeatPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
        }
    });

    // Validar nombre del usuario mientras el usuario escribe
    userNameInput.addEventListener('input', () => {

        removeInputSpaces(userNameInput);

        let errorMsg = 'El nombre del usuario no cumple los requisitos.';
        validateInputValue(userNameInput, userNameRegex, errorMsg);
    });

    // Validar coordenadas mientras el usuario escribe
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
function validateInputValue(inputElement, regex, errorMsg) {
    if (regex.test(inputElement.value)) {
        inputElement.setCustomValidity('');
    }
    else {
        inputElement.setCustomValidity(errorMsg);
    }
}


// EJECUCIÓN
signInFormValidation();