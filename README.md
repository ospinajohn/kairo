# Kairo

 <p align="center">
	 <img src="app/src-tauri/icons/icon.png" alt="Kairo" width="128" height="128">
 </p>

 <p align="center">
	 <strong>Un temporizador Pomodoro de escritorio, local y sin distracciones para Windows.</strong><br>
	 <em>A focused, local-first Pomodoro timer for Windows.</em>
 </p>

 <p align="center">
	 <a href="../../releases/latest">Descargar para Windows / Download for Windows</a>
	 ·
	 <a href="../../releases">Todas las versiones / All releases</a>
 </p>

 <p align="center">
	 <img src="https://img.shields.io/badge/Windows-10%2B-0078D4?logo=windows&logoColor=white" alt="Windows 10 or later">
	 <img src="https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white" alt="Tauri 2">
	 <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111" alt="React 19">
	 <img src="https://img.shields.io/badge/Tests-24%20passing-2EA043" alt="24 tests passing">
 </p>

> **Nota sobre la descarga / Download note:** el enlace abre la release más reciente de GitHub,
> donde se encuentra el instalador correspondiente a esa versión.

## Español

### Qué es

Kairo es una aplicación Pomodoro instalable para Windows. Arranca directamente en el temporizador, funciona de forma local y no requiere cuentas, conexión a internet ni servicios externos.

Su interfaz está diseñada como un pequeño instrumento de concentración: oscuro, silencioso y con el progreso en rojo-naranja como único acento visual.

### Demo

<p align="center">
	<video src="docs/media/kairo-demo.mp4" controls muted loop width="720" aria-label="Demo animada de Kairo"></video>
</p>

La demo se renderiza con [HyperFrames](https://github.com/heygen-com/hyperframes) a partir de
HTML y CSS, sin incorporarlo como dependencia de la aplicación.

### Funciones

- Temporizador de Concentración, Descanso corto y Descanso largo.
- Ciclo Pomodoro configurable con sesiones y descansos.
- Pausar, reanudar, reiniciar y saltar de fase.
- Anillo de progreso animado con indicador de sesión.
- Notificaciones nativas de Windows.
- Configuración persistente de duraciones y preferencias.
- Sonidos opcionales al completar una fase.
- Estadísticas locales: sesiones, minutos, racha y gráfico semanal.
- Exportación e importación de datos en JSON o CSV.
- Bandeja del sistema y restauración de ventana.
- Inicio con Windows, siempre visible y recordar posición/tamaño.
- Modo compacto para mantener el temporizador en segundo plano.
- Instancia única para evitar temporizadores duplicados.
- Interfaz en español y soporte para movimiento reducido.

### Requisitos

- Windows 10 versión 1903 o posterior, o Windows 11.
- Arquitectura x64.
- No requiere permisos de administrador para la instalación estándar.

### Descargas e instalación

Las versiones publicadas están disponibles en [GitHub Releases](../../releases). Cada release
incluye el instalador NSIS para Windows x64.

1.  Descarga `Kairo_<version>_x64-setup.exe` desde el botón superior.
2.  Ejecuta el instalador.
3.  Kairo se instalará para el usuario actual.
4.  Abre Kairo desde el menú Inicio.

El instalador es NSIS y actualmente ocupa aproximadamente 2,35 MiB.

Las releases se generan automáticamente al publicar un tag con formato `vX.Y.Z`. Consulta
[RELEASING.md](RELEASING.md) para publicar una nueva versión.

### Privacidad

- No hay cuentas ni autenticación.
- No se envían datos a servidores.
- No hay telemetría.
- Las estadísticas se guardan localmente en SQLite.
- La configuración se almacena localmente.
- La aplicación funciona sin conexión a internet.

### Desarrollo

#### Requisitos del entorno

- Node.js 18 LTS o posterior.
- pnpm.
- Rust estable mediante `rustup`.
- Visual Studio Build Tools para Windows.

#### Comandos

Desde la carpeta `app/`:

```powershell
pnpm install
pnpm tauri dev
```

Comprobaciones:

```powershell
pnpm build
pnpm test
```

Crear el instalador:

```powershell
pnpm tauri build
```

El instalador se genera en:

```text
app/src-tauri/target/release/bundle/nsis/Kairo_0.1.0_x64-setup.exe
```

### Estructura del proyecto

```text
.
├── app/
│   ├── src/                 # Interfaz React, hooks, lógica y estilos
│   └── src-tauri/           # Ventana, bandeja, notificaciones y empaquetado
├── docs/                    # Producto, requisitos, diseño y decisiones
├── AGENTS.md                # Guía de colaboración del repositorio
└── README.md
```

### Documentación

- [Producto y alcance](docs/product.md)
- [Requisitos](docs/requirements.md)
- [Sistema visual](docs/design.md)
- [Plan técnico](docs/plan.md)
- [Tareas y verificaciones](docs/tasks.md)
- [Decisiones](docs/decisions.md)
- [Estado actual](docs/handoff.md)
- [Publicar una versión](RELEASING.md)

## English

### What it is

Kairo is an installable Pomodoro desktop app for Windows. It opens directly on the timer, runs locally, and requires no account, internet connection, or external service.

Its interface is designed as a small focus instrument: dark, quiet, and centered around a warm red-orange progress accent.

### Demo

<p align="center">
	<video src="docs/media/kairo-demo.mp4" controls muted loop width="720" aria-label="Animated Kairo demo"></video>
</p>

The demo is rendered with [HyperFrames](https://github.com/heygen-com/hyperframes) from HTML and
CSS, without adding it as an application runtime dependency.

### Features

- Focus, Short Break, and Long Break timers.
- Configurable Pomodoro cycle with custom sessions and breaks.
- Pause, resume, reset, and skip phase controls.
- Animated progress ring with session indicator.
- Native Windows notifications.
- Persistent duration and preference settings.
- Optional sounds when a phase ends.
- Local statistics: sessions, minutes, streak, and weekly chart.
- JSON and CSV data import/export.
- System tray support and window restoration.
- Windows startup, always-on-top, and remembered position/size.
- Compact mode for keeping the timer in the background.
- Single-instance protection to prevent duplicate timers.
- Spanish interface and reduced-motion support.

### Requirements

- Windows 10 version 1903 or later, or Windows 11.
- x64 architecture.
- Standard installation does not require administrator privileges.

### Download and installation

Published versions are available in [GitHub Releases](../../releases). Each release includes
the NSIS installer for Windows x64.

1.  Download `Kairo_<version>_x64-setup.exe` using the button at the top.
2.  Run the installer.
3.  Kairo will install for the current user.
4.  Launch Kairo from the Start menu.

The installer uses NSIS and is currently approximately 2.35 MiB.

Releases are generated automatically when a tag matching `vX.Y.Z` is pushed. See
[RELEASING.md](RELEASING.md) for the release procedure.

### Privacy

- No accounts or authentication.
- No data is sent to external servers.
- No telemetry.
- Statistics are stored locally in SQLite.
- Configuration is stored locally.
- The application works offline.

### Development

#### Environment requirements

- Node.js 18 LTS or later.
- pnpm.
- Stable Rust through `rustup`.
- Visual Studio Build Tools for Windows.

#### Commands

From the `app/` directory:

```powershell
pnpm install
pnpm tauri dev
```

Checks:

```powershell
pnpm build
pnpm test
```

Build the installer:

```powershell
pnpm tauri build
```

The installer is generated at:

```text
app/src-tauri/target/release/bundle/nsis/Kairo_0.1.0_x64-setup.exe
```

### Project structure

```text
.
├── app/
│   ├── src/                 # React UI, hooks, logic, and styles
│   └── src-tauri/           # Window, tray, notifications, and packaging
├── docs/                    # Product, requirements, design, and decisions
├── AGENTS.md                # Repository collaboration guide
└── README.md
```

### Documentation

- [Product and scope](docs/product.md)
- [Requirements](docs/requirements.md)
- [Visual system](docs/design.md)
- [Technical plan](docs/plan.md)
- [Tasks and verification](docs/tasks.md)
- [Decisions](docs/decisions.md)
- [Current handoff](docs/handoff.md)
- [Publishing a release](RELEASING.md)

## License

No se ha definido todavía una licencia pública para el proyecto. / A public project license has not been defined yet.
