# Calendario institucional del ITSSAT

Aplicacion web para visualizar las actividades academicas de la institucion ITSSAT, en ella se llevara un calendario de actividades de la organizacion.

## Tecnologia a utilizar

### Lenguajes

- Javascript
- HTML5
- CSS3

### Librerias y Frameworks

1. Bootstrap v5.1, Documentacion [aqui](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
2. Vue v2, de Javascript para interfaces graficas con html [documentacion](https://es.vuejs.org/v2/guide/)
3. Entorno de ejecucion Javascript del lado del servidor [Nodejs](https://nodejs.org/es/)
4. Express de Javascript para api rest [Documentacion](https://expressjs.com/es/)
5. Base de datos de firebase [CloudFirestore](https://firebase.google.com/docs/firestore)
6. Hosting de firebase [Hosting](https://firebase.google.com/docs/hosting)
7. Implementacion de backen en firebase [Functions](https://firebase.google.com/docs/functions)
8. Axios, clienta de la api REST [dcoumentacion](https://axios-http.com/docs/intro)
9. Generador de claves UUID de Javascript [UUID](https://www.npmjs.com/package/uuid)
10. Encriptador por sha1 de Javascript [sha1](https://www.npmjs.com/package/sha1)


Documentacion extra de api REST [aqui](https://www.bbvaapimarket.com/es/mundo-api/api-rest-que-es-y-cuales-son-sus-ventajas-en-el-desarrollo-de-proyectos/) y [aqui](https://www.idento.es/blog/desarrollo-web/que-es-una-api-rest/)

## Estructura de la base de datos

Debido a que la base de datos a utilizar es la proporcionda por firebase, esta es una base de datos NoSQL, para ver la estructura ver documentacion [aqui](https://firebase.google.com/docs/firestore/manage-data/structure-data), estara en distribuida la informacion en las siguientes colecciones de datos:

**Coleccion de usuarios**

- **UUID_user**
    - UUID_user
    - correo_user
    - nombre_user
    - apellido_p_user
    - apellido_m_user
    - direccion_user
    - telefono_user
    - ciudad_user
    - password_user
    - codigo_recuperacion_user
    - tipo_user
    - categoria_user
    - acceso_a_user
    - activo_user
    - fecha_alta_user
    - creado_por_user
    - fecha_modificacion_user
    - modificado_por_user

**Colecion de actividades**

- **UUID_task**
    - UUID_task
    - year_task
    - rango_fechas_task
    - fecha_inicial_task
    - fecha_final_task
    - descripcion_task
    - mes_task
    - dias_task
    - para_categoria_task
    - activa_task
    - fecha_creada_task
    - creada_por_task
    - fecha_modificada_task
    - modificada_por_task

**Coleccion de categorias**
- **UUID_categoria**
    - UUID_category
    - nombre_category
    - fecha_creada_category
    - creada_por_category
    - fecha_modificada_category
    - modificada_por_category
    - activa_category

### Contenido de cada documento por coleccion

**Documentos para usuarios**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| UUID_user | String | Id para el usuario |
| correo_user | String | |
| nombre_user | String | |
| apellido_p_user | String | |
| apellido_m_user| String | |
| direccion_user | String | |
| telefono_user | String | |
| ciudad_user | String | |
| password_user | String | Contraseña para inicio de sesion, encriptada con sha1 |
| codigo_recuperacion_user | String | Codigo en caso olvidar la contraseña |
| tipo_user | String | Puede ser invitado, ejecutivo, o administrador |
| categoria_user | String | La categoria dependera directamente de las categorias agregadas, por ejemplo, maestro, directivo, oficina, etc |
| acceso_a_user | Object | Detalles de a que pestaña y acciones puede acceder el usuario |
| activo_user | Boolean | Indica si el usuario esta dado de baja o no |
| fecha_alta_user | String | |
| creado_por_user | String | |
| fecha_modificacion_user | String | |
| modificado_por_user | String | |

**Documentos para actividades**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| UUID_task | String | Id para la actividad |
| year_task | String | Corresponde al periodo escolar por ejemplo 2021 |
| rango_fechas_task | Boolean | Se especifica si tiene fecha establecida o se desconoce la fecha |
| fecha_inicial_task | String | la fecha inicial de la actividad |
| fecha_final_task | String | fecha final de la actividad, puede ser igual que la inicial pero no menor que la inicial |
| descripcion_task | String | Titulo o descripcion de la actividad a realizar |
| mes_task | String | Mes o meses en los que se realizara la actividad |
| dias_task | String | Si no se establece fecha especifica pueda contener texto en la descripcion de dias |
| para_categoria_task | String | relacionada con el id de categoria a que va dirijido |
| activa_task | String | Indica si esta activa la actividad |
| fecha_creada_task | String |  |
| creada_por_task | String | Id del usuario que la creo |
| fecha_modificada_task | Object | Detalles de a que pestaña y acciones puede acceder el usuario |
| modificada_por_task | Boolean | Id del usuario que la modifico |

**Documentos para categorias**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| UUID_category | String | Id para la categoria |
| nombre_category | Nombre de la categoria | |
| fecha_creada_category | String | |
| creada_por_category | String | Id del usuario que la creo |
| fecha_modificada_category | String | |
| modificada_por_category | String |Id del usuario que la creo |
| activa_category | Boolean | Muestra si aun esta activa la categoria |


