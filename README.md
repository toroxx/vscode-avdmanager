# Android Virtual Device (AVD) Manager

AVD Manager GUI for Visual Studio Code.
Launch android emulator without touching the Android Studio😎

See the [CHANGELOG](CHANGELOG.md) for the latest changes.

inspired by [oognuyh/vscode-android-emulator-helper](https://github.com/oognuyh/vscode-android-emulator-helper)

## Install

- VSCode Marketplace
  [https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager](https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager)
- Open-VSX
  [https://open-vsx.org/extension/toroxx/vscode-avdmanager](https://open-vsx.org/extension/toroxx/vscode-avdmanager)

## Features

### AVD Manager

Create AVD (+ Button)

![img](image/README/1647306492723.png)

Rename AVD [Pen Icon Button]

![img](image/README/1647306376053.png)

Delete AVD [Right Click on AVD Name]

![img](image/README/1647306333965.png)

AVD Details [Mouseover on the AVD name]

![img](image/README/1647306806230.png)

### SDK Platforms / Tools

Install packages (system-image, platforms, source-code)

![img](image/README/1647306155699.png)

Install SDK Tools E.g. Build-tools, cmake, emulator, etc.

![img](image/README/1647538210189.png)

Package Detail

![](image/README/1647666693038.png)

Accept All SDK licenses [Double Check icon Button]

Update All SDK Package [Sync icon button]

![](image/README/1647666810384.png)


### Emulator

Launch AVD [Play icon Button]

![img](image/README/1647306185675.png)

Emulator Log

![img](image/README/1647618267801.png)

## Requirements

1. Download Android SDK Command-line Tools
   [https://developer.android.com/studio/command-line](https://developer.android.com/studio/command-line)
2. Download Emulator via cli tools

   ```bash
   sdkmanager emulator
   ```

## Extension Settings

* `avdmanager.avdmanager`: AVD Manager executable path
* `avdmanager.sdkManager`: SDK Manager executable path
* `avdmanager.emulator`: Android emulator executable path
* `avdmanager.emulatorOpt`: Android emulator execute [options](https://developer.android.com/studio/run/emulator-commandline)

## Screenshot

### AVD Manager

![img](image/README/1647305763146.png)

### SDK Platforms

![img](image/README/1647305800773.png)

### SDK Tools

![](image/README/1647538046602.png)
