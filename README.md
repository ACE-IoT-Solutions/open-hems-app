# Open HEMS App
A React Native app demonstrating HEMS API interactions.

## Getting Started
#### Install Dependencies
```
yarn
```

#### Build App Locally
Android:
```
yarn run android
eas build --platform android --local
```
iOS:
```
yarn run ios
eas build --platform ios --local
```

#### Run App Locally
```
yarn start
```

### Build Project on expo.dev
You'll need to be authenticated with eas - see the [eas build documentation](https://docs.expo.dev/build/introduction/) for more detail
```
eas build --platform all --profile acceptance --non-interactive
```