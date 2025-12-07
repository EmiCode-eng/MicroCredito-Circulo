# MicroCrédito Círculo 📱💸

Plataforma web de inclusión financiera que digitaliza los círculos de ahorro y crédito ("tandas"), generando un historial crediticio alternativo basado en la reputación social (**Trust Score**).

## 🚀 Descripción del Proyecto

MicroCrédito Círculo resuelve la falta de transparencia y seguridad en los métodos informales de crédito. A través de una interfaz web intuitiva, permite a comunidades organizar tandas, registrar pagos mediante comprobantes digitales y visualizar la reputación de cada miembro en tiempo real.

### 🌟 Funcionalidades Principales (MVP)
* **Gestión de Círculos:** Creación de grupos, definición de montos y fechas.
* **Trust Score Engine:** Algoritmo que ajusta la puntuación del usuario (0-100) basado en cumplimiento.
* **Transparencia Total:** Dashboard visual con barras de progreso y estado de pagos.
* **Evidencia Digital:** Subida y almacenamiento seguro de comprobantes de pago.

---

## 🛠️ Tecnologías Digitales Utilizadas

Este proyecto utiliza una arquitectura **Serverless** y **Component-Based** para asegurar escalabilidad y bajo costo.

| Categoría | Tecnología | Justificación |
| :--- | :--- | :--- |
| **Frontend** | **React 18** | Biblioteca líder para interfaces dinámicas y reactivas. |
| **Runtime** | **Bun** | Entorno de ejecución rápido para gestión de paquetes y scripts. |
| **Estilos** | **Tailwind CSS** | Maquetado rápido "Mobile-First" y diseño moderno. |
| **Backend (BaaS)**| **Firebase** | Autenticación, Base de Datos y Storage sin configurar servidores. |
| **Base de Datos**| **Cloud Firestore** | Base de datos NoSQL en tiempo real para sincronización instantánea. |
| **Storage** | **Firebase Storage** | Almacenamiento seguro de imágenes (comprobantes). |
| **Gráficos** | **Chart.js** | Visualización de datos (Trust Score Doughnut). |

---

## ⚙️ Instrucciones de Instalación

### Prerrequisitos
* Tener instalado [Bun](https://bun.sh/) (o Node.js).
* Una cuenta de Google (para configurar Firebase).

### Pasos para desplegar en local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/EmiCode-eng/MicroCredito-Circulo]
    cd microcredito-circulo
    ```

2.  **Instalar dependencias con Bun:**
    ```bash
    bun install
    ```

3.  **Configurar Firebase:**
    * Crea un proyecto en [Firebase Console](https://console.firebase.google.com/).
    * Habilita **Authentication** (Google Provider).
    * Habilita **Firestore Database** (Modo prueba).
    * Habilita **Storage**.
    * Crea un archivo `src/firebaseConfig.js` y pega tus credenciales:
    ```javascript
    import { initializeApp } from "firebase/app";
    import { getFirestore } from "firebase/firestore";
    import { getAuth, GoogleAuthProvider } from "firebase/auth";
    import { getStorage } from "firebase/storage";

    const firebaseConfig = {
      apiKey: "TU_API_KEY",
      authDomain: "TU_PROYECTO.firebaseapp.com",
      projectId: "TU_PROYECTO_ID",
      storageBucket: "TU_PROYECTO.appspot.com",
      messagingSenderId: "...",
      appId: "..."
    };

    const app = initializeApp(firebaseConfig);
    export const db = getFirestore(app);
    export const auth = getAuth(app);
    export const googleProvider = new GoogleAuthProvider();
    export const storage = getStorage(app);
    ```

4.  **Configurar CORS (Crucial para subida de imágenes):**
    * Si tienes problemas subiendo imágenes en local, configura CORS en tu bucket de Firebase usando `gsutil` (ver documentación de Google Cloud).

5.  **Ejecutar el servidor de desarrollo:**
    ```bash
    bun run dev
    ```

6.  **Abrir en el navegador:**
    Visita `http://localhost:5173` (o el puerto que indique Bun).

---

## 📄 Licencia
Proyecto desarrollado para Hackatón de Innovación Digital “Juventud que Transforma con Tecnología” - 2025
