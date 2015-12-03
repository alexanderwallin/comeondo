'use strict';

const Promise = require('promise');
const spawn  = require('child_process').spawn;

/**
 * Comeando object
 * @type {Object}
 */
let Comeondo = {};

/**
 * Returns an object with cmd and args properties to send to
 * spawn(cmd, args)
 *
 * @param  {String} command A command as a string
 * @return {Object}         An object containging cmd and args
 */
Comeondo.getExecutableCmd = function(command) {
  const args = command.split(' ');
  const cmd = args.shift();
  return { cmd: cmd, args: args };
}

/**
 * Executes a series of commands
 *
 * @param  {String} commands An array of commands
 * @return {Object}          A promise
 */
Comeondo.run = function(commands) {
  let chain = new Promise((resolve) => resolve());

  commands.forEach(command => {
    chain = chain.then(() => Comeondo.exec(command));
  });

  return chain;
}

/**
 * Spawns a new child process with the given command. Resolves
 * when done, rejects on an exit code !== 0.
 *
 * @param  {String} command A command
 * @return {Object}         A promise
 */
Comeondo.exec = function(command) {
  const cmdObj = Comeondo.getExecutableCmd(command);

  return new Promise((resolve, reject) => {
    var proc = spawn(cmdObj.cmd, cmdObj.args, { stdio: ['inherit'] });
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', Comeondo.pipeStdout);
    proc.stderr.on('data', Comeondo.pipeStdout);
    proc.on('close', (code) => resolve());
    proc.on('exit', (code) => code > 0 && reject(code));
  });
}

/**
 * Writes stream data to the console
 *
 * @param  {[type]} data Data
 */
Comeondo.pipeStdout = function(data) {
  process.stdout.write(data.toString());
}

module.exports = Comeondo;
