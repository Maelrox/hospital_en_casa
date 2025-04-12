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

## Solución de Problemas Comunes

### Problema: Comando 'ng' no reconocido
**Solución:**
1. Verificar que Node.js esté instalado correctamente
2. Verificar las variables de entorno
3. Intentar instalar Angular CLI localmente:
   ```powershell
   npm install @angular/cli
   npx ng version
   ```

### Problema: Error al instalar dependencias
**Solución:**
1. Limpiar la caché de npm:
   ```powershell
   npm cache clean --force
   ```
2. Eliminar la carpeta node_modules:
   ```powershell
   rm -rf node_modules
   ```
3. Reinstalar dependencias:
   ```powershell
   npm install
   ```

### Problema: Puerto 4200 en uso
**Solución:**
1. Encontrar el proceso que usa el puerto:
   ```powershell
   netstat -ano | findstr :4200
   ```
2. Terminar el proceso:
   ```powershell
   taskkill /PID [NUMERO_DE_PID] /F
   ```
3. O usar un puerto diferente:
   ```powershell
   ng serve --port 4201
   ```

## Comandos Útiles

- **Generar un nuevo componente:**
  ```powershell
  ng generate component nombre-del-componente
  ```

- **Construir para producción:**
  ```powershell
  ng build --prod
  ```

- **Ejecutar pruebas:**
  ```powershell
  ng test
  ```

## Contacto

Para soporte técnico o reportar problemas, contactar al administrador del sistema.
