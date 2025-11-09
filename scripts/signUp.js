

function signInFormValidation() {
    const form = document.querySelector('.signForm')
    const passwordInput = document.getElementById('password_create')

    // Regex contraseña: mínimo 8 caracteres, una letra, un número y un carácter especial (#?!@$%^&*-)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {
        let isPasswordValid = true;

        // Validar la contraseña
        if (!passwordRegex.test(passwordInput.value)) {
            passwordInput.setCustomValidity('La contraseña no cumple los requisitos.'); // String con texto = Error (contraseña inválida) 
            isPasswordValid = false;
        } else {
            passwordInput.setCustomValidity(''); // String vacío = No hay Error (Contraseña correcta); NO CAMBIAR el str
        }

        // Validar formulario
        if (!form.checkValidity() || !isPasswordValid) {
            event.preventDefault();
            event.stopPropagation();
        }

        // Clase validación datos Bootstrap
        form.classList.add('was-validated');
    }, false)

    // Validar contraseña mientras el usuario escribe
    passwordInput.addEventListener('input', () => {

        // Eliminar espacios
        let passwordSpacesRemoved = passwordInput.value.replace(/\s/g, '');

        //Bloquear espacios
        if (passwordSpacesRemoved != passwordInput.value) {
            passwordInput.value = passwordSpacesRemoved
        }

        // Comparar contraseña con el Regex
        if (passwordRegex.test(passwordInput.value)) {
            passwordInput.setCustomValidity('');
        }
        else {
            passwordInput.setCustomValidity('La contraseña no cumple los requisitos.');
        }
    });
}

// EJECUCIÓN
signInFormValidation();