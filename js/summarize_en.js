function summarize() {

  var text = document.getElementById('input').value;
  var num_sent = document.getElementById('num_sent').value;
  //console.log(text);
  //console.log(num_sent);

  var sent_splitter = function(text) {
    return text.replace(/([^.!?A-Z]+[.?!]+\s*)/g, "$1|").split("|");
  };

  // https://sites.google.com/site/kevinbouge/stopwords-lists
  var _stopwords = "a a's able about above according accordingly across actually after afterwards again against ain't all allow allows almost alone along already also although always am among amongst an and another any anybody anyhow anyone anything anyway anyways anywhere apart appear appreciate appropriate are aren't around as aside ask asking associated at available away awfully b be became because become becomes becoming been before beforehand behind being believe below beside besides best better between beyond both brief but by c c'mon c's came can can't cannot cant cause causes certain certainly changes clearly co com come comes concerning consequently consider considering contain containing contains corresponding could couldn't course currently d definitely described despite did didn't different do does doesn't doing don't done down downwards during e each edu eg eight either else elsewhere enough entirely especially et etc even ever every everybody everyone everything everywhere ex exactly example except f far few fifth first five followed following follows for former formerly forth four from further furthermore g get gets getting given gives go goes going gone got gotten greetings h had hadn't happens hardly has hasn't have haven't having he he's hello help hence her here here's hereafter hereby herein hereupon hers herself hi him himself his hither hopefully how howbeit however i i'd i'll i'm i've ie if ignored immediate in inasmuch inc indeed indicate indicated indicates inner insofar instead into inward is isn't it it'd it'll it's its itself j just k keep keeps kept know knows known l last lately later latter latterly least less lest let let's like liked likely little look looking looks ltd m mainly many may maybe me mean meanwhile merely might more moreover most mostly much must my myself n name namely nd near nearly necessary need needs neither never nevertheless new next nine no nobody non none noone nor normally not nothing novel now nowhere o obviously of off often oh ok okay old on once one ones only onto or other others otherwise ought our ours ourselves out outside over overall own p particular particularly per perhaps placed please plus possible presumably probably provides q que quite qv r rather rd re really reasonably regarding regardless regards relatively respectively right s said same saw say saying says second secondly see seeing seem seemed seeming seems seen self selves sensible sent serious seriously seven several shall she should shouldn't since six so some somebody somehow someone something sometime sometimes somewhat somewhere soon sorry specified specify specifying still sub such sup sure t t's take taken tell tends th than thank thanks thanx that that's thats the their theirs them themselves then thence there there's thereafter thereby therefore therein theres thereupon these they they'd they'll they're they've think third this thorough thoroughly those though three through throughout thru thus to together too took toward towards tried tries truly try trying twice two u un under unfortunately unless unlikely until unto up upon us use used useful uses using usually uucp v value various very via viz vs w want wants was wasn't way we we'd we'll we're we've welcome well went were weren't what what's whatever when whence whenever where where's whereafter whereas whereby wherein whereupon wherever whether which while whither who who's whoever whole whom whose why will willing wish with within without won't wonder would would wouldn't x y yes yet you you'd you'll you're you've your yours yourself yourselves z zero";

  var stopwords = {};
  _stopwords.split(' ').forEach(function(w) { stopwords[w] = true; });

  var word_segmenter = function(sent) {
    return sent.split(/\b/)
      .map(function(w) { return w.trim().toLowerCase(); })
      .filter(function(w) {
        return (stopwords[w] == null && w.length > 0 &&
            ! /^[\s!-@\[-`\{-~　、-〜！-＠［-｀]+$/.test(w));
      });
  };

  var sentences = sent_splitter(text);
  var result = lexrank(
    sentences,
    {
      word_segmenter: word_segmenter,
      continuous: true
    }
  ).slice(0, num_sent);
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
