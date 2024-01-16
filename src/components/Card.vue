<template>
  <el-card
    :shadow="shadow"
    :body-style="bodyStyle"
    :style="{ padding: '0px', maxWidth: width + 'rem' }"
    class="card"
  >
    <div v-loading="!isReady">
      <div
        class="cursor-pointer"
        :style="imageContainerStyle"
        @click.prevent="cardClicked"
      >
        <img
          v-if="useDefaultImg"
          src="../assets/logo-sparc-wave-primary.svg"
          v-svg-inline
          :style="imageStyle"
        />
        <img
          v-else
          :src="thumbnail"
          alt="thumbnail loading ..."
          :style="imageStyle"
        />
      </div>
      <div v-if="false" class="image-overlay">
        <div
          class="triangle-right-corner"
          :style="`border-left-width: ${
            triangleHeight * 1.2
          }rem; border-top-width: ${triangleHeight}rem;`"
          @click="openLinkInNewTab"
        />
        <el-tooltip
          class="item"
          :content="`View ${data.type}`"
          placement="left"
        >
          <img
            class="triangle-icon"
            :style="`height: ${triangleHeight * 0.25}rem;top: ${
              triangleHeight * 0.15
            }rem;right: ${triangleHeight * 0.15}rem`"
            :src="typeIcon"
            @click="openLinkInNewTab"
          />
        </el-tooltip>
      </div>
      <div v-if="showCardDetails" class="details">
        <p v-if="!data.hideType">
          <b>{{ data.type }}</b>
        </p>
        <el-popover
          :virtual-ref="titleText"
          :disabled="disableTooltip"
          :content="data.title"
          placement="top"
          trigger="hover"
          popper-class="gallery-popper"
        >
        <template #reference>
          <!--use v-show here to make sure el popover always have a starting location -->
          <p
            v-show="!data.hideTitle"
            ref="titleText"
            class="title"
            persistent
          >
            {{ data.title }}
          </p>
          <p v-show="data.hideTitle" class="title text-placeholder" />
        </template>
      </el-popover>
        <el-button class="button" @click.prevent="cardClicked">
          View {{ data.type }}</el-button
        >
      </div>
    </div>
  </el-card>
</template>

<script>
import {
  ElButton as Button,
  ElCard as Card,
  ElPopover as Popover,
  ElTooltip as Tooltip,
  ElLoading as Loading,
} from 'element-plus'
import GalleryHelper from '../mixins/GalleryHelpers.js'
import { ref } from 'vue'

function isValidHttpUrl(string) {
  let url = undefined

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

export default {
  name: 'GalleryCard',
  components: {
    Button,
    Card,
    Popover,
    Tooltip,
    Loading
  },
  mixins: [GalleryHelper],
  props: {
    data: {
      type: Object,
      required: true,
    },
    width: {
      type: Number,
      default: 3,
    },
    height: {
      type: Number,
      default: 3,
    },
    showCardDetails: {
      type: Boolean,
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
    imageContainerStyle: {
      type: Object,
      default: () => {
        return {}
      },
    },
    shadow: {
      type: String,
      default: 'always',
    },
  },
  data() {
    return {
      ro: null,
      triangleSize: 4,
      thumbnail: undefined,
      useDefaultImg: false,
      disableTooltip: false,
      tooltipCalculated: false,
    }
  },
  setup() {
    const titleText = ref()
    return {
      titleText
    }
  },
  computed: {
    isReady() {
      return (
        this.data.title &&
        (this.thumbnail || this.useDefaultImg) &&
        (this.data.link || this.data.userData)
      )
    },
    imageHeight() {
      return this.showCardDetails ? this.height * 0.525 : this.height
    },
    imageWidth() {
      return this.width - 2 * this.marginDetails
    },
    triangleHeight() {
      return this.height * 0.237
    },
    marginDetails() {
      return this.height * 0.076
    },
    typeIcon() {
      return undefined
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function () {
        this.thumbnail = undefined
        this.useDefaultImg = false
        this.tooltipCalculated = false
        this.disableTooltip = false
        if (this.data.thumbnail) {
          if (isValidHttpUrl(this.data.thumbnail) && this.data.mimetype) {
            this.downloadThumbnail(this.data.thumbnail, { fetchAttempts: 0 })
          } else {
            this.thumbnail = this.data.thumbnail
          }
        } else {
          this.useDefaultImg = true
        }
        //Dynamically check title length to determine if popover should be shown
        this.$nextTick(() => {
          this.calculateShowTooltip()
        })
      },
    },
  },
  updated: function () {
    if (!this.tooltipCalculated) {
      this.$nextTick(() => {
        this.calculateShowTooltip()
      })
    }
  },
  methods: {
    /**
     * Open a new link if link is provide.
     * Fire an event if userData is provide.
     */
    cardClicked: function () {
      if (this.data.link) {
        const link = document.createElement('a')
        link.href = this.data.link
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
      if (this.data.userData) {
        this.$emit('card-clicked', this.data.userData)
      }
    },
    /**
     * handle thumbnail downloading,, it will use a default svg image if fails
     */
    downloadThumbnail: function (url, info) {
      this.getRequest(url, {}, 11000).then(
        (response) => {
          let data = response.data
          if (typeof data === 'string' && data.startsWith('data:')) {
            this.thumbnail = response.data
          } else {
            if (this.data.mimetype) {
              this.thumbnail = `data:${this.data.mimetype};base64,${response.data}`
            } else {
              this.thumbnail = response.data
            }
          }
        },
        (reason) => {
          if (
            reason.message.includes('timeout') &&
            reason.message.includes('exceeded') &&
            info.fetchAttempts < 3
          ) {
            info.fetchAttempts += 1
            this.downloadThumbnail(url, info)
          } else {
            this.useDefaultImg = true
          }
        }
      )
    },
    //dynamically calculate if tooltip is required
    calculateShowTooltip: function () {
      if (this.data.hideTitle) {
        this.disableTooltip = true
        this.tooltipCalculated = true
      } else {
        const ele = this.$refs.titleText
        //Check if title text is rendered yet
        if (ele && ele.offsetParent) {
          this.tooltipCalculated = true
          if (ele.offsetWidth >= ele.scrollWidth) this.disableTooltip = true
          else this.disableTooltip = false
        } else {
          //text not rendered yet
          if (this.data.title.length > 20) this.disableTooltip = false
          else this.disableTooltip = true
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@use 'element-plus/theme-chalk/src/button';
@use 'element-plus/theme-chalk/src/card';
@use 'element-plus/theme-chalk/src/popover';
@use 'element-plus/theme-chalk/src/tooltip';
@use 'element-plus/theme-chalk/src/loading';

.button,
.button:hover,
.button:focus {
  z-index: 10;
  font-family: Asap;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  background-color: $app-primary-color;
  border: $app-primary-color;
  color: white;
  cursor: pointer;
  margin-top: 8px;
}

.button:hover {
  background: $app-primary-color;
  box-shadow: -3px 2px 4px 0 rgba(0, 0, 0, 0.25);
  color: #fff;
}

.card {
  position: relative;
}
.details {
  text-align: left;
}

.cursor-pointer {
  cursor: pointer;
}

.text-placeholder {
  height: 1rem;
}

.title {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

p.bold {
  font-weight: bold;
}

.image-overlay {
  position: absolute;
  top: 0;
  right: 0;
}

.triangle-icon {
  position: absolute;
}

.triangle-right-corner {
  width: 0;
  height: 0;
  border-left: solid transparent;
  border-top: solid $app-primary-color;
}
</style>

<style lang="scss">
.gallery-popper {
  background: #f3ecf6 !important;
  border: 1px solid $app-primary-color;
  border-radius: 4px;
  color: #303133 !important;
  font-size: 12px;
  line-height: 1rem;
  height: 1rem;
  padding: 10px;
}
.gallery-popper.el-popper[x-placement^='top'] .popper__arrow {
  border-top-color: $app-primary-color !important;
}
.gallery-popper.el-popper[x-placement^='top'] .popper__arrow:after {
  border-top-color: #f3ecf6 !important;
}
</style>
