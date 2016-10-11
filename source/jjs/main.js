"use strict";

var previousForm = null
var mainSelect = null

QQ.paneDefinitions = [
  {
    title: 'Categories',
    filename: 'qCategories',
    fn: 'categories',
    formSpec: [
      ['string', 'max-categories', 'Maximum number of categories to show', 'Default is 20'],
    ],
  },
  {
    title: 'Percent correct',
    filename: 'qPercentCorrect',
    fn: 'percentCorrect',
    formSpec: [
      ['checkbox', 'game-type', 'Show regular, tournament, celebrity and school games seperately', false],
      ['select', 'date-range', 'Select season ranges', [
        {label:'Seasons 1-32 (1984-2016) combined', value:'99', selected:true},
        {label:'Seasons 1-11, 12-22, 23-32 combined', value:'10', selected:false},
        {label:'Every 5 seasons combined', value:'5', selected:false},
        {label:'Show each season separately', value:'1', selected:false}
      ]],
      ['checkbox', 'daily-doubles', 'Show Daily Doubles on separate lines', false],
      ['checkbox', 'by-round', 'Show Jeopardy and Double Jeopardy on separate lines', false],
      ['checkbox', 'out-of-order', 'Show out of order clues (not starting with the $200/$400 clue)', false],
    ],
  },
  {
    title: 'Players',
    filename: 'qPlayers',
    fn: 'players',
    formSpec: [
      ['select', 'games-to-use', 'Games to use', [
        {label:'All games', value:'99', selected:true},
        {label:'Regular games only', value:'0', selected:false},
        {label:'Tournament games only', value:'1', selected:false},
        {label:'Celebrity games only', value:'2', selected:false},
        {label:'School games only', value:'3', selected:false}
      ]],
      ['select', 'number-of-games', 'Number of games', [
        {label:'10 or more', value:'10', selected:true},
        {label:'5 or more', value:'5', selected:false},
        {label:'1 or more', value:'1', selected:false}
      ]],
    ],
  },
  {
    title: 'Number of games',
    filename: 'qNumberOfGames',
    fn: 'numberOfGames',
    formSpec: [
      ['select', 'player', 'Games to use', [
        {label:'All games', value:'99', selected:true},
        {label:'Regular games only', value:'0', selected:false},
        {label:'Tournament games only', value:'1', selected:false},
        {label:'Celebrity games only', value:'2', selected:false},
        {label:'School games only', value:'3', selected:false}
      ]],
    ],
  },
  {
    title: 'Final Jeopardy',
    filename: 'qFinalJeopardy',
    fn: 'finalJeopardy',
    formSpec: [
      ['select', 'player', 'Games to use', [
        {label:'All games', value:'99', selected:true},
        {label:'Regular games only', value:'0', selected:false},
        {label:'Tournament games only', value:'1', selected:false},
        {label:'Celebrity games only', value:'2', selected:false},
        {label:'School games only', value:'3', selected:false}
      ]],
    ],
  },
  {
    title: 'Seasons and Years',
    filename: 'qTheData',
    fn: 'theData',
    formSpec: []
  },
  {
    title: 'Words in clues--CAUTION! loads 45 MB of data',
    filename: 'qFindInClues',
    fn: QQ.findInClues,
    formSpec: [
      ['string', 'search-text', 'String to find in clues', 'Enter clue search string'],
    ]
  },
]

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var recomputePane = function(tag) {
  var pane = _.find(QQ.paneDefinitions, function(aPane) {
    if (tag===aPane.filename) return aPane
  })
  if (!pane) {
    console.log('no pane match for ' + tag)
    pane = QQ.paneDefinitions[0]
  }

  if (!pane.form) {
    pane.form = $(QQ.createForm(pane))
    pane.form.hide()
    var container = $('#'+pane.filename)
    container.empty().append(pane.form)
    console.log(pane.filename, container[0])
  }

  var params = [pane]
  pane.formSpec.forEach(function(item) {
    var v = null
    var element = pane.form.find('.'+item[1])
    if ('select' === item[0]) {
      v = parseInt(element.val(), 10)
    } else if ('checkbox' === item[0]) {
      v = element.prop('checked') ? 1 : 0
    } else if ('string' === item[0]) {
      v = element.val()
    } else {
      console.log('recomputePane: unknown spec function', pane.formSpec, pane)
    }
    if (v !== null) {
      params.push(v)
    }
  })
  //console.log('QQ', QQ)
  QQ[pane.fn].apply(this, params)
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initTabs = function() {
  //recomputePane('qCategories')
  //recomputePane('qPercentCorrect')
  //recomputePane('qPlayers')
  //recomputePane('qNumberOfGames')
  recomputePane('qFinalJeopardy')
  //recomputePane('qTheData')
  //recomputePane('qFindInClues')
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initCallbacks = function() {
  //google.charts.load('current', {'packages':['corechart', 'line', 'bar']});
  //QQ.getData('cdata.json')
  QQ.getData('c0data.json')
  QQ.getData('c1data.json')
  QQ.getData('c2data.json')
  QQ.getData('c3data.json')
  QQ.getData('categoryStrings.json')
  var steps = 1;
  function checkForData() {
    if (!QQ.getData('cdata.json')) {
      ++steps
      setTimeout(checkForData, 100)
    } else {
      console.log('VALID cdata after '+(steps/10).toFixed(1)+'ms')
      initTabs()
    }
  }
  setTimeout(checkForData, 100)
}
$(initCallbacks)
