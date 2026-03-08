#!/bin/bash
# Linux MAC Address Changer
# Run with sudo

if [ "$#" -ne 2 ]; then
    echo "Usage: sudo ./mac-changer-linux.sh  "
    echo "Example: sudo ./mac-changer-linux.sh eth0 00:11:22:33:44:55"
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

# Check if interface exists
if ! ip link show $INTERFACE &> /dev/null; then
    echo "Error: Interface $INTERFACE not found"
    exit 1
fi

# Bring interface down
echo "Bringing interface down..."
ip link set dev $INTERFACE down

# Change MAC address
echo "Setting new MAC address..."
ip link set dev $INTERFACE address $NEW_MAC

# Bring interface up
echo "Bringing interface up..."
ip link set dev $INTERFACE up

# Verify change
CURRENT_MAC=$(ip link show $INTERFACE | grep link/ether | awk '{print $2}')
echo ""
echo "✓ MAC address changed successfully!"
echo "Current MAC: $CURRENT_MAC"
