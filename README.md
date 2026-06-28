# Sr. Coffee

Chatbot conversacional con diseño de cafetería. Flujo completo de Landing → Login → Onboarding → Chat, con respuestas vía Gemini y modo local de respaldo.

---

# Características

- Landing con scroll animado y demos de conversación
- Login temático con animación de carga
- Onboarding con preguntas de bienvenida
- Chat con 6 temas de conversación distintos
- Modo claro / oscuro
- Sistema de racha diaria, cafés y sesiones
- Check-in de estado de ánimo
- Panel de analíticas y perfil de usuario
- Respuestas vía Gemini (IA real) con fallback local si no hay conexión o API key

---

#  Estructura

```
SrCoffee/
├── api/
│   └── chat.js              ← Serverless Function (Vercel) que llama a Gemini
├── index.html
├── package.json
├── vite.config.js
├── .env.example
└── src/
    ├── main.jsx
    ├── App.jsx               ← orquestador del flujo
    ├── data/
    │   ├── topics.js         ← temas, respuestas locales, starters
    │   └── icons.jsx
    └── components/
        ├── Landing.jsx
        ├── Login.jsx
        ├── Onboarding.jsx
        └── SrCoffee.jsx       ← chat principal
```

---

# Instalación local

```bash
npm install
npm run dev
```

Abre **http://localhost:5173**

# Credenciales de acceso (Login)

- Usuario: `coffeelover`
- Contraseña: `1234`

---

# Conectar Gemini (respuestas reales con IA)

La app funciona **sin configurar nada** (usa respuestas locales predefinidas).
Para que Sr. Coffee converse de verdad con Gemini, sigue estos pasos:

### 1. Genera tu API Key

1. Ve a [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google
3. Click en **"Crear clave de API"**
4. Copia la clave generada

### 2. Configúrala en Vercel

1. Entra a tu proyecto en [vercel.com](https://vercel.com)
2. Ve a **Settings → Environment Variables**
3. Agrega una nueva variable:

| Campo | Valor |
|---|---|
| **Name** | `GEMINI_API_KEY` |
| **Value** | *(pega aquí tu clave de API)* |
| **Environment** | Production, Preview, Development |

4. Click **Save**
5. Ve a **Deployments** → menú `⋮` del último deploy → **Redeploy**

### 3. (Opcional) Configúrala para desarrollo local

Crea un archivo `.env.local` en la raíz del proyecto (basado en `.env.example`):

```bash
GEMINI_API_KEY=tu_clave_aqui
```

> **Nunca subas `.env.local` ni tu API key a GitHub.** Ya está incluido en `.gitignore`.

---

# Cómo funciona el fallback

`SrCoffee.jsx` intenta llamar a `/api/chat` (Gemini). Si:
- No hay `GEMINI_API_KEY` configurada, o
- Falla la conexión, o
- Se agota la cuota gratuita

...la app cae automáticamente a respuestas locales predefinidas en `src/data/topics.js`, sin romperse ni mostrar errores al usuario.

---

# Despliegue en Vercel

1. Sube el proyecto a un repositorio (GitHub, GitLab, etc.)
2. En Vercel: **New Project → Import** tu repositorio
3. Vercel detecta automáticamente Vite — no necesitas configurar nada más
4. Agrega la variable `GEMINI_API_KEY` (ver sección anterior)
5. Deploy 

---

# Stack

- React 18 + Vite 5
- Vercel Serverless Functions
- Gemini 2.0 Flash API
- CSS-in-JS (sin librerías de estilos externas)