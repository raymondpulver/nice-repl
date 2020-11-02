# nice-repl

Extension of [https://github.com/sloria/local-repl](https://github.com/sloria/local-repl), a very low-key script designed to make a nice repl for a nodejs project.


## How to use

Add to project, optionally create a .replrc.js in the project, run yarn nice-repl

```shell
yarn add -D nice-repl
yarn nice-repl
```

## What's this do that local-repl doesn't?

This is a zero-config repl for your project, and instead of writing a .replrc.js where you can configure your repl and export a "context" object, with nice-repl you don't have to think that hard. You just write a .replrc.js and it will simply run the script in a nodejs context. All of your local variables leftover from that script will be available in the nice-repl context.

local-repl did not have repl history. nice-repl is nicer than that. It will create a ~/.nice-repl directory and save a repl history in a directory it makes based on the full project directory name. You can set the environment variable NODE_REPL_HISTORY_SIZE to configure the amount of lines you want to save in the history, same as the node.js REPL.


## Author

 Raymond Pulver IV

```
Inspired by my nice, who only likes things that are nice. I believe one day she will like this repl.
```
