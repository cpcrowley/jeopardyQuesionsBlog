//"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.clueArrayToObject = function(clue) {
  return {
    indexClueString: clue[0],
    rightArray: clue[1], // -1 if not right answer
    wrongArray: clue[2], // [] if no wrong answers
    col: clue[3], // 1 to 6, category columns on board
    row: clue[4], // 1 to 5, $200-$1000 or $400-$2000
    isDD: clue[5], // 1 if it is a daily double
    value: clue[6], // of right or wrong answer, the bet is isDD is true
    isOO: clue[7] // 1 if out-of-order, 2 if first out-of-order in category (col)
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.appendObservations = function(items, title) {
  if (!title) title = 'Observations about the statistics'
  var html = '<div class="observations-list-title">'+title+'</div><div class="observations-body"><ul>'

  _.forEach(items, function(item) {
    html += '<li><span class="observation-title">'+item[0]+'.</span><br/>'+item[1]+'</li>'
  })

  html += '</ul></div>'
  return html
}


//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.mergePlayerInfo = function(targetDataPlayers, dataToAddPlayers) {
  _.forEach(targetDataPlayers, function(value, key) {
    targetDataPlayers[key] += dataToAddPlayers[key]
  })
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.playerInfoObjectToArray = function(pi) {
  return [
    pi.games,
    pi.rights,
    pi.wrongs,
    pi.lockGames,
    pi.dd.rights,
    pi.dd.rightsTotal,
    pi.dd.wrongs,
    pi.dd.wrongsTotal
  ]
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.playerInfoArrayToObject = function(pi,key) {
  return {
    name: key,
    games: pi[0],
    clues: pi[1] + pi[2],
    rights: pi[1],
    wrongs: pi[2],
    lockGames: pi[3],
    dd: {
      clues: pi[4] + pi[6],
      rights: pi[4],
      rightsTotal: pi[5],
      wrongs: pi[6],
      wrongsTotal: pi[7]
    }
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.mergePlayers = function(targetDataPlayers, dataToAddPlayers) {
  _.forEach(dataToAddPlayers, function(value, key) {
    if (targetDataPlayers.hasOwnProperty(key)) {
      mergePlayerInfo(targetDataPlayers[key], dataToAddPlayers[key])
    } else {
      targetDataPlayers[key] = _.cloneDeep(dataToAddPlayers[key])
    }
  })
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.addFinalData = function(targetData, dataToAdd) {
  targetData.rights += dataToAdd.rights
  targetData.wrongs += dataToAdd.wrongs
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.addRoundData = function(targetData, dataToAdd) {
  for (var i = 0; i < 5; ++i) {
    var targetRow = targetData.rows[i]
    var addRow = dataToAdd.rows[i]

    targetRow.clues += addRow.clues
    targetRow.rights += addRow.rights
    _.forEach(targetRow.numWrong, function(v,i) {
      targetRow.numWrong[i] += addRow.numWrong[i]
    })

    targetRow.dd.rights += addRow.dd.rights
    targetRow.dd.rightsTotal += addRow.dd.rightsTotal
    targetRow.dd.wrongs += addRow.dd.wrongs
    targetRow.dd.wrongsTotal += addRow.dd.wrongsTotal

    targetRow.oo.clues += addRow.oo.clues
    targetRow.oo.rights += addRow.oo.rights
    _.forEach(targetRow.numWrong, function(v,i) {
      targetRow.oo.numWrong[i] += addRow.oo.numWrong[i]
    })
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.makeRoundResults = function(t) {
  var roundResults = {rows:[]}
  for (var i = 0; i < 5; ++i) {
    roundResults.rows[i] = {
      clues: 0,
      rights: 0,
      wrongs:[0,0,0,0],

      dd:{
        rights: 0,
        rightsTotal: 0,
        wrongs: 0,
        wrongsTotal: 0,
      },

      oo:{
        clues: 0,
        rights: 0,
        wrongs:[0,0,0,0],
      }
    }
  }
  return roundResults
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.makeSeasonResults = function() {
  return {
    r1:makeRoundResults('r1'),
    r2:makeRoundResults('r2'),
    final:{
      rights: 0,
      wrongs: 0,
    }
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.initializeResults = function() {
  var results = {}
  for (var season = 1; season < 33; ++season) {
    var seasonIndex = 's' + season
    results[seasonIndex] = makeSeasonResults()
  }
  return results
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.createForm = function(pane) {
  var html = '<div id="'+pane.paneId+'">'
  html += '<form class="form-horizontal" role="form">'
  html += '<div class="form-group">'

  pane.formSpec.forEach(function(item) {
    if ('select' === item[0]) {
      html += QQ.makeSelect(item[1], item[2], item[3])
    } else if ('checkbox' === item[0]) {
      html += QQ.makeCheckbox(item[1], item[2], item[3])
    } else if ('string' === item[0]) {
      html += QQ.makeStringEntry(item[1], item[2], item[3])
    } else if ('button' === item[0]) {
      html += QQ.makeGoButton(item[1], item[2])
    } else {
      console.log('createForm: unknown spec function', pane.formSpec, pane)
    }
  })

  html += '</div></form></div>'

  var panel = $(html)
  pane.form = panel
  pane.formSpec.forEach(function(item) {
    panel.find('.' + item[1])
    .on('change', function() {recomputePane(pane)})
  })
  // Prevent a CR from submitting the form and refreshing the page.
  panel.find('form').on('submit', function(event) { return false })

  return panel
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.makeSelectOrig = function(idBase, label, items) {
  var ret = '<label class="col-sm-2 control-label" for="'+idBase+'">'+label+'</label>' +
  '<div class="col-sm-10">' +
  '<select name="'+idBase+'" class="'+idBase+'"}>'

  items.forEach(function(item) {
    ret += '<option '+(item.selected?'selected ':'')+'value="'+item.value+'">'+item.label+'</option>'
  })
  ret += '</select></div>'
  return $(ret)
}
QQ.makeSelect = function(idBase, label, items) {
  var html = ''
  if (label) html += '<span class="form-label">'+label+'</span>'
  html += '<select id="'+idBase+'" name="'+idBase+'" class="'+idBase+'">'
  items.forEach(function(item) {
    html += '<option '+(item.selected?'selected ':'')+'value="'+item.value+'">'+item.label+'</option>'
  })
  html += '</select>'
  return html
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.makeCheckbox = function(idBase, label, defaultValue) {
  var checked = defaultValue ? 'checked' : ''
  return '<div class="checkbox"><label>' +
  '<input class="'+idBase+'" type="checkbox" '+defaultValue+'>'+label+'</label></div>'
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.makeStringEntry = function(idBase, label, placeHolder) {
  return '<label class="col-sm-2 control-label" for="'+idBase+'">'+label+'</label><div class="col-sm-10">' +
  '<input type="text" class="'+idBase+' form-control" id="'+idBase+'" placeholder="'+placeHolder+'"></div>'
}
