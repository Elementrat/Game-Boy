import Discord = require('discord.js');
import { Formatter, ResponseCode } from "./utils";
import { GameTemplate, GameManager, GameInstance, RedCardTemplate, MysteryTemplate } from "./games"
import { LeaderboardManager } from "./leaderboard"

const botToken = 'MzExMjI0MjU4NjcwMTAwNDgw.C_Ouxg.QF_4D6kWXVFL-sHyZnZpbxXAOM8';
const client = new Discord.Client();

var f = new Formatter();
var botPrefix = "."

class Server {
  leaderboardManager: LeaderboardManager
  gameManager: GameManager
  constructor() {
    this.gameManager = new GameManager()
    this.leaderboardManager = new LeaderboardManager()
  }
}

let me = new Server();

client.on('ready', () => {
  console.log('I am ready and listening!');
});

client.on('message', message => {
  let str = ""

  let channel = message.channel
  let author = message.author
  let mentions = message.mentions
  var content = message.content

  if (!content.startsWith(botPrefix)) {
    return;
  }

  content = content.replace(botPrefix, "")

  var inputSequence = content.split(" ").filter(function (elm) {
    return elm != " "
  })

  switch (inputSequence[0]) {

    case "score":
      if (!inputSequence[1] || mentions.users.size == 0) {
        channel.send("To grant points, say `score @username`")
        return
      }

      me.leaderboardManager.grantPoints(mentions.users.first().username, 1)
      break;

    case "end":

    var game = me.gameManager.gameInChannel(channel);
      if (game) {
        me.gameManager.endGame(channel)
        message.channel.send("Game ended.")
      }
      else{
        message.channel.send("You'll need to start a game before you can end it. ;)")
      }
    break;

    case "start":
    var game = me.gameManager.gameInChannel(channel)
      if (game) {
        let result = me.gameManager.startGame(channel);
        if (result == ResponseCode.SUCCESS) {
          let str = "Started Game. Here are the rules. \n"
          str += f.code(game.gameTemplate.rules)
          channel.send(str);
        }
        if (result == ResponseCode.ERR_NOT_ENOUGH_PLAYERS) {
          channel.send("Unable to start, the game requires a minimum of " + me.gameManager.gameInChannel(channel).gameTemplate.minPlayers + " players. You can join with `.join`")
          channel.send("Current roster:")
          channel.send(me.gameManager.describeRoster(channel))
        }
      }
      else {
        channel.send("Sorry, you'll need to create a game with `.play <game name>` before you can start!")
      }
      break;

    case "join":
      let result = me.gameManager.addPlayerToGame(channel, author)
      
      if (result == ResponseCode.SUCCESS) {

        channel.send(author.username + " joined the game!")
        let game = me.gameManager.gameInChannel(channel)

        channel.send("Current players: " + " (" + game.gameTemplate.minPlayers + " total needed)")
        channel.send(f.code(me.gameManager.describeRoster(channel)))
        channel.send("Say `.start` to begin the game.")
      }
      if (result == ResponseCode.ERR_GAME_INSTANCE_DOESNT_EXIST) {
        channel.send("You'll need to get a game going with `.play` before you can join!")
      }
      if(result == ResponseCode.ERR_PLAYER_ALREADY_JOINED){
        channel.send("You're already in the game, "+ author.username+"!")
      }
      if (result == ResponseCode.ERR_GAME_ALREADY_STARTED) {
        channel.send("Sorry, you can't join a game in-progress")
      }
      break;

    case "play":
      if (!inputSequence[1]) {
        str += "To initiate a game, say `.play <gamename>` \n"
        str += "Here are the games I know how to run:"
        channel.send(str)
        channel.send(f.code(me.gameManager.describeGames()))
      }
      else {
        var gameType = inputSequence[1];
        let result = me.gameManager.create(channel, gameType)

        if (result == ResponseCode.SUCCESS) {
          str = ""
          str += "**Alright, let's play " + gameType + "!** \n"
          str += "Waiting for players. To join, say `.join` \n"
          str += "When everyone is in, say `.start` to begin the game"
          channel.send(str)
        }
        if(result == ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME){
          channel.send("Sorry, there's already a game running in this channel. Say `.end` to kill it!")
        }
      }
      break;

    case "leaderboard":
      channel.send(f.code(me.leaderboardManager.describeScoreboard()))
      break;
  }
});

client.login(botToken);