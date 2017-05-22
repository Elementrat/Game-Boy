"use strict";
exports.__esModule = true;
var Discord = require("discord.js");
var utils_1 = require("./utils");
var games_1 = require("./games");
var stats_1 = require("./stats");
var db_1 = require("./db");
var tejhandler_1 = require("./tejhandler");
var secrets_1 = require("./secrets");
var client = new Discord.Client();
client.login(secrets_1.Secrets.botToken);
var Server = (function () {
    function Server() {
        this.leaderboardManager = new stats_1.LeaderboardManager();
        this.gameManager = new games_1.GameManager();
        this.tejHandler = new tejhandler_1.TejHandler();
        this.db = new db_1.DBManager();
    }
    return Server;
}());
var me = new Server();
client.on('ready', function () {
    console.log('Ready and listening!');
});
var commands = {
    leaderboard: function (inputSequence, message, author, channel) {
        channel.send(utils_1.Utils.code(me.leaderboardManager.describeScoreboard()));
    },
    realtej: function (inputSequence, message, author, channel) {
        saveTejQuote(inputSequence, message, author, true);
    },
    faketej: function (inputSequence, message, author, channel) {
        saveTejQuote(inputSequence, message, author, false);
    },
    play: function (inputSequence, message, author, channel) {
        var str = "";
        if (!inputSequence[1]) {
            str += "Here are the games I know:";
            channel.send(str);
            channel.sendEmbed(me.gameManager.describeGames());
            channel.send("To initiate a game, say `.play <gamename>` \n");
        }
        else {
            var gameType = inputSequence[1];
            switch (me.gameManager.create(channel, gameType)) {
                case utils_1.ResponseCode.SUCCESS:
                    var game = me.gameManager.gameInChannel(channel);
                    if (game.gameTemplate.requiresExplicitJoin) {
                        me.gameManager.addPlayerToGame(channel, author);
                        str = "";
                        str += "**Alright, let's play " + gameType + "!** \n";
                        str += "Waiting for players. To join, say `.join` \n";
                        str += "When everyone is in, say `.start` to begin the game";
                        channel.send(str);
                    }
                    break;
                case utils_1.ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME:
                    channel.send("Sorry, there's already a game running in this channel. Say `.end` to kill it!");
                    break;
            }
        }
    },
    end: function (inputSequence, message, author, channel) {
        var game = me.gameManager.gameInChannel(channel);
        if (game) {
            me.gameManager.endGame(channel);
            message.channel.send("Game ended.");
        }
        else {
            message.channel.send("You'll need to start a game before you can end it. ;)");
        }
    },
    join: function (inputSequence, message, author, channel) {
        var game = me.gameManager.gameInChannel(channel);
        var str = "";
        if (game) {
            var status = me.gameManager.addPlayerToGame(channel, author);
            switch (status) {
                case utils_1.ResponseCode.ERR_NOT_ENOUGH_PLAYERS:
                    str += author.username + " has joined the game";
                    break;
                case utils_1.ResponseCode.FAILURE:
                    str += "Sorry, something went wrong, and I don't know what";
                    break;
            }
        }
        else {
            str = "Sorry, you'll need to get a game going in this channel with `.play` before you can join it!";
        }
        channel.send(str);
    },
    start: function (inputSequence, message, author, channel) {
        var game = me.gameManager.gameInChannel(channel);
        if (game) {
            switch (me.gameManager.startGame(channel)) {
                case utils_1.ResponseCode.SUCCESS:
                    var str = "Started Game. Here are the rules. \n";
                    str += utils_1.Utils.code(game.gameTemplate.rules);
                    channel.send(str);
                    break;
                case utils_1.ResponseCode.ERR_NOT_ENOUGH_PLAYERS:
                    channel.send("Unable to start, the game requires a minimum of " + game.gameTemplate.minPlayers + " players. You can join with `.join`");
                    channel.send("Current roster:");
                    channel.send(me.gameManager.describeRoster(channel));
                    break;
            }
        }
        else {
            channel.send("Sorry, you'll need to create a game with `.play <game name>` before you can start!");
        }
    }
};
client.on('message', function (message) {
    if (!message.content.startsWith(utils_1.Utils.botPrefix))
        return;
    var str = "";
    var channel = message.channel;
    var author = message.author;
    var mentions = message.mentions;
    var content = message.content.replace(utils_1.Utils.botPrefix, "");
    var inputSequence = content.split(" ").filter(function (elm) {
        return elm != " ";
    });
    me.tejHandler.onMessage(inputSequence, message, channel, author);
    var g = me.gameManager.gameInChannel(message.channel);
    if (g) {
        if (message.type == "dm") {
            g.onDM(inputSequence, message, channel, author);
        }
        else {
            g.onPublicMessage(inputSequence, message, channel, author);
        }
    }
    if (commands[inputSequence[0]])
        commands[inputSequence[0]](inputSequence, message, author, channel);
});
var saveTejQuote = function (inputSequence, message, author, truthiness) {
    var cmd = truthiness ? ".realtej " : ".faketej ";
    if (!inputSequence[1]) {
        author.send("I need the quote too! Use the format `" + cmd + "<quote>`");
        return;
    }
    var quoteText = message.content.replace(cmd, "");
    me.db.saveTejQuote(quoteText, author.username, truthiness, function (status, results) {
        if (status == db_1.DBResponseCode.ERR) {
            author.send("Sorry, had an issue saving that one. I have memory problems. And hearing problems. And just a lot of problems. Blame Haxo.");
            return;
        }
        author.send("Successfully saved \"" + quoteText + "\" to the TejDB");
    });
};
