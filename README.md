# Dob Frontend

Interfaz web para interactuar con los contratos inteligentes desplegados en Vara Network utilizando Gear Protocol.

---

## 🛠️ Configuración del entorno

1. Clonar el repositorio:

```bash
git clone git@github.com:JorgeOehrens/dob-front.git
cd dob-front
```

2. Crear archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
VITE_NODE_ADDRESS=wss://testnet.vara.network
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Editar el archivo `src/app/consts.ts` y actualizar el valor de `CONTRACT_FACTORY` con el **programId** del contrato Factory desplegado anteriormente.

```ts
export const CONTRACT_FACTORY = "0x..."; // Reemplazar con tu ID
```

---

## 🚀 Ejecución del proyecto

```bash
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/` (o el puerto que indique Vite).

---
