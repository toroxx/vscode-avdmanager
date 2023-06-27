# Android Virtual Device (AVD) Manager Change Log

### 1.3.0

* new config `avdmanager.avdHome` for avdmanager
* attempt to find AVD Home path from the `ANDROID_AVD_HOME`

### 1.2.2

* attempt to find SDK path from the `ANDROID_SDK_ROOT` or `ANDROID_HOME` environment variable

### 1.2.1

* fix command execute fail in Linux and macOS [issue [#1](https://github.com/toroxx/vscode-avdmanager/issues/1)]
* try to accept all licenses before installing the emulator
* fix AVD list empty show "undefined | undefined" problem
* update the config check message

### 1.2.0

* new config `avdmanager.sdkPath` and `avdmanager.cmdVersion`
* auto check the `avdmanager.sdkPath` and executable paths valid
* new commands
  * `avdmanager.setup-sdkpath`
  * `avdmanager.setup-avdmanager`
  * `avdmanager.setup-sdkmanager`
  * `avdmanager.setup-emulator`

### 1.1.3

* SDK package icon with color
  * `avdmanager.pkgFolderInstalled` (for folder with installed package)
  * `avdmanager.pkgInstalled` (for installed package icon)
  * `avdmanager.pkgNotInstall` (for not installed package icon)
* marge the `avdmanager.pkg-install` and `avdmanager.pkg-uninstall` commands
* emulator logs display enhanced
* Minor bug fix

### 1.1.2

* marge the cmd-* commands
* new icon (check-all) for "Accept All SDK Licenses"
* new feature Update All SDK Package
* Add SDK Package detail View
* Minor bug fix

### 1.1.1

* Show emulator log on the output display
* fix relative path of ../src

### 1.1.0

* Added SDK Tool

### 1.0.2

* Fix AVD detail show "undefined"

### 1.0.1

- Fix AVDManager delete command
- Change VSCode Engine from 1.65.0 to 1.60.0

### 1.0.0

Initial releas
