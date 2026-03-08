#!/bin/bash
# macOS MAC Address Changer
# Run with sudo

if [ "$#" -ne 2 ]; then
    echo "Usage: sudo ./mac-changer-macos.sh  "
    echo "Example: sudo ./mac-changer-macos.sh en0 00:11:22:33:44:55"
    exit 1
fi

INTERFACE=$1
NEW_MAC=$2

echo "Changing MAC address for $INTERFACE to $NEW_MAC"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Error: This script must be run as root (use sudo)"
    exit 1
fi

# Disable interface
echo "Disabling interface..."
ifconfig $INTERFACE down

# Change MAC address
echo "Setting new MAC address..."
ifconfig $INTERFACE ether $NEW_MAC

# Enable interface
echo "Enabling interface..."
ifconfig $INTERFACE up

# Verify change
CURRENT_MAC=$(ifconfig $INTERFACE | grep ether | awk '{print $2}')
echo ""
echo "✓ MAC address changed successfully!"
echo "Current MAC: $CURRENT_MAC"
