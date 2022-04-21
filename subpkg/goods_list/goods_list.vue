<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key='i' @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        // 节流阀
        isloading:false
      };
    },
    onLoad(options) {
      // console.log(optiaos)
      // 将参数转存到 queryObj
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''

      this.getGoodsList()
    },
    methods: {
      // 获取商品列表
      async getGoodsList(cb) {
        // 打开节流阀
        this.isloading = true
        // 请求数据
        const {data: res } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        // 数据请求完毕调用cb回调函数
        cb && cb()
        // console.log(res)
        if (res.meta.status !== 200) return uni.$showMsg()
        // this.goodsList = res.message.goods
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList,...res.message.goods]
        // console.log(this.goodsList)
        this.total = res.message.total
      },
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
            
      }
    },
    onReachBottom() {
      // 判断是否还有下一页数据
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total)  return uni.$showMsg('数据加载完毕')
      // 如果在请求数据就 return
      if(this.isloading) return
      // 页码值＋1
      this.queryObj.pagenum++
      // 重新获取列表数据
      this.getGoodsList()
    },
    onPullDownRefresh(){
      // 重置关键数据
      this.queryObj.pagenum = 0
      this.total = 0
      this.isloading = false
      this.goodsList = []
      
       // 2. 重新发起请求
       // 获取数据之后关闭下拉刷新
        this.getGoodsList(() => uni.stopPullDownRefresh())
    },

}
</script>

<style lang="scss">

</style>
