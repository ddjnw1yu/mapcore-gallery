# Gallery Live Demo

## Live Demo

<div class="demo-map-container">
  <div class="demo-map-container-inner">
    <ClientOnly>
      <iframe
        src="https://mapcore-demo.org/current/mapintegratedvuer/"
      >
      </iframe>
    </ClientOnly>
  </div>
</div>

<script setup>
import { defineClientComponent } from "vitepress";
import "./demo-styles.css";

const Gallery = defineClientComponent(() => {
  return import("../src/components/Gallery.vue");
})
</script>

<script>
export default {
  data: function() {
    return {
    };
  }
}
</script>

## Code Preview

```js-vue
  <div class="your-outer-container">
    <Gallery
      :items="items"
    />
  </div>

  <script>
    import { Gallery } from "@abi-software/gallery";
    import "@abi-software/gallery/dist/style.css";

    export default {
      components: { Gallery },
      data: function () {
        return {
          items: [
            {
              title: 'test1',
              type: 'data',
              userData: 'https://sparc.science/',
            },
            {
              title: 'test2',
              type: 'data',
              link: 'https://sparc.science/',
            },
            {
              title: 'test3',
              type: 'data',
              link: 'https://sparc.science/',
            },
          ]
        }
      }
    }
  </script>
```
