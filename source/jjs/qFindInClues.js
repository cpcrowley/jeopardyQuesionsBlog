"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'Interesting to play around with',
      'I thought that New Mexico came up a lot but all the states come up roughly the same number of times.'
    ]
  ])
  return html
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.findInClues = function(pane, ss) {
  var answerStrings = QQ.getData('answerStrings.json')
  var clueStrings = QQ.getData('clueStrings.json')

  if (!ss || ss.length < 2) {
    return '<div class="results-div"><h3>Search string must be two characters for longer</h3></div>'
  }
  ss = ss.replace(/\+/g, ' ')
  ss = decodeURIComponent(ss)
  var ssLen = ss.length

  var clueHits = 0
  var answerHits = 0
  var numClues = answerStrings.length
  var ret = '';
  var re = new RegExp(ss, 'i')
  var match

  ret += '<div class="find-section">--- Clues ---</div>'
  _.forEach(clueStrings, function(s) {
    match = re.exec(s[1])
    if (match) {
      clueHits += 1
      var mi = match.index
      var s0 = s[1]
      var s1 = s0.substring(0, mi) + '<span class="found-string">' + ss + '</span>' + s0.substring(mi+ssLen)
      //var s2 = s1.replace("\\\'", "'")
      ret += s[0] + ': ' + s1 + '<br/>\n'
    }
  })
  ret += '<div class="find-section">--- Answers ---</div>'
  _.forEach(answerStrings, function(s) {
    match = re.exec(s[1])
    if (match) {
      answerHits += 1
      var mi = match.index
      var s0 = s[1]
      var s1 = s0.substring(0, mi) + '<span class="found-string">' + ss + '</span>' + s0.substring(mi+ssLen)
      //var s2 = s1.replace(/\\'/, "'")
      ret += s[0] + ': ' + s1 + '<br/>\n'
    }
  })

  var header = '<div class="results-div"><h4>Found "'+ss+'" in '+clueHits+
  ' clues and '+answerHits+' answers (of '+numClues+')</h4>'
  ret += notes()
  pane.form.append(header + ret + '</div>')
};
