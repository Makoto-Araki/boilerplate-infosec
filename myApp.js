const express = require('express');
const app = express();
const helmet = require('helmet');

// ヘッダー(X-Powered-By)を削除
app.use(helmet.hidePoweredBy());

// クリックジャッキングのリスク軽減
app.use(
  helmet.frameguard({
    action: 'deny',
  })
);

// クロスサイトスクリプティング(XSS)のリスク軽減
app.use(helmet.xssFilter());

// 応答MIMEタイプの推測を避ける
app.use(helmet.noSniff())

// IEが信頼できないHTMLを開くのを防ぐ
app.use(helmet.ieNoOpen())

// セキュリティポリシー(HSTS)の設定をオーバーライド
app.use(helmet.hsts({
  maxAge: 90*24*60*60,  // 90日
  force: true,  // 今後90日間はHTTPS通信を強制
}))

// DNSレコードのプリフェッチを抑止
app.use(helmet.dnsPrefetchControl())

// ブラウザのキャッシュ無効 => 常にHTMLダウンロード
app.use(helmet.noCache())

// コンテンツセキュリティポリシー(CSP)を設定
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", 'trusted-cdn.com'],
  },
}))

// デフォルト値で一括設定
// app.use(helmet())

// 複数設定をオーバーライド
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ['style.com'],
//     }
//   },
// }))














module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
