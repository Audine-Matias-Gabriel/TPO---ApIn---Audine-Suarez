
# Profesor:
    Jaime Juan Manuel

# Alumnos: 
    Suarez Folco - 1173944
    Audine Matias Gabriel - 1172179

## TPO Aplicaciones Interactivas - API

Node.js + TypeScript + Express + TypeORM + PostgreSQL

### Prerrequisitos

- Node.js 18+
- PostgreSQL 13+

### Configuración rápida

1. Crear el archivo de entorno

```bash
cp .env.example .env
# Editá los valores según tu entorno (usuario, contraseña, base, host, puerto)
```

2. Instalar dependencias

```bash
npm install
```

3. Compilar TypeScript (opcional si usás `dev`)

```bash
npm run build
```

4. Ejecutar migraciones (crea las tablas)

```bash
npm run migration:run
```

5. Iniciar la API

```bash
# Desarrollo (hot reload con ts-node)
npm run dev

# Producción (usa archivos compilados en dist)
npm start
```

La API escucha por defecto en `http://localhost:3000`

### Estructura del proyecto (resumen)

```
src/
  app.ts                  # Express app y middlewares
  index.ts                # Bootstrap: DataSource y server
  controllers/            # Controladores HTTP
  services/               # Lógica de negocio
  entities/               # Entidades TypeORM (*.entity.ts)
  routes/                 # Rutas Express
  db/
    data-source.ts        # Configuración TypeORM
    migrations/           # Migraciones
```

### Referencias

- Ejemplo oficial TypeORM + Express: [typeorm.io/docs/guides/example-with-express](https://typeorm.io/docs/guides/example-with-express)

## TO DO:
```
db/migrations
    User
    Project
    Task
    Comment
```