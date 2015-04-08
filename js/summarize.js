function summarize() {

  var text = document.getElementById('input').value;
  var num_sent = document.getElementById('num_sent').value;
  //console.log(text);
  //console.log(num_sent);

  var sent_splitter = function(text) {
    _sents = text.replace(/([。．？！\n]+)/g, '$1|').split('|');

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

  // https://sites.google.com/site/kevinbouge/stopwords-lists
  var _stopwords = 'これ それ あれ この その あの ここ そこ あそこ こちら どこ だれ なに なん 何 私 貴方 貴方方 我々 私達 あの人 あのかた 彼女 彼 です あります おります います は が の に を で え から まで より も どの と し それで しかし';
  var stopwords = {};
  _stopwords.split(' ').forEach(function(w) { stopwords[w] = true; });

  var _segmenter = new TinySegmenter();
  var word_segmenter = function(sent) {
    return _segmenter.segment(sent)
      .map(function(w) { return w.trim(); })
      .filter(function(w) {
        return (stopwords[w] == null && w.length > 0 &&
            ! /^[\s!-@\[-`\{-~　、-〜！-＠［-｀]+$/.test(w));
      });
  };

  var sentences = sent_splitter(text);
  console.log(sentences);
  var result = lexrank(sentences, {word_segmenter: word_segmenter})
                 .slice(0, num_sent);
  //console.log(result);
  var score_max = result[0].score;
  var score_min = result.slice(-1)[0].score;
  result.sort(function(a, b) { return a.idx - b.idx; });

  var score2color = function(s) { // need review
    // [0,1] -> [9,0] -> #nnnnnn
    var c = '#';
    var n = Math.floor((1 - s) * 9);
    for (var i = 0; i < 6; i++) c += n;
    return c;
  }

  var summary = '';
  result.forEach(function(meta) {
    //console.log('(' + meta.score + ', ' + meta.idx + ')  ' + sentences[meta.idx]);
    var score_norm = (meta.score - score_min) / (score_max - score_min);
    //console.log(meta.score + ' ' + score_norm);
    var color = score2color(score_norm);
    //console.log(color);
    summary += '<span style="color:' + color + '"> ' + sentences[meta.idx] + '</span>';
  });
  document.getElementById('output').innerHTML = '';
  document.getElementById('output').innerHTML =
    '<div class="jumbotron"><p>' + summary + '<p></div>';
}
