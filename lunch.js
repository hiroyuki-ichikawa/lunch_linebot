// 【修正箇所】LINE Message API アクセストークン
var ACCESS_TOKEN = '(*)LINE Message API アクセストークンを入れる';

// 【修正箇所】選択肢を出す際の画像
var button_png = "LINE Botの中で利用する選択を選ぶ際の画像.png";

// カレンダー用
function doGet(e) {
  var template = 'index';
  
  if( e.parameter.school == 1 ){
     // 中学校
     template = 'index_j';
  }else{
     // 小学校
     template = 'index_e';  
  }
  
  return HtmlService.createTemplateFromFile(template).evaluate();
}


// LINE Bot用
function doPost(e) {
  var contents = e.postData.contents;
  var obj = JSON.parse(contents);
  var events = obj["events"];
  for (var i = 0; i < events.length; i++) {
    if (events[i].type == "message") {
      //reply_message(events[i]);
      message_check(events[i]);
    }
  }
}

// メッセージのルーティング
function message_check(e){
  var flg = 0;
  
  // 今までセパレートする（まだ作れていない）
  kekka = e.message.text.split(",");

  // ２つ以上あった場合の処理
  if( kekka.length >= 2 ){
    if((kekka[0] === "小学校") || (kekka[0] === "中学校")){
      if( (kekka[1] === "昨日") || (kekka[1] === "今日") || (kekka[1] === "明日") || (kekka[1] === "今週") || (kekka[1] === "来週") ){
        // OK
        
        if( kekka.length == 3 ){
          if( kekka[2] === "アレルゲン" ){
            // アレルゲン
            reply_arerugen(e,kekka);
          }else{
            // 献立表示
            reply_kondate(e,kekka);
          }
        }else{
          // 献立の表示
          reply_kondate(e,kekka);
        }
        
      }else{
        reply_date(e,kekka[0]);
      }
    }else{
      // 小中学校選択
      reply_string(e,"操作方法","「今日」「明日」「今週」「来週」と入力するか、メニューから選んでください。");
      //reply_school_farst(e);
    }
  }

  
  // １つしかない場合の処理
  if( kekka.length == 1 ){
    if( e.message.text === "今日" ){
      reply_school(e,"今日")
    }else if(e.message.text === "昨日"){
      reply_school(e,"昨日")
    }else if(e.message.text === "明日"){
      reply_school(e,"明日")
    }else if(e.message.text === "今週"){
      reply_school(e,"今週")
    }else if(e.message.text === "来週"){
      reply_school(e,"来週")
    }else if(e.message.text === "小学校"){
      reply_date(e,"小学校")
    }else if(e.message.text === "中学校"){
      reply_date(e,"中学校")
    }else if(e.message.text === "今月"){
      reply_month(e);
    }else if(e.message.text === "利用方法"){
      reply_use(e);
    }else if(e.message.text === "給食確認方法"){
      // 【修正箇所】自分の自治体向けに変える
      reply_btn_str(e,"菊川市のHP","給食献立へのお問い合わせは菊川市のホームページをチェックホカ！","https://www.city.kikugawa.shizuoka.jp/kosodate/kyouiku/gakkoukyuushoku/index.html");
    }else if(e.message.text === "使い方の確認"){
      // 【修正箇所】質問の受付はGoogleFormなりメールなり自分の自治体向けに変える
      reply_btn_str(e,"利用方法","いつもご利用ありがとうホカ〜\n市内の小・中学校の献立を確認するには、メニューから献立が知りたい日を選ぶホカ！または、今日・今週・今月などを文字入力してくれれば教えるホカ！\nまた、このBotへのご意見・お問い合わせがある方はこちらのフォームからよろしくホカ！","https://forms.gle/7L2LhtvDczk8HR5Y6");
    }else{
      // 外している時の処理  
      reply_string(e,"操作方法","「今日」「明日」「今週」「来週」と入力するか、メニューから選んでください。");
      //reply_school_farst(e);
    }
  }
}

// 確認よう
function reply_btn_str(e,title,str,btnurl){
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "Flex Message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": title,
              "size": "xl",
              "align": "center"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": str,
              "align": "start",
              "wrap": true
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "確認",
                "uri": btnurl
              }
            }
          ]
        }
      }
    }]
  }; 
  
  reply_message(e,postData)

}

// 利用方法
function reply_use(e){
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "Flex Message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "何が知りたいホカ？",
              "size": "xl",
              "align": "center"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "学校給食について知りたい場合は「給食」を、使い方を知りたい場合は「利用方法」を選ぶホカ！",
              "align": "start",
              "wrap": true
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "給食",
                "text": "給食確認方法"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "使い方",
                "text": "使い方の確認"
              }
            }
          ]
        }
      }
    }]
  }; 
  
  reply_message(e,postData)

}

// 今月
function reply_month(e){
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "学校を選ぶホカ！",
              "align": "center"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": button_png,
          "size": "full",
          "aspectRatio": "1.51:1",
          "aspectMode": "fit"
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
           {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "小学校",
                // 【修正箇所】自分のGASのURLを設定する
                "uri": "https://script.google.com/macros/s/AKfycbxAMAxfJCWdmCK2Lo1tPPUC5qq27yDhjeSZoLzf9pqpknqKxM8/exec?school=0"
              }
            },
            {
              "type": "button",
              "action": {
                "type": "uri",
                "label": "中学校",
                // 【修正箇所】自分のGASのURLを設定する
                "uri": "https://script.google.com/macros/s/AKfycbxAMAxfJCWdmCK2Lo1tPPUC5qq27yDhjeSZoLzf9pqpknqKxM8/exec?school=1"
              }
            }
          ]
        }
      }
    }]
  }; 
  
  reply_message(e,postData)

}

// 文字の返信
function reply_string(e,str,text){
    var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": str,
              "size": "xl"
            },
            {
              "type": "text",
              "text": text,
              "wrap": true
            }
          ]
        }
      }
    }]
  };
  
  reply_message(e,postData)
}

// アレルゲンの出力
function reply_arerugen(e,kekka){
    var flg = 0;
    var flg2 = 0;
    var today = new Date();
    var newDate = new Date(today.getYear(), today.getMonth(), today.getDate());
 　 var day_num = today.getDay();
  　var DateStr = Utilities.formatDate( newDate,'JST','yyyy/MM/dd' );
    var Str = "";
    var Hikaku = "";
  　var arr_day = new Array('（日）', '（月）', '（火）', '（水）', '（木）', '（金）', '（土）');

    var myData = SpreadsheetApp.getActiveSheet().getDataRange().getValues();

    // 期間の設定
  　var start = 0;
    var end = 0;
  
    if( kekka[1] === "昨日" ){
      start = -1;
      end = 0;
    }
    if( kekka[1] === "今日" ){
      start = 0;
      end = 1;
    }
    if( kekka[1] === "明日" ){
      start = 1;
      end = 2;
    }
    if( kekka[1] === "今週" ){
      // 日曜日が0,土曜日が6
      start = day_num * -1;
      end = start + 7;
    }
    if( kekka[1] === "来週" ){
      // 日曜日が0,土曜日が6
      start = day_num * -1 + 7;
      end = start + 7;
    }
  
    // メインループ
    for(var jx=start;jx<end;jx++){
      newDate = new Date(today.getYear(), today.getMonth(), today.getDate() + jx)
  　  DateStr = Utilities.formatDate( newDate,'JST','yyyy/MM/dd' );
      day_num = newDate.getDay();
      
      if( Str === "" ){
        Str = "<" + DateStr + arr_day[day_num] + ">";
      }else{
        Str = Str + "\n<" + DateStr + arr_day[day_num] + ">";
      }
      
      flg = 0;
      flg2 = 0;
      for(var i=1;i<myData.length;i++){
        if( kekka[0] === myData[i][1] ){
           var date1 = Utilities.formatDate( myData[i][2],'JST','yyyy/MM/dd' );
      
           if( date1 === DateStr ){
              flg = 1;
              if( myData[i][7]!=""){
                 Str = Str + "\n・" + myData[i][7] + "(" + myData[i][4] + "/" + myData[i][5] + ")";
                 Hikaku = myData[i][4];
                 flg2 = 1;
              }
           }
        }
      }
      
      if( flg == 0 ){
        Str = Str + "\n・給食はありません";
      }else if( flg2 == 0){
        Str = Str + "\n・アレルゲンはありません";
      }
    }
  
    var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
        "type": "bubble",
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": kekka[1] + "のアレルゲン情報 ",
              "size": "xl"
            },
            {
              "type": "text",
              "text": Str,
              "wrap": true
            }
          ]
        }
      }
    }]
  };
  
  reply_message(e,postData)
}

// 献立の出力
function reply_kondate(e,kekka){
    var flg = 0;
    var today = new Date();
    var newDate = new Date(today.getYear(), today.getMonth(), today.getDate());
 　 var day_num = today.getDay();
  　var DateStr = Utilities.formatDate( newDate,'JST','yyyy/MM/dd' );
    var Str = "";
    var Hikaku = "";
  　var arr_day = new Array('（日）', '（月）', '（火）', '（水）', '（木）', '（金）', '（土）');

    var myData = SpreadsheetApp.getActiveSheet().getDataRange().getValues();

    // 期間の設定
  　var start = 0;
    var end = 0;
  
    if( kekka[1] === "昨日" ){
      start = -1;
      end = 0;
    }
    if( kekka[1] === "今日" ){
      start = 0;
      end = 1;
    }
    if( kekka[1] === "明日" ){
      start = 1;
      end = 2;
    }
    if( kekka[1] === "今週" ){
      // 日曜日が0,土曜日が6
      start = day_num * -1;
      end = start + 7;
    }
    if( kekka[1] === "来週" ){
      // 日曜日が0,土曜日が6
      start = day_num * -1 + 7;
      end = start + 7;
    }
  
    // メインループ
    for(var jx=start;jx<end;jx++){
      newDate = new Date(today.getYear(), today.getMonth(), today.getDate() + jx)
  　  DateStr = Utilities.formatDate( newDate,'JST','yyyy/MM/dd' );
      day_num = newDate.getDay();
      
      if( Str === "" ){
        Str = "<" + DateStr + arr_day[day_num] + ">";
      }else{
        Str = Str + "\n<" + DateStr + arr_day[day_num] + ">";
      }
      
      flg = 0;
      for(var i=1;i<myData.length;i++){
        if( kekka[0] === myData[i][1] ){
           var date1 = Utilities.formatDate( myData[i][2],'JST','yyyy/MM/dd' );
      
           if( date1 === DateStr ){
              flg = 1;
              if( Hikaku === myData[i][4] ){
              }else{
                 Str = Str + "\n・" + myData[i][4];
                 Hikaku = myData[i][4];
              }
           }
        }
      }
      
      if( flg == 0 ){
        Str = Str + "\n・給食はありません";
      }
    }
  
    var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": kekka[1] + "の献立だホカ〜",
              "size" : "xl",
              "align": "center"
            }
          ]
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "献立情報 " + Str,
              "align": "start",
              "wrap": true
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "アレルギー情報を見る",
                "text": kekka[0] + "," + kekka[1] + ",アレルゲン"
              }
            }
          ]
        }
      }
    }]
  };
  
  reply_message(e,postData)
}

// 日程を選択する
function reply_date(e,str){
    var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
        "type": "carousel",
        "contents": [
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "献立を見る"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "昨日",
                    "text": str + ",昨日"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "今日",
                    "text": str + ",今日"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "明日",
                    "text": str + ",明日"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "今週",
                    "text": str + ",今週"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "来週",
                    "text": str + ",来週"
                  }
                }
              ]
            }
          },
          {
            "type": "bubble",
            "body": {
              "type": "box",
              "layout": "vertical",
              "contents": [
                {
                  "type": "text",
                  "text": "アレルゲンを見る"
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "昨日",
                    "text": str + ",昨日,アレルゲン"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "今日",
                    "text": str + ",今日,アレルゲン"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "明日",
                    "text": str + ",明日,アレルゲン"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "今週",
                    "text": str + ",今週,アレルゲン"
                  }
                },
                {
                  "type": "button",
                  "action": {
                    "type": "message",
                    "label": "来週",
                    "text": str + ",来週,アレルゲン"
                  }
                }
              ]
            }
          }
        ]
      }
    }]
  };
  
  reply_message(e,postData)
}

// 学校から選択する
function reply_school_farst(e){
    var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents":
      {
        "type": "bubble",
        "hero": {
          "type": "image",
          "url": "https://sarubobo.netlify.com/clear.png",
          "size": "full",
          "aspectRatio": "20:13",
          "aspectMode": "cover",
          "action": {
            "type": "uri",
            "uri": "http://linecorp.com/"
          }
        },
        "body": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "学校を選んでください",
              "weight": "bold",
              "size": "xl"
            }
          ]
        },
        "footer": {
          "type": "box",
          "layout": "vertical",
          "spacing": "sm",
          "contents": [
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "message",
                "label": "小学校",
                "text": "小学校"
              }
            },
            {
              "type": "button",
              "style": "link",
              "height": "sm",
              "action": {
                "type": "message",
                "label": "中学校",
                "text": "中学校"
              }
            }
          ],
          "flex": 0
        }
      }
    }]
  };
  
  reply_message(e,postData)
}


// 学校を選択する
function reply_school(e,str){
  var postData = {
    "replyToken": e.replyToken,
    "messages": [{
      "type": "flex",
      "altText": "this is a flex message",
      "contents": {
        "type": "bubble",
        "direction": "ltr",
        "header": {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "text",
              "text": "学校を選ぶホカ！",
              "size" : "xl",
              "align": "center"
            }
          ]
        },
        "hero": {
          "type": "image",
          "url": button_png,
          "size": "full",
          "aspectRatio": "1.51:1",
          "aspectMode": "fit"
        },
        "footer": {
          "type": "box",
          "layout": "horizontal",
          "contents": [
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "小学校",
                "text": "小学校,"+str
              },
              "color": "#F97308"
            },
            {
              "type": "button",
              "action": {
                "type": "message",
                "label": "中学校",
                "text": "中学校,"+str
              },
              "color": "#F97308"
            }
          ]
        }
      }
    }]
  }; 
  reply_message(e,postData)
}

function reply_message(e,postData) {
  var options = {
    "method": "post",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + ACCESS_TOKEN
    },
    "payload": JSON.stringify(postData)
  };
  UrlFetchApp.fetch("https://api.line.me/v2/bot/message/reply", options);
}