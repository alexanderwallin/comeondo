[![view on npm](http://img.shields.io/npm/v/comeondo.svg)](https://www.npmjs.org/package/comeondo)
[![Dependency Status](https://david-dm.org/alexanderwallin/comeondo.svg)](https://david-dm.org/alexanderwallin/comeondo)

# comeondo

**comeondo** is a basic utility for chaining asynchronous commands in node.js. It runs commands using `spawn` and promises.

### Features

* Chains asynchronous commands in promises
* Captures user input if prompted
* Outputs feedback using [loglady](https://github.com/alexanderwallin/loglady)

## Installation

```bash
npm install comeondo
```

## Usage

```javascript
const comeondo = require('comeondo');

comeonedo.exec('pwd');
// -> "/Users/myname/path/to/current/dir"

const path = require('path');

comeondo.run([
  'cp README.md README-copy.md',
  'rm README.md'
] {
  cwd: path.resolve(__dirname, '..', 'siblingDir'),
}).then(() => {
  // Commands have run, let's do stuff
});
```
