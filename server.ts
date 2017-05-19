import Discord = require('discord.js');
import { Utils, ResponseCode } from "./utils";
import { GameTemplate, GameManager, GameInstance} from "./games"
import { LeaderboardManager } from "./leaderboard"
import { DBManager, DBResponseCode } from "./db"

import { Secrets } from "./secrets"

const client = new Discord.Client();

var utils = new Utils();
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
let db = new DBManager()

client.on('ready', () => {
  console.log('I am ready and listening!');
});


let saveTejQuote = function(inputSequence, message : Discord.Message, author : Discord.User, truthiness){
  console.log('try 2 sav')
  var cmd = truthiness ? ".realtej " : ".faketej "

  if(!inputSequence[1]){
    author.send("I need the quote too! Use the format `" + cmd + "<quote>`")
    return
  }

  let quoteText = message.content.replace(cmd, "")

  db.saveTejQuote(quoteText, author.username, truthiness, function(status, results){
    if(status == DBResponseCode.ERR){
      author.send("Sorry, had an issue saving that one. I have memory problems. And hearing problems. And just a lot of problems. Blame Haxo.")
      return
    }
    
    author.send("Successfully saved \"" + quoteText + "\" to the TejDB")
  })
  
}

let commands = {

  leaderboard : function(inputSequence, message : Discord.Message, author : Discord.User, channel){
      channel.send(utils.code(me.leaderboardManager.describeScoreboard()))
  },

  realtej: function(inputSequence,message : Discord.Message, author : Discord.User, channel){
      saveTejQuote(inputSequence, message, author, true)
  },

  faketej: function(inputSequence, message : Discord.Message, author : Discord.User, channel){
    saveTejQuote(inputSequence, message, author, false)
  },

  play : function(inputSequence, message : Discord.Message, author : Discord.User, channel){
    let str = ""
      if (!inputSequence[1]) {
        str += "Here are the games I know:"
        channel.send(str)
        channel.sendEmbed(me.gameManager.describeGames())
        channel.send("To initiate a game, say `.play <gamename>` \n")
      }
      else {
        var gameType = inputSequence[1];
        let result = me.gameManager.create(channel, gameType)

        if (result == ResponseCode.SUCCESS) {

          
        var game = me.gameManager.gameInChannel(channel);
        if(game.gameTemplate.requiresExplicitJoin){

          str = ""
          str += "**Alright, let's play " + gameType + "!** \n"
          str += "Waiting for players. To join, say `.join` \n"
          str += "When everyone is in, say `.start` to begin the game"
          channel.send(str)
        }
        }
        if(result == ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME){
          channel.send("Sorry, there's already a game running in this channel. Say `.end` to kill it!")
        }
      }
  },

  end : function(inputSequence, message : Discord.Message, author : Discord.User, channel){
      var game = me.gameManager.gameInChannel(channel);
      if (game) {
        me.gameManager.endGame(channel)
        message.channel.send("Game ended.")
      }
      else{
        message.channel.send("You'll need to start a game before you can end it. ;)")
      }
  },

  join : function(inputSequence, message : Discord.Message, author : Discord.User, channel){
    var game = me.gameManager.gameInChannel(channel)
      if (game) {
        let result = me.gameManager.startGame(channel);
        if (result == ResponseCode.SUCCESS) {
          let str = "Started Game. Here are the rules. \n"
          str += utils.code(game.gameTemplate.rules)
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
  }
}


client.on('message', message => {
  let str = ""

  let channel = message.channel
  let author = message.author
  let mentions = message.mentions
  var content = message.content


  //THIS IS A MESSAGE FROM TEJ
  if(author.id == "192841484939165696"){
      
  }

  for (var mention of mentions.users.array()){

    //THIS MESSAGE MENTIONS TEJ
    if(mention.username == "192841484939165696"){

    }
  }


  if (!content.startsWith(botPrefix)) {
    return;
  }

  content = content.replace(botPrefix, "")

  var g = me.gameManager.gameInChannel(message.channel);

  if(g){
      g.onPublicMessage(inputSequence, message, channel, author)
  }
  
  var inputSequence = content.split(" ").filter(function (elm) {
    return elm != " "
  })

  if(commands[inputSequence[0]]){
    commands[inputSequence[0]](inputSequence, message, author, channel)
  }
  
});

client.login(Secrets.botToken);