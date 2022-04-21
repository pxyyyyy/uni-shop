<template>
	<view>
		  <view class="goods-item">
		    <!-- 左侧 -->
		    <view class="goods-item-left">
          <!-- 购物车选中 -->
          <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickeHandler"></radio>
		      <image :src="goods.goods_small_logo  || defaultPic" class="goods-pic"></image>
		    </view>
		    <!-- 右侧 -->
		    <view class="goods-item-right">
		      <view class="goods-name">{{goods.goods_name}} </view>
		      <view class="goods-info-box">
		        <view class="goods-price">￥{{goods.goods_price | tofixed}} </view>
            <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
		      </view>
		    </view>
		  </view>
	</view>
</template>

<script>
	export default {
    props:{
      goods:{
        type:Object,
        default: {},
      },
      showRadio:{
        type:Boolean,
        // 默认情况不展示radio组件
        default:false
      },
      showNum:{
        type:Boolean,
        // 默认情况不展示  组件
        default:false
      }
    },
		data() {
			return {
				// 默认图片地址
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png',
			};
		},
    methods:{
      radioClickeHandler(){
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      numChangeHandler(val){
        // console.log(val)
        this.$emit('num-change',{
          goods_id:this.goods.goods_id,
          goods_count:+val
        })
      }
    },
    filters:{
      tofixed(num){
        return Number(num).toFixed(2)
      }
    }
    
	}
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
    }
    .goods-info-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>
