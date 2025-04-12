# Hospital en Casa - Guía de Instalación

## Requisitos Previos

1. **Node.js y npm**
   - Descargar e instalar Node.js desde [nodejs.org](https://nodejs.org/)
   - Versión recomendada: LTS (Long Term Support)
   - Durante la instalación, asegúrate de marcar la opción "Automatically install the necessary tools"

2. **Angular CLI**
   - Abrir PowerShell como Administrador
   - Ejecutar el siguiente comando:
   ```powershell
   npm install -g @angular/cli
   ```

## Configuración de Variables de Entorno

1. **Verificar la instalación de Node.js**
   - Abrir PowerShell
   - Ejecutar:
   ```powershell
   node --version
   npm --version
   ```
   - Si no funcionan, necesitas configurar las variables de entorno

2. **Configurar Variables de Entorno**
   - Presionar `Windows + R`
   - Escribir `sysdm.cpl` y presionar Enter
   - Ir a la pestaña "Opciones avanzadas"
   - Hacer clic en "Variables de entorno"
   - En "Variables del sistema", buscar "Path"
   - Hacer clic en "Editar"
   - Hacer clic en "Nuevo"
   - Agregar las siguientes rutas:
     ```
     C:\Program Files\nodejs\
     %AppData%\npm
     ```
   - Hacer clic en "Aceptar" en todas las ventanas

3. **Verificar la instalación de Angular CLI**
   - Cerrar y volver a abrir PowerShell
   - Ejecutar:
   ```powershell
   ng version
   ```
   - Si no funciona, intenta reiniciar la computadora

## Instalación del Proyecto

1. **Clonar el repositorio**
   ```powershell
   git clone [URL_DEL_REPOSITORIO]
   cd hospital_en_casa
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```powershell
   ng serve
   ```

4. **Abrir el navegador**
   - Ir a `http://localhost:4200`

