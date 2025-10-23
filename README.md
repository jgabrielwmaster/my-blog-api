# My Blog API

Esta es una API para un blog construida con NestJS, TypeORM y PostgreSQL.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

-   Node.js (se recomienda v18 o superior)
-   npm, yarn, o pnpm
-   Docker y Docker Compose (para ejecutar una base de datos PostgreSQL fácilmente)

## Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL-del-repositorio>
    cd my-blog-api
    ```

2.  Instala las dependencias del proyecto. Elige tu gestor de paquetes preferido:
    ```bash
    # Usando npm
    npm install

    # O usando yarn
    yarn install
    ```

## Configuración

### Base de Datos

Este proyecto requiere una base de datos PostgreSQL. La forma más sencilla de levantar una es usando Docker.

1.  Crea un archivo `docker-compose.yml` en la raíz del proyecto con el siguiente contenido:

    ```yaml
    version: '3.8'
    services:
      postgres:
        image: postgres:15
        restart: always
        environment:
          - POSTGRES_DB=my_blog_db
          - POSTGRES_USER=user
          - POSTGRES_PASSWORD=password
        ports:
          - '5432:5432'
        volumes:
          - postgres_data:/var/lib/postgresql/data

    volumes:
      postgres_data:
    ```

2.  Inicia el contenedor de la base de datos:
    ```bash
    docker-compose up -d
    ```

### Variables de Entorno

El proyecto utiliza un archivo `.env` para gestionar las variables de entorno.

1.  Crea un archivo llamado `.env` en la raíz del proyecto.

2.  Añade las siguientes variables, asegurándote de que coincidan con la configuración de tu base de datos (por ejemplo, la del `docker-compose.yml`):

    ```env
    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=user
    POSTGRES_PASSWORD=password
    POSTGRES_DB=my_blog_db
    PORT=3000
    ```

## Ejecutar la Aplicación

Para iniciar la aplicación en modo de desarrollo con recarga automática, ejecuta:

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000`.
