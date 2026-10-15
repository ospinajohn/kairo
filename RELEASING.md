# Publicar una versión de Kairo

Kairo publica instaladores de Windows mediante GitHub Actions. El workflow de release genera el instalador NSIS y lo adjunta automáticamente a GitHub Releases.

## Requisitos del repositorio

- El repositorio debe estar alojado en GitHub.
- La rama `main` debe contener el cambio que se quiere publicar.
- GitHub Actions debe tener permiso para escribir en releases.
- El workflow `Release Kairo` usa el `GITHUB_TOKEN` integrado; no requiere una clave adicional.

## Publicar una versión

1. Actualiza la versión en `app/src-tauri/tauri.conf.json`.
2. Actualiza la versión de `app/package.json` si corresponde.
3. Ejecuta las comprobaciones locales:

   ```powershell
   cd app
   pnpm install --frozen-lockfile
   pnpm test
   pnpm build
   ```

4. Confirma los cambios en `main`.
5. Crea y publica un tag que coincida con la versión:

   ```powershell
   git tag v0.1.1
   git push origin v0.1.1
   ```

6. GitHub Actions ejecutará el build en Windows y publicará la release con el instalador NSIS.

El archivo descargable se genera con este nombre:

```text
Kairo_<version>_x64-setup.exe
```

## Release de prueba

Para probar el workflow sin crear un tag, ejecútalo desde la pestaña **Actions** con `workflow_dispatch`. La publicación seguirá usando la versión declarada en `tauri.conf.json`.

## Notas

- El workflow actual publica Windows x64, que es la plataforma soportada por Kairo.
- La firma de código de Windows queda pendiente de configurar antes de una distribución pública amplia.
- Para generar actualizaciones automáticas será necesario añadir el plugin updater de Tauri y firmar los artefactos.
