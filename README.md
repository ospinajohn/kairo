# Kairo

Aplicación de temporizador Pomodoro instalable para Windows.
Interfaz visual oscura, funcionamiento completamente local, sin cuentas ni conexión a internet.

## Estado del proyecto

En definición. La documentación inicial está lista y esperando aprobación del responsable.
No hay código de aplicación todavía.

## Documentación

Lee [`AGENTS.md`](AGENTS.md) primero. Contiene el orden de lectura, el flujo de trabajo
y las reglas para colaboradores e IAs.

La documentación completa está en [`docs/`](docs/):

| Archivo                                        | Contenido                                       |
| ---------------------------------------------- | ----------------------------------------------- |
| [`docs/index.md`](docs/index.md)               | Mapa de la documentación                        |
| [`docs/product.md`](docs/product.md)           | Qué es Kairo y su alcance                       |
| [`docs/requirements.md`](docs/requirements.md) | Requisitos funcionales y no funcionales         |
| [`docs/design.md`](docs/design.md)             | Sistema visual (colores, tipografía, pantallas) |
| [`docs/plan.md`](docs/plan.md)                 | Stack técnico — disponible en Etapa 2           |
| [`docs/tasks.md`](docs/tasks.md)               | Tareas con estado y dependencias                |
| [`docs/decisions.md`](docs/decisions.md)       | Registro de decisiones importantes              |
| [`docs/handoff.md`](docs/handoff.md)           | Estado actual y próximos pasos                  |

## Alcance

**MVP** — temporizador funcional con notificaciones nativas, configuración persistente
y ventana sin bordes arrastrable.

**Pro/escritorio** — bandeja del sistema, estadísticas locales, inicio con Windows,
modo compacto, sonidos opcionales y exportación de datos.

Plataforma: Windows 10 (≥ 1903) / Windows 11, x64.
Distribución: instalador `.exe`.

## Comandos de desarrollo

No disponibles todavía. El stack técnico se definirá en la Etapa 2.

# Kairo

 <p align="center">
	 <img src="app/src-tauri/icons/icon.png" alt="Kairo" width="128" height="128">
 </p>

 <p align="center">
	 <strong>Un temporizador Pomodoro de escritorio, local y sin distracciones para Windows.</strong><br>
	 <em>A focused, local-first Pomodoro timer for Windows.</em>
 </p>

 <p align="center">
	 <a href="../../releases/latest/download/Kairo_0.1.0_x64-setup.exe">Descargar para Windows / Download for Windows</a>
	 ·
	 <a href="../../releases">Todas las versiones / All releases</a>
 </p>

 <p align="center">
	 <img src="https://img.shields.io/badge/Windows-10%2B-0078D4?logo=windows&logoColor=white" alt="Windows 10 or later">
	 <img src="https://img.shields.io/badge/Tauri-2.x-24C8DB?logo=tauri&logoColor=white" alt="Tauri 2">
	 <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111111" alt="React 19">
	 <img src="https://img.shields.io/badge/Tests-24%20passing-2EA043" alt="24 tests passing">
 </p>

> **Nota sobre la descarga / Download note:** el enlace apunta al instalador de la release más reciente de GitHub. Para que funcione, el asset debe publicarse con el nombre exacto `Kairo_0.1.0_x64-setup.exe`.

## Español

### Qué es

Kairo es una aplicación Pomodoro instalable para Windows. Arranca directamente en el temporizador, funciona de forma local y no requiere cuentas, conexión a internet ni servicios externos.

Su interfaz está diseñada como un pequeño instrumento de concentración: oscuro, silencioso y con el progreso en rojo-naranja como único acento visual.

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

### Instalación

1.  Descarga `Kairo_0.1.0_x64-setup.exe` desde el botón superior.
2.  Ejecuta el instalador.
3.  Kairo se instalará para el usuario actual.
4.  Abre Kairo desde el menú Inicio.

El instalador es NSIS y actualmente ocupa aproximadamente 2,35 MiB.

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

## English

### What it is

Kairo is an installable Pomodoro desktop app for Windows. It opens directly on the timer, runs locally, and requires no account, internet connection, or external service.

Its interface is designed as a small focus instrument: dark, quiet, and centered around a warm red-orange progress accent.

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

### Installation

1.  Download `Kairo_0.1.0_x64-setup.exe` using the button at the top.
2.  Run the installer.
3.  Kairo will install for the current user.
4.  Launch Kairo from the Start menu.

The installer uses NSIS and is currently approximately 2.35 MiB.

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

## License

No se ha definido todavía una licencia pública para el proyecto. / A public project license has not been defined yet.
