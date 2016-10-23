"use strict";
QQ.googleChartsIsLoaded = false

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
var setBannerImg = function(imgName) {
  $('#banner').css('background-image', 'url("/jeopardy/css/images/' + imgName + '")')
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initTabs = function() {
  QQ.paneName = 'none'
  QQ.topUrl = 'crowley.pw'
  var parts = window.location.href.split('/jeopardy/')
  if (parts.length == 2) {
    QQ.topUrl = parts[0]
    QQ.paneName = parts[1]
    QQ.paneName = _.trimEnd(QQ.paneName, '/')
  } else {
    console.log('***** ERROR: parsing window.location: "' + window.location + '"')
  }
  var mainSection = $('.article-entry')
  var imgName = 'jeopardyHome.jpeg'

  switch (QQ.paneName) {

    case 'topHome':
    window.location = QQ.topUrl
    return

    case 'percentCorrect':
    setBannerImg('percentCorrect.jpeg')
    QQ.percentCorrect(mainSection, 0, 99, 1, 0, 0)
    break;

    case 'players':
    setBannerImg('kenWatsonBrad.jpeg')
    QQ.analyzePlayers(mainSection, 0, 10)
    break;

    case 'finalJeopardy':
    setBannerImg('finalJeopardy.jpeg')
    QQ.finalJeopardy(mainSection, 0)
    break;

    case 'numberOfGames':
    setBannerImg('kenWatsonBrad.jpeg')
    QQ.winsByPlayer(mainSection, 1)
    break;

    case 'seasonsAndYears':
    setBannerImg('jeopardy.png')
    QQ.theData(mainSection)
    break;

    /*case 'wordsInClues':
    setBannerImg('wordsInClues.jpeg')
    QQ.getData('categoryStrings.json')
    waitFor('answerStrings.json', 100, function(){
      QQ.findInClues(mainSection, 'Albuquerque')
    })
    break;*/

    /*case 'categories':
    setBannerImg('categories.png')
    waitFor('categoryStrings.json', 100, function(){
      QQ.categories(mainSection, 20)
    })
    break;*/

    default:
    setBannerImg('jeopardyHome.jpeg')
    break
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.getData = function(fileName) {
  switch (fileName) {
    case 'cdata.json': return QQ.data4
    case 'c0data.json': return QQ.data0
    case 'c1data.json': return QQ.data1
    case 'c2data.json': return QQ.data2
    case 'c3data.json': return QQ.data3
    default:
    console.log('QQ.getData '+fileName+' not found')
    break
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
function initData() {
  var newPlayers = []
  _.forEach(JeopardyData[5], function(pi,key) {
    newPlayers.push(QQ.playerInfoArrayToObject(pi,key))
  })
  JeopardyData[5] = newPlayers
  QQ.data0 = JeopardyData[0]
  QQ.data0.players = newPlayers
  QQ.data1 = JeopardyData[1]
  QQ.data1.players = newPlayers
  QQ.data2 = JeopardyData[2]
  QQ.data2.players = newPlayers
  QQ.data3 = JeopardyData[3]
  QQ.data3.players = newPlayers
  QQ.data4 = JeopardyData[4]
  QQ.data4.players = newPlayers
  console.log('JeopardyData', JeopardyData)
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initCallbacks = function() {
  //console.log('initCallbacks: jQuery init called')
  google.charts.load('current', {'packages':['corechart', 'line', 'bar']});
  google.charts.setOnLoadCallback(function(){
    QQ.googleChartsIsLoaded = true
  })
  initData()
  initTabs()
}
$(initCallbacks)
/*













*/
