import Discord = require('discord.js');
import { Utils, ResponseCode } from "./utils";
import { GameTemplate, GameManager, GameInstance } from "./games"
import { LeaderboardManager, Scoreboard } from "./stats"
import { DBManager, DBResponseCode } from "./db"
import { TejHandler } from "./tejhandler"

import { Secrets } from "./secrets"

const client = new Discord.Client();
client.login(Secrets.botToken);

class Server {
  leaderboardManager: LeaderboardManager = new LeaderboardManager()
  gameManager: GameManager = new GameManager()
  tejHandler: TejHandler = new TejHandler()
  db: DBManager = new DBManager()
}

let me = new Server();

client.on('ready', () => {
  console.log('Ready and listening!');
});

let commands = {

  leaderboard: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    channel.send(Utils.code(me.leaderboardManager.describeScoreboard()))
  },

  realtej: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    saveTejQuote(inputSequence, message, author, true)
  },

  faketej: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    saveTejQuote(inputSequence, message, author, false)
  },

  play: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    let str = ""
    if (!inputSequence[1]) {
      str += "Here are the games I know:"
      channel.send(str)
      channel.sendEmbed(me.gameManager.describeGames())
      channel.send("To initiate a game, say `.play <gamename>` \n")
    }
    else {
      var gameType = inputSequence[1];

      switch(me.gameManager.create(channel, gameType)){

      case ResponseCode.SUCCESS:

        var game = me.gameManager.gameInChannel(channel);
        if (game.gameTemplate.requiresExplicitJoin) {
          me.gameManager.addPlayerToGame(channel, author)

          str = ""
          str += "**Alright, let's play " + gameType + "!** \n"
          str += "Waiting for players. To join, say `.join` \n"
          str += "When everyone is in, say `.start` to begin the game"
          channel.send(str)
        }
        break;

      case ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME:
        channel.send("Sorry, there's already a game running in this channel. Say `.end` to kill it!")
        break;
      }
    }
  },

  end: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    var game = me.gameManager.gameInChannel(channel);
    if (game) {
      me.gameManager.endGame(channel)
      message.channel.send("Game ended.")
    }
    else {
      message.channel.send("You'll need to start a game before you can end it. ;)")
    }
  },

  join: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    var game = me.gameManager.gameInChannel(channel)
    let str = ""

    if (game) {
      let status = me.gameManager.addPlayerToGame(channel, author)

      switch (status) {
        case ResponseCode.ERR_NOT_ENOUGH_PLAYERS:
          str += author.username + " has joined the game"
          break;

        case ResponseCode.FAILURE:
          str += "Sorry, something went wrong, and I don't know what"
          break;

      }
    }
    else {
      str = "Sorry, you'll need to get a game going in this channel with `.play` before you can join it!"
    }

    channel.send(str)

  },

  start: function (inputSequence, message: Discord.Message, author: Discord.User, channel) {
    var game = me.gameManager.gameInChannel(channel)
    if (game) {
      switch(me.gameManager.startGame(channel)){
        case ResponseCode.SUCCESS:
          let str = "Started Game. Here are the rules. \n"
          str += Utils.code(game.gameTemplate.rules)
          channel.send(str);
        break;

        case ResponseCode.ERR_NOT_ENOUGH_PLAYERS:
          channel.send("Unable to start, the game requires a minimum of " + game.gameTemplate.minPlayers + " players. You can join with `.join`")
          channel.send("Current roster:")
          channel.send(me.gameManager.describeRoster(channel))
        break;
      }
    }
    else {
      channel.send("Sorry, you'll need to create a game with `.play <game name>` before you can start!")
    }
  }
}


client.on('message', message => {

  if (!message.content.startsWith(Utils.botPrefix))
    return;

  let str = ""

  let channel = message.channel
  let author = message.author
  let mentions = message.mentions
  let content = message.content.replace(Utils.botPrefix, "")

  let inputSequence = content.split(" ").filter(function (elm) {
    return elm != " "
  })

  me.tejHandler.onMessage(inputSequence, message, channel, author)

  var g = me.gameManager.gameInChannel(message.channel);

  if (g){
    if(message.type == "dm"){
       g.onDM(inputSequence, message, channel, author)
    }
    else{
       g.onPublicMessage(inputSequence, message, channel, author)
    }
  }

  if (commands[inputSequence[0]])
    commands[inputSequence[0]](inputSequence, message, author, channel)

});

let saveTejQuote = function (inputSequence, message: Discord.Message, author: Discord.User, truthiness) {
  var cmd = truthiness ? ".realtej " : ".faketej "

  if (!inputSequence[1]) {
    author.send("I need the quote too! Use the format `" + cmd + "<quote>`")
    return
  }

  let quoteText = message.content.replace(cmd, "")

  me.db.saveTejQuote(quoteText, author.username, truthiness, function (status, results) {
    if (status == DBResponseCode.ERR) {
      author.send("Sorry, had an issue saving that one. I have memory problems. And hearing problems. And just a lot of problems. Blame Haxo.")
      return
    }

    author.send("Successfully saved \"" + quoteText + "\" to the TejDB")
  })

}