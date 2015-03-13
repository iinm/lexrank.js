# lexrank.js

LexRank (Text summarization) in JavaScript

- requires [pagerank.js](https://github.com/iinm/pagerank.js)

## Usage

Define sentence splitter and word segmenter.

```javascript
// example (Japanese)

var sent_splitter_ja = function(text) {
  return text.replace(/([。．？！]+)/g, '$1|').split('|');
};

// http://chasen.org/~taku/software/TinySegmenter/
var _segmenter = new TinySegmenter();

var word_segmenter_ja = function(sent) {
  return _segmenter.segment(sent)
           .map(function(w) { return w.trim(); })
           .filter(not_stopword); // remove stopwords (Recommended)
};
```

Apply LexRank.

```javascript
// example (http://ja.wikipedia.org/wiki/JavaScript)

var text = 'JavaScript（ジャヴァスクリプト）とは、プログラミング言語のひとつである。Javaと名前が似ているが、...';
var sentences = sent_splitter_ja(text);

var result = lexrank(sentences, {word_segmenter: word_segmenter_ja});

console.log('# (score, index)  sentence');
result.forEach(function(meta) { // sorted by score
  console.log('(' + meta.score + ', ' + meta.idx + ')  ' + sentences[meta.idx]);
});

// output
// # (score, index)  sentence
// (0.08698999355586459, 0)  JavaScript（ジャヴァスクリプト）とは、プログラミング言語のひとつである。
// (0.08698999355586459, 9)  広義の意味でこれをJavaScriptと呼ぶ場合、主要なブラウザが実装しているスクリプト言語はマイクロソフトやGoogle, Appleの実装も含めてJavaScriptである。
// (0.08698999355586459, 4)  JavaScriptという言葉は狭義にはMozillaが仕様を策定し実装しているスクリプト言語を指す。
// ...
```

## Default Parameters

```javascript
var result = lexrank(sentences, {word_segmenter: (required),
                                 idf: {}, // used when compute cos similarity
                                 threshold: 0.1, // cos similarity
                                 sort_by_score: true, // result
                                 pagerank: { alpha: 0.85,
                                             tol: 1.0e-6,
                                             max_iter: 100 }});
```
