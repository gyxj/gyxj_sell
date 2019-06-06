<template>
<div class="ratings">
<div class="ratings-scroll">
  <div class="ratings-content">
    <div class="overview">
      <div class="overview-left">
        <h1 class="score">{{seller.score}}</h1>
        <p class="score-text">综合评分</p>
        <p class="score-rankRate">高于周边商家{{seller.rankRate}}%</p>
      </div>
      <div class="overview-right">
        <div class="score-wrapper">
          <span class="text">服务态度</span>
          <star class="star" :score="seller.score" :size="36"></star>
          <span class="score">{{seller.serviceScore}}</span>
        </div>
        <div class="score-wrapper">
          <span class="text">商品评分</span>
          <star class="star" :score="seller.score" :size="36"></star>
          <span class="score">{{seller.foodScore}}</span>
        </div>
        <div class="deliveryTime">
          <span class="text">送达时间</span>
          <span class="time">{{seller.deliveryTime}}分钟</span>
        </div>
      </div>
    </div>
    <split></split>
    <ratingselect @type-change="typeChange" @content-change="contentChange" :select-type="selectType" :desc="desc" :only-content="onlyContent" :ratings="ratings"></ratingselect>
    <div class="rating-wrapper">
      <ul>
        <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in ratings" :key="rating.index" class="rating-item border-1px">
          <div class="avatar">
            <img width="28" height="28" :src="rating.avatar">
          </div>
          <div class="content">
            <h1 class="name">{{rating.username}}</h1>
            <div class="star-wrapper">
              <star :size="24" :score="rating.score"></star>
              <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
            </div>
            <p class="text">{{rating.text}}</p>
            <div class="recommend" v-show="rating.recommend.length">
              <span class="icon-thumb_up"></span>
              <span class="item" v-for="item in rating.recommend" :key="item.index">{{item}}</span>
            </div>
          </div>
          <div class="time">{{rating.rateTime | dateFormat}}</div>
        </li>
      </ul>
    </div>
  </div>
  <!-- <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods"></shopcart> -->
</div>
</div>
</template>

<script type="text/ecmascript-6">
import ratingselect from '../ratingselect/ratingselect'
import split from '../split/split'
import star from '../star/star'
import {dateFormat} from '../../common/js/date'
import BScroll from 'better-scroll'
// import shopcart from '../shopcart/shopcart'
const ALL = 2
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      ratings: [],
      goods: [],
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  created () {
    this.$http.get('/api/ratings').then((result) => {
      if (result.body.errno === ERR_OK) {
        this.ratings = result.body.data
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll('.ratings-scroll', {
              click: true,
              probeType: 3
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    })
    this.$http.get('/api/goods').then((result) => {
      if (result.body.errno === ERR_OK) {
        this.goods = result.body.data
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll('.ratings-scroll', {
              click: true,
              probeType: 3
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
    })
  },
  methods: {
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
    }
  },
  computed: {
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  components: {
    split,
    star,
    ratingselect
    // shopcart
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
.ratings
  position: absolute
  top: 174px
  left: 0
  bottom: 0
  width: 100%
  overflow: hidden
  .ratings-scroll
    height: 100%
    .overview
      display: flex
      padding: 18px 0
      box-sizing: border-box
      .overview-left
        flex: 0 0 137px
        width: 137px
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        @media only screen and (max-width: 320px)
          flex: 0 0 120px
          width: 120px
        .score
          font-size: 24px
          color: rgb(255,153,0)
          line-height: 28px
        .score-text
          padding-top: 6px
          font-size: 12px
          color:rgb(7,17,27)
          line-height: 12px
        .score-rankRate
          padding-top: 8px
          font-size: 10px
          color:rgba(7,17,27,0.5)
          line-height: 10px
      .overview-right
        flex: 1
        padding-left: 20px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        color: rgb(7,17,27)
        .score-wrapper
          padding-bottom: 8px
          font-size: 0
          .text
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
          .star
            display: inline-block
            vertical-align: top
            padding: 0 12px
          .score
            display: inline-block
            vertical-align: top
            color: rgb(255,153,0)
            font-size: 12px
            line-height: 18px
        .deliveryTime
          font-size: 0
          .text
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .time
            padding-left: 12px
            font-size: 12px
            color: rgb(147,153,159)
            line-height: 18px
    .ratingselect
      padding: 12px 18px 0 18px
      border-bottom: 1px solid rgba(7,17,27,0.2)
    .rating-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          height: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          flex: 1
          .name
            margin-bottom: 4px
            font-size: 10px
            color: rgb(7,17,27)
            line-height: 12px
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              margin-right: 6px
              vertical-align: top
            .delivery
              display: inline-block
              vertical-align: top
              padding-top: 2px
              padding-left: 6px
              font-size: 10px
              font-weight: 200
              color: rgb(147,153,159)
              line-height: 12px
          .text
            padding-bottom: 8px
            font-size: 12px
            color: rgb(7,17,27)
            line-height: 18px
          .recommend
            line-height: 16px
            font-size: 0
            .icon-thumb_up, .item
              display: inline-block
              margin: 0 8px 4px 0
              font-size: 9px
            .icon-thumb_up
              color: rgb(0,160,220)
            .item
              padding: 0 6px
              border: 1px solid rgba(7,17,27,0.1)
              border-radius: 1px
              background-color: rgb(255,255,255)
              color: rgb(147,153,159)
              line-height: 16px
        .time
          position: absolute
          top: 18px
          right: 0
          font-size: 10px
          font-weight: 200
          color: rgb(147,153,159)
          line-height: 12px
</style>
