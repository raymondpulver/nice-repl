"use strict";

const mkdirp = require("mkdirp");
const path = require("path");
const vm = require("vm");
const fs = require("fs");
const Module = require("module");
require('ts-node').register(require('./ts-node-config'));
  

exports.REPL_HISTORY_DIRECTORY = path.join(process.env.HOME, ".nice-repl");

exports.makeDirectoryStringFromDirname = (v) =>
  v.replace(RegExp(path.sep, "g"), "_");

exports.REPLRC_PATH = path.join(process.cwd(), ".replrc.js");

exports.REPL_HISTORY_FILE = path.join(
  exports.REPL_HISTORY_DIRECTORY,
  exports.makeDirectoryStringFromDirname(process.cwd())
);

exports.defineReadOnly = (o, prop, value) => {
  Object.defineProperty(o, prop, {
    value,
    configurable: true,
    enumerable: true,
    writable: false,
  });
  return o;
};

const PACKAGE_JSON_PATH = require.resolve(
  path.join(process.cwd(), "./package")
);

exports.createFakeReplrcModule = () => {
  const replrcModule = new Module(exports.REPLRC_PATH, null);
  replrcModule.filename = exports.REPLRC_PATH;
  replrcModule.paths = Module._nodeModulePaths(
    path.dirname(exports.REPLRC_PATH)
  );
  return replrcModule;
};

exports.createAndInjectNiceReplContext = () => {
  if (!fs.existsSync(exports.REPLRC_PATH)) return;
  const scriptSource = fs.readFileSync(exports.REPLRC_PATH, "utf8");
  const script = new vm.Script(scriptSource);

  const replrcModule = (require.cache[
    exports.REPLRC_PATH
  ] = exports.createFakeReplrcModule()); // now when local-repl goes to req-cwd the .replrc.js, it will use our injected one
  const context = Object.setPrototypeOf(vm.createContext(), global);
  Object.defineProperty(context, "require", {
    enumerable: false,
    configurable: true,
    writable: true,
    value: replrcModule.require.bind(replrcModule),
  });
  script.runInContext(context);
  replrcModule.exports = {
    context
  };
};

const repl = require("repl");
const localRepl = require("local-repl");

exports.start = async () => {
  mkdirp.sync(exports.REPL_HISTORY_DIRECTORY);
  exports.createAndInjectNiceReplContext();
  const niceRepl = await localRepl.start({
    enableAwait: true,
  });
  niceRepl.replMode = repl.REPL_MODE_SLOPPY;
  await new Promise((resolve, reject) => {
    niceRepl.setupHistory(exports.REPL_HISTORY_FILE, (err) =>
      err ? reject(err) : resolve()
    );
  });
  niceRepl.historySize = process.env.NODE_REPL_HISTORY_SIZE || "1000";
  return niceRepl;
};
