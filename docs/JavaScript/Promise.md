## Promise 对象
Promise 对象用于表示一个异步操作的最终完成 (或失败)及其结果值
## 特点
对象的状态不受外界影响，3种状态
- Pending   进行中
- Fulfilled  已完成
- Rejected  已失败 
一旦改变就不会再变（Fulfilled状态和Rejected状态）
Pending -> Fulfilled
Pending -> Rejected
## 基础用法
### 创建promise实例
```js
const myPromise = new Promise((resolve, rejected) => {
    let number = 3
    if (number > 5) {
        resolve('成功')
    }else {
        rejected('失败')
    }
})
myPromise.then((res) => {
    console.log(res)
}, (err) => {
    console.log(err)
})
```
Promise构造函数接受一个函数作为参数，该函数有两个参数分别是resolve和reject，他们是两个函数，由Javascript引擎提供，不用自己部署。
resolve作用是将Promise状态由“未完成”转为“成功”，pending -> fulfilled；在异步操作成功时调用，并将异步操作的结果作为参数传递出去；
reject作用是将Promise状态由“未完成”转为“失败”，pending -> rejected；在异步操作失败时调用，并将异步操作的结果作为参数传递出去；
### then方法
Promise实例生成后，可用then方法分别指定两种状态回调参数。then方法可以接受两个回调函数作为参数：
1. Promise对象状态改为Resolved时调用 （必选）
2. Promise对象状态改为Rejected时调用 （可选）
```js
function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms)
    })
}
sleep(3000).then(() => console.log('完成'))
```
在Promise实例对象创建完成后立即调用then，上述例子中，等待了3000秒后执行了then方法。
### 执行顺序
**普通顺序**
```js
console.log('000')
const myPromise = new Promise((resolve, reject) => {
    console.log('111')
    resolve()
})
myPromise.then(() => {
    console.log('222')
})
console.log('333')
```
**与定时器混用**
```js
console.log('000')
const myPromise = new Promise((resolve, reject) => {
    console.log('111')
    resolve()
})
setTimeout(() => {
    console.log('222')
}, 0);
myPromise.then(() => {
    console.log('333')
})
console.log('444')
```
## Promise优缺点
### 优点
- 解决回调
- 链式调用
- 减少嵌套
### 缺点
- 无法监测进行状态
- 新建立即执行且无法取消
- 内部错误无法抛出
## 手写promise
### Promise状态
- state存放当前的状态
- value存放当前状态的值
- then方法，返回值也是promise
- catch方法
- finally方法
- 静态方法，如promise.all，promise.resolve
### 实现Promise
####
1. 实现一个promise，在setTimeout 中去 resolve
```js
const PENDING = "PENDING"
const FULFILLED = "FULFILLED"
const REJECTED = "REJECTED"
class MyPromise{
    constructor(fn){
        this.state = PENDING
        this.value = undefined
        this.resolveCallbacks = []
        this.rejectCallbacks = []
        const resolve = (val) => {
            this.state = FULFILLED
            this.value = val
            // 执行所有的then方法,将当前状态的值传递出去
            this.resolveCallbacks.map((fn) => fn(this.value))
        }
        const reject = (val) => {
            this.state = REJECTED
            this.value = val
            // 执行所有的then方法,将当前状态的值传递出去
            this.rejectCallbacks.map((fn) => fn(this.value))
        }
        // 创建之后直接执行，需要接收两个参数
        fn(resolve, reject)
    }
    then(onfulfilled, onrejected) {
        // 处理尚未完成的promise,在未完成状态下挂载，完成状态下执行执行即可
        if (this.state === PENDING) {
            this.resolveCallbacks.push(onfulfilled)
            this.rejectCallbacks.push(onrejected)
        }
    }
}
```