# ABI-Software Gallery

#### In App.vue - (Options API)
```
<template>
    <div>
      <Gallery :items="dataInput" @card-clicked="cardClicked" />
    </div>
</template>

<script>
import Gallery from './components/Gallery.vue'
import "@abi-software/gallery/dist/style.css";
export default {
  name: "App",
  components: {
    Gallery,
  },
  ...
}
```

#### When using the mixin
Contains the `defaultImg` source and the `getRequest` function for fetching the dataset images.
```
<script>
/* eslint-disable no-alert, no-console */
import GalleryHelper from "@abi-software/gallery/src/mixins/GalleryHelpers";
export default {
  mixins: [ GalleryHelper ],
  ...
}
``` 

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run serve
```

### Compile and Minify for Production

```sh
npm run build-bundle
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```