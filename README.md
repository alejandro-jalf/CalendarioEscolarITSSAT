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
8. Axios, cliente de la api REST [dcoumentacion](https://axios-http.com/docs/intro)
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
    - area_user
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
    - para_area_task
    - activa_task
    - fecha_creada_task
    - creada_por_task
    - fecha_modificada_task
    - modificada_por_task

**Coleccion de areas**
- **UUID_area**
    - UUID_area
    - nombre_area
    - fecha_creada_area
    - creada_por_area
    - fecha_modificada_area
    - modificada_por_area
    - activa_area

### Diagrama de base de datos

```` javascript
// Coleccion de Usuarios

{
    UUID_user: String,
    correo_user: String,
    nombre_user: String,
    apellido_p_user: String,
    apellido_m_user: String,
    direccion_user: String,
    telefono_user: String,
    ciudad_user: String,
    password_user: String,
    codigo_recuperacion_user: String,
    tipo_user: String,
    area_user: String,
    accessTo_user: {
        inicio: String || Object,
        administracion: String || Object
    },
    activo_user: Boolean,
    fecha_alta_user: String,
    creado_por_user: String,
    fecha_modificacion_user: String,
    modificado_por_user: String
}

// Coleccion de Actividades

{
    UUID_task: String,
    year_task: String,
    rango_fechas_task: String,
    fecha_inicial_task: String,
    fecha_final_task: String,
    descripcion_task: String,
    mes_task: String,
    dias_task: String,
    para_area_task: String,
    activa_task: Boolean,
    fecha_creada_task: String,
    creada_por_task: String,
    fecha_modificada_task: String,
    modificada_por_task: String
}

// Coleccion de Area

{
    UUID_area: String,
    nombre_area: String,
    fecha_creada_area: String,
    creada_por_area: String,
    fecha_modificada_area: String,
    modificada_por_area: String,
    activa_area: Boolean
}
````

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
| codigo_recuperacion_user | String | Codigo en caso de olvidar la contraseña |
| tipo_user | String | Puede ser invitado, ejecutivo, o administrador |
| area_user | String | La area dependera directamente de las areas agregadas, por ejemplo, maestro, directivo, oficina, etc |
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
| para_area_task | String | relacionada con el id de area a que va dirijido |
| activa_task | String | Indica si esta activa la actividad |
| fecha_creada_task | String |  |
| creada_por_task | String | Id del usuario que la creo |
| fecha_modificada_task | Object | Detalles de a que pestaña y acciones puede acceder el usuario |
| modificada_por_task | Boolean | Id del usuario que la modifico |

**Documentos para areas**

| Campo | Tipo | Descripcion |
|-------|------|-------------|
| UUID_area | String | Id para la area |
| nombre_area | String | Nombre de la area |
| fecha_creada_area | String | |
| creada_por_area | String | Id del usuario que la creo |
| fecha_modificada_area | String | |
| modificada_por_area | String |Id del usuario que la creo |
| activa_area | Boolean | Muestra si aun esta activa la area |

## Rutas de la api (functions)

La aplicacion estara alojada en un servidor con node js, tendremos una ruta base la cual es la direccion donde estara alojada la api, por ejemplo

https://calendario_scolar_itssat.com/

Aunado a ello se a continuacion se muestran las rutas que estaran disponibles para acceder o manipular los datos de la aplicacion

### Rutas para usuario

| **Metodo** | **Ruta** | **Request** | **Descripcion** |
|-----------|----------|------------|-----------------|
| **GET** | api/v1/usuarios | | Obtiene todos los datos almacenandos en base de datos |
| **GET** | api/v1/usuarios/:correo_user | | Obtiene un usuario determinado |
| **POST** | api/v1/usuarios | { nombre_user: '', apellido_p_user: '', apellido_m_user: '', direccion_user: '', sucursal_user: '', correo_user: '', password_user: '', tipo_user: '', access_to_user: '' } | Crea un nuevo usuario |
| **POST** | api/v1/usuarios/:correo_user/login | { password_user: '' } | Verifica el logueo de un usuario |
| **PUT** | api/v1/usuarios/:correo_user | { nombre_user: '', apellido_p_user: '', apellido_m_user: '', direccion_user: '', sucursal_user: '', correo_user: '', tipo_user: '', access_to_user: '', activo_user: true } | Modifica los datos de un usuario determinado |
| **PUT** | api/v1/usuarios/:correo_user/general | { nombre_user: '', apellido_p_user: '', apellido_m_user: '', direccion_user: '' } | Modifica los datos generales del usuario |
| **PUT** | api/v1/usuarios/:correo_user/email | { new_correo_user: '', password_user: '' } | Actualiza la direccion de correo electronico de un usuario |
| **PUT** | api/v1/usuarios/:correo_user/password | { password_user: '', new_password_user: '' } | Modifica la contraseña actual del usuario |
| **PUT** | api/v1/usuarios/:correo_user/recovery | | Recupera la cuenta de un usuario |
| **PUT** | api/v1/usuarios/:correo_user/status | { activo_user: true } | Cambia el status de un usuario puede enviar true o false |
| **DELETE** | api/v1/usuarios/:correo_user | | Elimina un usuario |
