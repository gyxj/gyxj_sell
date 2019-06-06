<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header'
  import {urlParse} from './common/js/util'
  const ERR_OK = 0
  export default {
    data () {
      return {
        'seller': {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () {
      this.$http.get('/api/seller?id=' + this.seller.id).then((result) => {
        if (result.body.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, result.body.data)
        }
      })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      position: relative
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7,17,27,0.1))
      .tab-item
        flex: 1
        text-align: center
        & > a
          display: block
          font-size: 14px
          color: rgb(77,85,93)
        .router-link-active
            color: rgb(240,20,20)
</style>
