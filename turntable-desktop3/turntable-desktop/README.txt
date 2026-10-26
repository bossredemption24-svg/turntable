TURNTABLE – desktop app (Electron)
==================================
What you get: a Windows installer (.exe), a macOS disk image (.dmg), and Linux packages (.AppImage, .deb).
Each installer must be built on its own operating system. Two ways to do that:

OPTION A – build on your own computer
  1. Install Node.js 20 or newer from nodejs.org.
  2. Open a terminal in this folder and run:   npm install
  3. Try it first:                             npm start
  4. Build the installer for your system:      npm run dist
  The installer appears in the "dist" folder.
     Windows -> Turntable-Setup-1.0.0.exe   |   macOS -> Turntable-1.0.0-<arch>.dmg   |   Linux -> .AppImage and .deb
  Build on Windows to get the .exe, on a Mac to get the .dmg, on Linux for the Linux packages.

OPTION B – build all three with no local setup (GitHub)
  1. Create a free GitHub account and a new repository.
  2. Upload everything in this folder, including the hidden ".github" folder
     (on Mac press Cmd+Shift+. in Finder to show hidden folders).
  3. Open the repository's "Actions" tab, choose "Build installers", press "Run workflow".
  4. When it finishes (about 5-10 minutes), open the run and download the artifacts.
     Each one contains that system's installer.

Using the app
  - Add songs with the button or by dragging files in, like the web version.
  - After installing, you can right-click an audio file and choose Open with > Turntable.
    Opening a file while Turntable is running adds it to the queue.
  - Saved playlists, themes and equalizer settings are kept in the app's own storage on your computer.

First-run warnings (expected)
  The installers are not code-signed, so the operating system shows a caution once.
  Windows: "Windows protected your PC" -> More info -> Run anyway.
  macOS: right-click the app -> Open -> Open (or System Settings > Privacy & Security > Open Anyway).
  Removing these warnings needs a paid code-signing certificate (Windows) and an Apple Developer account (macOS).

Updating Electron
  The project pins Electron 33. To move to the newest version run:
     npm install --save-dev electron@latest electron-builder@latest


TROUBLESHOOTING THE WINDOWS INSTALLER
  1. Unzip first. GitHub gives you a .zip containing the .exe. Run the .exe from a normal folder
     (for example Desktop), not from inside the zip preview.
  2. SmartScreen: right-click the .exe > Properties > tick "Unblock" > OK, then run it again.
     Or in the blue "Windows protected your PC" window click More info > Run anyway.
  3. Antivirus: unsigned installers are sometimes quarantined. Check your antivirus history and allow the file.
  4. No install needed: run Turntable-Portable-1.0.0.exe, which is a single file that starts the app directly.
  5. Still failing: download the "turntable-windows-unpacked" artifact, unzip it, and double-click Turntable.exe.
     If that opens, only the installer is the problem. If it does not, note the exact error message.


WHAT'S NEW IN 1.1.0
  - Mini player: the small button at the top-right of the player shrinks the window to a compact,
    always-on-top player. Press it again to restore the normal window.
  - Album art and titles now also work for FLAC and M4A files (as well as MP3).
  - Playback speed (0.75x to 2x) and crossfade (fade out and in between songs) are in the Tune tab.
  - Auto-update (Windows installer, Linux AppImage, signed macOS builds). See below.

AUTO-UPDATE SETUP (one time)
  1. In package.json, under "build" > "publish", replace YOUR_GITHUB_USERNAME and YOUR_REPO_NAME
     with your GitHub account and repository name.
  2. Ship a release: raise "version" in package.json (for example 1.2.0), commit, then run
        git tag v1.2.0
        git push --tags
     The "Build installers" workflow builds everything and publishes a GitHub Release.
  3. People who already have the app installed get the new version the next time they open it.
  Notes: the portable .exe does not auto-update. On macOS, updates only work once the app is signed
  and notarized (see SIGNING.md). Auto-update needs the repository to be public, or a token for private ones.
