export default{
  namespaced:true,
  
  state:() => ({
    // 购物车的数组  用来储存购物车中每个商品的信息对象
    // 每个商品的信息对象都包含6个属性
    // {goods_id,goods_name,goods_price,goods_count,goods_small_logo,goods_state}
    cart:JSON.parse(uni.getStorageSync('cart') || '[]') 
  }),
  
  mutations:{
    addToCart(state,goods){    
      // 判断购物车是否存在相同商品
      const findResult =  state.cart.find(x => x.goods_id === goods.goods_id)
      // console.log(findResult)
      if(!findResult){
        state.cart.push(goods)
      }else{
        findResult.goods_count++
      }
      // console.log(state.cart)
      
      this.commit('m_cart/saveToStorage')
    },
    // 数据储存到本地
    saveToStorage(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    // 购物车选中状态
    updateGoodsState(state,goods){
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult){
        findResult.goods_state = goods.goods_state   
            // console.log(findResult.goods_state)
        this.commit('m_cart/saveToStorage')
      }
    },
    // 商品数量
    updateGoodsCount(state,goods){
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if(findResult){
        findResult.goods_count = goods.goods_count
        // console.log(findResult.goods_count)
        this.commit('m_cart/saveToStorage')
      }
    },
    // 根据id删除对于商品
    removeGoodsById(state,goods_id){
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 更新全选反选
    updateAllGoodsState(state,newState){
      state.cart.forEach(x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }
    
    
  },
  
  getters:{
    // 统计购物车总数量
    total(state){
      // let c = 0
      // // 循环统计商品的数量，累加到变量 c 中
      // state.cart.forEach(goods => c += goods.goods_count)
      // return c
      
      return state.cart.reduce((total,item) => total += item.goods_count,0)
    },
    // 勾选商品的总数量
    checkedCount(state){
      return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count,0)
    },
    // 已勾选商品的总价格
    checkedGoodsAmount(state){
      return state.cart.filter(x => x.goods_state).reduce((total,item) => total += item.goods_count * item.goods_price,0).toFixed(2)
    }
  }
}