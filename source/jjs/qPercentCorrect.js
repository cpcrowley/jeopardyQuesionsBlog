"use strict";

var c0data = []
var c1data = []
var c2data = []
var c3data = []
var cdata = []
var graphData = []

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var formatPercentCorrectRow = function(gameType, fromSeason, toSeason, dailyDoubles, byround, ooAlso) {
  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  var totals = QQ.makeSeasonResults()
  var totals0, totals1, totals2, totals3
  if (gameType) {
    totals0 = QQ.makeSeasonResults()
    totals1 = QQ.makeSeasonResults()
    totals2 = QQ.makeSeasonResults()
    totals3 = QQ.makeSeasonResults()
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  function addRoundDataToTotals(totals, dataToUse) {
    QQ.addRoundData(totals.r1, dataToUse.r1)
    QQ.addRoundData(totals.r2, dataToUse.r2)
    totals.rJandDJ = QQ.makeRoundResults()
    QQ.addRoundData(totals.rJandDJ, dataToUse.r1)
    QQ.addRoundData(totals.rJandDJ, dataToUse.r2)
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------

  for (var seasonIndex = fromSeason; seasonIndex < (toSeason+1); ++seasonIndex) {
    var season = 's'+seasonIndex
    addRoundDataToTotals(totals, cdata[season])
    if (gameType) {
      addRoundDataToTotals(totals0, c0data[season])
      addRoundDataToTotals(totals1, c1data[season])
      addRoundDataToTotals(totals2, c2data[season])
      addRoundDataToTotals(totals3, c3data[season])
    }
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  var seasons = fromSeason + '-' + toSeason;
  if (fromSeason === toSeason) seasons = fromSeason;

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  function formatRound2(roundTotal, column2Title, column1Title, ooAlso) {
    var html = ''
    html += QQ.formatRound(roundTotal, column2Title, column1Title, 0, graphData);
    if (ooAlso) html += QQ.formatRound(roundTotal, 'OO:'+column2Title, column1Title, 0, graphData);
    return html
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  function getGameTypeHtml(rSuffix, titlePrefix, ooAlso) {
    var html = ''
    html += formatRound2(totals0[rSuffix], titlePrefix+':regular', seasons, ooAlso);
    html += formatRound2(totals1[rSuffix], titlePrefix+':tournament', seasons, ooAlso);
    html += formatRound2(totals2[rSuffix], titlePrefix+':celebrity', seasons, ooAlso);
    html += formatRound2(totals3[rSuffix], titlePrefix+':school', seasons, ooAlso);
    return html
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  function getRoundHtml(rSuffix, titlePrefix) {
    var html = ''
    html += formatRound2(totals[rSuffix], titlePrefix, seasons, ooAlso);
    if (gameType) html += getGameTypeHtml(rSuffix, 'J & DJ', ooAlso)
    if (dailyDoubles) {
      // Note: do not do OO if DD is specified, for not formatRound2
      html += formatRound2(totals[rSuffix], 'DD: '+titlePrefix, seasons, false);
      if (gameType) {
        html += getGameTypeHtml(rSuffix, 'DD: '+titlePrefix, false)
      }
    }
    return html
  }

  //----------------------------------------------------------------------------
  //----------------------------------------------------------------------------
  var allHtml = '';
  if (byround===1) {
    allHtml += getRoundHtml('r1', 'J')
    allHtml += getRoundHtml('r2', 'DJ')
  } else {
    allHtml += getRoundHtml('rJandDJ', 'J & DJ')
  }

  return allHtml
};

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var makeChart = function(graphData) {
  var options, dataTable, chart
  var element = $('#chart1')[0]
  if (graphData[0].length < 8) {
    options = {
      'axes': {
        x: {
          0: {
            side: 'top'
          }
        }
      },
      height: 400
    }
    dataTable = new google.visualization.arrayToDataTable(_.zip.apply(_, graphData))
    //console.log('dataIn', _.zip.apply(_, graphData), graphData)
    chart = new google.charts.Bar(element)
  } else {
    options = {
      height: 400
    }
    dataTable = new google.visualization.arrayToDataTable(graphData);
    chart = new google.charts.Line(element)
  }
  chart.draw(dataTable, options);
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.percentCorrect = function(pane, gameType, ranges, dailyDoubles, byround, ooAlso)
{
  //console.log('CALL percentCorrect gameType='+gameType+' ranges='+ranges+' dailyDoubles='+dailyDoubles+' byround='+byround+' ooAlso='+ooAlso)
  cdata = QQ.getData('cdata.json')
  if (!cdata) {
    console.log('***** percentCorrect: cData not ready')
    return
  }
  c0data = QQ.getData('c0data.json')
  c1data = QQ.getData('c1data.json')
  c2data = QQ.getData('c2data.json')
  c3data = QQ.getData('c3data.json')

  graphData = [['Round', '$200', '$400', '$600', '$800', '$1000', 'All']]

  ranges = parseInt(ranges,10)
  dailyDoubles = parseInt(dailyDoubles,10)
  byround = parseInt(byround,10)

  var html = '';
  var i;
  var yearRanges
  switch(ranges) {
    case 1:
    for(i = 1; i < 34; ++i) {
      html += formatPercentCorrectRow(gameType, i, i, dailyDoubles, byround, ooAlso);
    }
    break;

    case 5:
    yearRanges = [[1,5], [6,10], [11,15], [15,20], [21,25], [26,30], [31,33]]
    _.forEach(yearRanges, function(yearRange) {
      html += formatPercentCorrectRow(gameType, yearRange[0], yearRange[1], dailyDoubles, byround, ooAlso);
    })
    break;

    case 10:
    yearRanges = [[1,11], [12,22], [23,33]]
    _.forEach(yearRanges, function(yearRange) {
      html += formatPercentCorrectRow(gameType, yearRange[0], yearRange[1], dailyDoubles, byround, ooAlso);
    })
    break;

    default:
    html += formatPercentCorrectRow(gameType, 1, 33, dailyDoubles, byround, ooAlso);
    break;
  }

  $('tbody').empty().append(html)

  // connect to and set the checkboxes
  var gameTypeCB = $('.game-type')
  gameTypeCB[0].checked = (gameType === 1)
  //console.log('set gameTypeCB to '+(gameType === 1))

  var dailyDoublesCB = $('.daily-doubles')
  dailyDoublesCB[0].checked = (dailyDoubles === 1)
  //console.log('set dailyDoublesCB to '+(dailyDoubles === 1))

  var byRoundCB = $('.by-round')
  byRoundCB[0].checked = (byround === 1)

  var outOfOrderCB = $('.out-of-order')
  outOfOrderCB[0].checked = (ooAlso === 1)

  var rangesSelect = $('#date-range')
  rangesSelect.val(ranges)

  function handleParamChange() {
    //console.log('CALL handleParamChange gametype='+(gameTypeCB[0].checked ? 1 : 0))
    QQ.percentCorrect(pane,
      (gameTypeCB[0].checked ? 1 : 0),
      parseInt(rangesSelect.val(),10),
      (dailyDoublesCB[0].checked ? 1 : 0),
      (byRoundCB[0].checked ? 1 : 0),
      (outOfOrderCB[0].checked ? 1 : 0)
    )
  }

  gameTypeCB.on('click', handleParamChange)
  dailyDoublesCB.on('click', handleParamChange)
  byRoundCB.on('click', handleParamChange)
  outOfOrderCB.on('click', handleParamChange)
  rangesSelect.on('change', handleParamChange)

  // Create the chart
  graphData = _.zip.apply(_, graphData)
  QQ.waitForGoogleCharts(function(){makeChart(graphData)}, 40, 250)
}
/*

















*/
