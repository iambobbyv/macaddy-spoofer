# MAC Address Spoofer

Professional MAC address spoofing application with automated randomization features.

## Features

- 🔄 Automated MAC address randomization with customizable timers
- 🏢 Vendor-specific MAC addresses (Cisco, Apple, Intel, Dell, HP, etc.)
- 📊 Multiple interface support (WiFi, Ethernet, Bluetooth)
- 📝 Complete change history tracking
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

### Windows
Run `scripts/mac-changer-windows.ps1` with administrator privileges

### macOS
Run `scripts/mac-changer-macos.sh` with sudo

### Linux
Run `scripts/mac-changer-linux.sh` with sudo

## Usage

1. **Select Interface**: Choose WiFi, Ethernet, or Bluetooth adapter
2. **Choose Vendor**: Select from dropdown or use random
3. **Generate/Apply**: Create random MAC or enter custom address
4. **Set Timer**: Configure automated randomization interval
5. **Track Changes**: View complete history of all changes

## Security Notes

- MAC spoofing may violate network policies
- Use responsibly and only on networks you own or have permission
- Some networks detect MAC changes and may block access
- Administrator/root privileges required for actual MAC changes

## License

MIT License - Use at your own risk

## Support

For issues or questions, please open an issue on the project repository.
