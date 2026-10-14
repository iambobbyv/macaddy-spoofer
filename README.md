# MAC Address Spoofer

Professional MAC address spoofing application with automated randomization features.

## Features

- 🔄 Scheduled MAC rotation with real privileged changes — each tick applies via one macOS administrator password prompt (explicit opt-in; dismissing a prompt skips that tick and the schedule keeps running)
- 🏢 Vendor-specific MAC addresses (Apple, Intel, Cisco, Dell, HP, Samsung, VMware, Microsoft, Lenovo, Google, Raspberry Pi) from a single consistent taxonomy
- 📊 Multiple interface support (WiFi, Ethernet; Bluetooth is informational only — restricted on modern macOS)
- 🛡️ Honest UI: the dashboard always shows the last verified MAC; generated-but-unapplied values are marked "Pending — not applied"
- 📝 Complete change history tracking (applied / failed / skipped per interface, capped at 500 entries)
- 💾 Save/Load configurations
- 📤 Export history to CSV
- 🖨️ Print-ready reports

## Installation

### Browser Version
1. Open `index.html` in any modern web browser
2. All features work client-side with no server required

### Electron Desktop App
npm install
npm start

### Building Executables
npm run build

## Platform-Specific MAC Changing

### macOS
The app performs changes in-app through a macOS administrator password prompt (one prompt per apply or batch) — no Terminal or sudo setup required. `scripts/mac-changer-macos.sh` remains in the repo for manual use only.

### Windows
Run `scripts/mac-changer-windows.ps1` with administrator privileges

### Linux
Run `scripts/mac-changer-linux.sh` with sudo

## Usage

1. **Select Interface**: Choose WiFi, Ethernet, or Bluetooth adapter
2. **Choose Vendor**: Select from dropdown or use random
3. **Generate/Apply**: Create random MAC or enter custom address
4. **Set Timer**: enable "Apply real changes on each rotation" to opt in, then start the timer — each rotation performs a real privileged change (one admin prompt per tick); dismissed prompts skip that tick and the schedule continues
5. **Track Changes**: View complete history of all changes

## Security Notes

- MAC spoofing may violate network policies
- Use responsibly and only on networks you own or have permission
- Some networks detect MAC changes and may block access
- Applying a change requires administrator approval via the macOS password prompt shown by the app (one prompt per apply/batch); cancelling the prompt leaves everything unchanged
- Randomly generated MACs use the locally-administered bit (first octet `| 0x02`, multicast cleared) so they can't collide with real vendor OUIs or become multicast addresses

## License

MIT License - Use at your own risk

## Support

For issues or questions, please open an issue on the project repository.
