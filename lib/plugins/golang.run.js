var cp = require('child_process');
var fs = require('fs');

var h = require('../helper');
var log = require('../log');
var Plugin = require('../plugin.js');
var session = require('../session');

// Please note that we DON'T want implement a lightweight judge engine
// here, thus we are NOT going to support all the problems!!!
//
// Only works for those problems could be easily tested.
//
// [Usage]
//
// https://github.com/skygragon/leetcode-cli-plugins/blob/master/docs/cpp.run.md
//
var plugin = new Plugin(100, 'golang.run', '2017.07.29',
  'Plugin to run golang code locally for debugging.');

plugin.testProblem = function (problem, cb) {
  let ori = null;
  let tmp = null;
  if (session.argv.tpl) {
    log.info('Rewrite source code ' + problem.file);
    let code = fs.readFileSync(problem.file).toString()
    let strs = code.split('//--ignore--');
    code = strs[strs.length - 1]
    ori = problem.file;
    tmp = ori + '.tmp';
    fs.writeFileSync(tmp, code);
    problem.file = tmp;
  }

  let ans = plugin.next.testProblem(problem, cb);
  if (session.argv.tpl) {
    fs.unlinkSync(problem.file);
    problem.file = ori;
  }
  return ans
};

plugin.submitProblem = function (problem, cb) {
  let ori = null;
  let tmp = null;
  if (session.argv.tpl) {
    log.info('Rewrite source code ' + problem.file);
    let code = fs.readFileSync(problem.file).toString()
    let strs = code.split('//--ignore--');
    code = strs[strs.length - 1]
    ori = problem.file;
    tmp = ori + '.tmp';
    fs.writeFileSync(tmp, code);
    problem.file = tmp;
  }

  let ans = plugin.next.submitProblem(problem, cb);
  if (session.argv.tpl) {
    fs.unlinkSync(problem.file);
    problem.file = ori;
  }
  return ans
};

plugin.exportProblem = function (problem, opts) {
  let header = '';
  if (session.argv.tpl) {
    log.info('Rewrite source code ' + problem.file);
    header = 'package main\n\n//--ignore--'
  }
  return header + plugin.next.exportProblem(problem, opts);
};

module.exports = plugin;
