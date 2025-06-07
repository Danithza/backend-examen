# BACKEND-EXAMEN

Este proyecto es el backend para el sistema de gestión de especialistas, desarrollado con **AdonisJS** (versión 5+), utilizando el ORM Lucid y migraciones con base de datos relacional (MySQL o PostgreSQL).

---

## ⚙️ Requisitos

- Node.js >= 18.x
- Base de datos SQL (MySQL, PostgreSQL, SQLite)
- Editor recomendado: [VSCode](https://code.visualstudio.com/)

---

## 🚀 Instalación del proyecto

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/BACKEND-EXAMEN.git
cd BACKEND-EXAMEN
```

2. Instalar las dependencias:

```bash
npm install
```

3. Configurar el entorno:

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita las variables de entorno según tu base de datos:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=nombre_base_de_datos
```

4. Ejecutar migraciones para crear las tablas:

```bash
node ace migration:run
```

---

## Estructura del proyecto

```
app/
├── controllers/               # Controladores HTTP (ej: especialistas_controller.ts)
├── models/                    # Modelos ORM (ej: especialista.ts, user.ts)
├── middleware/                # Middleware para rutas o seguridad
├── exceptions/                # Manejo de errores personalizados
database/
├── migrations/                # Archivos de migración SQL (estructura de tablas)
start/
├── routes.ts                  # Rutas principales de la API
```

---

## Comandos útiles

| Comando                        | Descripción                                     |
|------------------------------|-------------------------------------------------|
| `npm run dev`                | Inicia el servidor en modo desarrollo           |
| `node ace migration:run`     | Ejecuta las migraciones                         |
| `node ace make:model Nombre` | Crea un nuevo modelo                            |
| `node ace make:controller`   | Crea un nuevo controlador                       |
| `node ace make:migration`    | Crea una nueva migración                        |

---

## rutas configuradas

Las rutas están definidas en el archivo `start/routes.ts`. Por ejemplo:

```ts
Route.get('/especialistas', 'EspecialistasController.index')
Route.post('/especialistas', 'EspecialistasController.store')
```

---

## Modelos y migraciones

- `especialista.ts`: modelo que representa la tabla `especialistas`.
- Migración `create_especialistas_table.ts` define columnas como nombre, especialidad, etc.
- También existen migraciones para usuarios (`users`) y tokens de acceso (`access_tokens`), útiles para autenticación si se desea implementar.

---


## Autor

Este backend fue creado como parte de un examen práctico usando AdonisJS.
