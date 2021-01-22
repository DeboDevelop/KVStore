var fs = require("fs");
var path = require("path");
var lockfile = require("proper-lockfile");
var _a = require("./bootstrap"), checkingDir = _a.checkingDir, creatingDir = _a.creatingDir, createFiles = _a.createFiles;
var size = 0;
var KVStore = /** @class */ (function () {
    function KVStore(name, file_path) {
        if (file_path === void 0) { file_path = __dirname; }
        this.name = name;
        this.file_path = checkingDir(file_path);
        creatingDir(this);
        for (var i = 0; i < 10; i++) {
            size += createFiles(this, i);
        }
        console.log(this);
    }
    return KVStore;
}());
var kv = new KVStore("name");
