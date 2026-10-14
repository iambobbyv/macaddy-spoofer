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

MAC Addy Spoofer is distributed **directly** — it is not on the Mac App Store
(MAC spoofing requires administrator privileges that the App Store sandbox
does not allow).

1. Download the latest `MAC Addy Spoofer-<version>-arm64.dmg` (Apple Silicon)
   or `-x64.dmg` (Intel) from [souriapps.net](https://souriapps.net) or the
   [GitHub releases page](https://github.com/iambobbyv/macaddy-spoofer/releases).
2. Open the `.dmg` and drag **MAC Addy Spoofer** into Applications.
3. Launch the app. Release builds are signed + notarized, so Gatekeeper
   accepts them on first launch.
   - **Unsigned / self-built copies:** right-click the app, choose **Open**,
     then confirm — this clears the one-time Gatekeeper warning.
4. Applying a MAC change prompts once for your administrator password (the
   app runs a privileged `ifconfig` command through macOS authorization).

### Run from source (development)

```sh
npm install
npm start
```

### Building installers

```sh
npm run build            # current platform (macOS: DMG + ZIP, Linux: AppImage)
npm run build:mac:arm64  # Apple Silicon DMG
npm run build:mac:x64    # Intel DMG
npm run build:mac        # both architectures
```

Unsigned CI validation builds run automatically on every PR
(see `.github/workflows/build.yml`).

## Release signing & notarization

Release builds are code-signed with a **Developer ID Application**
certificate and notarized so Gatekeeper accepts them. This requires:

- Apple Developer Program membership
- the Developer ID certificate in your login Keychain
- a `.env` file (copy `.env.example`) with `APPLE_ID`,
  `APPLE_APP_PASSWORD` (app-specific password), and `APPLE_TEAM_ID`

Without these, `scripts/notarize.js` skips notarization automatically and
the build stays unsigned — fine for local testing, not for distribution.
Never commit `.env` (it is gitignored).

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
