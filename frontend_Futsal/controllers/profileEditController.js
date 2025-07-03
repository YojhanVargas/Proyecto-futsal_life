document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  if (!token) return mostrarNotificacion("No hay sesión activa", true);

  const notificationDiv = document.getElementById("notification");

  function mostrarNotificacion(mensaje, esError = false) {
    notificationDiv.textContent = mensaje;
    notificationDiv.className = "notification show" + (esError ? " error" : "");
    setTimeout(() => {
      notificationDiv.classList.remove("show");
    }, 3000);
  }

  const profilePic = document.getElementById("profile-pic");
  const nameSpan = document.getElementById("profile-name");
  const emailSpan = document.getElementById("profile-email");
  const phoneSpan = document.getElementById("profile-phone");
  const addressSpan = document.getElementById("profile-address");

  const editContainer = document.getElementById("edit-profile-container");
  const viewContainer = document.getElementById("profile-container");
  const editBtn = document.getElementById("edit-profile-button");

  const form = document.getElementById("edit-profile-form");

  const inputName = document.getElementById("name");
  const inputEmail = document.getElementById("email");
  const inputPhone = document.getElementById("phone");
  const inputAddress = document.getElementById("address");
  const inputFoto = document.getElementById("profile-pic-input");

  async function cargarPerfil() {
    try {
      const res = await fetch("http://localhost:3000/api/perfil", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al cargar el perfil");

      const data = await res.json();

      nameSpan.textContent = data.Nombre;
      emailSpan.textContent = data.correo;
      phoneSpan.textContent = data.Telefono;
      addressSpan.textContent = data.Direccion;

      inputName.value = data.Nombre;
      inputEmail.value = data.correo;
      inputPhone.value = data.Telefono;
      inputAddress.value = data.Direccion;

      if (data.Foto_Perfil) {
        profilePic.src = `http://localhost:3000/uploads/perfiles/${data.Foto_Perfil}`;
      } else {
        profilePic.src = "default-profile.png";
      }

    } catch (error) {
      console.error("❌ Error al cargar perfil:", error);
      mostrarNotificacion("No se pudo cargar el perfil", true);
    }
  }

  editBtn.addEventListener("click", () => {
    viewContainer.style.display = "none";
    editContainer.style.display = "block";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const updateRes = await fetch("http://localhost:3000/api/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          Nombre: inputName.value,
          Direccion: inputAddress.value,
          Telefono: inputPhone.value,
          Correo: inputEmail.value
        })
      });

      const updateJson = await updateRes.json();
      if (!updateRes.ok) throw new Error(updateJson.mensaje);

      mostrarNotificacion("Perfil actualizado correctamente");

      if (inputFoto.files.length > 0) {
        const formData = new FormData();
        formData.append("foto", inputFoto.files[0]);

        const fotoRes = await fetch("http://localhost:3000/api/perfil/foto", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        const fotoJson = await fotoRes.json();
        if (!fotoRes.ok) throw new Error(fotoJson.mensaje);

        mostrarNotificacion("Imagen actualizada");
      }

      await cargarPerfil();
      editContainer.style.display = "none";
      viewContainer.style.display = "block";

    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      mostrarNotificacion("Error al actualizar perfil: " + error.message, true);
    }
  });

  cargarPerfil();
});
