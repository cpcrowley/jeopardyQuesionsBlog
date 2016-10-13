"use strict";

var c0data = []
var c1data = []
var c2data = []
var c3data = []
var cdata = []
var graphData = []

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'Questions do get harder as you go down the rows',
      'You can see this by the % correct in each row, from 93% in row 1 to 69% in row 5. And row 5 is a lot harder, 69% versus 78% for row 4.'
    ],
    [
      'The double jeopardy round is harder than Jeopardy round',
      'Especially in rows 3, 4 and 5. Row 5 is a full 10% harder.'
    ],
    [
      'Daily double questions are harder than regular questions in the same row',
      'Especially in the second row where the percent correct is 23% lower.'
    ],
    [
      'Daily double questions are all hard',
      'They are about the same hardness is rows 2, 3 and 4. Row 5 is very hard with only 57% correct.'
    ],
    [
      'The question difficulty has stayed roughly the same over the seasons',
      'Although the questions in seasons 7-13 were a little easier.'
    ],
    [
      'People do better in tournament games',
      'This makes sense since the players in the tournament games are the big winners from the regular games.'
    ],
    [
      'Most of the tournament advantage comes in double jeopardy',
      'Almost all, in fact.'
    ],
    [
      'Out-of-order clues',
      '<p>Usually players select clues from the top down, starting with the lowest dollar values. Sometines players choose a clue out of order, that is, before all the clues above it have been chosen. One reason to do this is to hunt for the daily doubles. Another reason is a accumulate money quickly or to catch opponents off-guard.</p>'+

      '<p>You can see that the percent correct goes down a little bit for out-of-order clues probably due to people not fully understanding how the category works. But the effect is faily small.</p>'+

      '<p>The percent of clues that are out-of-order was high in the first 6-7 seasons and then went down for 20 seasons. Starting in season 27 it started going up again. This is probably due to more sophisticated player strategies, mainly hunting for daily doubles.</p>'
    ]
  ])
  return html
}

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
    //console.log('season='+season)
    //console.log('cdata', cdata)
    //console.log('cdata.s1', cdata.s1)
    //console.log('cdata[s1]', cdata['s1'])
    //console.log('cdata[season]', cdata[season])
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

  var html = '<div class="table-responsive results-div">'
  +'<table class="table table-bordered table-striped">';

  html += '<tr class="color-table-top-label">'
  html += '<th>Seasons</th>';
  html += '<th>Round</th>';
  _.forEach([200,400,600,800,1000], function(v){
    html += `<th colspan="2">\$${v}/\$${2*v}</th>`
  })
  html += '<th colspan="2">All rows</th>';
  html += '</tr>';

  html += '<tr class="color-table-top-label">';
  _.forEach([0,1], function(){html += '<th>&nbsp;</th>'})
  _.forEach([0,1,2,3,4,5], function(){html += '<th>% correct</th><th>Total</th>'})
  html += '</tr>';
  var i;
  var yearRanges
  switch(ranges) {
    case 1:
    for(i = 1; i < 33; ++i) {
      html += formatPercentCorrectRow(gameType, i, i, dailyDoubles, byround, ooAlso);
    }
    break;

    case 5:
    yearRanges = [[1,5], [6,10], [11,15], [15,20], [21,25], [26,30], [31,32]]
    _.forEach(yearRanges, function(yearRange) {
      html += formatPercentCorrectRow(gameType, yearRange[0], yearRange[1], dailyDoubles, byround, ooAlso);
    })
    break;

    case 10:
    yearRanges = [[1,11], [12,22], [23,32]]
    _.forEach(yearRanges, function(yearRange) {
      html += formatPercentCorrectRow(gameType, yearRange[0], yearRange[1], dailyDoubles, byround, ooAlso);
    })
    break;

    default:
    html += formatPercentCorrectRow(gameType, 1, 32, dailyDoubles, byround, ooAlso);
    break;
  }

  html += '</table>';
  html += '<div id="chart1"></div>'
  html += notes()
  html += '</div>'
  pane.empty().append(html)
  graphData = _.zip.apply(_, graphData)
  var delay = 0
  // Wait a little longer for Google Charts to load.
  if (!google || !google.visualization || !google.visualization.arrayToDataTable) delay = 2000
  setTimeout(function(){makeChart(graphData)}, delay)
}
