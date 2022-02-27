"use strict";
var chai = require("chai");
const BN = web3.utils.BN;
const chaiBN = require("chai-BN")(BN);
chai.use(chaiBN);

var chaiAsPromised = require("chai-as-promised");
const { assert } = require("console");
const { isTypedArray } = require("util/types");
chai.use(chaiAsPromised);

module.exports = chai;