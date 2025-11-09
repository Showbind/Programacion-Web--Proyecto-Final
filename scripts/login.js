

function loginFormValidation() {
    const form = document.querySelector('.signForm')
    const passwordInput = document.getElementById('password_create')

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {

        // Validar formulario
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
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

// EJECUCIÓN
loginFormValidation();