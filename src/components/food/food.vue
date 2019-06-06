<template>
<transition>
  <div class="food" v-show="showFood">
  <div class="food-scroll">
    <div class="food-content">
      <div class="img-header">
        <img :src="food.image">
        <div class="back" @click="back">
          <i class="icon-arrow_lift"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="extra">
          <span class="sell">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">￥{{food.price}}</span>
          <del v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</del>
        </div>
        <div class="cartcontrol-wrapper">
          <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
        </div>
        <transition>
          <div class="addCart" v-show="food.count===0 || !food.count" @click.stop="addCart($event)">加入购物车</div>
        </transition>
      </div>
      <split v-show="food.info"></split>
      <div class="info" v-show="food.info">
        <h2 class="title">商品介绍</h2>
        <p class="text">{{food.info}}</p>
      </div>
      <split></split>
      <div class="ratingselect-wrapper">
        <h1 class="title">商品评价</h1>
        <ratingselect @type-change="typeChange" @content-change="contentChange" :desc="desc" :select-type="selectType" :only-content="onlyContent" :ratings="food.ratings" class="border-1px"></ratingselect>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" :key="rating.index" class="rating-item border-1px">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img class="avatar" width="12" height="12" :src="rating.avatar">
              </div>
              <div class="time">{{rating.rateTime | dateFormat}}</div>
              <p class="text">
                <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评论</div>
        </div>
      </div>
    </div>
  </div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import Vue from 'vue'
import BScroll from 'better-scroll'
import cartcontrol from '../cartcontrol/cartcontrol'
import split from '../split/split'
import ratingselect from '../ratingselect/ratingselect'
import {dateFormat} from '../../common/js/date'
const ALL = 2
export default {
  props: {
    food: {
      type: Object
    }
  },
  data () {
    return {
      showFood: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    created () {
      this.scroll = new BScroll('.food-scroll', {
        click: true,
        probeType: 3
      })
    },
    typeChange (type) {
      this.selectType = type
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    contentChange (content) {
      this.onlyContent = content
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    show () {
      this.showFood = true
      this.selectType = ALL
      this.onlyContent = false
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll('.food-scroll', {
            click: true,
            probeType: 3
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    needShow (type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    },
    back () {
      this.showFood = false
    },
    addCart (event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.food, 'count', 1)
      this.$emit('cart-add', event.target) // 向父组件触发一个自定义的cart-add事件，同时将事件对象传递给父组件
    },
    cartAdd (target) {
      this.$emit('cart-add', target) // 向父组件触发一个自定义的cart-add事件，同时将事件对象传递给父组件
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  },
  filters: {
    dateFormat (time) {
      let date = new Date(time)
      return dateFormat(date, 'yyyy-MM-dd hh:mm')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.food
  position: fixed
  top: 0
  left: 0
  bottom: 48px
  width: 100%
  overflow: hidden
  z-index: 30
  background-color:#fff
  transform: translate3d(0,0,0)
  &.v-enter, &.v-leave-to
    transform: translate3d(100%,0,0)
  &.v-enter-active, &.v-leave-active
    transition: all 0.5s linear
  .food-scroll
    height: 100%
  .food-content
    position: relative
    .img-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          color: #fff
    .content
      position: relative
      width: 100%
      padding: 18px
      box-sizing: border-box
      .title
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
        line-height: 14px
      .extra
        padding-top: 8px
        font-size: 0
        color: rgb(147,153,159)
        line-height: 10px
        .sell
          font-size: 10px
        .rating
          margin-left: 12px
          font-size: 10px
      .price
        padding-top: 18px
        font-size: 0
        font-weight: 700
        line-height: 24px
        .now
          font-size: 14px
          color: rgb(240,20,20)
        .old
          margin-left: 12px
          font-size: 10px
          color: rgb(147,153,159)
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .addCart
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 10
        height: 24px
        line-height: 24px
        padding: 1px 12px 0 12px
        box-sizing: border-box
        border-radius: 12px
        font-size: 10px
        background-color: rgb(0,160,220)
        color: rgb(255,255,255)
        &.v-enter, &.v-leave-to
          opacity: 0
        &.v-enter-active, &.v-leave-active
          transition: all 0.01s
    .info
      padding: 18px
      .title
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
        line-height: 14px
      .text
        margin: 6px 8px 0 8px
        font-size: 12px
        font-weight: 200
        color: rgb(77,85,93)
        line-height: 24px
    .ratingselect-wrapper
      .title
        padding: 18px 18px 0 18px
        font-size: 14px
        font-weight: 700
        color: rgb(7,17,27)
        line-height: 14px
      .ratingselect
        padding: 0 18px
        margin-top: 6px
        border-1px: rgba(7,17,27,0.3)
      .rating-wrapper
        padding: 0 18px
        .rating-item
          padding: 16px 0
          border-1px: rgba(7,17,27,0.1)
          .user
            float: right
            margin-top: 1px
            font-size: 0
            line-height: 12px
            color: rgb(147,153,159)
            .name
              margin-right: 6px
              font-size: 10px
            .avatar
              display: inline-block
              vertical-align: top
              margin-top: -2px
              width: 12px
              height: 12px
              border-radius: 50%
          .time
            font-size: 10px
            color: rgb(147,153,159)
            line-height: 12px
          .text
            padding-top: 6px
            font-size: 12px
            color: rgb(7,17,27)
            line-height: 16px
            .icon-thumb_up
              margin-right: 4px
              color: rgb(0,160,220)
              line-height: 16px
            .icon-thumb_down
              margin-right: 4px
              color: rgb(147,153,159)
              line-height: 24px
        .no-rating
          padding: 16px 0
          font-size: 12px
          color: rgb(147,153,159)
</style>
