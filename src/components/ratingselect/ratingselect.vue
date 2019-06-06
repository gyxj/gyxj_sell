<template>
<div class="ratingselect">
  <div class="ratingType">
    <span class="block positive" :class="{'active':sType===2}" @click="select(2,$event)">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
    <span class="block positive" :class="{'active':sType===0}" @click="select(0,$event)">{{desc.positive}}<span class="count">{{positive.length}}</span></span>
    <span class="block negative" :class="{'active':sType===1}" @click="select(1,$event)">{{desc.negative}}<span class="count">{{negative.length}}</span></span>
  </div>
  <div class="switch" :class="{'on':oContent}" @click="toggleContent">
    <span class="icon-check_circle"></span>
    <span class="text">只看有内容的评价</span>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0
  const NEGATIVE = 1
  const ALL = 2
  export default {
    props: {
      ratings: {
        type: Array,
        default () {
          return []
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default () {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          }
        }
      }
    },
    data () {
      return {
        sType: this.selectType,
        oContent: this.onlyContent
      }
    },
    methods: {
      select (type, event) {
        if (!event._constructed) {
          return
        }
        this.sType = type
        this.$emit('type-change', this.sType)
      },
      toggleContent (event) {
        if (!event._constructed) {
          return
        }
        this.oContent = !this.oContent
        this.$emit('content-change', this.oContent)
      }
    },
    computed: {
      positive () {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE
        })
      },
      negative () {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
.ratingselect
  .ratingType
    font-size: 0
    line-height: 16px
    padding: 12px 0 18px 0
    border-bottom: 1px solid rgba(7,17,27,0.1)
    .block
      margin-right: 8px
      padding: 8px 12px
      font-size: 12px
      border-radius: 2px
      .count
        display: inline-block
        margin-left: 2px
        font-size: 10px
    .positive
      color: rgb(77,85,93)
      background-color: rgba(0,160,220,0.2)
      &.active
        background-color: rgb(0,160,220)
        color: #fff
    .negative
      margin-right: 0
      color: rgb(77,85,93)
      background-color: rgba(77,85,93,0.2)
      &.active
        background-color: rgb(77,85,93)
        color: #fff
  .switch
    padding: 12px 0
    font-size: 0
    color: rgb(147,153,159)
    &.on
      .icon-check_circle
        color: #00c850
    .icon-check_circle
      margin-left: 4px
      font-size: 24px
      line-height: 24px
    .text
      display: inline-block
      vertical-align: top
      margin-top: 7px
      margin-left: 4px
      font-size: 12px
      line-height: 12px
</style>
