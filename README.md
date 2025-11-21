# Pre-Parcial 2 - API de Planes de Viaje

API REST desarrollada con NestJS para la gestión de planes de viaje y países, integrando datos externos desde RestCountries API.

## Descripción

Esta API proporciona funcionalidad para gestionar planes de viaje y consultar información de países. El sistema está compuesto por dos módulos principales:

- **Countries (Países)**: Gestión y consulta de información de países con caché en base de datos y consulta a API externa RestCountries.
- **TravelPlans (Planes de Viaje)**: Creación y gestión de planes de viaje asociados a países, incluyendo sistema de comentarios.

## Cómo Ejecutar el Proyecto

### Requisitos Previos
- Node.js (v16 o superior)
- Docker y Docker Compose
- npm

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/MariaAmor8/pre-parcial-2.git
cd pre-parcial-2
```

2. **Instalar dependencias**
```bash
npm install
```

### Configuración de la Base de Datos

La aplicación utiliza **MongoDB** como base de datos. Para configurarla:

1. **Iniciar MongoDB con Docker Compose**
```bash
docker-compose up -d
```

Esto iniciará un contenedor de MongoDB con la siguiente configuración:
- **Puerto**: 27018 (mapeado desde el puerto interno 27017)
- **Usuario**: root
- **Contraseña**: secret
- **Base de datos**: preparcial2

2. **Verificar que el contenedor está corriendo**
```bash
docker ps
```

### Ejecutar la API

**Modo desarrollo (con hot-reload)**
```bash
npm run start:dev
```

**Modo producción**
```bash
npm run build
npm run start:prod
```

La API estará disponible en: `http://localhost:3000`

---

## Documentación de Endpoints

### Módulo Countries

#### 1. Obtener todos los países
```http
GET /countries
```

**Respuesta de ejemplo:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "codigo": "COL",
    "nombre": "Colombia",
    "region": "Americas",
    "subregion": "South America",
    "capital": "Bogotá",
    "poblacion": 50882884,
    "bandera": "https://flagcdn.com/w320/co.png",
    "fuente": "REST Countries API"
  }
]
```

#### 2. Obtener país por código
```http
GET /countries/:codigo
```

**Parámetros:**
- `codigo`: Código Alpha3 del país (ej: COL, USA, MEX)

**Ejemplo:**
```bash
curl http://localhost:3000/countries/COL
```

**Nota:** Si el país no existe en la base de datos, se consulta automáticamente desde la API de RestCountries y se almacena en caché.

#### 3. Crear país manualmente
```http
POST /countries
Content-Type: application/json
```

**Body:**
```json
{
  "codigo": "COL",
  "nombre": "Colombia",
  "region": "Americas",
  "subregion": "South America",
  "capital": "Bogotá",
  "poblacion": 50882884,
  "bandera": "https://flagcdn.com/w320/co.png"
}
```

---

### Módulo TravelPlans

#### 1. Obtener todos los planes de viaje
```http
GET /travel-plans
```

**Respuesta de ejemplo:**
```json
[
  {
    "_id": "691ef0187d2632ce5f26ca0b",
    "titulo": "Viaje a Francia",
    "fechaInicio": "2025-12-01T00:00:00.000Z",
    "fechaFin": "2025-12-05T00:00:00.000Z",
    "pais": {
      "_id": "691ef0187d2632ce5f26ca09",
      "codigo": "FRA",
      "nombre": "France",
      "region": "Europe",
      "subregion": "Western Europe",
      "capital": "Paris",
      "poblacion": 66351959,
      "bandera": "https://flagcdn.com/w320/fr.png",
      "fuente": "cache",
      "createdAt": "2025-11-20T10:40:24.490Z",
      "updatedAt": "2025-11-20T12:08:28.341Z",
      "__v": 0
    },
    "comentarios": [
      {
        "descripcion": "Viaje familiar para Navidad",
        "_id": "691ef0187d2632ce5f26ca0c",
        "createdAt": "2025-11-20T10:40:24.510Z",
        "updatedAt": "2025-11-20T10:40:24.510Z"
      }
    ],
    "createdAt": "2025-11-20T10:40:24.510Z",
    "updatedAt": "2025-11-20T10:40:24.510Z",
    "__v": 0
  }
]
```

#### 2. Obtener un plan de viaje por ID
```http
GET /travel-plans/:id
```

**Ejemplo:**
```bash
curl http://localhost:3000/travel-plans/507f1f77bcf86cd799439012
```

#### 3. Crear un plan de viaje
```http
POST /travel-plans
Content-Type: application/json
```

**Body:**
```json
{
  "titulo": "Vacaciones en Colombia",
  "fechaInicio": "2025-12-01",
  "fechaFin": "2025-12-15",
  "pais": "COL",
  "comentarios": []
}
```

**Validaciones:**
- `titulo`: String obligatorio
- `fechaInicio`: Fecha en formato ISO 8601 (YYYY-MM-DD)
- `fechaFin`: Fecha posterior a fechaInicio
- `pais`: Código Alpha3 del país (debe existir o se consultará a RestCountries)

#### 4. Obtener un comentario específico
```http
GET /travel-plans/:planId/comments/:commentId
```

**Ejemplo:**
```bash
curl http://localhost:3000/travel-plans/507f1f77bcf86cd799439012/comments/507f1f77bcf86cd799439013
```

---

## 🌐 Explicación del Provider Externo

### Integración con RestCountries API

El sistema utiliza la API pública de [RestCountries](https://restcountries.com/) para obtener información actualizada de países.

#### Funcionamiento del Caché

1. **Primera consulta**: Cuando se solicita un país por código (ej: `/countries/COL`), el sistema:
   - Busca el país en la base de datos local (MongoDB)
   - Si NO existe, realiza una petición a RestCountries API
   - Almacena la información en la base de datos para futuras consultas

2. **Consultas posteriores**: Los datos se recuperan directamente desde la base de datos, mejorando el rendimiento y reduciendo llamadas externas.

#### Implementación Técnica

La clase `CountriesApiProvider` se encarga de:

```typescript
// URL de consulta
https://restcountries.com/v3.1/alpha/{codigo}?fields=cca3,name,region,subregion,capital,population,flags
```

**Campos consultados:**
- `cca3`: Código Alpha3 del país
- `name`: Nombre común y oficial
- `region`: Región geográfica
- `subregion`: Subregión
- `capital`: Ciudad capital
- `population`: Población
- `flags`: URLs de banderas (PNG y SVG)

**Manejo de errores:**
- Si la API no responde o el país no existe, se retorna `null`
- Los errores se registran en la consola para debugging

---

## 🗄️ Modelo de Datos

### Schema: Country (País)

```typescript
{
  codigo: String,        // Código Alpha3 (ej: "COL", "USA")
  nombre: String,        // Nombre del país
  region: String,        // Región geográfica (ej: "Americas")
  subregion: String,     // Subregión (ej: "South America")
  capital: String,       // Ciudad capital
  poblacion: Number,     // Número de habitantes
  bandera: String,       // URL de la imagen de la bandera
  fuente: String,        // Origen de los datos (default: "cache")
  createdAt: Date,       // Fecha de creación (automático)
  updatedAt: Date        // Fecha de actualización (automático)
}
```

**Campos obligatorios:** Todos los campos excepto `fuente`, `createdAt` y `updatedAt`

---

### Schema: TravelPlan (Plan de Viaje)

```typescript
{
  titulo: String,           // Título del plan de viaje
  fechaInicio: Date,        // Fecha de inicio del viaje
  fechaFin: Date,           // Fecha de fin del viaje
  pais: ObjectId,           // Referencia al documento Country
  comentarios: [Comment],   // Array de comentarios embebidos
  createdAt: Date,          // Fecha de creación (automático)
  updatedAt: Date           // Fecha de actualización (automático)
}
```

**Campos obligatorios:** `titulo`, `fechaInicio`, `fechaFin`, `pais`

**Validaciones:**
- `fechaFin` debe ser posterior a `fechaInicio`
- El país referenciado debe existir en la base de datos

---

### Schema: Comment (Comentario)

```typescript
{
  _id: ObjectId,         // ID único del comentario
  descripcion: String    // Contenido del comentario
}
```

Los comentarios están embebidos dentro de los planes de viaje.
