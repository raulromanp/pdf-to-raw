var spawn = require('child_process').spawn;

/**
 * Extract text from pdf using pdftotext external program
 * @param  String  pdf_path absolute path to pdf
 * @param  Object   options  {from: 1, to: 23}
 * @param  Function callback with params (err, output)
 * @return {[type]}            [description]
 */
module.exports.process = function(pdf_path, options, callback) {

  var args = [];
  if (typeof options !== 'function') {
    if (options && options.from && !isNaN(options.from)) {
      args.push('-f');
      args.push(options.from)
    };
    if (options && options.to && !isNaN(options.to)) {
      args.push('-l');
      args.push(options.to)
    };
  } else {
    callback = options;
  }



  args.push('-raw');
  args.push('-enc');
  args.push('UTF-8');
  args.push(pdf_path);
  args.push('-');

  var child = spawn('pdftotext', args);

  var stdout = child.stdout;
  var stderr = child.stderr;
  var output = '';
  var errput = '';

  stdout.setEncoding('utf8');
  stderr.setEncoding('utf8');

  // buffer both streams
  stderr.on('data', function(data) {
    errput += data;
  });
  stdout.on('data', function(data) {
    output += data;
  });

  child.on('close', function(code) {
    if (code) {
      callback('pdftotext end with code ' + code, null, errput);
    }
    callback(null, output);

  });
};
