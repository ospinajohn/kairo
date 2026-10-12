// ============================================================
// Kairo — Backend Rust
// ============================================================

use std::sync::{Arc, Mutex};
use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Emitter, Listener, WindowEvent,
};

#[derive(Clone, serde::Serialize)]
struct SingleInstancePayload {
    args: Vec<String>,
    cwd:  String,
}

#[derive(Clone, serde::Deserialize)]
struct MinimizeToTrayPayload {
    enabled: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        // PRO-05: instancia única — debe ir PRIMERO
        .plugin(tauri_plugin_single_instance::init(|app, argv, cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
            let _ = app.emit("single-instance", SingleInstancePayload { args: argv, cwd });
        }))
        // PRO-06: recordar posición y tamaño
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // Notificaciones nativas
        .plugin(tauri_plugin_notification::init())
        // PRO-04: inicio con Windows
        .plugin(tauri_plugin_autostart::Builder::new().build())
        // Abrir URLs externas
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            // ── Estado compartido: ¿minimizar a bandeja al cerrar? ──
            // Default true — se actualiza desde el frontend vía evento
            let minimize_to_tray = Arc::new(Mutex::new(true));

            // ── Menú de la bandeja ──
            let show_i = MenuItem::with_id(app, "show", "Mostrar Kairo", true, None::<&str>)?;
            let quit_i = MenuItem::with_id(app, "quit", "Cerrar",        true, None::<&str>)?;
            let menu   = Menu::with_items(app, &[&show_i, &quit_i])?;

            // ── Ícono en la bandeja ──
            TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .tooltip("Kairo — Temporizador Pomodoro")
                .menu(&menu)
                .show_menu_on_left_click(false)
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event {
                        let app = tray.app_handle();
                        if let Some(win) = app.get_webview_window("main") {
                            let _ = win.unminimize();
                            let _ = win.show();
                            let _ = win.set_focus();
                        }
                    }
                })
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "show" => {
                        if let Some(win) = app.get_webview_window("main") {
                            let _ = win.unminimize();
                            let _ = win.show();
                            let _ = win.set_focus();
                        }
                    }
                    "quit" => app.exit(0),
                    _ => {}
                })
                .build(app)?;

            // ── Escuchar cambios del switch "Minimizar a bandeja" ──
            let mtt_for_listener = Arc::clone(&minimize_to_tray);
            app.listen("minimize-to-tray-changed", move |event| {
                if let Ok(payload) = serde_json::from_str::<MinimizeToTrayPayload>(event.payload()) {
                    if let Ok(mut val) = mtt_for_listener.lock() {
                        *val = payload.enabled;
                    }
                }
            });

            // ── Interceptar cierre de ventana ──
            let handle = app.handle().clone();
            let mtt_for_event = Arc::clone(&minimize_to_tray);
            let main_win = app.get_webview_window("main").unwrap();
            main_win.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    let should_minimize = mtt_for_event.lock()
                        .map(|v| *v)
                        .unwrap_or(true);

                    if should_minimize {
                        // Minimizar a bandeja en lugar de cerrar
                        api.prevent_close();
                        if let Some(win) = handle.get_webview_window("main") {
                            let _ = win.hide();
                        }
                    }
                    // Si should_minimize es false, el cierre procede normalmente
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error al iniciar Kairo");
}
