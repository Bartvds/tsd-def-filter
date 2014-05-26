var assert = require('assert');
var through2 = require('through2');
var minimatch = require('minimatch');
var semver = require('semver');
function dummy(value) {
    return true;
}
function getMatcher(pattern, options) {
    if (!pattern) {
        return dummy;
    }
    return minimatch.filter(pattern, options);
}
function getSemver(pattern, options) {
    if (!pattern) {
        return dummy;
    }
    var range = new semver.Range(pattern, true);
    var hasUpperBound = range.set.some(function (arr) {
        return arr.some(function (comp) {
            return /^\</.test(comp.operator);
        });
    });
    return function (version) {
        if (!version) {
            return !hasUpperBound;
        }
        return range.test(new semver.SemVer(version, true));
    };
}
function filterDefs(filter) {
    assert((typeof filter === 'object' && filter), 'filter must be an object');
    var nameTest = getMatcher(filter.name);
    var pathTest = getMatcher(filter.path, {
        matchBase: /\/|\\/.test(filter.path)
    });
    var semverTest = getSemver(filter.semver);
    return through2.obj(function (def, enc, callback) {
        if (nameTest(def.name) && pathTest(def.path) && semverTest(def.semver)) {
            this.push(def);
        }
        callback();
    });
}
module.exports = filterDefs;
