#!/usr/bin/env node
"use strict";

const niceRepl = require("../lib/repl");

niceRepl.start().catch((err) => console.error(err));
