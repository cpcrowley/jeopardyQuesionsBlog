"use strict";

console.log('qCategories')

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'There have been a lot of categories over the years',
      'Over 37,000 categories.'
    ],
    [
      'Many categories are used multiple times',
      'Science with 165, Before & Afer with 132 and Potpourri with 126'
    ]
  ])
  return html
}

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.categories = function(pane, maxCategories) {
  var html
  var categoryStrings = QQ.getData('categoryStrings.json')
  if (!categoryStrings) {
    html = '<div class="results-div">' +
    '<div id="loading-info-box" class="jumbotron alert-warning">' +
    '<h3>Category data downloading. Try again in a few seconds.</h3>' +
    '</div>/div>'
    pane.form.append(html)
    return
  }
  html = '<div class="results-div">' +
  '<h4>There are a total of '+categoryStrings.length+' categories.</h4>' +
  '<table id="category-table" class="table table-bordered table-striped">' +
  '<thead>' +
  '<tr>' +
  '<th class="text-align-right">Frequency</th>' +
  '<th class="text-align-right">%</th>' +
  '<th class="text-align-left">Category</th>' +
  '</tr>' +
  '</thead>' +
  '</tbody>'

  categoryStrings.sort(function(a,b) {
    var a1 = a[1]
    var b1 = b[1]
    // Sort Z to A
    if (a1 < b1) return +1;
    if (a1 > b1) return -1;
    return 0;
  })
  var totalCategories = categoryStrings.reduce(function(prevValue, currentValue, i) {
    return 0 + prevValue + parseInt(currentValue[1], 10)
  }, 0)
  if (totalCategories === 0) totalCategories = 1 // insurance
  totalCategories /= 100
  if (!maxCategories) maxCategories = 20
  if (maxCategories > categoryStrings.length) maxCategories = categoryStrings.length

  for(var i = 0; i < maxCategories; ++i) {
    var item = categoryStrings[i]
    html += '<tr>' +
    '<td class="text-align-right">'+item[1]+'</td>' +
    '<td class="text-align-right">'+((parseInt(item[1],10)/totalCategories).toFixed(2))+'</td>' +
    '<td class="text-align-left">'+item[0]+'</td></tr>'
  }
  html += '</tbody></table>';
  html += notes()
  html += '</div>'
  pane.form.append(html)
  $('#category-table').dataTable({
    "order": [[1, 'desc']]
  })
};
