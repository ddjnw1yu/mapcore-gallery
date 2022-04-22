<template>
  <el-card :shadow="shadow" :body-style="bodyStyle" :style="{ padding: '0px', maxWidth: width + 'rem' }" class="card">
    <div v-loading="!isReady">
      <div :style="imageContainerStyle">
        <img v-if="useDefaultImg" src="../assets/logo-sparc-wave-primary.svg" svg-inline :style="imageStyle" />
        <img v-else :src="thumbnail" alt="thumbnail loading ..." :style="imageStyle" />
      </div>
      <div v-if="false" class="image-overlay">
        <div
          class="triangle-right-corner"
          :style="`border-left-width: ${triangleHeight * 1.2}rem; border-top-width: ${triangleHeight}rem;`"
          @click="openLinkInNewTab"
        />
        <el-tooltip class="item" :content="`View ${data.type}`" placement="left">
          <img
            class="triangle-icon"
            :style="`height: ${triangleHeight * 0.25}rem;top: ${triangleHeight * 0.15}rem;right: ${triangleHeight * 0.15}rem`"
            :src="typeIcon"
            @click="openLinkInNewTab"
          />
        </el-tooltip>
      </div>
      <div v-if="showCardDetails" class="details">
        <p>
          <b>{{ data.type }}</b>
        </p>
        <el-popover ref="galleryPopover" :content="data.title" placement="top" trigger="hover" popper-class="gallery-popper" />
        <p class="title" v-popover:galleryPopover>
          {{ data.title }}
        </p>
        <el-button class="button" @click.prevent="cardClicked"> View {{ data.type }}</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
// import { SvgIcon } from '@abi-software/svg-sprite'
import axios from 'axios'
import Vue from 'vue'
import { Button, Card, Popover } from 'element-ui'
Vue.use(Button)
Vue.use(Card)
Vue.use(Popover)

function isValidHttpUrl(string) {
  let url = undefined

  try {
    url = new URL(string)
  } catch (_) {
    return false
  }
  return url.protocol === 'http:' || url.protocol === 'https:'
}

const getRequest = async (url, params, timeout) => {
  return await axios({
    method: 'get',
    url,
    params,
    timeout,
  })
}

export default {
  name: 'GalleryCard',
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
    }
  },
  computed: {
    isReady() {
      return this.data.title && (this.thumbnail || this.useDefaultImg) && (this.data.link || this.data.userData)
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
  methods: {
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
    downloadThumbnail: function (url, info) {
      getRequest(url, {}, 11000).then(
        (response) => {
          let data = response.data
          if (data.startsWith('data:')) {
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
          if (reason.message.includes('timeout') && reason.message.includes('exceeded') && info.fetchAttempts < 3) {
            info.fetchAttempts += 1
            this.downloadThumbnail(url, info)
          } else {
            this.useDefaultImg = true
          }
        }
      )
    },
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler: function () {
        this.thumbnail = undefined
        this.useDefaultImg = false
        if (this.data.thumbnail) {
          if (isValidHttpUrl(this.data.thumbnail) && this.data.mimetype) {
            this.downloadThumbnail(this.data.thumbnail, { fetchAttempts: 0 })
          } else {
            this.thumbnail = this.data.thumbnail
          }
        } else {
          this.useDefaultImg = true
        }
      },
    },
  },
}
</script>

<style scoped>
.button {
  z-index: 10;
  font-family: Asap;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  background-color: #8300bf;
  border: #8300bf;
  color: white;
  cursor: pointer;
  margin-top: 8px;
}

.button:hover {
  background: #8300bf;
  box-shadow: -3px 2px 4px 0 rgba(0, 0, 0, 0.25);
  color: #fff;
}

.card {
  position: relative;
}
.details {
  text-align: left;
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
  border-top: solid #8300bf;
}
</style>

<style>
.gallery-popper {
  background: #f3ecf6 !important;
  border: 1px solid #8300bf;
  border-radius: 4px;
  color: #303133 !important;
  font-size: 12px;
  line-height: 1rem;
  height: 1rem;
  padding: 10px;
}
.gallery-popper.el-popper[x-placement^='top'] .popper__arrow {
  border-top-color: #8300bf !important;
}
.gallery-popper.el-popper[x-placement^='top'] .popper__arrow:after {
  border-top-color: #f3ecf6 !important;
}
</style>
