# Pre-Parcial 2 - API de Planes de Viaje

API REST desarrollada con NestJS para la gestión de planes de viaje y países, integrando datos externos desde RestCountries API.

## Descripción

Esta API proporciona funcionalidad para gestionar planes de viaje y consultar información de países. El sistema está compuesto por dos módulos principales:

- **Countries (Países)**: Gestión y consulta de información de países con caché en base de datos y consulta a API externa RestCountries.
- **TravelPlans (Planes de Viaje)**: Creación y gestión de planes de viaje asociados a países, incluyendo sistema de comentarios.


-> [Parte parcial 2](#parte-parcial-2)

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

## Explicación del Provider Externo

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

## Modelo de Datos

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


# **Parte parcial 2**

### Extensión de la API
En este caso, la API ahora inclye un nuevo endpoint para eliminar un país dado su codigo alpha, además de incluir un Guard y un Middleware. Se creó la carpeta `common` para almacenar allí los archivos que contienen el guard y el middleware, que se encuentran `auth.guard.ts` y `access-log.middleware.ts` respectivamente. Incluir la funcionalidad de elimiar un país implicó la creación de un nuevo endpoint en el controller del modulo Countries (`countries.controller.ts`) y un nuevo método en el servicio del mismo módulo (`countries.service.ts`). El endpoint es protegido con el guard, para que solo requests con un api key específico puedan ejecutar esta funcionalidad. Por otro lado, antes de eliminar un país, se verifica que exista dentro de la base de datos y se verifica que no tenga travel plans asociados. 


### Cómo funciona y cómo validar endpoint protegido
El endpoint protegido es 
```bash
  DELETE /countries/:codigo
```
En el controller el endpoint está implementado de la siguiente manera:

```typescript
  @UseGuards(AuthGuard)
  @Delete(':codigo')
  delete(@Param('codigo') codigo: string) {
    return this.countriesService.deleteCountry(codigo);
  }
```
Este endpoint requiere autenticación mediante API Key para eliminar un país de la base de datos. El guard se ejecuta antes del handler del controlador.

El funcionamiento de este endpoint se puede verificar mediante los siguientes casos
- Si el país a borrar no existe dentro de la base de datos, entonces se tiene el siguiente mensaje (asumiendo que tiene un x-api-key correcto)
```json
{
    "message": "País con código <codigo> no encontrado",
    "error": "Not Found",
    "statusCode": 404
}
```

- Si el país a borrar existe dentro de la base de datos pero tiene travel plans asociados entonces se retorna (asumiendo que tiene un x-api-key correcto)
```json
{
    "message": "No se puede eliminar el país France porque tiene 1 un plan de viaje asociado",
    "error": "Bad Request",
    "statusCode": 400
}
```

- Si el país existe y no tiene travel plans asociados entonces se retorna
```json
{
    "acknowledged": true,
    "deletedCount": 1
}
```

### Cómo funciona y cómo validar guard implementado

El guard implementado implementa la interfaz canActivate (esto es lo que lo convierte en un guard). Este guard accede al header del request y lee su x-api-key. Este x-api-key extraído se comprara vs el x-api-key que se tiene por defecto (`123`). Si este x-api-key no coincide con `123` se lanza un UnauthorizedException; de lo contrario, la petición puede pasar al controlador. 

Como el guard solo se aplicó al método de eliminar un país, el funcionamiento de este se puede verificar mediante el uso de este endpoint contemprano los siguientes casos:
- Si el request no tiene el x-api-key correcto (o no tiene api key) entonces se retorna el siguiente mensaje
```json
{
    "message": "Invalid or missing API key",
    "error": "Unauthorized",
    "statusCode": 401
}
```

- Si el request tiene el x-api-key correcto (en este caso '123') etnonces se elimina el país y se retorna el siguiente mensaje
```json
{
    "acknowledged": true,
    "deletedCount": 1
}
```

### Cómo funciona y cómo validar middleware de logging
El middleware implementado se aplica sobre todas las rutas de la aplicación (esto se puede ver en `('*')` del AppModule.configure() ) y lo que hace es generar un  UUID único por request para trazabilidad. Además se registra información de entrada como el método de entrada, la URL a la que se hizo el request, la IP del cliente, el user-agent, entre otros; e información de salida como la duración del request, el status code y la url . Los registros tanto de entrada como de salida se imprimen por consola. 

Si por ejemplo, se ejecuta `DELETE http://localhost:3000/countries/FRA` entonces lo que se imprime por consola es lo siguiente
- En la entrada
``` 
Request In: {"requestId":"649f107b-35dd-4872-9418-ddd920aaa05b","method":"DELETE","url":"/countries/fra","ip":"::1","ua":"PostmanRuntime/7.49.1","headers":{"x-api-key":"***redacted***","user-agent":"PostmanRuntime/7.49.1","accept":"*/*","postman-token":"8eb4f1b0-e994-4f23-bffc-03d9f19eca60","host":"localhost:3000","accept-encoding":"gzip, deflate, br","connection":"keep-alive"}}
```

- En la salida
```
Request Out: {"requestId":"649f107b-35dd-4872-9418-ddd920aaa05b","status":400,"durationMs":7,"mrs":"DELETE","url":"/countries/fra"}

```
