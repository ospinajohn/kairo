# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

Kairo app

El README principal del proyecto está en [../README.md](../README.md).

## Desarrollo

Desde esta carpeta:

```powershell
pnpm install
pnpm tauri dev
```

## Validación

```powershell
pnpm build
pnpm test
```

## Instalador

```powershell
pnpm tauri build
```

El instalador NSIS se genera en:

```text
src-tauri/target/release/bundle/nsis/Kairo_0.1.0_x64-setup.exe
```
