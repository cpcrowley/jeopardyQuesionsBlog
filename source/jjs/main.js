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
var initTabs = function() {
  var parts = window.location.href.split('/')
  var paneName = 'none'
  var l = parts.length
  if (parts.length > 1) paneName = parts[l-2]
  var mainSection = $('.article-entry')
  //console.log('mainSection', mainSection)
  var imageChangeInterval = 1000
  //console.log('initTabs: paneName='+paneName)
  switch (paneName) {

    case 'percentCorrect':
    //changeBannerAfterInterval('percentCorrect.jpeg', '#00f', imageChangeInterval)
    QQ.percentCorrect(mainSection, 0, 99, 1, 0, 0)
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
    QQ.winsByPlayer(mainSection, 1)
    break;

    case 'seasonsAndYears':
    //changeBannerAfterInterval('jeopardy.png', '#0f0', imageChangeInterval)
    QQ.theData(mainSection)
    break;

    /*case 'wordsInClues':
    //changeBannerAfterInterval('wordsInClues.jpeg', '#0f0', imageChangeInterval)
    QQ.getData('categoryStrings.json')
    waitFor('answerStrings.json', 100, function(){
      QQ.findInClues(mainSection, 'Albuquerque')
    })
    break;*/

    /*case 'categories':
    //changeBannerAfterInterval('categories.png', '#0f0', imageChangeInterval)
    waitFor('categoryStrings.json', 100, function(){
      QQ.categories(mainSection, 20)
    })
    break;*/

    default:
    //changeBannerAfterInterval('jeopardyHome.jpeg', '#fff', imageChangeInterval)
    break
  }
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var initCallbacks = function() {
  //console.log('initCallbacks: jQuery init called')
  google.charts.load('current', {'packages':['corechart', 'line', 'bar']});
  google.charts.setOnLoadCallback(function(){
    QQ.googleChartsIsLoaded = true
    //console.log('*** Google charts has loaded')
  })
  QQ.getData('c0data.json')
  QQ.getData('c1data.json')
  QQ.getData('c2data.json')
  QQ.getData('c3data.json')
  //QQ.getData('categoryStrings.json')
  waitFor('cdata.json', 100, initTabs)
}
$(initCallbacks)
