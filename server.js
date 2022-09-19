import express from 'express';
import { renderToString } from 'vue/server-renderer';
import { createApp } from './app.js';

const server = express();

server.get('/', (req, res) => {
  // # 案例一：sever.js 返回初始化的视图 + client.js
  // 将 createSSRApp 执行结果转为模板字符串 - 应用一次模板字符串解析？显示初始化的视图
  // client 执行 mount 之后，div 中的内容，全部没了；？那还要 server 渲染的 HTML 字符串干嘛？防止页面闪烁？

  const app = createApp();
  renderToString(app).then(html => {
    console.log('html', html);

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Vue SSR Example</title>
        <script type="importmap">
          {
            "imports": {
              "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
            }
          }
        </script>
        <script type="module" src="/client.js"></script>
      </head>
      <body>
        <div id="initView">initView: ${html}</div>
        <div id="app">${html}</div>
      </body>
    </html>
    `);
  });

  // ## 案例2：也可以仅仅发送一个 HTML 模板，所有逻辑交由 client.js 实现
  // res.send(`
  // <!DOCTYPE html>
  // <html>
  //   <head>
  //     <title>Vue SSR Example</title>
  //     <script type="importmap">
  //       {
  //         "imports": {
  //           "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
  //         }
  //       }
  //     </script>
  //     <script type="module" src="/client.js"></script>
  //   </head>
  //   <body>
  //     <div id="app"></div>
  //   </body>
  // </html>
  // `);
});

server.use(express.static('.'));

server.listen(3000, () => {
  console.log('ready');
});
