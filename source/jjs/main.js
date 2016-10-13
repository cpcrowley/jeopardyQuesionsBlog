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
    var container = $('#main')
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
var waitFor = function(filename, interval, doAfter) {
  if (QQ.getData(filename) !== null) {
    doAfter()
  } else {
    setTimeout(function(){waitFor(filename, interval, doAfter)}, interval)
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var changeBannerAfterInterval = function(imageName, textColor, interval) {
  setTimeout(function() {
    var css1 = '#banner {background-image: url("/css/images/' + imageName + '");}'
    var css2 = '.main-nav-link {color: ' + textColor + ';font-weight:bold;}'
    $('body').append('<style>'+
    css1+
    css2+
    '</style>')
  }, interval)
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initTabs = function() {
  var parts = window.location.href.split('/')
  var paneName = 'none'
  var l = parts.length
  if (parts.length > 1) paneName = parts[l-2]
  var mainSection = $('.article-entry')
  //console.log('mainSection', mainSection)
  var imageChangeInterval = 1000
  switch (paneName) {

    case 'categories':
    //changeBannerAfterInterval('categories.png', '#0f0', imageChangeInterval)
    waitFor('categoryStrings.json', 100, function(){
      QQ.categories(mainSection, 20)
    })
    break;

    case 'players':
    //changeBannerAfterInterval('kenWatsonBrad.jpeg', '#0f0', imageChangeInterval)
    QQ.analyzePlayers(mainSection, 0, 10)
    break;

    case 'finalJeopardy':
    //changeBannerAfterInterval('finalJeopardy.jpeg', '#000', imageChangeInterval)
    QQ.finalJeopardy(mainSection, 0)
    break;

    case 'numberOfGames':
    //changeBannerAfterInterval('kenWatsonBrad.jpeg', '#0f0', imageChangeInterval)
    QQ.winsByPlayer(mainSection, 0)
    break;

    case 'seasonsAndYears':
    //changeBannerAfterInterval('jeopardy.png', '#0f0', imageChangeInterval)
    QQ.theData(mainSection)
    break;

    case 'wordsInClues':
    //changeBannerAfterInterval('wordsInClues.jpeg', '#0f0', imageChangeInterval)
    QQ.getData('categoryStrings.json')
    waitFor('answerStrings.json', 100, function(){
      QQ.findInClues(mainSection, 'Albuquerque')
    })
    break;

    case 'percentCorrect':
    //changeBannerAfterInterval('percentCorrect.jpeg', '#00f', imageChangeInterval)
    QQ.percentCorrect(mainSection, 0, 99, 1, 0, 0)
    break;

    default:
    //changeBannerAfterInterval('jeopardyHome.jpeg', '#fff', imageChangeInterval)
    break
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initCallbacks = function() {
  google.charts.load('current', {'packages':['corechart', 'line', 'bar']});
  QQ.getData('c0data.json')
  QQ.getData('c1data.json')
  QQ.getData('c2data.json')
  QQ.getData('c3data.json')
  QQ.getData('categoryStrings.json')
  waitFor('cdata.json', 100, initTabs)
}
$(initCallbacks)
