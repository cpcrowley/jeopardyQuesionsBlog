"use strict";
QQ.lockTableInitialized = false

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.finalJeopardy = function(pane, gameType) {
  var cdata = QQ.getData('cdata.json')
  if (!cdata) {
    console.log('***** finalJeopardy cData not ready')
    return
  }
  var c0data = QQ.getData('c0data.json')
  var c1data = QQ.getData('c1data.json')
  var c2data = QQ.getData('c2data.json')
  var c3data = QQ.getData('c3data.json')

  var html = ''

  var finalData = cdata.finalData
  switch (gameType) {
    case 0: finalData = c0data.finalData; break
    case 1: finalData = c1data.finalData; break
    case 2: finalData = c2data.finalData; break
    case 3: finalData = c3data.finalData; break
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  var html = ''

  //----------------------------------------------------------------------------
  function winLine(sub1, sub2, percent, title) {
    html += '<tr><td class="text-align-left">'+title+'</td>'
    finalData[sub1].forEach(function(v) {
      var a = (percent==='%') ? ((100*v/finalData[sub2]).toFixed()+'%') :
      ('$'+(v/finalData[sub2]).toFixed())
      html += '<td>' + a + '</td>'
    })
    html += '</tr>'
  }

  //----------------------------------------------------------------------------
  winLine('winsByDJOrder', 'totalGames', '%',
  '% final win by place after double jeopardy, including locks')

  winLine('winsByDJOrderNoLock', 'totalNoLockGames', '%',
  '% final win by place after double jeopardy, NOT a lock')

  winLine('winsByPodiumPosition', 'totalGames', '%',
  '% final win by podium position (Champion is first, challengers second and third)')

  winLine('totalAfterDJScore', 'totalGames', '$',
  'Average score after double jeopardy')

  winLine('totalFinalScore', 'totalGames', '$',
  'Average final score')

  //----------------------------------------------------------------------------
  html += '<tr><td class="text-align-left">% locks by any player</td><td>'+(100*finalData.totalLocks/finalData.totalGames).toFixed()+'%</td>'
  html += '<td></td><td></td></tr>'

  $('.place-table tbody').empty().append(html)

  html = ''

  var players = cdata.players
  switch (gameType) {
    case 0: players = c0data.players; break
    case 1: players = c1data.players; break
    case 2: players = c2data.players; break
    case 3: players = c3data.players; break
  }
  var playersWithLocks = _.filter(players, function(playerInfo) {
    return (playerInfo.games >= 1) && (playerInfo.lockGames >= 1)
  })

  playersWithLocks.forEach(function(playerInfo) {
    html += '<tr class="color-table-body">'+
    '<td class="color-table-side-label">'+playerInfo.name+'</td>'+
    '<td>'+playerInfo.lockGames+'</td>'+
    '<td>'+playerInfo.games+'</td>'+
    '<td>'+(100*playerInfo.lockGames/playerInfo.games).toFixed()+'%</td>'+
    '</tr>'
  })

  console.log('QQ.finalJeopardy: html='+html)

  var lockTable = $('.lock-table')
  lockTable.find('tbody').empty().append(html)
  if (QQ.lockTableInitialized) {
    lockTable.order([1, 'desc'])
  } else {
    lockTable.dataTable({"order": [[1, 'desc']]})
    QQ.lockTableInitialized = true
  }

  var gamesSelect = $('#final-games-type')
  gamesSelect.val(gameType)
  function handleParamChange() {
    QQ.finalJeopardy(pane, parseInt(gamesSelect.val(),10))
  }
  gamesSelect.on('change', handleParamChange)
}
/*

















*/
