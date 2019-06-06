<template>
<div class="header">
  <div class="content-wrapper">
    <div class="avatar">
      <img width='64' height="64" :src="seller.avatar">
    </div>
    <div class="content">
      <div class="title">
        <span class="brand"></span>
        <span class="name">{{seller.name}}</span>
      </div>
      <div class="description">{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
      <div class="supports" v-if="seller.supports">
        <span class="icon" :class="classMap[seller.supports[0].type]"></span>
        <span class="text">{{seller.supports[0].description}}</span>
      </div>
    </div>
    <div class="support-count" @click="showDetail">
      <span class="count" v-if="seller.supports">{{seller.supports.length}}个</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
  </div>
  <div class="bulletin-wrapper" @click="showDetail">
    <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    <i class="icon-keyboard_arrow_right"></i>
  </div>
  <div class="background">
    <img :src="seller.avatar" width="100%" height="100%">
  </div>
  <transition>
    <div class="detail" v-show="detailShow">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <div class="name">{{seller.name}}</div>
          <star class="star" :score="seller.score" :size="48"></star>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports" :key="item.index">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{seller.bulletin}}</p>
          </div>
        </div>
      </div>
      <div class="detail-close">
        <i class="icon-close" @click="closeDetail"></i>
      </div>
    </div>
  </transition>
</div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star'
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail () {
        this.detailShow = true
      },
      closeDetail () {
        this.detailShow = false
      }
    },
    components: {
      star
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"
  .header
    position: relative
    background: rgba(7,17,27,0.5)
    overflow: hidden
    color: #fff
    .content-wrapper
      padding: 24px 12px 18px 24px
      font-size: 0
      position: relative
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        font-size: 14px
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            width: 30px
            height: 18px
            bg-image('brand')
            background-size: 30px 18px
            background-repeat: no-repeat
            vertical-align: top
          .name
            margin-left: 6px
            font-size: 16px
            font-weight: bold
            line-height: 18px
        .description
          margin-bottom: 10px
          font-size: 12px
          font-weight: 200
          line-height: 12px
        .supports
          .icon
            display: inline-block
            vertical-align: top
            margin-right: 4px
            width: 12px
            height: 12px
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image('decrease_1')
            &.discount
              bg-image('discount_1')
            &.invoice
              bg-image('invoice_1')
            &.special
              bg-image('special_1')
            &.guarantee
              bg-image('guarantee_1')
          .text
            vertical-align: middle
            font-size: 10px
            font-weight: 200
            line-height: 12px
      .support-count
        position: absolute
        right: 12px
        bottom: 14px
        padding: 0 8px
        height: 24px
        line-height: 24px
        background-color: rgba(0,0,0,0.2)
        border-radius: 14px
        text-align: center
        .count
          display: inline-block
          font-size: 10px
          vertical-align: top
          margin-top: 1px
        .icon-keyboard_arrow_right
          font-size: 10px
          line-height: 24px
          margin-left: 2px
    .bulletin-wrapper
      position:relative
      height: 28px
      line-height: 28px
      padding: 0 22px 0 12px
      white-space: nowrap
      overflow: hidden
      text-overflow: ellipsis
      background-color: rgba(7,17,27,0.2)
      .bulletin-title
        display: inline-block
        vertical-align: top
        margin-top: 8px
        width: 22px
        height: 12px
        bg-image('bulletin')
        background-size: 22px 12px
        background-repeat: no-repeat
      .bulletin-text
        vertical-align: top
        font-size: 12px
        margin: 0 4px
      .icon-keyboard_arrow_right
        position: absolute
        right: 12px
        top: 9px
        font-size: 10px
    .background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
    .detail
      position: fixed
      z-index: 99
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7,17,27,0.8)
      &.v-enter-active, &.v-leave-active
        transition: all .5s
      &.v-enter, &.v-leave-to
        opacity: 0
      blur(10px)
      overflow: auto
      .detail-wrapper
        min-height: 100%
        width: 100%
        .detail-main
          margin-top: 64px
          padding-bottom: 64px
          .name
            font-size: 16px
            font-weight: 700
            line-height: 16px
            text-align: center
          .star
            text-align: center
            margin-top: 16px
          .title
            display: flex
            width: 80%
            margin: 28px auto 24px auto
            .line
              flex: 1
              margin-bottom: 6px
              border-bottom: 1px solid rgba(255,255,255,0.2)
            .text
              margin: 0 12px
              font-size: 14px
              font-weight: 700
          .supports
            width: 80%
            margin: 0 auto
            .support-item
              padding: 0 12px
              margin-bottom: 12px
              &:last-child
                margin-bottom: 0
              .icon
                display: inline-block
                width: 16px
                height: 16px
                margin-top: 1px
                vertical-align: top
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                  bg-image('decrease_2')
                &.discount
                  bg-image('discount_2')
                &.invoice
                  bg-image('invoice_2')
                &.special
                  bg-image('special_2')
                &.guarantee
                  bg-image('guarantee_2')
              .text
                line-height: 12px
                font-weight: 200
                font-size: 12px
          .bulletin
            width: 80%
            margin: 0 auto
            .content
              padding: 0 12px
              font-size: 12px
              font-weight: 200
              line-height: 24px
      .detail-close
        margin: -64px auto 0 auto
        width: 32px
        height:32px
        clear: both
        font-size: 32px
</style>
