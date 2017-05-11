"use strict";
exports.__esModule = true;
var utils_1 = require("./utils");
var f = new utils_1.Formatter();
var LeaderboardManager = (function () {
    function LeaderboardManager() {
        this.leaderboard = new Map();
    }
    LeaderboardManager.prototype.grantPoints = function (username, points) {
        if (!this.leaderboard.get(username))
            this.leaderboard.set(username, 0);
        this.leaderboard.set(username, this.leaderboard.get(username) + points);
    };
    LeaderboardManager.prototype.describeScoreboard = function () {
        var str = "";
        if (this.leaderboard.size == 0) {
            str += "No scores have been recorded yet.";
        }
        this.leaderboard.forEach(function (score, user) {
            str += f.pad_r(user, " ") + " " + score + "\n";
        });
        return str;
    };
    return LeaderboardManager;
}());
exports.LeaderboardManager = LeaderboardManager;
