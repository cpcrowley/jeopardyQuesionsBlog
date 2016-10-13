"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'Percent answered correctly',
      'Matt Jackson with 96% is ahead among players who have been in 10 games or more. Ken Jennings is 19th at 91.5%'
    ],
    [
      'Ken Jennings',
      'His percent answered right is high but not the highest. Where he shines is the number of clues he answers per game where he is way above everybody else with 36.2 clues per game with the next best person is at 30.0 clues per game. That is 20% more clues per game.'
    ],
    [
      'Daily Doubles',
      'Players who win a lot of games answer a lot of daily doubles. Some of this is the strategy of "hunting" for daily doubles and part of it is that multiple-game winners just answer a lot of questions correctly. A few people also seem to bet big on daily doubles.'
    ],
    [
      'Daily Double Bets',
      'Roger Craig is the highest bettor. He win an aaverage of $9213 on 1.8 daily double per game, an average of over $5118 per daily double. Matt Jackson is close with an average of $8194 on 1.9 daily doubles per game, with an average daily double win of $4312'
    ]
  ])
  return html
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.analyzePlayers = function(pane, gameType, numberOfGames) {
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
  html += '<table id="players-table" class="table table-bordered table-striped">'
  html += '<thead>'+
  '<tr class="color-table-top-label">'+
  '<th>&nbsp;</th>'+
  '<th>&nbsp;</th>'+
  '<th colspan="4">All Clues</th>'+
  '<th colspan="5">Daily Doubles</th>'+
  '</tr>';
  html += '<tr class="color-table-top-label">'
  var ths = ['Player', 'Games', 'Total', '% right', 'right/game', 'clues/game',
  'Total', '% right', 'DD/game', 'won/game', 'lost/game']
  _.forEach(ths, function(th){ html += `<th>${th}</th>` })
  html += '</tr></thead><tbody>';

  console.log('QQ.analyzePlayers: dataToUse.players["Seth Wilson"]', dataToUse.players["Seth Wilson"])

  _.forEach(dataToUse.players, function(playerInfo) {
    if (playerInfo.games >= numberOfGames) {
      var games = playerInfo.games
      var clues = playerInfo.rights + playerInfo.wrongs
      var rightpc = 0
      if (clues) rightpc = (100*playerInfo.rights/clues)
      var dd = playerInfo.dd
      var ddclues = dd.rights + dd.wrongs
      var ddrightpc = 0
      if (ddclues) ddrightpc = (100*dd.rights/ddclues)
      html += '<tr>'
      html += `<td class="text-align-left color-table-side-label">${playerInfo.name}</td>`
      var tds = [
        games,
        clues,
        rightpc.toFixed(1),
        (playerInfo.rights/games).toFixed(1),
        (clues/games).toFixed(1),
        ddclues, ddrightpc.toFixed(1),
        (ddclues/games).toFixed(1),
        '$'+(dd.rightsTotal/games).toFixed(),
        '$'+(dd.wrongsTotal/games).toFixed()
      ]
      _.forEach(tds, function(td){ html += `<td>${td}</td>` })
      html += '</tr>'
    }
  })

  html += '</tbody></table>';
  html += notes()
  html += '</div>'
  pane.empty().append(html)
  $('#players-table').dataTable({
    "order": [[1, 'desc']]
  })
}
