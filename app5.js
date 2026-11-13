"use strict";
const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let judgement = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 以下の数行は人間の勝ちの場合の処理なので，
  // 判定に沿ってあいこと負けの処理を追加する
  judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/janken2", (req, res) => {
  const hand = req.query.hand;               // ラジオボタンで選ばれた value（グー/チョキ/パー）
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  console.log( {hand, win, total} );
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';

  // 勝敗の判定
  let judgement = '';
  if( hand == cpu ) {
    judgement = 'あいこ';
  } else if( (hand=='グー' && cpu=='チョキ') ||
             (hand=='チョキ' && cpu=='パー') ||
             (hand=='パー' && cpu=='グー') ) {
    judgement = '勝ち';
    win += 1;
  } else {
    judgement = '負け';
  }
  total += 1;

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken2', display );
});

// ===== 第8回：DB（もどき）の一覧表示とデータ追加 =====
let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  // 登録後は一覧を返す（入力画面に戻すなら res.redirect('/public/keiyo_add.html'); ）
  res.render('db1', { data: station });
});

// 同じデータを表（db2.ejs）で表示する版
app.get("/keiyo_table", (req, res) => {
  res.render('db2', { data: station });
});

// ===== 第8回 やってみよう(2)(3)：モンハンワイルズの新モンスター一覧と追加 =====
// 項目：id（番号），name（モンスター名），species（種族），alias（別名）
let monster = [
  { id:1, name:"ドシャグマ", species:"牙獣種", alias:"闢獣" },
  { id:2, name:"チャタカブラ", species:"両生種", alias:"纏蛙" },
  { id:3, name:"バーラハーラ", species:"海竜種", alias:"沙海竜" },
  { id:4, name:"ラバラ・バリナ", species:"鋏角種", alias:"刺花蜘蛛" },
  { id:5, name:"レ・ダウ", species:"飛竜種", alias:"煌雷竜" },
  { id:6, name:"ウズ・トゥナ", species:"海竜種", alias:"波衣竜" },
  { id:7, name:"ププロポル", species:"獣竜種", alias:"沼噴竜" },
  { id:8, name:"アジャラカン", species:"牙獣種", alias:"赫猿獣" },
];

app.get("/monster", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('monster', { data: monster });
});

app.get("/monster_add", (req, res) => {
  let newdata = {
    id: Number( req.query.id ),
    name: req.query.name,
    species: req.query.species,
    alias: req.query.alias
  };
  monster.push( newdata );
  // 追加したモンスターが入った一覧を見せたいので一覧を返す
  res.render('monster', { data: monster });
});

// ===== 第9回：一覧表示と詳細表示 =====
let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

// やってみよう(3)：station2へのデータ追加
// 例：/keiyo2_add?id=8&code=JE13&name=幕張豊砂駅&change=&passengers=12000&distance=30.5
// ※ "/keiyo2/:number" より上に書く（下に書くと keiyo2_add が :number として扱われるのを防ぐため，URLも別名にしている）
app.get("/keiyo2_add", (req, res) => {
  const newdata = {
    id: Number( req.query.id ),
    code: req.query.code,
    name: req.query.name,
    change: req.query.change,
    passengers: Number( req.query.passengers ),   // 数値の項目は Number() で変換する
    distance: Number( req.query.distance )
  };
  console.log( newdata );
  station2.push( newdata );
  res.redirect('/keiyo2');
});

app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {data: detail} );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
