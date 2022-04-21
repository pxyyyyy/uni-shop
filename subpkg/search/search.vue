<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100"  cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议 -->
    <view class="sugg-list"  v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash-filled" size="17" @click="clean"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag :text="item" v-for="(item,i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>        
      </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer:null,
        kw:'',
        // 搜索结果
        searchResults:[],
        // 搜索历史
        historyList:[]
      };
    },
    onLoad() {
      this.historyList = JSON.parse( uni.getStorageSync('kw') || '[]')
     
    },
    methods:{
      input(e){
        clearTimeout(this.timer) 
        this.timer = setTimeout(() => {
          this.kw = e.value
          // console.log(e.value)
          this.getSearchList()
        },500)
      },
      // 根据搜索关键词，搜索商品建议列表
      async getSearchList(){
        if(this.kw === ''){
          this.searchResults = []
          return
        }
        const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
        // console.log(res)
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        this.saveSearchHistory()
      },
      gotoDetail(item){
        // console.log(item.goods_id)
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      saveSearchHistory(){
        // this.historyList.push(this.kw)
        
        const set = new Set(this.historyList)
        set.delete(this.kw)
        // console.log(set)
        set.add(this.kw)
        // console.log(set)
        this.historyList = Array.from(set)
        //搜索历史 持久化储存到本地
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      clean(){
        this.historyList = []
        uni.setStorageSync('kw','[]')
      },
      // 点击搜索历史跳转
      gotoGoodsList(kw){
        console.log(kw)
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?query=' + kw
        })
      }
      
    },
    computed:{
      histories(){
        return [...this.historyList].reverse()
      }
    }
}
</script>

<style lang="scss">
.search-box{
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list{
  padding: 0 5px;
  .sugg-item{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name{
      // 超出文本省略号
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
.history-box{
  padding: 0 5px;
  .history-title{
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list{   
    display: flex;
    flex-wrap: wrap;
    .uni-tag{
      margin: 5px 5px;
    }
  }
  
}

</style>
