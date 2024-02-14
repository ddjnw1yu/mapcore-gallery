<script setup name="App">
import Gallery from './components/Gallery.vue'

const dataInput = [
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

function cardClicked(data) {
  console.log('card-clicked', data)
}
</script>

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <Gallery :items="dataInput" @card-clicked="cardClicked" />
  </div>
</template>