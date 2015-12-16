'use strict';

const Q = require('q');
const spawn  = require('win-spawn');
const loglady = require('loglady');

const defaultOptions = {
  stdio: ['inherit'],
};

/**
 * Comeando object
 * @type {Object}
 */
let Comeondo = {};

Comeondo.options = defaultOptions;

/**
 * Sets or extends options to pass to spawn.
 *
 * @param {Object}  options Options object
 * @param {boolean} extend  Whether to extend the current options
 */
Comeondo.setOptions = function(options, extend) {
  extend = !!!extend;

  if (options) {
    if (extend) {
      for (let i in options) {
        loglady.intermediate(`-> set options[${i}] = ${options[i]}`);
        Comeondo.options[i] = options[i];
      }
    }
    else {
      Comeondo.options = options;
    }
  }
  else {
    Comeondo.options = defaultOptions;
  }

  return Comeondo;
}

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
Comeondo.run = function(commands, opts) {
  loglady.section('Comeondo.run');

  Comeondo.setOptions(opts || null);

  let chain = Comeondo.exec(commands.shift());

  for (let i in commands) {
    chain = chain.then(() => Comeondo.exec(commands[i]));
  }

  return chain;
}

/**
 * Spawns a new child process with the given command. Resolves
 * when done, rejects on an exit code !== 0.
 *
 * @param  {String} command A command
 * @return {Object}         A promise
 */
Comeondo.exec = function(command, opts) {
  if (typeof command === 'string')
    command = Comeondo.getExecutableCmd(command);

  loglady.action('Comeondo.exec');
  loglady.command(`${command.cmd} ${command.args.join(' ')}`);

  Comeondo.setOptions(opts || null);

  return Q.promise((resolve, reject) => {
    var proc = spawn(command.cmd, command.args, Comeondo.options);
    proc.stdout.setEncoding('utf8');
    proc.stdout.on('data', Comeondo.pipeStdout);
    proc.stderr.on('data', Comeondo.pipeStdout);
    proc.on('close', (code) => resolve(code));
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
