var sql = require("sqlite3");
var Discord = require("discord.js");

import { Utils } from "./utils"

var utils = new Utils();

export enum DBResponseCode{
    SUCCESS,
    ERR
}

export class DBManager{
    public db:any

    constructor(){
        this.db = new sql.Database('../data/tejdb.sqlite')
    }
    public saveTejQuote(quote :string, author : string, realness, callback) {
        var me = this;
        
          this.db.run("CREATE TABLE IF NOT EXISTS tej (quote TEXT PRIMARY KEY UNIQUE, author TEXT, realness INTEGER)", [], function () {
            me.db.run("INSERT INTO tej (quote, author, realness) VALUES (?, ?, ?)", quote, author, realness, function (err, rows) {
                if (err) {
                    console.log(err);
                    callback(DBResponseCode.ERR);
                }
                else {
                    callback(DBResponseCode.SUCCESS);
                }
            });
        });
    }
    
  public getTejQuotes (callback) {
        var me = this;
        this.db.all("SELECT quote, author, realness from tej", [], function (err, rows) {
            if (err) {
                console.log(err);
                callback(DBResponseCode.ERR, null);
            }
            callback(DBResponseCode.SUCCESS, rows);
        });
    };

  public saveScores (scoreboard, callback) {
        var me = this;
        this.db.run("CREATE TABLE IF NOT EXISTS " + scoreboard.gameName + " (id TEXT PRIMARY KEY, username CHAR(50), score NUMBER)", [], function () {
            scoreboard.scores.forEach(function (newlyEarnedScore, user) {
                //see if this user has saved a score before
                me.db.all("SELECT username, score, id FROM " + scoreboard.gameName + " WHERE id = ?", user.id, function (err, rows) {
                    if (err) {
                        console.log(err);
                        callback(DBResponseCode.ERR);
                        return;
                    }
                    if (rows.length != 0) {
                        var newScore = rows[0].score + newlyEarnedScore;
                        var i = rows[0].id.toString();
                        me.db.all("UPDATE  " + scoreboard.gameName + " SET score = ? WHERE id = ?", newScore, i, function (zerr, zrows) {
                        });
                    }
                    else {
                        me.db.run("INSERT INTO " + scoreboard.gameName + " (id, username, score) VALUES (?,?,?)", user.id, user.username, newlyEarnedScore);
                    }
                    callback(DBResponseCode.SUCCESS);
                });
            });
        });
    };

    getLeaderboard(gameName, callback) {
        var result = "";
        var e = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
        this.db.all("SELECT username, score FROM " + gameName + " ORDER BY score DESC", [], function (err, rows) {
            if (err) {
                console.log(err);
                callback(DBResponseCode.ERR, null);
                return;
            }
            var rank = 1;
            for (var x in rows) {
                result += rank + ": " + rows[x].username + " with " + rows[x].score + " date";
                if (rows[x].score != 1)
                    result += "s";
                result += "\n";
                rank++;
            }
            if (rows.length == 0) {
                result = "No scores recorded yet. Get playing!";
            }
            e.addField(gameName.replace("_", " ") + " Leaderboard", result, false);
            callback(DBResponseCode.SUCCESS, e);
        });
    };


}


