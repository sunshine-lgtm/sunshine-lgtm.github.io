module.exports = {
  title: 'Memory space',
  description: '我的个人网站',
  head: [ // 注入到当前页面的 HTML <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  base: '/', // 这是部署到github相关的配置
  markdown: {
    lineNumbers: false // 代码块显示行号
  },
  themeConfig: {
    nav: [ // 导航栏配置
      { text: '前端基础', link: '/accumulate/' },
      { text: '算法题库', link: '/algorithm/' },
      { text: '微博', link: 'https://github.com/sunshine-lgtm/sunshine-lgtm.github.io' }
    ],
    sidebar: [
      {
        title: 'TypeScript',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        // sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          ['/TypeScript/基础知识', '基础知识']
        ]
      },
      {
        title: 'HTTP',   // 必要的
        collapsable: false, // 可选的, 默认值是 true,
        // sidebarDepth: 1,    // 可选的, 默认值是 1
        children: [
          ['/HTTP/1.x', 'HTTP 1.x'],
          ['/HTTP/2.x', 'HTTP 2.x'],
        ]
      },
      {
        title: 'JavaScript',
        children: [
          ['/JavaScript/async', 'async'],
          ['/JavaScript/Promise', 'Promise'],
          ['/JavaScript/EventLoop事件循环', 'EventLoop事件循环'],
        ]
      },
      {
        title: 'Vue',
        path: '/Vue',      // 可选的, 标题的跳转链接，应为绝对路径且必须存在
        children: [
          ['/Vue/Computed', 'Computed'],
          ['/Vue/NextTick', 'NextTick'],
          ['/Vue/KeepAlive', 'KeepAlive']
        ]
      }
    ], // 侧边栏配置
    sidebarDepth: 2, // 侧边栏显示2级
  }
};