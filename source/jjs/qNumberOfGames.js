"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.winsByPlayer = function(pane, gameType) {
  console.log('QQ.winsByPlayer gameType='+gameType)
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
    case 0: dataToUse = c0data; console.log('Using c0data'); break
    case 1: dataToUse = c1data; console.log('Using c1data'); break
    case 2: dataToUse = c2data; console.log('Using c2data'); break
    case 3: dataToUse = c3data; console.log('Using c3data'); break
    default: dataToUse = cdata; console.log('Using cdata'); break
  }

  var html = ''

  var numPlayersByGameCount = {}

  console.log('dataToUse.players', dataToUse.players)
  console.log('dataToUse.players[0]', dataToUse.players[0])
  _.forEach(dataToUse.players, function(player) {
    var nGames = player.games
    var count = numPlayersByGameCount[nGames]
    if (!count) count = 0
    count += 1
    numPlayersByGameCount[nGames] = count
  })
  console.log('numPlayersByGameCount', numPlayersByGameCount)

  var gameCountNumPlayersRows = _.map(numPlayersByGameCount,
    function(numPlayers,gameCount) {return [gameCount,numPlayers,0]})
    .sort(function(a,b) {return a[0]-b[0]})
  //console.log('gameCountNumPlayersRows', gameCountNumPlayersRows)

  var cumTotal = 0
  var totalPlayers = 0

  _.forEach(gameCountNumPlayersRows, function(row) {
    totalPlayers += row[1]
    cumTotal += row[1]
    row[2] = cumTotal
  })
  //console.log('gameCountNumPlayersRows', gameCountNumPlayersRows)

  _.forEach(gameCountNumPlayersRows, function(row) {
    //console.log('LOOP row', row)
    var pc = (100 * row[1]) / totalPlayers
    var pcCum = (100 * row[2]) / totalPlayers

    html += '<tr class="color-table-body">'
    var tds = [row[0], row[1], pc.toFixed(2), row[2], pcCum.toFixed(2)]
    _.forEach(tds, function(td){ html += `<td>${td}</td>` })
    html += '</tr>'
  })

  $('tbody').empty().append(html)

  var gamesSelect = $('#number-games-type')
  gamesSelect.val(gameType.toString())
  console.log('set gamesSelect to '+gamesSelect.val())
  function handleParamChange() {
    //console.log('handleParamChange gamesSelect='+parseInt(gamesSelect.val(),10))
    QQ.winsByPlayer(pane, parseInt(gamesSelect.val(),10))
  }
  gamesSelect.on('change', handleParamChange)
};
/*

















*/
