#  Translator App
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)

* Standard compliant React Native App Utilizing [Ignite](https://github.com/infinitered/ignite)

## How to Setup

**Step 1:** git clone this repo:
w
**Step 2:** cd to the cloned repo:

**Step 3:** Install the Application with `npm install`

**Step 4:** Link `React-Native` Dependencies `react-native link`

**Step 5:** rename `env.sample` to `.env` and put the urls for your app

## Overview

- written using ES6
- uses Yarn for package dependency management
- uses [JavaScript Standard Style](http://standardjs.com/)
- uses [React native I18n](https://github.com/AlexanderZaytsev/react-native-i18n#ios) for localization
  * See intallation guide
    * [IOS](https://github.com/AlexanderZaytsev/react-native-i18n#ios)
    * [ANDROID](https://github.com/AlexanderZaytsev/react-native-i18n#android)
- uses WebRTC [react-native-webrtc](https://github.com/oney/react-native-webrtc)
  * See installation guide.
    * [IOS](https://github.com/oney/react-native-webrtc/blob/master/Documentation/iOSInstallation.md)
    * [ANDROID](https://github.com/oney/react-native-webrtc/blob/master/Documentation/AndroidInstallation.md)
- uses Incall Manager [react-native-incall-manager](https://github.com/zxcpoiu/react-native-incall-manager)
  * [See installation guide](https://github.com/zxcpoiu/react-native-incall-manager#installation)
- Using 12 Factor methodology
  * [See installation guide](https://github.com/luggit/react-native-config)
- Uses [Fabric IO](https://fabric.io) for testing the app
    - Wrapper [react-native-fabric](https://github.com/corymsmith/react-native-fabric)
    - [Crashlytics](https://github.com/corymsmith/react-native-fabric#crashlytics-usage)
- For making APP **VOIP** (notifications)
  - IOS
    - [React Native VoIP Push Notification](https://github.com/ianlin/react-native-voip-push-notification?files=1)
    - [React Native CallKit](https://github.com/ianlin/react-native-callkit)
  - ANDROID
    - [React-Native-FCM](https://github.com/evollu/react-native-fcm)

> Please see `package.json` for other react-native dependency that needs manual linking for this project


## How to Run App

1. cd to the repo
2. Run Build for either OS
  * for iOS
    * run `react-native run-ios`
  * for Android
    * Run Genymotion
    * run `react-native run-android`


## CLI Tools

- `yarn start` - Start the react-native cli
- `yarn lint` - Lint errors
- `yarn test` - run Unit tests
- `standard` - lint codebase using [JavaScript Standard Style](http://standardjs.com)
- `standard --fix` - fix code according to JS Standard Style
- `yarn validate` - automatically fix most code issues!
- `yarn add <package-name>` - add a new package to `package.json`
- `yarn remove <package-name>` - remove package from `package.json`

> Please check package.json for more info.

## Standard Compliant

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)
This project adheres to Standard.  Our CI enforces this, so we suggest you enable linting to keep your project compliant during development.

**To Lint on Commit**

This is implemented using [ghooks](https://github.com/gtramontina/ghooks). There is no additional setup needed.

**Bypass Lint**

If you have to bypass lint for a special commit that you will come back and clean (pushing something to a branch etc.) then you can bypass git hooks with adding `--no-verify` to your commit command.

**Understanding Linting Errors**

The linting rules are from JS Standard and React-Standard.  [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## :closed_lock_with_key: Secrets

This project uses [react-native-config](https://github.com/luggit/react-native-config) to expose config variables to your javascript code in React Native. You can store API keys
and other sensitive information in a `.env` file:

```
API_URL=https://myapi.com
GOOGLE_MAPS_API_KEY=abcdefgh
```

and access them from React Native like so:

```
import Secrets from 'react-native-config'

Secrets.API_URL  // 'https://myapi.com'
Secrets.GOOGLE_MAPS_API_KEY  // 'abcdefgh'
```

The `.env` file is ignored by git keeping those secrets out of your repo.
