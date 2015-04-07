var sent_splitter = function(text) {
  _sents = text.replace(/([。．？！]+)/g, '$1|').split('|');

  // 開いた括弧は必ず閉じる．
  var close2open = {'」': '「', '』': '『', '）': '（'};
  var sent = [];
  var pstack = [];
  var buff = "";
  _sents.forEach(function(s) {
    var ps = s.match(/[「」『』（）]/g);
    if (ps != null) {
      ps.forEach(function(p) {
        if (Object.keys(close2open).indexOf(p) == -1) { // open
          pstack.push(p);
        } // close
        else if (pstack[pstack.length-1] == close2open[p]) {
          pstack.pop();
        }
        //console.log(pstack);
      });
    }
    // ここでpstackが空なら括弧の対応がとれている．
    if (pstack.length == 0) {
      buff += s;
      if (buff != "") sent.push(buff);
      buff = "";
    }
    else {
      buff += s;
    }
  });
  if (buff != "") sent.push(buff);
  return sent;
};

var sent = "括弧が混在した日本語の文．「こんにちは！『ほげ』ほげ．」と，語った．（おわり";
var sents = sent_splitter(sent);
console.log(sents);
