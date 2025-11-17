
function signInFormValidation() {
    const form = document.querySelector('.signForm')
    const passwordInput = document.getElementById('password_create')
    const repeatPasswordInput = document.getElementById('password_repeat')
    const userNameInput = document.getElementById('username_create')

    const userNameRegex = /^.{4,}$/ // Mínimo 4 caracteres

    // Regex contraseña: mínimo 8 caracteres, una letra, un número y un carácter especial (#?!@$%^&*-)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/ // Copy-Paste de una pagina web

    // Al hacer "submit" en el form
    form.addEventListener('submit', event => {
        let isPasswordValid = true;
        let isRepeatPasswordValid = true;

        // Validar la contraseña
        if (!passwordRegex.test(passwordInput.value)) {
            passwordInput.setCustomValidity('La contraseña no cumple los requisitos.'); // String con texto = Error (contraseña inválida) 
            isPasswordValid = false;
        } else {
            passwordInput.setCustomValidity(''); // String vacío = No hay Error (Contraseña correcta); NO CAMBIAR el str
        }

        // Validar que las contraseñas coincidan
        if (passwordInput.value !== repeatPasswordInput.value) {
            isRepeatPasswordValid = false;
            repeatPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
        }

        // Validar formulario
        if (!form.checkValidity() || !isPasswordValid || !isRepeatPasswordValid) {
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

    // Validar repetir contraseña mientras el usuario escribe
    repeatPasswordInput.addEventListener('input', () => {
        // Eliminar espacios
        let repeatPasswordSpacesRemoved = repeatPasswordInput.value.replace(/\s/g, '');

        //Bloquear espacios
        if (repeatPasswordSpacesRemoved != repeatPasswordInput.value) {
            repeatPasswordInput.value = repeatPasswordSpacesRemoved
        }

        // Comparar las contraseñas
        if (passwordInput.value === repeatPasswordInput.value) {
            repeatPasswordInput.setCustomValidity('');
        }
        else{
            repeatPasswordInput.setCustomValidity('Las contraseñas no coinciden.');
        }
    });

    // Validar nombre del usuario mientras el usuario escribe
    userNameInput.addEventListener('input', () => {
        // Eliminar espacios
        let userNameSpacesRemoved = userNameInput.value.replace(/\s/g, '');

        //Bloquear espacios
        if (userNameSpacesRemoved != userNameInput.value) {
            userNameInput.value = userNameSpacesRemoved
        }

        // Comparar nombre del usuario con el Regex
        if (userNameRegex.test(userNameInput.value)) {
            userNameInput.setCustomValidity('');
        }
        else {
            userNameInput.setCustomValidity('El nombre de usuario no cumple los requisitos.');
        }
    });
}

// EJECUCIÓN
signInFormValidation();