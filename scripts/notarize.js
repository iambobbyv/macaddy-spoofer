/**
 * scripts/notarize.js
 * ─────────────────────────────────────────────────────────────────────────────
 * electron-builder afterSign hook — called automatically after code-signing.
 *
 * Prerequisites (one-time setup):
 *   1. Enroll in the Apple Developer Program (https://developer.apple.com)
 *   2. Create an App-Specific Password at appleid.apple.com for notarytool
 *   3. Copy .env.example → .env and fill in your credentials
 *   4. Make sure "Developer ID Application: Your Name (TEAM_ID)" cert is in Keychain
 *
 * Environment variables (set in .env or CI/CD secrets):
 *   APPLE_ID           – your Apple ID email
 *   APPLE_APP_PASSWORD – app-specific password from appleid.apple.com
 *   APPLE_TEAM_ID      – 10-character Team ID from developer.apple.com/account
 *   APPLE_ID_CERT      – (optional) exact cert name, e.g. "Developer ID Application: Bobby V (ABCD123456)"
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

require('dotenv').config();
const { notarize } = require('@electron/notarize');

module.exports = async function afterSign(context) {
    const { electronPlatformName, appOutDir, packager } = context;

    // Only notarize on macOS builds
    if (electronPlatformName !== 'darwin') return;

    const appName   = packager.appInfo.productFilename;
    const appPath   = `${appOutDir}/${appName}.app`;
    const appleId   = process.env.APPLE_ID;
    const password  = process.env.APPLE_APP_PASSWORD;
    const teamId    = process.env.APPLE_TEAM_ID;

    // Skip notarization if credentials are not set (local dev builds)
    if (!appleId || !password || !teamId) {
        console.log('⚠️  Notarization skipped: APPLE_ID / APPLE_APP_PASSWORD / APPLE_TEAM_ID not set.');
        console.log('   Set these in .env to enable notarization for distribution builds.');
        return;
    }

    console.log(`\n🔏 Notarizing ${appName} (${appPath})…`);
    console.log(`   Apple ID: ${appleId} | Team: ${teamId}`);

    try {
        await notarize({
            tool:     'notarytool',
            appPath,
            appleId,
            appleIdPassword: password,
            teamId
        });
        console.log(`✅ Notarization complete — ${appName} is ready for distribution.\n`);
    } catch (err) {
        console.error('❌ Notarization failed:', err.message);
        throw err;
    }
};
