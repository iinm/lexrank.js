// Node.js
var lexrank = require('./lexrank.js');
var TinySegmenter = require('./tiny_segmenter.js');

// test http://ja.wikipedia.org/wiki/JavaScript
var text = 'JavaScript（ジャヴァスクリプト）とは、プログラミング言語のひとつである。Javaと名前が似ているが、異なるプログラミング言語である（後述の#歴史を参照）。オブジェクト指向のスクリプト言語であることを特徴とする。実行環境が主にウェブブラウザに実装され、動的なウェブサイト構築や、リッチインターネットアプリケーションなど高度なユーザインタフェースの開発に用いられる。JavaScriptという言葉は狭義にはMozillaが仕様を策定し実装しているスクリプト言語を指す。このスクリプト言語はEcmaインターナショナルでECMAScript (ECMA-262) として標準化されており、多くのWebブラウザー等はこの標準化されたECMAScriptを実装している。たとえば、マイクロソフトによる実装はJScriptと呼ぶ。一般的にJavaScriptという言葉が使われるときはこのようなさまざまなECMAScriptの実装も含んだ幅広い意味でつかわれるので、どちらの意味でJavaScriptという言葉が使われているかは文脈で判断する必要がある[1]。ECMAScriptは仕様自体に独自の拡張を条件付きで認める記述があり[2]、現在主要なブラウザが実装しているスクリプト言語はすべてECMAScriptに準拠していることになる。広義の意味でこれをJavaScriptと呼ぶ場合、主要なブラウザが実装しているスクリプト言語はマイクロソフトやGoogle, Appleの実装も含めてJavaScriptである。なお、Webブラウザーでよく実装されているAPIであるDOM (Document Object Model) はECMAScriptの仕様の一部ではないので、DOMの準拠の有無はECMAScriptの準拠の有無とは関係ない[3]。読むと長く、またJavaと略すことができない（Javaというプログラム言語がある）。そのため、略し方がたびたび各所で話題になっている。';

// Define sentence splitter and word segmenter.

var sent_splitter = function(text) {
  return text.replace(/([。．？！]+)/g, '$1|').split('|');
};

// https://sites.google.com/site/kevinbouge/stopwords-lists
var _stopwords = 'これ それ あれ この その あの ここ そこ あそこ こちら どこ だれ なに なん 何 私 貴方 貴方方 我々 私達 あの人 あのかた 彼女 彼 です あります おります います は が の に を で え から まで より も どの と し それで しかし'.split(' ');
var stopwords = {};
_stopwords.forEach(function(w) { stopwords[w] = true; });

var _segmenter = new TinySegmenter();
var word_segmenter = function(sent) {
  return _segmenter.segment(sent)
           .map(function(w) { return w.trim(); })
           .filter(function(w) { return stopwords[w] == null; })
}

var result = lexrank(text, {sent_splitter: sent_splitter,
                            word_segmenter: word_segmenter});

//console.log(result);
console.log('# (score, index)  sentence');
result.forEach(function(sent) {
  console.log('(' + sent.score + ', ' + sent.idx + ')  ' + sent.sent);
});


// test idf param
var result = lexrank(text, {sent_splitter: sent_splitter,
                            word_segmenter: word_segmenter,
                            idf: {'オブジェクト': 1.5, '指向': 1.7}});

console.log('\n# (score, index)  sentence');
result.forEach(function(sent) {
  console.log('(' + sent.score + ', ' + sent.idx + ')  ' + sent.sent);
});
