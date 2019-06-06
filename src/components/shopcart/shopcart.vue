<template>
<div>
<div class="shopcart">
  <div class="content">
    <div class="content-left" @click="toggleList">
      <div class="logo-wrapper">
        <div class="logo" :class="{'highlight':computedCount>0}">
          <span class="icon-shopping_cart" :class="{'highlight':computedCount>0}"></span>
        </div>
        <div class="totalCount" v-show="computedCount>0">{{computedCount}}</div>
      </div>
      <div class="price" :class="{'highlight':computedlPrice>0}">￥{{computedlPrice}}</div>
      <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
    </div>
    <div class="content-right" @click="toPay">
      <div class="pay" :class="{'more':minPrice-computedlPrice<=0}">{{computedPay}}</div>
    </div>
  </div>
  <div class="balls-container">
    <div v-for="ball in balls" :key="ball.index">
      <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-show="ball.flag">
          <div class="inner inner-hook"></div>
        </div>
      </transition>
    </div>
  </div>
  <transition>
    <div class="shopcart-list" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="clearCart">清空</span>
      </div>
      <div class="list-content">
        <ul>
          <li class="food" v-for="food in selectFoods" :key="food.index">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>￥{{food.price * food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</div>
<transition>
  <div class="list-mask" v-show="listShow" @click="hiddenList"></div>
</transition>
</div>
</template>

<script type="text/ecmascript-6">
  import cartcontrol from '../cartcontrol/cartcontrol'
  import BScroll from 'better-scroll'
  export default {
   props: {
     deliveryPrice: {
       type: Number
     },
     minPrice: {
       type: Number
     },
     selectFoods: {
       type: Array
     }
   },
   data () {
     return {
       balls: [
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         },
         {
           flag: false
         }
       ],
       dropBalls: [],
       fold: true
     }
   },
   computed: {
     computedlPrice () {
       let totalPrice = 0
       this.selectFoods.forEach((food) => {
         totalPrice += food.price * food.count
       })
       return totalPrice
     },
     computedCount () {
       let totalCount = 0
       this.selectFoods.forEach((food) => {
         totalCount += food.count
       })
       return totalCount
     },
     computedPay () {
       let payNum = this.minPrice - this.computedlPrice
       if (payNum === this.minPrice) {
         return `￥${this.minPrice}起送`
       } else if (payNum > 0) {
         return `还差￥${payNum}起送`
       } else {
         return '去结算'
       }
     },
     listShow () {
       if (!this.computedCount) {
         return false
       }
       let show = !this.fold
       if (show) {
         this.$nextTick(() => {
           if (!this.scroll) {
             this.initScroll()
           } else {
             this.scroll.refresh()
           }
         })
       }
       return show
     }
   },
   methods: {
     toPay () {
       if (this.computedlPrice < this.minPrice) {
         return
       }
       window.alert(`请支付${this.computedlPrice}元`)
     },
     hiddenList () {
       this.fold = true
     },
     clearCart () {
       this.toggleList()
       this.selectFoods.forEach((food) => {
         food.count = 0
       })
     },
     cartAdd (target) {
       this.$nextTick(() => {
         this.drop(target)
       })
     },
     toggleList () {
       if (!this.computedCount) {
         return
       }
       this.fold = !this.fold
     },
     initScroll () {
       this.scroll = new BScroll('.list-content', {
         click: true
       })
     },
     drop (el) {
       for (let i = 0; i < this.balls.length; i++) {
         let ball = this.balls[i]
         if (!ball.flag) {
           ball.flag = true
           ball.el = el
           this.dropBalls.push(ball)
           return
         }
       }
     },
     beforeEnter (el) {
       let count = this.balls.length
       while (count--) {
         let ball = this.balls[count]
         if (ball.flag) {
           let rect = ball.el.getBoundingClientRect()
           let x = rect.left - 32
           let y = -(window.innerHeight - rect.top - 22)
           el.style.display = ''
           el.style.webkitTransform = `translate3d(0,${y}px,0)`
           el.style.transform = `translate3d(0,${y}px,0)`
           let inner = el.getElementsByClassName('inner-hook')[0]
           inner.style.webkitTransform = `translate3d(${x}px,0,0)`
           inner.style.transform = `translate3d(${x}px,0,0)`
         }
       }
     },
     enter (el) {
       /* eslint-disable no-unused-vars */
       let rf = el.offsetHeight
       this.$nextTick(() => {
         el.style.webkitTransform = 'translate3d(0,0,0)'
         el.style.transform = 'translate3d(0,0,0)'
         let inner = el.getElementsByClassName('inner')[0]
         inner.style.webkitTransform = 'translate3d(0,0,0)'
         inner.style.transform = 'translate3d(0,0,0)'
       })
     },
     afterEnter (el) {
       let ball = this.dropBalls.shift()
       if (ball) {
         ball.flag = false
         el.style.display = 'none'
       }
     }
   },
   components: {
     cartcontrol
   }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.shopcart
  position: fixed
  bottom: 0
  left: 0
  z-index: 50
  width: 100%
  height:48px
  .content
    display: flex
    background: #141d27
    padding-left: 12px
    font-size: 0
    height: 48px
    color: rgba(255,255,255,0.4)
    .content-left
      flex: 1
      .logo-wrapper
        display: inline-block
        position: absolute
        top: -12px
        width: 58px
        height: 58px
        border-radius: 50%
        background-color: #141d27
        .logo
          margin: 8px auto 0 auto
          width: 44px
          height: 44px
          border-radius: 50%
          background-color: rgba(255,255,255,0.4)
          &.highlight
            background-color: rgb(0,160,220)
          .icon-shopping_cart
            display: inline-block
            margin: 10px
            height: 24px
            line-height: 24px
            font-size: 24px
            &.highlight
             color: rgb(255,255,255)
        .totalCount
          position: absolute
          top: 0
          right: 0
          width: 24px
          height: 16px
          line-height: 16px
          font-size: 9px
          font-weight: 700
          color: rgb(255,255,255)
          background-color: rgb(240,20,20)
          text-align: center
          box-shadow: 0 2px 4px 0 rgba(0,0,0,0.4)
          border-radius: 8px
      .price
        display: inline-block
        margin-left: 44px
        padding: 0 12px
        border-right: 1px solid rgba(255,255,255,0.1)
        font-size: 16px
        font-weight: 700
        line-height:24px
        &.highlight
          color: #fff
      .desc
        display: inline-block
        padding-left: 12px
        font-size: 14px
        font-weight: 700
        line-height: 48px
    .content-right
      flex: 0 0 105px
      width: 105px
      .pay
        font-size: 14px
        font-weight: 700
        text-align: center
        line-height: 48px
        box-sizing: border-box
        background-color: #2b333b
        padding: 0 8px
        &.more
          background-color: #00b43c
          color: #fff
  .balls-container
    .ball
      position: fixed
      z-index: 88
      bottom: 22px
      left: 32px
      transform: translate3d(0,0,0)
      transition: all 0.4s cubic-bezier(0.49,-0.29,0.75,0.41)
      .inner
        width: 16px
        height: 16px
        border-radius: 50%
        background-color: rgb(0,160,220)
        transition: all 0.4s linear
        transform: translate3d(0,0,0)
  .shopcart-list
    position: absolute
    left: 0
    top: 0
    z-index: -1
    width: 100%
    transform: translate3d(0,-100%,0)
    &.v-enter, &.v-leave-to
      transform: translate3d(0,0,0)
    &.v-enter-active, &.v-leave-active
      transition: all 0.5s
    .list-header
      width: 100%
      height: 40px
      line-height: 40px
      background-color: #f3f5f7
      box-sizing: border-box
      padding: 0 18px
      border-1px(rgba(7,17,27,0.1))
      .title
        float: left
        font-size: 14px
        font-weight: 200
        color: rgb(7,17,27)
      .empty
        float: right
        font-size: 12px
        color: rgb(0,160,220)
    .list-content
      padding: 0 18px
      max-height: 217px
      overflow: hidden
      background-color: #fff
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        border-1px(rgba(7,17,27,0.1))
        .name
          line-height: 24px
          font-size: 14px
          color: rgb(7,17,27)
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-size: 14px
          font-weight: 700
          color: rgb(240,20,20)
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 6px
.list-mask
  position: fixed
  top: 0
  left: 0
  z-index: 40
  width: 100%
  height: 100%
  background: rgba(7,17,27,0.6)
  backdrop-filter: blur(10px)
  &.v-enter, &.v-leave-to
    background: rgba(7,17,27,0)
  &.v-enter-active, &.v-leave-active
    transition: all 0.5s
</style>
