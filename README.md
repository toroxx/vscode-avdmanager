[![GitHub package version](https://img.shields.io/github/v/release/toroxx/vscode-avdmanager?include_prereleases&label=GitHub%20version)](https://github.com/toroxx/vscode-avdmanager)
[![Visual Studio Marketplace](https://img.shields.io/visual-studio-marketplace/v/toroxx.vscode-avdmanager?label=VS%20Marketplace&logo=sdf)](https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager)
[![OpenVSX Registry](https://img.shields.io/open-vsx/v/toroxx/vscode-avdmanager?label=Open%20VSX)](https://open-vsx.org/extension/toroxx/vscode-avdmanager)
[![VS Market installs](https://img.shields.io/visual-studio-marketplace/i/toroxx.vscode-avdmanager?color=green&label=Installs)](https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager)
<a target="_blank" href="https://www.buymeacoffee.com/toroxx12"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" height="20px"></a>

# Android Virtual Device (AVD) Manager

AVD Manager GUI for Visual Studio Code.

Launch Android Emulator and manage SDK packages without touching the Android Studio😎

See the [CHANGELOG](CHANGELOG.md) for the latest changes.

Also, welcome to open the issue any about this extension.

inspired by [oognuyh/vscode-android-emulator-helper](https://github.com/oognuyh/vscode-android-emulator-helper)

## Features

### AVD Manager

* AVD create, rename, delete, detail view

### SDK Platforms / Tools

* packages Install, update, delete
* accept SDK licenses

### Emulator

* Launch AVD

## Setup Android SDK

### Steps

1. Create Folder for the `SDK Root Path`  (E.g. C:/android/sdk)
2. Create `cmdline-tools` folder inside the SDK Root
   (E.g. C:/android/sdk/cmdline-tools)
3. Download `Android SDK Command-line Tools`
   [https://developer.android.com/studio#command-line-tools-only](https://developer.android.com/studio#command-line-tools-only)
4. Extract the files. You may get a folder call `cmdline-tools` and rename to `latest`
5. Move `latest` folder to cmdline-tools Folder
   E.g. C:/android/sdk/cmdline-tools/latest

### Folder Structure

* C:/android/sdk/ (SDK Root)
  * cmdline-tools
    * latest (download from android.com)
      * lib
      * bin
        * avdmanager
        * sdkmanager

Remember update `avdmanager.sdkPath` to Android SDK Root Path
It should work fine, if the folder structure is correct.

## Extension Settings

### Required

* `avdmanager.sdkPath` : Android SDK Root Path
  The location of the Android SDK Root Path. If blank, it will attempt to find it from the `ANDROID_SDK_ROOT` or `ANDROID_HOME` environment variables.
* `avdmanager.cmdVersion`: Android SDK Command-Line Tools Version (default=latest)

After updating the SDK Path. The AVD Manager will auto lookup all executable paths from the SDK.

### Optional

* `avdmanager.avdmanager`: AVD Manager executable path
* `avdmanager.avdHome`: AVD Home path for AVDManager
* `avdmanager.sdkManager`: SDK Manager executable path
* `avdmanager.emulator`: Android emulator executable path
* `avdmanager.emulatorOpt`: Android emulator execute [options](https://developer.android.com/studio/run/emulator-commandline)

## Commands

* `avdmanager.pkg-update-all` : Update All SDK Package
* `avdmanager.pkg-accept-license` : Accept All SDK Licenses
* `avdmanager.setup-sdkpath` : Update SDK Root Path
* `avdmanager.setup-avdmanager` : Update AVDManage Path
* `avdmanager.setup-sdkmanager` : Update SDKManage Path
* `avdmanager.setup-emulator` : Update Emulator Path

## Screenshot

### AVD Manager

Create AVD [+ Button]

![img](image/README/1647306492723.png)

Create AVD - new AVD Name

![img](image/README/2023-08-01214131.png)

Create AVD - device selection

![img](image/README/2023-08-01214153.png)


Rename AVD [Pen Icon Button]  
  
![img](image/README/1647306376053-2.png)

Open AVD config.ini  [File Button] and Open AVD config folder  [Folder Button]

![img](image/README/202306281147001.png)

Delete AVD [Right Click on AVD Name]

![img](image/README/1647306333965-2.png)


AVD Details [Mouseover on the AVD name]

![img](image/README/1647306806230-2.png)

### SDK Platforms / Tools

Install packages (system-image, platforms, source-code)

![](image/README/1647845727856.png)

Install SDK Tools E.g. Build-tools, cmake, emulator, etc.

![](image/README/1647845760332.png)

Package Detail

![](image/README/1647666693038.png)

Accept All SDK licenses [Double Check icon Button]

Update All SDK Package [Sync icon button]

![](image/README/1647666810384.png)

### Emulator

Launch AVD [Play icon Button]

![img](image/README/1647306185675.png)

Emulator Log

![](image/README/1647845143589.png)

## Links

- [GitHub](https://github.com/toroxx/vscode-avdmanager) ([Issues](https://github.com/toroxx/vscode-avdmanager/issues) | [Releases](https://github.com/toroxx/vscode-avdmanager/releases))
- VSCode Marketplace
  [https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager](https://marketplace.visualstudio.com/items?itemName=toroxx.vscode-avdmanager)
- Open-VSX
  [https://open-vsx.org/extension/toroxx/vscode-avdmanager](https://open-vsx.org/extension/toroxx/vscode-avdmanager)
