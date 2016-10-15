"use strict";
QQ.playersTableInitialized = false

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

  var html = ''

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

  var playersTable = $('.players-table')
  playersTable.find('tbody').empty().append(html)
  if (QQ.playersTableInitialized) {
    playersTable.order([1, 'desc'])
  } else {
    playersTable.dataTable({"order": [[1, 'desc']]})
    QQ.playersTableInitialized = true
  }

  var gamesSelect = $('#games-to-use')
  gamesSelect.val(gameType)
  var numberGamesSelect = $('#number-of-games')
  numberGamesSelect.val(numberOfGames)

  function handleParamChange() {
    QQ.analyzePlayers(pane, parseInt(gamesSelect.val(),10), parseInt(numberGamesSelect.val(),10))
  }
  gamesSelect.on('change', handleParamChange)
  numberGamesSelect.on('change', handleParamChange)

}
/*
















*/
