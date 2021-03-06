import { Utils } from "./utils"
import Discord = require("discord.js")

export class Scoreboard{
    gameName:string
    scores:Map<Discord.User, number> = new Map<Discord.User, number>()
}

export class LeaderboardManager{
    public leaderboard: Map<String, Number>;
   
    constructor(){
        this.leaderboard = new Map<String, Number>()
    }

    public grantPoints(username, points) {
    if (!this.leaderboard.get(username))
      this.leaderboard.set(username, 0)
    this.leaderboard.set(username, this.leaderboard.get(username) + points)
    }

    public describeScoreboard() : string{
        let str = ""

        if (this.leaderboard.size == 0) {
           str += "No scores have been recorded yet."
        }
        this.leaderboard.forEach((score: Number, user: String) => {
            str += Utils.pad_r(user, " ") + " " + score + "\n"
        });

        return str
    }
}