<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <gallery :items="dataInput" @card-clicked="cardClicked" />
  </div>
</template>

<script>
import Gallery from './components/Gallery'
export default {
  name: 'App',
  components: {
    Gallery,
  },
  data: function () {
    return {
      dataInput: [
        {
          title: 'test1',
          type: 'data',
          link: 'https://sparc.science/',
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
      ],
    }
  },
  methods: {
    cardClicked: function (data) {
      console.log('card-clicked', data)
    },
  },
}
</script>
