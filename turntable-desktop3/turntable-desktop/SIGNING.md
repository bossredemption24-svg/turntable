# Code signing guide

Signing removes the "unknown publisher" warnings (Windows SmartScreen, macOS Gatekeeper) and is required
for macOS auto-update. It needs paid accounts, so it is optional. Prices and rules change; check each
provider before buying.

## Windows
Pick one:
- **Azure Trusted Signing** (Microsoft's service, roughly $10/month; availability depends on your country and
  whether you are an individual or organization). In package.json under build.win add
  `"azureSignOptions": { "publisherName": "...", "endpoint": "...", "certificateProfileName": "...", "codeSigningAccountName": "..." }`
  and add repository secrets AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET.
- **A code-signing certificate** from a certificate authority (typically a few hundred dollars per year).
  Export it as a .pfx, base64-encode it, and add repository secrets CSC_LINK (the base64 text) and CSC_KEY_PASSWORD.

SmartScreen reputation can still take a while to build on new certificates.

## macOS
1. Join the Apple Developer Program (about $99/year).
2. In your developer account create a "Developer ID Application" certificate, export it as .p12,
   base64-encode it, and add secrets CSC_LINK and CSC_KEY_PASSWORD.
3. Create an app-specific password at appleid.apple.com and add secrets APPLE_ID,
   APPLE_APP_SPECIFIC_PASSWORD and APPLE_TEAM_ID.
4. In package.json under build.mac add `"hardenedRuntime": true` and `"notarize": true`.

## Turn signing on in the workflow
In .github/workflows/build.yml, delete the line `CSC_IDENTITY_AUTO_DISCOVERY: false` and add the secrets
above to the build step's `env:` block, for example `CSC_LINK: ${{ secrets.CSC_LINK }}`.

Electron Builder's options change between versions; if a setting is rejected, check its code-signing docs.
