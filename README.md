# Futsal Life ⚽

![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-9B2C3E?style=for-the-badge&logo=ejs&logoColor=white)

Bienvenido a Futsal Life, una aplicación web completa construida con Node.js y Express para gestionar y explorar el mundo del futsal. La plataforma permite a los usuarios registrarse, iniciar sesión y administrar perfiles, así como interactuar con "productos" que pueden representar jugadores, equipos o artículos deportivos.

## Tabla de Contenidos

- [Funcionalidades Principales](#funcionalidades-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Instalación y Puesta en Marcha](#instalación-y-puesta-en-marcha)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Contacto](#contacto)

## Funcionalidades Principales

-   **Autenticación de Usuarios:** Sistema completo de registro, inicio de sesión y cierre de sesión utilizando sesiones y JWT.
-   **Seguridad de Contraseñas:** Hashing de contraseñas con `bcryptjs` para un almacenamiento seguro.
-   **Gestión de Perfiles:** Los usuarios pueden ver y administrar la información de su perfil.
-   **Operaciones CRUD:** Funcionalidad completa para Crear, Leer, Actualizar y Eliminar "productos".
-   **Validación de Formularios:** Uso de `express-validator` para asegurar que los datos enviados por el usuario sean válidos y seguros.
-   **Subida de Archivos:** Implementación de `multer` para manejar la subida de imágenes (ej. avatares de perfil, imágenes de productos).
-   **Notificaciones por Email:** Integración con `nodemailer` para el envío de correos electrónicos (ej. bienvenida, recuperación de contraseña).

## Tecnologías Utilizadas

-   **Backend:** Node.js, Express.js
-   **Motor de Plantillas:** EJS (Embedded JavaScript) para renderizar vistas del lado del servidor.
-   **Base de Datos:** MySQL con el driver `mysql2`.
-   **Autenticación:** JSON Web Tokens (`jsonwebtoken`), `express-session`, `cookie-parser`.
-   **Middleware:** `cors`, `multer`, `express-validator`.
-   **Variables de Entorno:** `dotenv`.
-   **Desarrollo:** `nodemon` para reinicio automático del servidor.

## Instalación y Puesta en Marcha

Sigue estos pasos para obtener una copia local del proyecto y ponerla en funcionamiento.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:
-   [Node.js](https://nodejs.org/) (versión 14 o superior)
-   [npm](https://www.npmjs.com/) (generalmente viene con Node.js)
-   Un servidor de base de datos [MySQL](https://www.mysql.com/) (como XAMPP, WAMP, o una instalación nativa).

### Pasos de Instalación

1.  **Clona el repositorio:**
    ```sh
    git clone [https://github.com/YojhanVargas/Proyecto-futsal_life.git](https://github.com/YojhanVargas/Proyecto-futsal_life.git)
    ```

2.  **Navega al directorio del backend:**
    ```sh
    cd Proyecto-futsal_life/backend_futsal
    ```

3.  **Instala las dependencias del proyecto:**
    ```sh
    npm install
    npm install swagger-ui-express
    npm install multer
    ```

4.  **Configura la Base de Datos:**
    -   Abre tu cliente de MySQL y crea una nueva base de datos. Puedes llamarla `futsal_life`.
    -   Importa la estructura de la base de datos y los datos iniciales usando el archivo `database/futsal_life.sql`.
    -   CREATE DATABASE IF NOT EXISTS `futsal` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `futsal`;

-- Volcando estructura para tabla futsal.acudiente
CREATE TABLE IF NOT EXISTS `acudiente` (
  `Id_Acudiente` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Jugador` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Acudiente`),
  KEY `Id_Jugador` (`Id_Jugador`),
  CONSTRAINT `acudiente_ibfk_1` FOREIGN KEY (`Id_Jugador`) REFERENCES `jugador` (`Id_Jugador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.asistencia
CREATE TABLE IF NOT EXISTS `asistencia` (
  `Id_Asistencia` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int(11) DEFAULT NULL,
  `Id_Partido` int(11) DEFAULT NULL,
  `Asistio` tinyint(1) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  PRIMARY KEY (`Id_Asistencia`),
  UNIQUE KEY `asistencia_unica` (`Id_Usuario`,`Fecha`),
  KEY `Id_Partido` (`Id_Partido`),
  CONSTRAINT `asistencia_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `asistencia_ibfk_2` FOREIGN KEY (`Id_Partido`) REFERENCES `partido` (`Id_Partido`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.categoria
CREATE TABLE IF NOT EXISTS `categoria` (
  `Id_Categoria` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_Categoria` varchar(50) NOT NULL,
  PRIMARY KEY (`Id_Categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando datos para la tabla futsal.categoria: ~4 rows (aproximadamente)
INSERT INTO `categoria` (`Id_Categoria`, `Nombre_Categoria`) VALUES
	(1, 'Iniciación'),
	(2, 'Prejuvenil'),
	(3, 'Juvenil'),
	(4, 'Única/Mayores');

-- Volcando estructura para tabla futsal.convocatoria
CREATE TABLE IF NOT EXISTS `convocatoria` (
  `Id_Convocatoria` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Partido` int(11) DEFAULT NULL,
  `Id_Jugador` int(11) DEFAULT NULL,
  `Respuesta` enum('Sí','No','Pendiente') DEFAULT 'Pendiente',
  PRIMARY KEY (`Id_Convocatoria`),
  KEY `Id_Partido` (`Id_Partido`),
  KEY `Id_Jugador` (`Id_Jugador`),
  CONSTRAINT `convocatoria_ibfk_1` FOREIGN KEY (`Id_Partido`) REFERENCES `partido` (`Id_Partido`),
  CONSTRAINT `convocatoria_ibfk_2` FOREIGN KEY (`Id_Jugador`) REFERENCES `jugador` (`Id_Jugador`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.entrenador
CREATE TABLE IF NOT EXISTS `entrenador` (
  `Id_Entrenador` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Equipo` int(11) DEFAULT NULL,
  `Id_Torneo` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Entrenador`),
  KEY `Id_Equipo` (`Id_Equipo`),
  KEY `Id_Torneo` (`Id_Torneo`),
  CONSTRAINT `entrenador_ibfk_1` FOREIGN KEY (`Id_Equipo`) REFERENCES `equipo` (`Id_Equipo`),
  CONSTRAINT `entrenador_ibfk_2` FOREIGN KEY (`Id_Torneo`) REFERENCES `torneo` (`Id_Torneo`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.equipo
CREATE TABLE IF NOT EXISTS `equipo` (
  `Id_Equipo` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Categoria` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id_Equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Volcando estructura para tabla futsal.jugador
CREATE TABLE IF NOT EXISTS `jugador` (
  `Id_Jugador` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Usuario` int(11) DEFAULT NULL,
  `Id_Equipo` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Jugador`),
  KEY `Id_Usuario` (`Id_Usuario`),
  KEY `Id_Equipo` (`Id_Equipo`),
  CONSTRAINT `jugador_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `jugador_ibfk_2` FOREIGN KEY (`Id_Equipo`) REFERENCES `equipo` (`Id_Equipo`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.mensaje
CREATE TABLE IF NOT EXISTS `mensaje` (
  `Id_Mensaje` int(11) NOT NULL AUTO_INCREMENT,
  `Id_Emisor` int(11) DEFAULT NULL,
  `Id_Receptor` int(11) DEFAULT NULL,
  `Contenido` text DEFAULT NULL,
  `FechaEnvio` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`Id_Mensaje`),
  KEY `Id_Emisor` (`Id_Emisor`),
  KEY `Id_Receptor` (`Id_Receptor`),
  CONSTRAINT `mensaje_ibfk_1` FOREIGN KEY (`Id_Emisor`) REFERENCES `usuario` (`Id_Usuario`),
  CONSTRAINT `mensaje_ibfk_2` FOREIGN KEY (`Id_Receptor`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Volcando estructura para tabla futsal.partido
CREATE TABLE IF NOT EXISTS `partido` (
  `Id_Partido` int(11) NOT NULL AUTO_INCREMENT,
  `Fecha` date DEFAULT NULL,
  `Hora` time DEFAULT NULL,
  `Lugar` varchar(255) DEFAULT NULL,
  `Id_Entrenador` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Partido`),
  KEY `Id_Entrenador` (`Id_Entrenador`),
  CONSTRAINT `partido_ibfk_1` FOREIGN KEY (`Id_Entrenador`) REFERENCES `entrenador` (`Id_Entrenador`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Volcando estructura para tabla futsal.perfil
CREATE TABLE IF NOT EXISTS `perfil` (
  `Id_Perfil` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) DEFAULT NULL,
  `Direccion` varchar(500) DEFAULT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `Id_Usuario` int(11) DEFAULT NULL,
  `Foto_Perfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`Id_Perfil`),
  KEY `Id_Usuario` (`Id_Usuario`),
  CONSTRAINT `perfil_ibfk_1` FOREIGN KEY (`Id_Usuario`) REFERENCES `usuario` (`Id_Usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.resultados
CREATE TABLE IF NOT EXISTS `resultados` (
  `Id_Resultados` int(11) NOT NULL AUTO_INCREMENT,
  `Goles` varchar(255) DEFAULT NULL,
  `Tarjetas` varchar(255) DEFAULT NULL,
  `Id_Partido` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Resultados`),
  KEY `Id_Partido` (`Id_Partido`),
  CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`Id_Partido`) REFERENCES `partido` (`Id_Partido`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- Volcando estructura para tabla futsal.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `Id_Rol` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`Id_Rol`),
  UNIQUE KEY `Nombre` (`Nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.torneo
CREATE TABLE IF NOT EXISTS `torneo` (
  `Id_Torneo` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `Estado` enum('Activo','Finalizado','Suspendido') DEFAULT 'Activo',
  PRIMARY KEY (`Id_Torneo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcando estructura para tabla futsal.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `Id_Usuario` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(255) NOT NULL,
  `Apellido` varchar(255) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Contraseña` varchar(255) NOT NULL,
  `Id_Rol` int(11) DEFAULT NULL,
  `Id_Categoria` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_Usuario`),
  UNIQUE KEY `Correo` (`Correo`),
  KEY `Id_Rol` (`Id_Rol`),
  KEY `usuario_ibfk_2` (`Id_Categoria`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`Id_Rol`) REFERENCES `rol` (`Id_Rol`),
  CONSTRAINT `usuario_ibfk_2` FOREIGN KEY (`Id_Categoria`) REFERENCES `categoria` (`Id_Categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    ```sh
    # Ejemplo de comando desde la terminal
    mysql -u tu_usuario -p futsal_life < ../database/futsal_life.sql
    ```

5.  **Configura las Variables de Entorno:**
    -   En el directorio `backend_futsal`, crea un archivo llamado `.env`.
    -   Copia el contenido de abajo, y rellena los valores con tus credenciales.

    ```env
    # Configuración de la Base de Datos
    DB_HOST=localhost
    DB_USER=root # o tu usuario de MySQL
    DB_PASSWORD=tu_contraseña_de_mysql # tu contraseña
    DB_NAME=futsal_life # el nombre de la DB que creaste

    # Configuración para envío de correos (ej. Nodemailer con Gmail)
    EMAIL_FROM=tu_correo@gmail.com
    EMAIL_PASS=tu_contraseña_de_aplicacion_de_gmail

    # Clave secreta para JWT
    JWT_SECRET=un_secreto_muy_largo_y_dificil_de_adivinar
    ```

6.  **Ejecuta la aplicación en modo desarrollo:**
    ```sh
    npm run dev
    ```
    El servidor se iniciará en `http://localhost:3000` (o el puerto que hayas configurado).

## Estructura del Proyecto

El proyecto sigue una arquitectura MVC (Modelo-Vista-Controlador) para una mejor organización del código.

```
.
├── backend_futsal/         # Directorio principal del servidor
│   ├── controllers/        # Lógica de negocio (Controladores)
│   ├── database/           # Configuración de la conexión a la DB
│   ├── middlewares/        # Middlewares de Express
│   ├── models/             # Lógica de interacción con la DB (Modelos)
│   ├── public/             # Archivos estáticos (CSS, JS cliente, imágenes)
│   ├── routes/             # Definición de rutas de la API
│   ├── views/              # Plantillas EJS (Vistas)
│   ├── .env                # (No versionado) Variables de entorno
│   ├── package.json
│   └── server.js           # Punto de entrada de la aplicación
├── database/
│   └── futsal_life.sql     # Script de la base de datos
└── .gitignore
```

## Contacto

Nicolas Mendez - (https://github.com/NicolasMendez30)

Sergio Ruiz - (https://github.com/sergio-wq)

Yojhan Vargas - [@YojhanVargas](https://github.com/YojhanVargas)
