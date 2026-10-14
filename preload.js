// preload.js — MAC Addy Spoofer — secure context bridge

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('macApi', {

    // ── MAC address IPC ───────────────────────────────────────────────────────
    changeMac: (iface, newMac) =>
        ipcRenderer.invoke('mac:change', { iface, newMac }),

    // Batch change — applies to several interfaces with a single admin prompt.
    // changes: [{ iface, newMac }] → { results: [{ iface, requested, actual, ok, error? }] }
    changeMacBatch: (changes) =>
        ipcRenderer.invoke('mac:changeBatch', { changes }),

    getCurrentMac: (iface) =>
        ipcRenderer.invoke('mac:getCurrent', iface),

    // ── Network test (real ifconfig check, not simulated) ─────────────────────
    testConnection: (iface) =>
        ipcRenderer.invoke('net:testConnection', iface),

    // ── Native confirm dialog (replaces browser confirm()) ────────────────────
    confirm: ({ title, message, detail, confirmLabel, cancelLabel }) =>
        ipcRenderer.invoke('dialog:confirm', { title, message, detail, confirmLabel, cancelLabel }),

    // ── Open mailto: or https: in the default app ─────────────────────────────
    openExternal: (url) =>
        ipcRenderer.invoke('shell:openExternal', url),

    // ── Menu action listener ──────────────────────────────────────────────────
    // Receives events sent from the native menu via win.webContents.send()
    onMenuAction: (callback) => {
        ipcRenderer.on('menu:action', (_event, action) => callback(action));
    },

    onMenuNavigate: (callback) => {
        ipcRenderer.on('menu:navigate', (_event, view) => callback(view));
    },

    onMenuSwitchIface: (callback) => {
        ipcRenderer.on('menu:switchIface', (_event, iface) => callback(iface));
    }
});

// ── App metadata ──────────────────────────────────────────────────────────────
// Separate namespace from macApi so version reads stay available even if the
// MAC IPC surface changes. The renderer calls this defensively
// (window.macaddy?.getVersion?.()) for data-driven version labels.
contextBridge.exposeInMainWorld('macaddy', {

    // App version from package.json (via app.getVersion()).
    getVersion: () =>
        ipcRenderer.invoke('app:getVersion')
});
