<template>
<div class="goods" :goods="goods">
  <div class="menu-wrapper">
    <ul>
      <li v-for="(item,index) in goods" :key="item.index" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
        <span class="text border-1px">
          <span v-if="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
        </span>
      </li>
    </ul>
  </div>
  <div class="foods-wrapper">
    <ul>
      <li class="food-list food-list-hook" v-for="item in goods" :key="item.index">
        <h1 class="title">{{item.name}}</h1>
        <ul>
          <li class="food-item border-1px" v-for="food in item.foods" :key="food.index" @click="selectFood(food,$event)">
            <div class="icon"><img width="57" height="57" :src="food.icon"></div>
            <div class="content">
              <h2 class="name">{{food.name}}</h2>
              <p class="desc">{{food.description}}</p>
              <div class="extra">
                <span class="sell">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
              </div>
              <div class="price">
                <span>￥{{food.price}}</span><del v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</del>
              </div>
              <div class="cartcontrol-wrapper">
                <cartcontrol :food="food" @cart-add="cartAdd"></cartcontrol>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <shopcart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :selectFoods="selectFoods" ref="shopCart"></shopcart>
  <food :food="selectedFood" ref="food" @cart-add="cartAdd"></food>
</div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import shopcart from '../shopcart/shopcart'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
const ERR_OK = 0
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  created () {
    this.$http.get('/api/goods').then((result) => {
        if (result.body.errno === ERR_OK) {
          this.goods = result.body.data
          this.$nextTick(() => {
            if (!this.menuScroll || !this.foodsScroll) {
              this.initScroll()
            } else {
              this.menuScroll.refresh()
              this.foodsScroll.refresh()
            }
            this.calculateHeight()
          })
        }
    })
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  methods: {
    selectFood (food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    _drop (target) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(target)
      })
    },
    cartAdd (target) {
      this._drop(target)
    },
    initScroll () {
      this.menuScroll = new BScroll('.menu-wrapper', {
        click: true
      })
      this.foodsScroll = new BScroll('.foods-wrapper', {
        click: true,
        probeType: 3
      })
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    calculateHeight () {
      let foodList = document.querySelector('.foods-wrapper').getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index, event) {
      if (!event._constructed) {
        return
      }
      let foodList = document.querySelector('.foods-wrapper').getElementsByClassName('food-list-hook')
      let ref = foodList[index]
      this.foodsScroll.scrollToElement(ref, 300)
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
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
    shopcart,
    cartcontrol,
    food
  }
//  events: {
//    'cart.add' (target) {
//      this._drop(target)
//    }
//  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin"
.goods
  display: flex
  position: absolute
  top: 174px
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrapper
    flex: 0 0 80px
    width: 80px
    background-color: #f3f5f7
    .menu-item
      display: table
      height: 54px
      width: 56px
      padding: 0 12px
      font-size: 0
      &.current
        position: relative
        margin-top: -1px
        background: #fff
        font-weight: 700
        z-index: 10
        .text
          border-none()
      .icon
        display: inline-block
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: 2px
        background-size: 12px 12px
        background-repeat: no-repeat
        &.decrease
          bg-image('decrease_3')
        &.discount
          bg-image('discount_3')
        &.invoice
          bg-image('invoice_3')
        &.special
          bg-image('special_3')
        &.guarantee
          bg-image('guarantee_3')
      .text
        display: table-cell
        vertical-align: middle
        width: 56px
        font-size: 12px
        line-height: 14px
        border-1px: rgba(7,17,27,0.1)
  .foods-wrapper
    flex: 1
    .title
      font-size: 12px
      color: rgb(147,153,159)
      height:26px
      line-height: 26px
      padding-left: 14px
      background: #f3f5f7
      border-left: 2px solid #d9dde1
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px: rgba(7,17,27,0.1)
      &:last-child
        border-none()
        margin-bottom: 0
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin-top: 2px
          font-size: 14px
          color: rgb(7,17,27)
          line-height: 14px
        .desc, .extra
          margin-top: 8px
          font-size: 10px
          color: rgb(143,153,159)
          line-height: 12px
        .extra
          padding-bottom: 8px
          .sell
            margin-right: 12px
        .price
          font-size: 14px
          color: rgb(240,20,20)
          font-weight: 700
          line-height: 24px
          .oldPrice
            font-size: 10px
            vertical-align: top
            color: rgb(143,153,159)
            margin-left: 8px
        .cartcontrol-wrapper
          position: absolute
          right: 0
          bottom: 18px
</style>
