"use strict";

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
var notes = function() {
  var html = QQ.appendObservations([
    [
      'Less data in season 1-12',
      'The j-archive site has nearly complete data for seasons 14-32 (1997-2016) but the data for seasons 1-12 is spotty.'
    ],
  ])
  return html
}

var seasonData = [
  [32, '2015-09-14', '2016-07-29', 230],
  [31, '2014-09-15', '2015-07-31', 230],
  [30, '2013-09-16', '2014-08-01', 230],
  [29, '2012-09-17', '2013-08-02', 230],
  [28, '2011-09-19', '2012-08-03', 230],
  [27, '2010-09-13', '2011-07-29', 230],
  [26, '2009-09-14', '2010-07-30', 230],
  [25, '2008-09-08', '2009-07-24', 230],
  [24, '2007-09-10', '2008-07-25', 230],
  [23, '2006-09-11', '2007-07-27', 230],
  [22, '2005-09-12', '2006-07-28', 230],
  [21, '2004-09-06', '2005-07-22', 230],
  [20, '2003-09-08', '2004-07-23', 230],
  [19, '2002-09-02', '2003-07-18', 228],
  [18, '2001-09-03', '2002-07-19', 229],
  [17, '2000-09-04', '2001-07-20', 230],
  [16, '1999-09-06', '2000-07-21', 230],
  [15, '1998-09-07', '1999-07-23', 228],
  [14, '1997-09-01', '1998-07-17', 229],
  [13, '1996-09-02', '1997-07-18', 198],
  [12, '1995-09-04', '1996-07-19', 76],
  [11, '1994-09-05', '1995-07-21', 39],
  [10, '1993-09-06', '1994-07-22', 49],
  [ 9, '1992-09-07', '1993-07-23', 63],
  [ 8, '1991-09-02', '1992-07-17', 47],
  [ 7, '1990-09-03', '1991-07-19', 51],
  [ 6, '1989-09-04', '1990-09-08', 151],
  [ 5, '1988-09-05', '1989-07-21', 70],
  [ 4, '1987-09-07', '1988-07-23', 120],
  [ 3, '1986-09-08', '1987-07-24', 78],
  [ 2, '1985-09-09', '1986-06-06', 43],
  [ 1, '1984-09-10', '1985-06-07', 38]
]

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
QQ.theData = function(pane) {
  var html = '<div class="table-responsive results-div">'
  html += '<table id="the-data-table" class="table table-bordered table-striped">'+
  '<thead>'+
  '<tr class="color-table-top-label">'+
  '<th>Season</th>'+
  '<th>Games Archived</th>'+
  '<th>Started</th>'+
  '<th>Ended</th>'+
  '</tr>';
  html += '</thead><tbody>';

  _.forEach(seasonData, function(sd) {
    html += '<tr>'
    html += `<td class="color-table-side-label">${sd[0]}</td>`
    html += `<td>${sd[3]}</td>`
    html += `<td>${sd[1]}</td>`
    html += `<td>${sd[2]}</td>`
    html += '</tr>'
  })

  html += '</tbody></table>';
  html += notes()
  html += '</div>'
  pane.form.append(html)
  $('#the-data-table').dataTable({
    "order": [[0, 'desc']]
  })
}