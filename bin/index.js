#!/usr/bin/env node

require('dotenv').config()
require = require("esm")(module)
module.exports = require("../src/index.js")