<template>
  <div ref="myButton" class="gallery">
    <div class="gallery-strip">
      <a v-if="items.length > 1" href="#" :class="['oval', 'prev', { disabled: !isPrevPossible }]" @click.prevent="goPrev">
        <span class="progress-button">&lsaquo;</span>
      </a>
      <div v-else style="width: 2rem" />
      <div class="filler" />
      <div class="card-line">
        <span
          v-for="(item, index) in items"
          :key="'card_' + index"
          :style="{ display: displayState(index) }"
          :class="['key-image-span', { active: isActive(index) }]"
        >
          <card
            v-if="isVisible(index)"
            :data="item"
            :body-style="bodyStyle"
            :image-style="imageStyle"
            :width="cardWidth"
            :height="cardHeight"
            :shadow="shadow"
            :show-card-details="showCardDetails"
            @card-clicked="cardClicked"
          />
        </span>
      </div>
      <div class="filler" />
      <a v-if="items.length > 1" href="#" :class="['oval', 'next', { disabled: !isNextPossible }]" @click.prevent="goNext">
        <span class="progress-button">&rsaquo;</span>
      </a>
      <div v-else style="width: 2rem" />
    </div>
    <div v-if="showIndicatorBar && items.length > 1" :style="bottomSpacer" />
    <index-indicator v-if="showIndicatorBar && items.length > 1" :count="itemCount" :current="currentIndex" @clicked="indicatorClicked" />
  </div>
</template>

<script>
import IndexIndicator from './IndexIndicator'
import Card from './Card'

function convertRemToPixels(rem) {
  if (typeof window !== 'undefined') {
    return rem * parseFloat(window.getComputedStyle(document.documentElement).fontSize)
  }
  return rem * 16
}

export default {
  name: 'Gallery',
  components: { IndexIndicator, Card },
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      },
    },
    maxWidth: {
      type: Number,
      required: true,
    },
    cardWidth: {
      type: Number,
      default: 13.8,
    },
    showIndicatorBar: {
      type: Boolean,
      default: true,
    },
    highlightActive: {
      type: Boolean,
      default: true,
    },
    showCardDetails: {
      type: Boolean,
      default: true,
    },
    bodyStyle: {
      type: Object,
      default: () => {
        return { padding: '20px', background: '#ffffff' }
      },
    },
    imageStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
    bottomSpacer: {
      type: Object,
      default: () => {
        return { minHeight: '4rem' }
      },
    },
    metaData: {
      type: Object,
      default: () => {
        return {
          datasetVersion: -1,
          datasetId: -1,
        }
      },
    },
    description: {
      type: String,
      default: '',
    },
    shadow: {
      type: String,
      default: 'always',
    },
  },
  data() {
    return {
      count: 0,
      currentIndex: 0,
      controlHeight: 2,
      controlWidth: 2,
      visibleIndecies: [],
    }
  },
  computed: {
    itemCount() {
      return this.items.length
    },
    isPrevPossible() {
      return this.currentIndex > 0
    },
    isNextPossible() {
      return this.currentIndex < this.itemCount - 1
    },
    cardHeight() {
      return 0.78 * this.cardWidth
    },
    cardLineWidth() {
      const cardSpacing = 0.25
      return this.itemCount * (this.cardWidth + cardSpacing) - cardSpacing
    },
    numberOfItemsVisible() {
      // The maximum width we are allowed minus two buttons for next and previous
      // divided by the width of a card.
      // const n = this.itemCount - 1
      const cardSpacingPx = convertRemToPixels(0.5)
      const buttonPx = convertRemToPixels(2)
      const cardWidthPx = convertRemToPixels(this.cardWidth)
      const cardItems = (this.maxWidth - 2 * buttonPx - 2 * cardSpacingPx) / (1.1 * cardWidthPx)
      return Math.max(1, Math.floor(cardItems))
    },
  },
  methods: {
    cardClicked(payload) {
      this.$emit('card-clicked', payload)
    },
    isActive(index) {
      return this.currentIndex === index && this.highlightActive
    },
    isVisible(index) {
      return this.visibleIndecies.includes(index)
    },
    goNext() {
      this.currentIndex += 1
    },
    goPrev() {
      this.currentIndex -= 1
    },
    displayState(index) {
      return this.visibleIndecies.includes(index) ? undefined : 'none'
    },
    indicatorClicked(index) {
      if (this.currentIndex !== index) {
        this.currentIndex = index
      }
    },
  },
  created() {
    this._visibleIndecies = []
  },
  watch: {
    currentIndex: {
      handler: function () {
        const oddImagesVisible = this.numberOfItemsVisible % 2 === 1
        let halfVisible = this.numberOfItemsVisible / 2
        if (oddImagesVisible) {
          halfVisible = (this.numberOfItemsVisible - 1) / 2
        }
        let rawIndicies = [this.currentIndex]
        for (let i = 1; i <= halfVisible; i++) {
          rawIndicies.push(this.currentIndex + i)
          rawIndicies.push(this.currentIndex - i)
        }

        if (!oddImagesVisible) {
          rawIndicies.pop()
        }
        this.visibleIndecies = []
        for (let v of rawIndicies) {
          if (v < 0) {
            this.visibleIndecies.push(v + this.numberOfItemsVisible)
          } else if (v >= this.itemCount) {
            this.visibleIndecies.push(v - this.numberOfItemsVisible)
          } else {
            this.visibleIndecies.push(v)
          }
        }
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
.oval {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  box-shadow: 0 0.125rem 0.25rem 0 rgba(0, 0, 0, 0.25);
  border: solid 1px var(--pale-grey);
  background-color: #ffffff;
  border-radius: 1rem;
  display: flex;
  justify-content: center;
  user-select: none;
}

.gallery-strip,
.card-line {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: center;
}

.card-line {
  flex-grow: 2;
}

.progress-button {
  font-size: 1.5rem;
  font-weight: bold;
  color: #8300bf;
}

.filler {
  flex-grow: 1;
}

.key-image-span.active {
  transform: scale(1.1);
}

a.prev:not(.underline),
a.next:not(.underline) {
  text-decoration: none;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
