var PythonShell = require('python-shell');
//var pyshell = new PythonShell('../worker_instant_rider.py');

// sends a message to the Python script via stdin
//pyshell.send('hello');
var options = {
  mode: 'text',
  args: ['sg4423@nyu.edu']
};
PythonShell.run('../worker_instant_rider.py', options, function (err, results) {
  if (err) throw err;
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});
/*pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  console.log(message);
});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
//  console.log('finished');
});*/
