"use strict";
exports.__esModule = true;
var ResponseCode;
(function (ResponseCode) {
    ResponseCode[ResponseCode["SUCCESS"] = 0] = "SUCCESS";
    ResponseCode[ResponseCode["FAILURE"] = 1] = "FAILURE";
    ResponseCode[ResponseCode["ERR_ALREADY_EXISTS"] = 2] = "ERR_ALREADY_EXISTS";
    ResponseCode[ResponseCode["ERR_CHANNEL_ALREADY_HAS_GAME"] = 3] = "ERR_CHANNEL_ALREADY_HAS_GAME";
    ResponseCode[ResponseCode["ERR_GAME_INSTANCE_DOESNT_EXIST"] = 4] = "ERR_GAME_INSTANCE_DOESNT_EXIST";
    ResponseCode[ResponseCode["ERR_GAME_TEMPLATE_DOESNT_EXIST"] = 5] = "ERR_GAME_TEMPLATE_DOESNT_EXIST";
    ResponseCode[ResponseCode["ERR_PLAYER_ALREADY_JOINED"] = 6] = "ERR_PLAYER_ALREADY_JOINED";
    ResponseCode[ResponseCode["ERR_NOT_ENOUGH_PLAYERS"] = 7] = "ERR_NOT_ENOUGH_PLAYERS";
    ResponseCode[ResponseCode["ERR_GAME_ALREADY_STARTED"] = 8] = "ERR_GAME_ALREADY_STARTED";
})(ResponseCode = exports.ResponseCode || (exports.ResponseCode = {}));
var Utils = (function () {
    function Utils() {
        this.padLength = 14;
        this.botPrefix = ".";
        this.colors = new Map();
        this.colors.set("theme", 0x00FF00);
        this.colors.set("tej", 0xEB1D89);
        this.delays = new Map();
        this.delays.set("short", 2000);
        this.delays.set("medium", 4000);
    }
    Utils.prototype.shuffle = function (array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };
    Utils.prototype.code = function (string) {
        return "```" + string + "```";
    };
    Utils.prototype.bold = function (string) {
        return "**" + string + "**";
    };
    // right padding s with c to a total of n chars taken from 
    //https://eureka.ykyuen.info/2011/08/23/javascript-leftright-pad-a-string/
    Utils.prototype.pad_r = function (s, c) {
        if (!s || !c || s.length >= this.padLength) {
            return s;
        }
        var max = (this.padLength - s.length) / c.length;
        for (var i = 0; i < max; i++) {
            s += c;
        }
        return s;
    };
    return Utils;
}());
exports.Utils = Utils;
