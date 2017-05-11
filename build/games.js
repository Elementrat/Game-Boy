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
var utils_1 = require("./utils");
var f = new utils_1.Formatter();
var Role = (function () {
    function Role() {
    }
    return Role;
}());
exports.Role = Role;
var GameManager = (function () {
    function GameManager() {
        this.gameTemplates = new Map();
        this.gameTemplates.set("Red-Card", new RedCardTemplate());
        this.gameTemplates.set("Mystery", new MysteryTemplate());
        this.gameTemplates.set("Cards-Against", new CardsAgainstTemplate());
        this.gameInstances = new Map();
    }
    GameManager.prototype.describeGames = function () {
        var str = "";
        this.gameTemplates.forEach(function (e) {
            str += f.pad_r(e.name, " ") + "  " + e.description + "\n";
        });
        return str;
    };
    GameManager.prototype.describeRoster = function (channel) {
        var str = "";
        var game = this.gameInstances.get(channel);
        if (game.players.length == 0) {
            str = "No players have joined yet.";
        }
        this.gameInstances.get(channel).players.forEach(function (player) {
            str += player.username + "\n";
        });
        return str;
    };
    GameManager.prototype.addPlayerToGame = function (channel, user) {
        var game = this.gameInstances.get(channel);
        if (!game) {
            return utils_1.ResponseCode.ERR_GAME_INSTANCE_DOESNT_EXIST;
        }
        return game.join(user);
    };
    GameManager.prototype.gameInChannel = function (channel) {
        return this.gameInstances.get(channel);
    };
    GameManager.prototype.endGame = function (channel) {
        this.gameInstances["delete"](channel);
        return utils_1.ResponseCode.SUCCESS;
    };
    GameManager.prototype.startGame = function (channel) {
        var g = this.gameInstances.get(channel);
        if (!g) {
            return utils_1.ResponseCode.ERR_GAME_INSTANCE_DOESNT_EXIST;
        }
        if (g.gameTemplate.minPlayers > g.players.length) {
            return utils_1.ResponseCode.ERR_NOT_ENOUGH_PLAYERS;
        }
        else {
            g.start();
            return utils_1.ResponseCode.SUCCESS;
        }
    };
    GameManager.prototype.create = function (channel, gameType) {
        if (this.gameInstances.get(channel)) {
            return utils_1.ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME;
        }
        else {
            var gameTemplate = this.gameTemplates.get(gameType);
            if (!gameTemplate) {
                return utils_1.ResponseCode.ERR_GAME_TEMPLATE_DOESNT_EXIST;
            }
            this.gameInstances.set(channel, this.gameTemplates.get(gameType).create());
            return utils_1.ResponseCode.SUCCESS;
        }
    };
    return GameManager;
}());
exports.GameManager = GameManager;
var GameTemplate = (function () {
    function GameTemplate() {
        this.roles = new Array();
    }
    GameTemplate.prototype.create = function () {
        return null;
    };
    return GameTemplate;
}());
exports.GameTemplate = GameTemplate;
var RedCardTemplate = (function (_super) {
    __extends(RedCardTemplate, _super);
    function RedCardTemplate() {
        var _this = _super.call(this) || this;
        _this.name = "Red-Card";
        _this.rules = "Try to ruin the hosts date";
        _this.roles = [
            { name: "The Single", description: "" },
            { name: "The Dates", description: "" }
        ];
        _this.description = "Try to ruin your friends ideal dates";
        _this.perks = ["tick", "tock", "zick", "zook", "zonk"];
        _this.redFlags = ["wot", "woot", "wit", "wzt"];
        _this.minPlayers = 1;
        return _this;
    }
    RedCardTemplate.prototype.create = function () {
        return new RedCardInstance(this);
    };
    return RedCardTemplate;
}(GameTemplate));
exports.RedCardTemplate = RedCardTemplate;
var MysteryTemplate = (function (_super) {
    __extends(MysteryTemplate, _super);
    function MysteryTemplate() {
        var _this = _super.call(this) || this;
        _this.name = "Mystery";
        _this.description = "A test game (Not Implemented)";
        return _this;
    }
    return MysteryTemplate;
}(GameTemplate));
exports.MysteryTemplate = MysteryTemplate;
var CardsAgainstTemplate = (function (_super) {
    __extends(CardsAgainstTemplate, _super);
    function CardsAgainstTemplate() {
        var _this = _super.call(this) || this;
        _this.name = "Cards Against";
        _this.description = "You already know what this is (Not Implemented)";
        return _this;
    }
    return CardsAgainstTemplate;
}(GameTemplate));
exports.CardsAgainstTemplate = CardsAgainstTemplate;
var GameInstance = (function () {
    function GameInstance(template) {
        this.gameTemplate = template;
        this.started = false;
        this.players = new Array();
    }
    GameInstance.prototype.start = function () {
        this.started = true;
    };
    GameInstance.prototype.join = function (user) {
        if (this.players.indexOf(user) == -1) {
            this.players.push(user);
            return utils_1.ResponseCode.SUCCESS;
        }
        else {
            return utils_1.ResponseCode.ERR_PLAYER_ALREADY_JOINED;
        }
    };
    return GameInstance;
}());
exports.GameInstance = GameInstance;
var RedCardInstance = (function (_super) {
    __extends(RedCardInstance, _super);
    function RedCardInstance() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RedCardInstance.prototype.start = function () {
    };
    return RedCardInstance;
}(GameInstance));
exports.RedCardInstance = RedCardInstance;
