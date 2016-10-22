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
  console.log('analyzePlayers: gameType='+gameType+' #players='+dataToUse.players.length)
  console.log('cdata.players.length='+cdata.players.length)
  console.log('c0data.players.length='+c0data.players.length)
  console.log('c1data.players.length='+c1data.players.length)
  console.log('c2data.players.length='+c2data.players.length)
  console.log('c3data.players.length='+c3data.players.length)

  var html = `<table class="players-table table table-bordered table-striped">
    <thead>
      <tr class="color-table-top-label">
        <th>&nbsp;</th>
        <th>&nbsp;</th>
        <th colspan="4">All Clues</th>
        <th colspan="5">Daily Doubles</th>
      </tr>
      <tr class="color-table-top-label">
        <th>Player</th>
        <th>Games</th>
        <th>Total</th>
        <th>% right</th>
        <th>right/game</th>
        <th>clues/game</th>
        <th>Total</th>
        <th>% right</th>
        <th>DD/game</th>
        <th>won/game</th>
        <th>lost/game</th>
      </tr>
    </thead>
    <tbody>
    `

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

  html += '</tbody></table>'

  var playersTable = $(html)
  $('.results-div').empty().append(playersTable)
  playersTable.DataTable({"order": [[1, 'desc']]})

  var gamesSelect = $('#games-to-use')
  gamesSelect.val(gameType)
  var numberGamesSelect = $('#number-of-games')
  numberGamesSelect.val(numberOfGames)

  function handleParamChange() {
    var gs = parseInt(gamesSelect.val(),10)
    var ngs = parseInt(numberGamesSelect.val(),10)
    //console.log('handleParamChange gs.val='+gamesSelect.val()+' gs='+gs)
    QQ.analyzePlayers(pane, gs, ngs)
  }
  gamesSelect.on('change', handleParamChange)
  numberGamesSelect.on('change', handleParamChange)

}
/*

















*/
