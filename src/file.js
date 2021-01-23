"use strict";
exports.__esModule = true;
exports.readGivenData = exports.deleteOldData = exports.createNewData = void 0;
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
function sleepProcessDelete(key, key_hash, obj) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            deleteOldData(key, key_hash, obj)
                .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
        }, 5 * 1000);
    });
}
function sleepProcessRead(key, key_hash, obj) {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            readGivenData(key, key_hash, obj)
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
                reject(err);
            }
            if (file_obj.hasOwnProperty(key)) {
                //returning appropriate promise
                reject({ status: "Error", msg: "Key already exist." });
            }
            else {
                //creating the new key value pair
                file_obj[key] = value;
                //updating the size variable
                obj.size += Buffer.byteLength(JSON.stringify(value)) + Buffer.byteLength(key);
                try {
                    fs.writeFileSync(file_p, JSON.stringify(file_obj), "utf8");
                    resolve({ status: "Sucess", msg: "Data is Created Successfully." });
                }
                catch (err) {
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
function deleteOldData(key, key_hash, obj) {
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
                reject(err);
            }
            if (file_obj.hasOwnProperty(key)) {
                //updating the size variable
                obj.size -= Buffer.byteLength(JSON.stringify(file_obj[key])) + Buffer.byteLength(key);
                //deleting the data of given key
                delete file_obj[key];
                try {
                    fs.writeFileSync(file_p, JSON.stringify(file_obj), "utf8");
                    resolve({ status: "Sucess", msg: "Data is deleted successfully." });
                }
                catch (err) {
                    reject(err);
                }
            }
            else {
                //returning appropriate promise
                reject({ status: "Error", msg: "Key Doesn't exist" });
            }
            return release();
        })["catch"](function (e) {
            if (e.code == "ELOCKED") {
                //Putting the currect operation to sleep as another operation is working on the same file.
                sleepProcessDelete(key, key_hash, obj)
                    .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
            }
            else {
                //rejecting the promise due to error
                reject(e);
            }
        });
    });
}
exports.deleteOldData = deleteOldData;
function readGivenData(key, key_hash, obj) {
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
                reject(err);
            }
            if (file_obj.hasOwnProperty(key)) {
                //returning the data
                resolve({ status: "Success", data: file_obj[key] });
            }
            else {
                //returning appropriate promise
                reject({ status: "Error", msg: "Key doesn't exist" });
            }
            return release();
        })["catch"](function (e) {
            if (e.code == "ELOCKED") {
                //Putting the currect operation to sleep as another operation is working on the same file.
                sleepProcessRead(key, key_hash, obj)
                    .then(function (res) { return resolve(res); })["catch"](function (err) { return reject(err); });
            }
            else {
                //rejecting the promise due to error
                reject(e);
            }
        });
    });
}
exports.readGivenData = readGivenData;
