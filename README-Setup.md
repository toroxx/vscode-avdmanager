# Setup Guide for sharing the SDK to Android Studio, VSCode and VSCode-like tools (E.g. VSCodium)

## Requirement
- Install JDK 8 (Oracle JDK or OpenJDK)

## Preparing the SDK

1. Assume that everything will place in the folder `C:\android-sdk`.  
Create folder `C:\android-sdk` and `C:\android-sdk\cmdline-tools`.
    ``` 
    mkdir C:\android-sdk
    mkdir C:\android-sdk\cmdline-tools
    ```

2. download the SDK command line tool (e.g. `commandlinetools-win-9477386_latest.zip`) from below link 
https://developer.android.com/studio#command-line-tools-only

3. open commandlinetools-win-9477386_latest.zip, you will see the `cmdline-tools`
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/92bf94c7-36e7-4a3c-80a2-06fc9b6efb8a)

4. unzip and rename the folder name from `cmdline-tools` to `latest`

5. move the `latest` to `C:\android-sdk\cmdline-tools`. 
The SDK folder will be like below
    ```
    C:\android-sdk
    └─cmdline-tools
        └─latest
            ├─lib
            └─bin
              ├─avdmanager.bat
              └─sdkmanager.bat
    ```

6. Set  the environment `ANDROID_HOME` to `C:\android-sdk`
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/7bcbc28e-f728-411f-aa98-13d96a9dba9e)


## Setup the VSCode and VSCode-like tools (E.g. VSCodium)
1. install AVD Manager  
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/9f9b7883-ea8d-4281-8a97-d907eaa2de77)

2. Click the Android icon to open the AVD Manager
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/13ae121d-5e86-4281-a4b2-e248077e7f5b)

3. You may see below. Click `Download Emulator` to download the emulator
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/831b166f-6485-4662-9dc3-0de8f4f946f3)

4. If you click download. Wait until you see the `output` showing the download 100%.
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/8f284ec4-0e11-46ba-abbe-91c3288ef080)

5. Restart your VSCode and open AVD manager

6. Complete
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/fc2e40e0-66d1-4db5-89d7-3aaaac1487ad)

## Setup Android Studio

1. Open the Android Studio, Click `More Actions`, `SDK Manager`
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/17fb4e98-9874-4c70-9df7-f2b1ddbf120a)

2. On `Android SDK Location`, Click Edit
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/b372f901-db03-4eec-86ad-ad1de071f29f)

3. Change `Android SDK Location` to the SDK path (e.g. `C:\android-sdk`)
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/8c0ce221-2b48-4443-bc82-20990b01794e)

4. Click Next and complete the setup.
![image](https://github.com/toroxx/vscode-avdmanager/assets/18657712/f1e79982-ed51-4186-ab74-f2a360ea8ce2)


------


After all, the VSCode and Android Studio will share the same SDK tools.
