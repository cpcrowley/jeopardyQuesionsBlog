"use strict";


/*var dataStore = {
  'c0data.json': {state:'not fetched', mbSize:0.4, data:null},
  'c1data.json': {state:'not fetched', mbSize:0.4, data:null},
  'c2data.json': {state:'not fetched', mbSize:0.4, data:null},
  'c3data.json': {state:'not fetched', mbSize:0.4, data:null},
  'cdata.json': {state:'fetching', mbSize:0.4, data:null}
  //'clueStrings.json': {state:'not fetched', mbSize:29.3, data:null},
  //'answerStrings.json': {state:'not fetched', mbSize:5.4, data:null},
  //'categoryStrings.json': {state:'not fetched', mbSize:1.5, data:null}
}
//var pendingFetches = 0

var cDataNames = ['c0data.json', 'c1data.json', 'c2data.json', 'c3data.json']

function processCData() {
  if (_.every(cDataNames, function(name) { return dataStore[name].state === 'valid'})) {
    var c0data = dataStore['c0data.json'].data
    var c1data = dataStore['c1data.json'].data
    var c2data = dataStore['c2data.json'].data
    var c3data = dataStore['c3data.json'].data
    convertPlayersToObjects(c0data)
    convertPlayersToObjects(c1data)
    convertPlayersToObjects(c2data)
    convertPlayersToObjects(c3data)
    var c99data = _.cloneDeep(c0data)
    _.mergeWith(c99data, c1data, c2data, c3data, function(objValue, srcValue) {
      if (_.isNumber(objValue)) return objValue + srcValue
    })
    dataStore['cdata.json'].data = c99data
    dataStore['cdata.json'].state = 'valid'
    var topPlayers = ['Ken Jennings', 'Julia Collins', 'David Madden', 'Matt Jackson', 'Seth Wilson', 'Arthur Chu']
    _.forEach(topPlayers, function(p){
      console.log(`${p}: regular:${_.find(c0data.players, ['name',p]).games} tournament:${ _.find(c1data.players, ['name',p]).games}`)
    })
  }
}

QQ.getData = function(fileName) {
  var dataInfo = dataStore[fileName]
  switch (dataInfo.state) {
    case 'not fetched':
    //if (pendingFetches === 0) {
    //  $('#loading-info-box').show()
    //}
    //++pendingFetches
    dataInfo.state = 'fetching'
    //console.log('BEGIN fetching '+fileName)
    $.ajax({
      dataType: "json",
      url: '/jeopardy/jdata/'+fileName,
    })
    .done(function(dataIn) {
      //console.log('DONE fetching '+fileName)
      dataInfo.state = 'valid'
      dataInfo.data = dataIn
      //pendingFetches -= 1
      //if (pendingFetches === 0) {
      //  $('#loading-info-box').hide()
      //}
      processCData()
    })
    .fail(function(prom, status, code) {
      dataInfo.state = 'error'
      console.log('********* FAILED to fetch '+fileName+', status='+status+', '+code)
    })
    break

    case 'fetching':
    // Nothing to do
    break

    case 'error':
    // Nothing to do
    break

    case 'valid':
    // Nothing to do
    break
  }
  return dataInfo.data
}*/
