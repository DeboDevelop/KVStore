var fs = require("fs");
var path = require("path");
var _a = require("./bootstrap"), checkingDir = _a.checkingDir, creatingDir = _a.creatingDir, createFiles = _a.createFiles;
var _b = require("./util"), keyHash = _b.keyHash, check = _b.check, checkKey = _b.checkKey;
var _c = require("./file"), createNewData = _c.createNewData, deleteOldData = _c.deleteOldData;
var KVStore = /** @class */ (function () {
    function KVStore(name, file_path) {
        if (file_path === void 0) { file_path = __dirname; }
        this.size = 0;
        this.name = name;
        this.file_path = checkingDir(file_path);
        creatingDir(this);
        for (var i = 0; i < 10; i++) {
            createFiles(this, i);
        }
        console.log(this);
    }
    KVStore.prototype.createData = function (key, value, seconds) {
        if (seconds === void 0) { seconds = undefined; }
        var return_value = check(this.size, key, value);
        if (return_value.status === "Error") {
            return new Promise(function (resolve, reject) {
                reject(return_value);
            });
        }
        else {
            var key_hash = keyHash(key);
            var curr_obj = this;
            return createNewData(key, key_hash, value, seconds, curr_obj);
            // return new Promise(function (resolve, reject) {
            //     createNewData(key, key_hash, value, seconds, curr_obj)
            //         .then((res: any) => resolve(res))
            //         .catch((err: any) => reject(err));
            // });
        }
    };
    KVStore.prototype.deleteData = function (key) {
        var return_value = checkKey(key);
        if (return_value.status === "Error") {
            return new Promise(function (resolve, reject) {
                reject(return_value);
            });
        }
        else {
            var key_hash_1 = keyHash(key);
            var curr_obj_1 = this;
            return new Promise(function (resolve, reject) {
                deleteOldData(key, key_hash_1, curr_obj_1)
                    .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
            });
        }
    };
    return KVStore;
}());
module.exports = KVStore;
