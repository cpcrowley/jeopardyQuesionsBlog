"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'The leader usually wins',
      'The dollar leader going into final jeopardy wins 74% of the time, 65% if there is not a lock. The player in third only has an 8% chance of winning even if there is not a lock.'
    ],
    [
      'Locks',
      'Sometimes the leaer has a <em>lock</em>, that is, more than twice as much money as the second place player, so a low bet will guarantee a win no matter how final jeopardy comes out. The leader has a lock 27% of the time.'
    ],
    [
      'Brad Rutter',
      'Brad Rutter played in the era when you could only play five regular games and then you had to quit. He has since played in 23 tournament games an done very well, with 7 locks in those 23 games, against tournament quality players.'
    ],
  ])
  return html
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var whoWinsFJ = function() {
  var html = ''
  return html
}

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

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  var html = '<div class="table-responsive results-div"><h1>NEW VERSION</h1>'

  var finalData = cdata.sAllFinalData
  switch (gameType) {
    case 0: finalData = c0data.sAllFinalData; break
    case 1: finalData = c1data.sAllFinalData; break
    case 2: finalData = c2data.sAllFinalData; break
    case 3: finalData = c3data.sAllFinalData; break
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  html += '<table class="table table-bordered"><thead><tr class="color-table-top-label"><th>&nbsp;</th><th>First</th><th>Second</th><th>Third</th></tr></thead><tbody>'

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

  //----------------------------------------------------------------------------
  html += '</tbody></table>';

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  html += '<table id="lock-table" class="table table-bordered table-striped"><thead><tr class="color-table-top-label"><th>Player</th><th>Locks</th><th>Games</th><th>% locks</th></tr></thead><tbody>'

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

  html += '</tbody></table>';
  html += notes()
  html += '</div>';
  pane.form.append(html)
  $('#lock-table').dataTable({
    "order": [[1, 'desc']]
})
}
