"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var utils_1 = require("./utils");
var Root = (function () {
    function Root() {
        this.name = "Default";
    }
    return Root;
}());
exports.Root = Root;
var Role = (function () {
    function Role() {
    }
    return Role;
}());
exports.Role = Role;
var GameManager = (function () {
    function GameManager() {
        this.gameTemplates = new Map();
        //console.log(s)
        this.gameTemplates.set("red-flags", new game_redflags_1.RedFlagsTemplate());
        this.gameTemplates.set("tej", new game_tej_1.TejTemplate());
        // this.gameTemplates.set("Cards-Against", new CardsAgainstTemplate())
        this.gameInstances = new Map();
    }
    GameManager.prototype.describeGames = function () {
        var e = new Discord.RichEmbed({ color: utils_1.Utils.colors.get("theme") });
        if (this.gameTemplates.size == 0) {
            e.addField("I don't know how to play anything", "I'm sorry. I feel like a failure");
        }
        this.gameTemplates.forEach(function (template) {
            e.addField(template.name, template.description, false);
        });
        return e;
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
        gameType = gameType.toLowerCase();
        if (this.gameInstances.get(channel)) {
            return utils_1.ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME;
        }
        else {
            var gameTemplate = this.gameTemplates.get(gameType);
            if (!gameTemplate) {
                return utils_1.ResponseCode.ERR_GAME_TEMPLATE_DOESNT_EXIST;
            }
            this.gameInstances.set(channel, this.gameTemplates.get(gameType).create(channel));
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
    GameTemplate.prototype.create = function (channel) {
        return null;
    };
    return GameTemplate;
}());
exports.GameTemplate = GameTemplate;
var GameInstance = (function () {
    function GameInstance(template) {
        this.gameTemplate = template;
        this.started = false;
        this.players = new Array();
    }
    GameInstance.prototype.start = function () {
        this.started = true;
    };
    GameInstance.prototype.onPublicMessage = function (inputSequence, message, channel, author) {
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
var game_redflags_1 = require("./game_redflags");
var game_tej_1 = require("./game_tej");
