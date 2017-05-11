"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Discord = require("discord.js");
var utils_1 = require("./utils");
var f = new utils_1.Formatter();
// bot Token- https://discordapp.com/developers/applications/me
var token = 'MzExMjI0MjU4NjcwMTAwNDgw.C_Ouxg.QF_4D6kWXVFL-sHyZnZpbxXAOM8';
var client = new Discord.Client();
var GameTemplate = (function () {
    function GameTemplate() {
    }
    return GameTemplate;
}());
exports.GameTemplate = GameTemplate;
var RedCardTemplate = (function (_super) {
    __extends(RedCardTemplate, _super);
    function RedCardTemplate() {
        var _this = _super.call(this) || this;
        _this.name = "Red-Card";
        _this.description = "Try to ruin your friends ideal dates";
        _this.cards = ["tick", "tock", "zick", "zook", "zonk"];
        return _this;
    }
    return RedCardTemplate;
}(GameTemplate));
exports.RedCardTemplate = RedCardTemplate;
var MysteryTemplate = (function (_super) {
    __extends(MysteryTemplate, _super);
    function MysteryTemplate() {
        var _this = _super.call(this) || this;
        _this.name = "Mystery";
        _this.description = "A non-functional test game";
        return _this;
    }
    return MysteryTemplate;
}(GameTemplate));
exports.MysteryTemplate = MysteryTemplate;
var GameInstance = (function () {
    function GameInstance() {
    }
    GameInstance.prototype.start = function () {
        console.log('started');
    };
    return GameInstance;
}());
exports.GameInstance = GameInstance;
var Server = (function () {
    function Server() {
        this.gameTemplates = new Map();
        this.gameTemplates.set("Red-Card", new RedCardTemplate());
        this.gameTemplates.set("Mystery", new MysteryTemplate());
        this.leaderBoard = new Map();
    }
    return Server;
}());
var me = new Server();
client.on('ready', function () {
    console.log('I am ready and listening!');
});
client.on('message', function (message) {
    var inputSequence = message.content.split(" ").filter(function (elm) {
        return elm != " ";
    });
    switch (inputSequence[0]) {
        case "play":
            message.channel.send("To create a game, send 'play <gamename>'");
            message.channel.send("Here are the games I know how to run:");
            var str_1 = "";
            me.gameTemplates.forEach(function (e) {
                str_1 += f.pad_r(e.name, " ", 10) + "  " + e.description + "\n";
            });
            message.channel.send(f.code(str_1));
            break;
    }
    if (message.content.startsWith('ping')) {
        for (var _i = 0, _a = message.mentions.users.array(); _i < _a.length; _i++) {
            var x = _a[_i];
            message.channel.send(x.username);
        }
        message.channel.send('wab');
    }
});
client.login(token);
