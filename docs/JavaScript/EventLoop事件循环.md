## 浏览器中的EventLoop
### 为什么会有事件循环
因为javascript是单线程的。
- 单线程是指js引擎中解析和执行js代码的线程只有一个（主线程），每次只能做一件事情；
- js为什么选择单线程？js是服务于客户端，如果是多线程会出现意想不到的问题，比如有一个线程是需要删掉这个dom元素，而另一个线程需要修改这个dom元素上的内容，就会报错
- 单线程就意味着，同一时间只能执行一个任务，所有的任务都需要排队，前一个任务结束，后一个任务才能执行。如果前一个任务耗时很长，后一个任务需要一直等待，就会导致页面卡死，体验不好
### 如何解决单线程带来的问题？
异步，把耗时的任务放到异步队列中
- javascript的任务可以分为两种，同步和异步。
- 同步任务是直接放在主线程上排队依次执行
- 异步任务会放在异步队列中，若有多个异步任务则需要在任务队列中等待，任务下一步会被移动到调用栈，然后主线程执行调用栈的任务。
::: 调用栈
调用栈是一个栈结构，函数调用会形成一个栈帧，帧中包含了当前执行函数的参数和局部变量等上下文信息，函数执行完后，他的执行上下文会从栈中弹出。
:::
**检查调用栈是否为空，以及某个任务添加到调用栈中的这个过程就是事件循环，这就是js实现异步的核心**

浏览器端事件循环中的异步队列有两种，宏任务队列和微任务队列。

## 常见的macrotask：
- script全部代码
- setTimeout
- setInterval
- I/O操作
- UI渲染

## 常见的microtask：
- new Promise().then()
- MutationObserve

## 1. 执行顺序
1. 检查宏任务队列是否为空，非空则到2，为空则到3。
2. 执行宏任务中的一个任务。
3. 继续检查微任务队列是否为空，若有则到4，否则到5。
4. 取出微任务中的任务执行，执行完成后返回到步骤3。
5. 执行视图更新。

::: TIP
当某个宏任务执行完后,会查看是否有微任务队列。如果有，先执行微任务队列中的所有任务，如果没有，会读取宏任务队列中排在最前的任务，执行宏任务的过程中，遇到微任务，依次加入微任务队列。栈空后，再次读取微任务队列里的任务，依次类推。
:::

```js
setTimeout(() => {
    console.log('setTimeout')
})
const myPromise = new Promise((resolve, reject) => {
    console.log('promise start')
    resolve('1')
    console.log('promise end')
})
myPromise.then(res => {
    console.log('then:'+res)
})
/**
 1、setTimeout 宏任务
 2、Promise    微任务
 同步promise start->promise end->微任务then:1->宏任务setTimeout
 **/
```
## 2. 宏任务微任务交错执行
```js
setTimeout(() => {
    console.log('timeout 1')
     Promise.resolve().then(res => {
         console.log('Promise 1')
     })
 })

 Promise.resolve().then(res => {
     console.log('promise 2')
     setTimeout(() => {
         console.log('timeout 2')
     })
 })

 /**
 1、setTimeout 宏任务
 2、Promise    微任务
微任务：promise 2-> 宏任务： timeout 1->微任务：Promise 1->宏任务：timeout 2
由于宏任务：timeout 1比timeout 2 先加入异步队列，由于是先进先出，
所以timeout 1首先执行，但是timeout 1宏任务中又有一个微任务，
因此Promise 1随后执行，timeout2最后执行
 **/
```
## 3. async thenable对象
```js
async function fn() {
  return await {
    then(resolve) {
      resolve('thenable')
    }
  }
}
```
改写成：
```js
async function fn(){
  return new Promise((resolve, reject) => {
    resolve('promise')
  })
}
```
## 4、async执行顺序
```js
async function async1() {
    console.log("async1 start")
    await async2();
    console.log("async1 end")
}
async function async2() {
    console.log('async2')
}

// 入口
async1();
console.log("script")
```
改写成：
```js
async function async1() {
    console.log("async1 start")
    new Promise((resolve, reject) => {
        console.log('async2')
        resolve()
    }).then(res => {
        console.log("async1 end")
    })
}
async function async2() {
    console.log('async2')
}

// 入口
async1();
console.log("script")
```

## 5. 如果promise没有resolve和reject
promise代码没有resolve和reject，表示这个promise对象永远没有完成，await一直等待结果，导致promise下面的代码永远不会执行
```js
async function async1() {
    console.log("async1 start")
    await new Promise(resolve => {
        console.log("promise")
    })
    console.log("async1 success")
    return "async1 end"
}
console.log("script start");
async1().then(res => {
    console.log(res)
})
console.log("script end");
```
## 6. 某大厂面试
```js
async function async1() {
    console.log("async1 start")
    await async2()
    console.log("async1 end")
}
async function async2(){
    console.log("async2");
}
console.log("script start");
setTimeout(() => {
    console.log("setTimeout");
}, 0)
async1();
new Promise((resolve, reject) => {
    console.log("promise1")
    resolve()
}).then(res => {
    console.log("promise2")
}).then(res => {
    console.log("promise3")
}).then(res => {
    console.log("promise4")
})
console.log("script end");
```