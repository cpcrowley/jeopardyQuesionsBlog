"use strict";

var QQ = {}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.formatRound = function(roundTotal, column2Title, column1Title, gameCount, graphData) {
  var html = '';
  var graphRow = [column1Title+' '+column2Title]

  html += '<tr><td class="text-align-left">'+column1Title+'</td><td>'+column2Title+'</td>'

  var totalClues = 0 // not considering DD or OO
  var totalRightAllRows = 0
  var totalAllRows = 0
  var percent = 0
  var isOO = false
  for(var irow = 0; irow < 5; ++irow) {
    var rowData = roundTotal.rows[irow]
    var rights = rowData.rights
    var clues = rowData.clues
    totalClues += clues
    switch (column2Title.substring(0,2)) {
      case 'DD':
      rights = rowData.dd.rights
      clues = rowData.dd.rights+rowData.dd.wrongs
      break

      case 'OO':
      rights = rowData.oo.rights
      clues = rowData.oo.clues
      isOO = true
      break
    }

    totalRightAllRows += rights
    totalAllRows += clues

    // Avoid NaN from zerodivide
    percent = 0;
    if(clues !== 0) {
      percent = (100*rights)/clues;
    }

    html += '<td>'+percent.toFixed()+'%</td>';
    graphRow.push(Math.round(percent))
    if (gameCount) {
      html += '<td>'+(totalRight/gameCount).toFixed(1)+'</td>';
    }
    html += '<td>'+clues+'</td>';
  }
  if (totalAllRows === 0) totalAllRows = 1
  percent = (100*totalRightAllRows)/totalAllRows;

  html += '<td>'+percent.toFixed()+'%</td>';
  graphRow.push(Math.round(percent))
  if (gameCount) {
    html += '<td>'+(totalRightAllRows/gameCount).toFixed(1)+'</td>';
  }
  if (isOO) {
    var tcp = (100*totalAllRows)/totalClues
    html += '<td>'+totalAllRows+' ('+tcp.toFixed(0)+'%)</td>';
  } else {
    html += '<td>'+totalAllRows+'</td>';
  }

  html += '</tr>';

  graphData.push(graphRow)

  return html;

};
