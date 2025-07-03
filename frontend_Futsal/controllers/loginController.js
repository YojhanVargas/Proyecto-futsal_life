document.addEventListener("DOMContentLoaded", function() {
    // --- SECCIÓN 1: DECLARACIÓN DE VARIABLES DEL DOM ---
    const contenedor_login_register = document.querySelector(".contenedor__login-register");
    const caja_trasera_login = document.querySelector(".caja__trasera-login");
    const caja_trasera_register = document.querySelector(".caja__trasera-register");
    const formulario_login = document.getElementById("login-form");
    const formulario_register = document.getElementById("register-form");
    const loginErrorMessageDiv = document.getElementById('login-error-message');
    const registerErrorMessageDiv = document.getElementById('register-error-message');
    const btn_iniciar_sesion = document.getElementById("btn__iniciar-sesion");
    const btn_registrarse = document.getElementById("btn__registrarse");
    const rolSelector = document.getElementById('register-rol');
    const categoriaContainer = document.getElementById('categoria-container');
    const categoriaSelector = document.getElementById('register-categoria');
    // --- SECCIÓN 2: LÓGICA DE ANIMACIÓN (MOSTRAR/OCULTAR FORMULARIOS) ---
    function iniciarSesionVista() {
        if (window.innerWidth > 850) {
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "10px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.opacity = "1";
            caja_trasera_login.style.opacity = "0";
        } else {
            formulario_login.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_register.style.display = "none";
            caja_trasera_register.style.display = "block";
            caja_trasera_login.style.display = "none";
        }
    }
    function registerVista() {
        if (window.innerWidth > 850) {
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "410px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.opacity = "0";
            caja_trasera_login.style.opacity = "1";
        } else {
            formulario_register.style.display = "block";
            contenedor_login_register.style.left = "0px";
            formulario_login.style.display = "none";
            caja_trasera_register.style.display = "none";
            caja_trasera_login.style.display = "block";
            caja_trasera_login.style.opacity = "1";
        }
    }
    function anchoPage() {
        if (window.innerWidth > 850) {
            caja_trasera_register.style.display = "block";
            caja_trasera_login.style.display = "block";
        } else {
            caja_trasera_register.style.display = "block";
            caja_trasera_register.style.opacity = "1";
            caja_trasera_login.style.display = "none";
            formulario_login.style.display = "block";
            formulario_register.style.display = "none";
            contenedor_login_register.style.left = "0px";
        }
    }
    btn_iniciar_sesion.addEventListener("click", iniciarSesionVista);
    btn_registrarse.addEventListener("click", registerVista);
    window.addEventListener("resize", anchoPage);
    anchoPage();
    iniciarSesionVista();
    // --- SECCIÓN 3: LÓGICA CONDICIONAL DE CATEGORÍA ---
    if (rolSelector) {
        rolSelector.addEventListener('change', function() {
            const selectedRol = this.value;
            if (selectedRol === '2') { // Solo para Jugador
                categoriaContainer.style.display = 'block';
                categoriaSelector.required = true;
            } else {
                categoriaContainer.style.display = 'none';
                categoriaSelector.required = false;
                categoriaSelector.value = '';
            }
        });
    }
    // --- SECCIÓN 4: VALIDACIÓN DE CONTRASEÑA EN TIEMPO REAL ---
    const passwordInput = document.getElementById('register-password');
    if (passwordInput) {
        const checklist = {
            length: document.getElementById('req-length'),
            upper: document.getElementById('req-upper'),
            lower: document.getElementById('req-lower'),
            number: document.getElementById('req-number'),
            special: document.getElementById('req-special')
        };
        function validateRequirement(element, condition) {
            if (!element) return;
            const icon = element.querySelector('span');
            if (condition) {
                element.classList.remove('invalid');
                element.classList.add('valid');
                icon.textContent = '✅';
            } else {
                element.classList.remove('valid');
                element.classList.add('invalid');
                icon.textContent = '❌';
            }
        }
        passwordInput.addEventListener('input', function() {
            const pass = passwordInput.value;
            validateRequirement(checklist.length, pass.length >= 8);
            validateRequirement(checklist.upper, /[A-Z]/.test(pass));
            validateRequirement(checklist.lower, /[a-z]/.test(pass));
            validateRequirement(checklist.number, /[0-9]/.test(pass));
            validateRequirement(checklist.special, /[@$!%*?&_-]/.test(pass));
        });
    }
    // --- SECCIÓN 5: MANEJO DE ENVÍO DE FORMULARIOS ---
    // -- LOGIN --
    if (formulario_login) {
        formulario_login.addEventListener('submit', async function(e) {
            e.preventDefault();
            loginErrorMessageDiv.textContent = '';
            const Correo = document.getElementById('login-email').value;
            const Contraseña = document.getElementById('login-password').value;
            try {
                const response = await fetch('http://localhost:3000/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ Correo, Contraseña })
                });
                const data = await response.json();
                if (response.ok) {
                    Swal.fire({ icon: 'success', title: '¡Éxito!', text: data.mensaje });
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('idUsuario', data.usuario.id);
                    localStorage.setItem('userRole', data.usuario.rol === 1 ? 'entrenador' : 'jugador');
                    window.location.href = data.usuario.rol === 1 ? 'indexEntrenador.html' : 'indexJugador.html';
                } else {
                    loginErrorMessageDiv.textContent = data.mensaje;
                }
            } catch (error) {
                loginErrorMessageDiv.textContent = 'Error de conexión con el servidor.';
            }
        });
    }
    // -- REGISTRO --
    if (formulario_register) {
        formulario_register.addEventListener('submit', async function(e) {
            e.preventDefault();
            registerErrorMessageDiv.innerHTML = '';

            const Contraseña = document.getElementById('register-password').value;
            const ConfirmarContraseña = document.getElementById('register-confirm-password').value;
            const errors = [];

            // Validaciones antes de enviar
            if (Contraseña !== ConfirmarContraseña) {
                errors.push('Las contraseñas no coinciden.');
            }
            if (Contraseña.length < 8 || !/[A-Z]/.test(Contraseña) || !/[a-z]/.test(Contraseña) || !/[0-9]/.test(Contraseña) || !/[@$!%*?&_]/.test(Contraseña)) {
                errors.push('La contraseña no cumple con todos los requisitos de seguridad.');
            }

            if (errors.length > 0) {
                registerErrorMessageDiv.innerHTML = errors.join('<br>');
                return;
            }

            const Nombre = document.getElementById('register-nombre').value;
            const Apellido = document.getElementById('register-apellido').value;
            const Correo = document.getElementById('register-email').value;
            const Direccion = document.getElementById('register-direccion').value;
            const Telefono = document.getElementById('register-telefono').value;
            const Id_Rol = rolSelector.value;
            const datosAEnviar = { Nombre, Apellido, Correo, Direccion, Telefono, Contraseña, Id_Rol };

            if (categoriaContainer.style.display === 'block') {
                const Id_Categoria = categoriaSelector.value;
                if (!Id_Categoria) {
                    registerErrorMessageDiv.textContent = 'Por favor, selecciona una categoría.';
                    return;
                }
                datosAEnviar.Id_Categoria = Id_Categoria;
            }

            try {
                const response = await fetch('http://localhost:3000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAEnviar)
                });
                const data = await response.json();
                if (response.ok) {
                    Swal.fire({ icon: 'success', title: '¡Registro Exitoso!', text: data.mensaje })
                        .then(() => {
                            iniciarSesionVista();
                            formulario_register.reset(); // Limpia el formulario
                        });
                } else {
                    registerErrorMessageDiv.textContent = data.mensaje;
                }
            } catch (error) {
                registerErrorMessageDiv.textContent = 'Error de conexión con el servidor.';
            }
        });
    }
});
// --- FUNCIÓN GLOBAL ---
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
    } else {
        input.type = 'password';
    }
}