<template>
<div class="cartcontrol">
  <transition>
    <div class="cart-del icon-remove_circle_outline" v-show="food.count>0" @click.stop="delFood">
    </div>
  </transition>
  <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
  <div class="cart-add icon-add_circle" @click.stop="addFood($event)"></div>
</div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue'
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addFood (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
        this.$emit('cart-add', event.target) // 向父组件触发一个自定义的cart-add事件，同时将事件对象传递给父组件
      },
      delFood (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count > 0) {
          this.food.count--
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-del, .cart-add
      display: inline-block
      padding: 6px
      font-size: 24px
      color: rgb(0,160,220)
      height: 24px
      line-height: 24px
      &.v-enter, &.v-leave-to
        opacity: 0
        transform: translate3d(24px,0,0) rotate(180deg)
      &.v-enter-active, &.v-leave-active
        transition: all 0.5s linear
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
</style>
