"use strict";
exports.__esModule = true;
exports.createNewData = void 0;
var fs = require("fs");
var path = require("path");
var lockfile = require("proper-lockfile");
function sleepProcessCreate(key, key_hash, value, seconds, obj) {
    if (seconds === void 0) { seconds = undefined; }
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            createNewData(key, key_hash, value, seconds, obj)
                .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
        }, 5 * 1000);
    });
}
function createNewData(key, key_hash, value, seconds, obj) {
    var file_p = path.join(obj.file_path, obj.name, key_hash + ".json");
    return new Promise(function (resolve, reject) {
        lockfile
            .lock(file_p)
            .then(function (release) {
            var file_obj;
            try {
                file_obj = JSON.parse(fs.readFileSync(file_p, "utf8"));
            }
            catch (err) {
                console.log("Hello1");
                reject(err);
            }
            if (file_obj.hasOwnProperty(key)) {
                //returning appropriate promise
                console.log("Hello2");
                reject({ status: "Error", msg: "Key already exist." });
            }
            else {
                //creating the new key value pair
                file_obj[key] = value;
                //updating the size variable
                obj.size += Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(key);
                try {
                    console.log("Hello3");
                    fs.writeFileSync(file_p, JSON.stringify(file_obj), "utf8");
                    resolve({ status: "Sucess", msg: "File is Created Successfully." });
                }
                catch (err) {
                    console.log("Hello4");
                    reject(err);
                }
            }
            return release();
        })["catch"](function (e) {
            if (e.code == "ELOCKED") {
                //Putting the currect operation to sleep as another operation is working on the same file.
                sleepProcessCreate(key, key_hash, value, seconds, obj)
                    .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
            }
            else {
                //rejecting the promise due to error
                reject(e);
            }
        });
    });
}
exports.createNewData = createNewData;
