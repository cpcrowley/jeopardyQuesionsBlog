"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'It is hard to win on Jeopardy',
      'Only 28% of contestants make it past the first game. Out of about 10,000 players, less than 3,000 win any games at all.'
    ],
    [
      'The champion wins 44% of the time',
      'Almost 72% of players lose in their first games so there is a 28% chance of a challenger (a non-champion) winning a game. There are two challengers so they have a 56% of winning. This means the champion has a 44% chance of winning.'
    ],
  ])
  return html
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.winsByPlayer = function(pane, gameType) {
  var cdata = QQ.getData('cdata.json')
  if (!cdata) {
    console.log('***** winsByPlayer: cData not ready')
    return
  }
  var c0data = QQ.getData('c0data.json')
  var c1data = QQ.getData('c1data.json')
  var c2data = QQ.getData('c2data.json')
  var c3data = QQ.getData('c3data.json')
  var dataToUse = null
  switch (gameType) {
    case 0: dataToUse = c0data; break
    case 1: dataToUse = c1data; break
    case 2: dataToUse = c2data; break
    case 3: dataToUse = c3data; break
    default: dataToUse = cdata; break
  }

  var html = '<div class="table-responsive results-div">'
  html += '<table class="table table-bordered table-striped">'
  html += '<tr class="color-table-top-label">'
  var ths = ['Games Played', '# Players', '%', 'Cum. Players', 'Cum. %']
  _.forEach(ths, function(th){ html += `<th>${th}</th>` })
  html += '</tr>'

  var numPlayersByGameCount = {}

  _.forEach(dataToUse.players, function(player) {
    var nGames = player.games
    var count = numPlayersByGameCount[nGames]
    if (!count) count = 0
    count += 1
    numPlayersByGameCount[nGames] = count
  })

  var gameCountNumPlayersRows = _.map(numPlayersByGameCount,
    function(numPlayers,gameCount) {return [gameCount,numPlayers,0]})
    .sort(function(a,b) {return a[0]-b[0]})

  var cumTotal = 0
  var totalPlayers = 0

  _.forEach(gameCountNumPlayersRows, function(row) {
    totalPlayers += row[1]
    cumTotal += row[1]
    row[2] = cumTotal
  })

  _.forEach(gameCountNumPlayersRows, function(row) {
    var pc = (100 * row[1]) / totalPlayers
    var pcCum = (100 * row[2]) / totalPlayers

    html += '<tr class="color-table-body">'
    var tds = [row[0], row[1], pc.toFixed(2), row[2], pcCum.toFixed(2)]
    _.forEach(tds, function(td){ html += `<td>${td}</td>` })
    html += '</tr>'
  })

  html += '</table>';
  html += notes()
  html += '</div>'
  pane.empty().append(html)
};
