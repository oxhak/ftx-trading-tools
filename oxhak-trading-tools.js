const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
var readline = require('readline');
const FTXRest = require('./ftx-api-rest.js');
const FTXAPIKeys = require('./FTXAPIKeys.js');

const ftx = new FTXRest({
  key: FTXAPIKeys.key,
  secret: FTXAPIKeys.secret,
  subaccount: FTXAPIKeys.subaccount
})

var instrument;
var current_position_type;


///Market buy/sell
function MarketEntry(type, amount){
  if (amount.includes('%account')){
    var finalamountaccount;
    var amountpercentageaccount=amount.replace('%account','');
    ftx.request({
      method: 'GET',
      path: '/wallet/balances'
    }).then(function(data) {
      data.result.forEach(function(value, index, array) {
        if (data.result[index].coin === "USD" ){
          finalamountaccount=(data.result[index].total*parseInt(amountpercentageaccount)/100);
          ftx.request({
            method: 'GET',
            path: '/markets/'+instrument,
          }).then(function(data) {
             finalamountaccount=finalamountaccount/data.result.price;
             ftx.request({
               method: 'POST',
               path: '/orders',
               data: {
                 'market': instrument,
                 'side': type,
                 'price': null,
                 'type': 'market',
                 'size': finalamountaccount,
                 'reduceOnly': false,
                 'ioc': false,
                 'postOnly': false,
                 'clientId': null
               }
             }).then(function(data) {
             });
          });
        }
      });
    });
  } else if (amount.includes('%position')){
    var finalamountposition;
    var amountpercentageposition=amount.replace('%position','');
    ftx.request({
      method: 'GET',
      path: '/positions'
    }).then(function(data) {
      data.result.forEach(function(value, index, array) {
        if (data.result[index].future === instrument ){
          finalamountposition=(data.result[index].openSize*parseInt(amountpercentageposition)/100);
          ftx.request({
            method: 'POST',
            path: '/orders',
            data: {
              'market': instrument,
              'side': type,
              'price': null,
              'type': 'market',
              'size': finalamountposition,
              'reduceOnly': true,
              'ioc': false,
              'postOnly': false,
              'clientId': null
            }
          }).then(function(data) {
          });
        }
      });
    });
  // } else if (amount.includes('%freecollateral')){
  } else {
    ftx.request({
      method: 'POST',
      path: '/orders',
      data: {
        'market': instrument,
        'side': type,
        'price': null,
        'type': 'market',
        'size': amount,
        'reduceOnly': false,
        'ioc': false,
        'postOnly': false,
        'clientId': null
      }
    }).then(function(data) {
    });
  }
}
///
///Splitted orders
function SplitFinalStep(type,splitsteppedamount,into,splitsteppedfrom,splitsteppedto,reduceonly){
var pricestep=(splitsteppedto-splitsteppedfrom)/into;
var price=splitsteppedfrom;
var i=1;
while (i <= into) {
  ftx.request({
    method: 'POST',
    path: '/orders',
    data: {
      'market': instrument,
      'side': type,
      'price': price,
      'type': 'limit',
      'size': splitsteppedamount/into,
      'reduceOnly': false,
      'ioc': false,
      'postOnly': true,
      'clientId': null
    }
  }).then(function(data) {
    rl.prompt();
  });
  console.log("Posted "+type+" order " + i + ": " + splitsteppedamount/into + " @" +price);
  i++;
  price=price+pricestep;
}
}
function SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto){
  var splitsteppedamount;
  if (amount.includes('%account')){
    var splitsteppedamountpercentage=amount.replace('%account','');
    ftx.request({
      method: 'GET',
      path: '/wallet/balances'
    }).then(function(data) {
      data.result.forEach(function(value, index, array) {
        if (data.result[index].coin === "USD" ){
          splitsteppedamount=data.result[index].total;
          splitsteppedamount=(data.result[index].total*parseInt(splitsteppedamountpercentage)/100);
          ftx.request({
            method: 'GET',
            path: '/markets/'+instrument,
          }).then(function(data) {
             splitsteppedamount=splitsteppedamount/data.result.price;
             SplitFinalStep(type,splitsteppedamount,into,splitsteppedfrom,splitsteppedto);
          });
        }
      });
    });
  } else if (amount.includes('%position')){
    var splitsteppedamountposition;
    var splitsteppedamountpercentageposition=amount.replace('%position','');
    ftx.request({
      method: 'GET',
      path: '/positions'
    }).then(function(data) {
      data.result.forEach(function(value, index, array) {
        if (data.result[index].future === instrument ){
          splitsteppedamountposition=(data.result[index].openSize*parseInt(splitsteppedamountpercentageposition)/100);
          SplitFinalStep(type,splitsteppedamountposition,into,splitsteppedfrom,splitsteppedto);
        }
      });
    });
  // } else if (amount.includes('%freecollateral')){
  } else {
    splitsteppedamount=amount;
    SplitFinalStep(type,splitsteppedamount,into,splitsteppedfrom,splitsteppedto);
  }
}
function SplitStepPriceTo(type,amount,into,splitsteppedfrom,to){
      var splitsteppedto;
      if (to.includes('M+')){
        ftx.request({
          method: 'GET',
          path: '/markets/'+instrument,
        }).then(function(data) {
          if (to.includes('%')){
          to=to.replace('%','');
          splitsteppedto=(data.result.price+(data.result.price*parseInt(to.replace('M+',''))/100));
          SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto);
        } else {
          splitsteppedto=data.result.price+parseInt(to.replace('M+',''));
          SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto);
        }
        });
      } else if (to.includes('M-')) {
        ftx.request({
          method: 'GET',
          path: '/markets/'+instrument,
        }).then(function(data) {
          if (to.includes('%')){
          to=to.replace('%','');
          splitsteppedto=(data.result.price-(data.result.price*parseInt(to.replace('M-',''))/100));
          SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto);
        } else {
          splitsteppedto=data.result.price+parseInt(to.replace('M-',''));
          SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto);
        }
        });
      } else {
        splitsteppedto=parseInt(to);
        SplitStepAmount(type,amount,into,splitsteppedfrom,splitsteppedto);
      }
}
function SplitStepPriceFrom(type,amount,into,from,to){
      var splitsteppedfrom;
      if (from.includes('M+')){
        ftx.request({
          method: 'GET',
          path: '/markets/'+instrument,
        }).then(function(data) {
          if (from.includes('%')){
          from=from.replace('%','');
          splitsteppedfrom=(data.result.price+(data.result.price*parseInt(from.replace('M+',''))/100));
          SplitStepPriceTo(type,amount,into,splitsteppedfrom,to);
        } else {
          splitsteppedfrom=data.result.price+parseInt(from.replace('M+',''));
          SplitStepPriceTo(type,amount,into,splitsteppedfrom,to);
        }
        });
      } else if (from.includes('M-')) {
        ftx.request({
          method: 'GET',
          path: '/markets/'+instrument,
        }).then(function(data) {
          if (from.includes('%')){
          from=from.replace('%','');
          splitsteppedfrom=data.result.price-(data.result.price*parseInt(from.replace('M-',''))/100);
          SplitStepPriceTo(type,amount,into,splitsteppedfrom,to);
          } else {
          splitsteppedfrom=data.result.price-parseInt(from.replace('M-',''));
          SplitStepPriceTo(type,amount,into,splitsteppedfrom,to);
          }
        });
      } else {
        splitsteppedfrom=parseInt(from);
        SplitStepPriceTo(type,amount,into,splitsteppedfrom,to);
      }
}
///

/// Stop loss
function StopLoss(distance){
  distance=distance.replace('%','');
  ftx.request({
    method: 'GET',
    path: '/positions'
  }).then(function(data) {
      data.result.forEach(function(value, index, array) {
           if(data.result[index].future===instrument){
             if(data.result[index].openSize!=0)
             var position_side;
             var stop_price;
             var stop_size=data.result[index].openSize;
             if (data.result[index].side === "buy" ){
             position_side="sell";
             stop_price=data.result[index].entryPrice-(data.result[index].entryPrice*distance/100);
             } else if (data.result[index].side === "sell" ) {
             position_side="buy";
             stop_price=data.result[index].entryPrice+(data.result[index].entryPrice*distance/100);
             }
             ftx.request({
               method: 'POST',
               path: '/conditional_orders',
               data: {
                 'market': instrument,
                 'side': position_side,
                 'triggerPrice': stop_price,
                 'size': stop_size,
                 'type': 'stop',
                 'reduceOnly': true
               }
             }).then(function(data) {
               rl.prompt();
             });
           }
      })
  });
}
///

///Cancel orders
function CancelOrders(type){
  if(type === "all"){
    ftx.request({
      method: 'DELETE',
      path: '/orders',
      data: {
        market: instrument
      }
    }).then(function(data) {
        ftx.request({
          method: 'GET',
          path: '/positions'
        }).then(function(data) {
            data.result.forEach(function(value, index, array) {
                 if(data.result[index].future===instrument){
                   var position_side;
                   if (data.result[index].side === "buy" ){
                   position_side="sell";
                   } else if (data.result[index].side === "sell" ) {
                   position_side="buy";
                   }
                   //Close Position
                   if(data.result[index].openSize!=0)
                   ftx.request({
                     method: 'POST',
                     path: '/orders',
                     data: {
                       'market': instrument,
                       'side': position_side,
                       'price': null,
                       'type': 'market',
                       'size': data.result[index].openSize,
                       'reduceOnly': true,
                       'ioc': false,
                       'postOnly': false,
                       'clientId': null
                     }
                   }).then(function(data) {
                     // console.log(data);
                     rl.prompt();
                   });
                 }
            })
        });
    });
  } else if(type === "orders"){
    ftx.request({
      method: 'DELETE',
      path: '/orders',
      data: {
        market: instrument
      }
    }).then(function(data) {
   });
 }  else if(type === "buys"){
       ftx.request({
         method: 'GET',
         path: '/orders',
         data: {
           market: instrument
         }
       }).then(function(data) {
         data.result.forEach(function(value, index, array) {
           if (data.result[index].side === "buy" ){
                 ftx.request({
                   method: 'DELETE',
                   path: '/orders/'+parseInt(data.result[index].id)
                 }).then(function(data) {
                 });
           }
           rl.prompt();
         });
       });
   } else if(type === "sells"){
         ftx.request({
           method: 'GET',
           path: '/orders',
           data: {
             market: instrument
           }
         }).then(function(data) {
           data.result.forEach(function(value, index, array) {
             if (data.result[index].side === "sell" ){
                   ftx.request({
                     method: 'DELETE',
                     path: '/orders/'+parseInt(data.result[index].id)
                   }).then(function(data) {
                   });
             }
             rl.prompt();
           });
         });
     }
}
///

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('FTX> ');
rl.prompt();
rl.on('line', function(line) {
  var splittedline=line.split(" ");
  if (line === "balance") {
    ftx.request({
      method: 'GET',
      path: '/wallet/balances'
    }).then(function(data) {
       data.result.forEach(function(value, index, array) {
       console.log("");
       console.log("------------------");
       console.log("["+data.result[index].coin+"] [Free "+data.result[index].free+"] [Total "+data.result[index].total+"] [USD Value "+data.result[index].usdValue+"]");
       console.log("------------------");
       });
       rl.prompt();
    });
  }
  else if (splittedline[0] === "price") {
    ftx.request({
      method: 'GET',
      path: '/markets/'+instrument,
    }).then(function(data) {
       console.log(data.result.last);
      rl.prompt();
    });
  }
  else if (splittedline[0] === "buy") {
  MarketEntry('buy', splittedline[1]);
  }
  else if (splittedline[0] === "sell") {
  MarketEntry('sell', splittedline[1]);
  }
  else if (splittedline[0] === "instrument") {
  instrument=splittedline[1].toUpperCase();
  console.log("instrument set to "+instrument);
  rl.setPrompt("FTX["+instrument+"]> ");
  rl.prompt();
  }
  else if (splittedline[0] === "stop") {
  StopLoss(splittedline[1]);
  }
  else if (splittedline[0] === "cancel") {
  CancelOrders(splittedline[1]);
  }
  else if (splittedline[0] === "split") {
  SplitStepPriceFrom(splittedline[1],splittedline[2],splittedline[4],splittedline[6],splittedline[8]);
  }
  else if (line === "help") {
       console.log("");
       console.log("------------------");
       console.log("Commands:");
       console.log("------------------");
       console.log("instrument {instrument}");
       console.log("balance");
       console.log("price");
       console.log("buy {amount}");
       console.log("sell {amount}");
       console.log("split {buy/sell} {amount} into {into} from {from} to {to}");
       console.log("stop {distance}%");
       console.log("cancell all");
       console.log("cancel buys");
       console.log("cancel sells");
       console.log("help");
       console.log("about");
       console.log("version");
       console.log("------------------");
       console.log("More infos at https://github.com/oxhak/oxhak-trading-tools#README");
       console.log("------------------");
       rl.prompt();
  } else if (line === "about") {
       console.log("oxhak-trading-tools https://github.com/oxhak/oxhak-trading-tools");
       rl.prompt();
  } else if (line === "version") {
       console.log("v0.0.1");
       rl.prompt();
  }
    rl.prompt();
}).on('close',function(){
    process.exit(0);
});
