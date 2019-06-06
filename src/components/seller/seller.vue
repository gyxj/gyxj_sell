<template>
<div class="seller">
<div class="seller-scroll">
  <div class="seller-content">
    <div class="overview">
      <h2 class="title">{{seller.name}}</h2>
      <div class="desc border-1px">
        <star :size="36" :score="seller.score"></star>
        <span class="text">({{seller.ratingCount}})</span>
        <span class="text">月售{{seller.sellCount}}单</span>
      </div>
      <ul class="remark">
        <li class="block">
          <h2 class="minPrice">起送价</h2>
          <div class="content">
            <span class="stress">{{seller.minPrice}}</span>
            <span class="normal">元</span>
          </div>
        </li>
        <li class="block">
          <h2 class="minPrice">商家配送</h2>
          <div class="content">
            <span class="stress">{{seller.deliveryPrice}}</span>
            <span class="normal">元</span>
          </div>
        </li>
        <li class="block">
          <h2 class="minPrice">平均配送时间</h2>
          <div class="content">
            <span class="stress">{{seller.deliveryTime}}</span>
            <span class="normal">分钟</span>
          </div>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="bulletin-wrapper">
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <p class="text">{{seller.bulletin}}</p>
      </div>
      <ul>
        <li class="support" v-for="support in seller.supports" :key="support.index">
          <span class="support-item" :class="classMap[support.type]"></span>
          <span class="description">{{support.description}}</span>
        </li>
      </ul>
    </div>
    <split></split>
    <div class="pics">
      <h2 class="title">商家实景</h2>
      <div class="pic-wrapper">
        <ul class="pic-list" ref="picWidth">
          <li class="pic" v-for="pic in seller.pics" :key="pic.index">
            <img :src="pic" width="120" height="90">
          </li>
        </ul>
      </div>
    </div>
    <split></split>
    <div class="infos">
      <h2 class="title">商家信息</h2>
      <ul class="info-wrapper">
        <li class="info" v-for="info in seller.infos" :key="info.index">
          <p class="text">{{info}}</p>
        </li>
      </ul>
    </div>
    <div class="favorite">
      <span class="icon-favorite" :class="{'active': favorite}" @click="toggleFavorite"></span>
      <p class="text">{{favoriteText}}</p>
    </div>
  </div>
</div>
</div>
</template>

<script type="text/ecmascript-6">
import star from '../star/star'
import split from '../split/split'
import BScroll from 'better-scroll'
import {saveToLocal, loadFromLocal} from '../../common/js/store'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '未收藏'
    }
  },
  methods: {
    toggleFavorite (event) {
      if (!event._constructed) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  components: {
    star,
    split
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$nextTick(() => {
      if (!this.yScroll) {
        this.yScroll = new BScroll('.seller-scroll', {
          click: true,
          probeType: 3
        })
      } else {
        this.yScroll.refresh()
      }
    })
  },
  mounted () {
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let width = (picWidth + margin) * this.seller.pics.length - margin
      // console.log('mounted')
      this.$refs.picWidth.style.width = width + 'px'
      this.$nextTick(() => {
        if (!this.picScroll) {
          this.picScroll = new BScroll('.pic-wrapper', {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        } else {
          this.picScroll.refresh()
        }
      })
    }
  },
  updated () {
    if (this.seller.pics) {
      let picWidth = 120
      let margin = 6
      let width = (picWidth + margin) * this.seller.pics.length - margin
      // console.log('updated')
      this.$refs.picWidth.style.width = width + 'px'
      this.$nextTick(() => {
        if (!this.picScroll) {
          this.picScroll = new BScroll('.pic-wrapper', {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        } else {
          this.picScroll.refresh()
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.seller
  position: absolute
  top: 174px
  left: 0
  bottom: 0
  width: 100%
  overflow: hidden
  .seller-scroll
    height: 100%
    .overview
      padding: 18px
      .title
        font-size: 14px
        color: rgb(7,17,27)
        line-height: 14px
      .desc
        padding: 8px 0 18px 0
        border-1px(rgba(7,17,27,0.1))
        .star
          display: inline-block
          padding-right: 8px
        .text
          display: inline-block
          vertical-align: top
          font-size: 10px
          color: rgb(77,85,93)
          line-height: 18px
      .remark
        display: flex
        padding-top: 18px
        font-size: 0
        .block
          flex: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,0.1)
          &:last-child
            border: 0
          .minPrice
            font-size: 10px
            color: rgb(147,153,159)
            line-height: 10px
          .content
            padding-top: 4px
            color: rgb(7,17,27)
            line-height: 24px
            font-weight: 200
            .stress
              font-size: 24px
            .normal
              font-size: 10px
    .bulletin-wrapper
      padding: 18px
      .bulletin
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          font-size: 14px
          color: rgb(7,17,27)
          line-height: 14px
        .text
          padding: 8px 12px 16px 12px
          font-size: 12px
          font-weight: 200
          color: rgb(240,20,20)
          line-height: 24px
      .support
        padding: 16px 12px
        border-bottom: 1px solid rgba(7,17,27,0.1)
        font-size: 0
        .support-item
          display: inline-block
          vertical-align: top
          width: 16px
          height: 16px
          background-size: 16px 16px
          background-repeat: no-repeat
          &.decrease
            bg-image('decrease_4')
          &.discount
            bg-image('discount_4')
          &.invoice
            bg-image('invoice_4')
          &.special
            bg-image('special_4')
          &.guarantee
            bg-image('guarantee_4')
        .description
          padding-left: 6px
          font-size: 12px
          font-weight: 12px
          color: rgb(7,17,27)
          line-height: 16px
    .pics
      padding: 18px
      .title
        padding-bottom: 12px
        font-size: 14px
        color: rgb(7,17,27)
        line-height: 14px
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic
            display: inline-block
            width: 120px
            height: 90px
            padding-right: 6px
            &:last-child
              padding: 0
    .infos
      padding: 18px
      .title
        padding-bottom: 12px
        font-size: 14px
        color: rgb(7,17,27)
        line-height: 14px
        border-bottom: 1px solid rgba(7,17,27,0.1)
      .info-wrapper
        .info
          padding: 16px 12px
          border-bottom: 1px solid rgba(7,17,27,0.1)
          .text
            font-size: 12px
            font-weight: 200
            color: rgb(7,17,27)
            line-height: 16px
    .favorite
      position: absolute
      top: 18px
      right: 18px
      .icon-favorite
        padding-left: 5px
        font-size: 24px
        line-height: 24px
        color: #d4d6d9
        &.active
          color: rgb(240,20,20)
      .text
        padding-top: 4px
        font-size: 10px
        color: rgb(77,85,93)
        line-height:10px
</style>
