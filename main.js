// main.js — MAC Addy Spoofer — Electron main process
// Distribution: Developer ID signed + Notarized (Gatekeeper-compliant)

const { app, BrowserWindow, ipcMain, dialog, Menu, shell } = require('electron');
const path = require('path');
const { execFile, exec } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';

app.setName('MAC Addy Spoofer');

// ── Window factory ───────────────────────────────────────────────────────────
function createWindow() {
    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 900,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 16, y: 20 },
        backgroundColor: '#070b14',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: isDev,
            sandbox: false
        },
        icon: path.join(__dirname, 'assets', 'icon.png'),
        show: false
    });

    win.once('ready-to-show', () => {
        win.show();
        buildMenu(win); // build menu after window exists so clicks can target it
    });

    win.loadFile('index.html');
    if (isDev) win.webContents.openDevTools();

    return win;
}

// ── App lifecycle ────────────────────────────────────────────────────────────
app.whenReady().then(() => {
    app.setAboutPanelOptions({
        applicationName: 'MAC Addy Spoofer',
        applicationVersion: app.getVersion() || '1.0.0',
        copyright: '© 2026 SOURI APPS LLC. All rights reserved.',
        credits: 'Built with Electron'
    });

    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// ── Menu helper ──────────────────────────────────────────────────────────────
function send(channel, data) {
    const win = BrowserWindow.getAllWindows()[0];
    if (win) win.webContents.send(channel, data);
}

function buildMenu(win) {
    const template = [
        // ── App ──────────────────────────────────────────────────────────────
        {
            label: 'MAC Addy Spoofer',
            submenu: [
                { role: 'about' },
                { type: 'separator' },
                {
                    label: 'Preferences…',
                    accelerator: 'Cmd+,',
                    click: () => send('menu:navigate', 'settings')
                },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideOthers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]
        },

        // ── File ─────────────────────────────────────────────────────────────
        {
            label: 'File',
            submenu: [
                {
                    label: 'Save Configuration…',
                    accelerator: 'Cmd+S',
                    click: () => send('menu:action', 'saveConfig')
                },
                {
                    label: 'Load Configuration…',
                    accelerator: 'Cmd+O',
                    click: () => send('menu:action', 'loadConfig')
                },
                { type: 'separator' },
                {
                    label: 'Export History as CSV…',
                    accelerator: 'Cmd+E',
                    click: () => send('menu:action', 'exportHistory')
                },
                {
                    label: 'Clear History…',
                    click: () => send('menu:action', 'clearHistory')
                },
                { type: 'separator' },
                { role: 'close' }
            ]
        },

        // ── Edit ─────────────────────────────────────────────────────────────
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { role: 'selectAll' },
                { type: 'separator' },
                {
                    label: 'Copy Current MAC Address',
                    accelerator: 'Cmd+Shift+C',
                    click: () => send('menu:action', 'copyMAC')
                }
            ]
        },

        // ── Interface ────────────────────────────────────────────────────────
        {
            label: 'Interface',
            submenu: [
                {
                    label: 'Wi-Fi',
                    accelerator: 'Cmd+1',
                    click: () => send('menu:switchIface', 'WiFi')
                },
                {
                    label: 'Ethernet',
                    accelerator: 'Cmd+2',
                    click: () => send('menu:switchIface', 'Ethernet')
                },
                {
                    label: 'Bluetooth',
                    accelerator: 'Cmd+3',
                    click: () => send('menu:switchIface', 'Bluetooth')
                },
                { type: 'separator' },
                {
                    label: 'Apply MAC Address',
                    accelerator: 'Cmd+Return',
                    click: () => send('menu:action', 'applyMAC')
                },
                {
                    label: 'Generate Random MAC',
                    accelerator: 'Cmd+G',
                    click: () => send('menu:action', 'generateRandom')
                },
                {
                    label: 'Refresh from System',
                    accelerator: 'Cmd+Shift+F',
                    click: () => send('menu:action', 'refreshMAC')
                },
                { type: 'separator' },
                {
                    label: 'Randomize All Interfaces',
                    accelerator: 'Cmd+Shift+G',
                    click: () => send('menu:action', 'randomizeAll')
                },
                {
                    label: 'Restore All to Original',
                    accelerator: 'Cmd+Shift+Z',
                    click: () => send('menu:action', 'restoreAll')
                }
            ]
        },

        // ── View ─────────────────────────────────────────────────────────────
        {
            label: 'View',
            submenu: [
                {
                    label: 'Dashboard',
                    accelerator: 'Cmd+Option+1',
                    click: () => send('menu:navigate', 'dashboard')
                },
                {
                    label: 'Automation',
                    accelerator: 'Cmd+Option+2',
                    click: () => send('menu:navigate', 'automation')
                },
                {
                    label: 'History',
                    accelerator: 'Cmd+Option+3',
                    click: () => send('menu:navigate', 'history')
                },
                {
                    label: 'Settings',
                    accelerator: 'Cmd+Option+4',
                    click: () => send('menu:navigate', 'settings')
                },
                {
                    label: 'About & Support',
                    accelerator: 'Cmd+Option+5',
                    click: () => send('menu:navigate', 'about')
                },
                { type: 'separator' },
                ...(isDev ? [
                    { role: 'reload' },
                    { role: 'forceReload' },
                    { role: 'toggleDevTools' },
                    { type: 'separator' }
                ] : []),
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },

        // ── Window ───────────────────────────────────────────────────────────
        {
            role: 'window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ]
        },

        // ── Help ─────────────────────────────────────────────────────────────
        {
            role: 'help',
            submenu: [
                {
                    label: 'Send Feedback…',
                    click: () => send('menu:action', 'sendFeedback')
                },
                {
                    label: 'Report a Problem…',
                    click: () => send('menu:action', 'reportBug')
                },
                { type: 'separator' },
                {
                    label: 'About & Support',
                    click: () => send('menu:navigate', 'about')
                }
            ]
        }
    ];

    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── IPC: Confirm dialog (replaces browser confirm()) ─────────────────────────
ipcMain.handle('dialog:confirm', async (_event, { title, message, detail, confirmLabel = 'Confirm', cancelLabel = 'Cancel' }) => {
    const win = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0];
    const { response } = await dialog.showMessageBox(win, {
        type: 'warning',
        buttons: [cancelLabel, confirmLabel],
        defaultId: 1,
        cancelId: 0,
        title,
        message,
        detail
    });
    return response === 1; // true = user confirmed
});

// ── IPC: Open external URL / mailto in default app ───────────────────────────
ipcMain.handle('shell:openExternal', async (_event, url) => {
    // Only allow mailto: and https: URLs
    if (/^(mailto:|https:\/\/)/.test(url)) {
        await shell.openExternal(url);
        return { ok: true };
    }
    return { ok: false, reason: 'Disallowed URL scheme' };
});

// ── IPC: Test network connection for an interface ────────────────────────────
ipcMain.handle('net:testConnection', async (_event, iface) => {
    return new Promise((resolve) => {
        try {
            sanitizeIface(iface);
        } catch (e) {
            resolve({ ok: false, status: 'Invalid interface name', ip: null });
            return;
        }

        const child = execFile('ifconfig', [iface]);
        let stdout = '';
        let stderr = '';

        child.stdout.on('data', d => { stdout += d.toString(); });
        child.stderr.on('data', d => { stderr += d.toString(); });

        child.on('error', () => resolve({ ok: false, status: 'Interface not found', ip: null }));

        child.on('exit', code => {
            if (code !== 0) {
                resolve({ ok: false, status: 'Interface not found', ip: null });
                return;
            }

            const isUp      = /flags=\d+<[^>]*\bUP\b/.test(stdout);
            const isRunning = /flags=\d+<[^>]*\bRUNNING\b/.test(stdout);
            const isActive  = /status:\s*active/i.test(stdout);
            const ipMatch   = stdout.match(/inet\s+(\d+\.\d+\.\d+\.\d+)/);
            const ip        = ipMatch ? ipMatch[1] : null;
            const macMatch  = stdout.match(/ether\s+([0-9a-f:]+)/i);
            const mac       = macMatch ? macMatch[1].toUpperCase() : null;

            let status;
            if (isUp && (isRunning || isActive) && ip) status = 'Connected';
            else if (isUp && (isRunning || isActive) && !ip) status = 'Up — no IP assigned';
            else if (isUp && !isRunning && !isActive) status = 'Up — no link';
            else status = 'Interface down';

            resolve({
                ok: isUp && (isRunning || isActive) && !!ip,
                status,
                ip,
                mac,
                up: isUp,
                running: isRunning || isActive
            });
        });
    });
});

// ── IPC: Change MAC (osascript admin elevation) ──────────────────────────────
ipcMain.handle('mac:change', async (_event, { iface, newMac }) => {
    try {
        const safeIface = sanitizeIface(iface);
        const safeMac   = sanitizeMac(newMac);
        const scriptPath = path.join(__dirname, 'scripts', 'mac-changer-macos.sh');
        const shellCmd  = `bash '${scriptPath}' '${safeIface}' '${safeMac}'`;

        return await runWithAdminPrivileges(shellCmd);

    } catch (err) {
        const cancelled = /(-128|cancelled|canceled)/i.test(err.message);
        if (!cancelled) {
            dialog.showErrorBox(
                'MAC Change Failed',
                [
                    err.message,
                    '',
                    'Common causes:',
                    '• The interface may be down or not support MAC spoofing.',
                    '• Bluetooth MAC changes are restricted on newer macOS.',
                    '• Try Wi-Fi (en0) or Ethernet (en1/en2) instead.',
                    '',
                    'The macOS password dialog must be completed to apply changes.'
                ].join('\n')
            );
        }
        throw err;
    }
});

// ── IPC: Get current MAC ─────────────────────────────────────────────────────
ipcMain.handle('mac:getCurrent', async (_event, iface) => {
    return new Promise((resolve, reject) => {
        try {
            const safeIface = sanitizeIface(iface);
            const child = execFile('ifconfig', [safeIface]);
            let stdout = '';
            let stderr = '';
            child.stdout.on('data', d => { stdout += d.toString(); });
            child.stderr.on('data', d => { stderr += d.toString(); });
            child.on('error', err => reject(err));
            child.on('exit', code => {
                if (code !== 0) return reject(new Error(stderr || `ifconfig exited with code ${code}`));
                const match = stdout.match(/ether\s+([0-9a-f:]+)/i);
                resolve(match ? match[1].toUpperCase() : null);
            });
        } catch (err) { reject(err); }
    });
});

// ── Helpers ──────────────────────────────────────────────────────────────────
function runWithAdminPrivileges(shellCmd) {
    return new Promise((resolve, reject) => {
        const osaScript = `do shell script ${JSON.stringify(shellCmd)} with administrator privileges`;
        exec(`osascript -e ${JSON.stringify(osaScript)}`, (err, stdout, stderr) => {
            if (err) reject(new Error(stderr.trim() || err.message));
            else resolve({ ok: true, output: stdout.trim() });
        });
    });
}

function sanitizeIface(iface) {
    if (!/^[a-zA-Z0-9]+$/.test(iface)) throw new Error(`Invalid interface name: ${iface}`);
    return iface;
}

function sanitizeMac(mac) {
    if (!/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac)) throw new Error(`Invalid MAC address: ${mac}`);
    return mac.toLowerCase();
}
