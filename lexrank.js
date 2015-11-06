if (typeof module !== 'undefined' && module.exports) {
  var pagerank = require('./pagerank.js');
}

function lexrank(sentences, params) {

  // set default parameters
  //if (!params) params = {};
  if (!params.continuous) params.continuous = false;  // continuous lexrank
  if (!params.pagerank_params) params.pagerank_params = {}; // see pagerank.js
  if (!params.threshold) params.threshold = .1;
  if (!params.idf) params.idf = {};
  if (!params.sort_by_score) params.sort_by_score = true; // sort result

  // Begin tools
  var values = function(obj) {
    var xs = [];
    for (var key in obj) xs.push(obj[key]);
    return xs;
  };

  var sum = function(xs) {
    return xs.reduce(function(prev, current, idx, all) {
      return prev + current;
    });
  };

  var norm = function(xs) {
    return Math.sqrt(sum(xs.map(function(v, i, all) { return v * v; })));
  };

  var cos_sim = function(tf1, tf2) { // tf or tf*idf
    if (Object.keys(tf1).length == 0 || Object.keys(tf2).length == 0)
      return 0;
    var a = 0;
    Object.keys(tf1).forEach(function(w) {
      a += tf1[w] * ((tf2[w] != null) ? tf2[w] : 0);
    });
    var b = norm(values(tf1)) * norm(values(tf2));
    return a / b;
  };
  // End tools

  // sentence -> tf vector
  var word2id = {}; var id2word = [];
  var word_id = 0;
  //var tf_vecs = [];
  var tfidf_vecs = [];

  var tf2tfidf = function(tf) {
    tfidf = [];
    for (var wid in tf) {
      tfidf[wid] = tf[wid] * ((params.idf[id2word[wid]] != null)
                                ? params.idf[id2word[wid]] : 1.0);
    }
    return tfidf;
  };

  sentences.forEach(function(s) {
    var tf = [];
    params.word_segmenter(s).forEach(function(w) {
      if (word2id[w] == null) {
        word2id[w] = word_id;
        id2word[word_id] = w;
        word_id++;
      }
      tf[word2id[w]] = (tf[word2id[w]] == null) ? 1 : (tf[word2id[w]] + 1);
    });
    //tf_vecs.push(tf);
    tfidf_vecs.push(tf2tfidf(tf));
  });
  //console.log(tf_vecs.length);
  //console.log(word2id);
  //console.log(id2word);

  // compute similarities between sentences and prepare a graph.

  //var similarities = [];
  var graph = {};
  for (var i = 0; i < sentences.length; i++) {
    graph[i] = {};
    //similarities[i] = [];
  }

  for (var i = 0; i < sentences.length; i++) {
    for (var j = i + 1; j < sentences.length; j++) {
      var score = cos_sim(tfidf_vecs[i], tfidf_vecs[j]);
      //similarities[i][j] = score;
      if (params.continuous && score > 0) {
        graph[i][j] = {'weight': score};
        graph[j][i] = {'weight': score};
      }
      else if (score >= params.threshold) {
        graph[i][j] = {'weight': 1.0};
        graph[j][i] = {'weight': 1.0};
      }
    }
  }
  //console.log(graph);

  // apply pagerank
  var score = pagerank(graph, params.pagerank_params);
  //console.log(score);

  var sents_meta = [];
  for (var i = 0; i < sentences.length; i++) {
    //sents_meta.push({idx: i, score: score[i], sims: similarities[i]});
    sents_meta.push({idx: i, score: score[i]});
  }

  if (params.sort_by_score == true) {
    sents_meta.sort(function(a, b) {
      return b.score - a.score;
    });
  }

  return sents_meta;
}

// for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = lexrank;
}
