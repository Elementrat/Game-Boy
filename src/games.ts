import Discord = require('discord.js');
import { Utils, ResponseCode } from "./utils"

export class Root{
    name : string
    constructor(){
        this.name = "Default"
    }
}

export class Role {
    name : string
    description : string
}

export class GameManager {
    gameTemplates : Map<String, GameTemplate> = new Map<String, GameTemplate>()
    gameInstances : Map<Discord.Channel, GameInstance> = new Map<Discord.Channel,GameInstance>()

    constructor() {
        this.gameTemplates.set("red-flags", new RedFlagsTemplate())
        this.gameTemplates.set("tej", new TejTemplate())
    }

    public describeGames(): Discord.RichEmbed {
        var e = new Discord.RichEmbed({color : Utils.colors.get("theme")})

        if(this.gameTemplates.size == 0){
            e.addField("I don't know how to play anything", "I'm sorry. I feel like a failure")
        }

        this.gameTemplates.forEach(function (template) {
            e.addField(template.name, template.description, false);
        })

        return e
    }

    public describeRoster(channel){
        let str = ""
        var game = this.gameInstances.get(channel);

        if(game.players.length == 0){
            str =  "No players have joined yet."
        }

        this.gameInstances.get(channel).players.forEach(function(player){
            str += player.username + "\n"
        })
        return str
    }

    public addPlayerToGame(channel : Discord.Channel, user : Discord.User) : ResponseCode{
        var game = this.gameInstances.get(channel);
        if(!game){
            return ResponseCode.ERR_GAME_INSTANCE_DOESNT_EXIST
        }
        return game.join(user)
    }

    public gameInChannel(channel : Discord.Channel) : GameInstance{
        return this.gameInstances.get(channel)
    }
    public endGame(channel) : ResponseCode{
        this.gameInstances.delete(channel)
        return ResponseCode.SUCCESS
    }

    startGame(channel) : ResponseCode {
        var g = this.gameInstances.get(channel)

        if(!g){
            return ResponseCode.ERR_GAME_INSTANCE_DOESNT_EXIST
        }

        if(g.gameTemplate.minPlayers > g.players.length){
            return ResponseCode.ERR_NOT_ENOUGH_PLAYERS
        }
        else{
            g.start()
            return ResponseCode.SUCCESS
        }      
    }

    create(channel, gameType:string) : ResponseCode{

        gameType = gameType.toLowerCase()

        if(this.gameInstances.get(channel)){
            return ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME
        }
        else{
            let gameTemplate = this.gameTemplates.get(gameType);
            
            if(!gameTemplate){
                return ResponseCode.ERR_GAME_TEMPLATE_DOESNT_EXIST
            }

            this.gameInstances.set(channel, this.gameTemplates.get(gameType).create(channel));
            return ResponseCode.SUCCESS
        }
        
    }
}

export class GameTemplate {
    public name: string
    public description: string
    public minPlayers : number
    public rules : string
    public roles : Array<Role> = new Array<Role>()
    public requiresExplicitJoin :boolean
    public requiresVoice :boolean

    public constructor(){

    }

    public create(channel) : GameInstance{
        return null
    }
}

export class GameInstance {
    public players: Array<Discord.User> = new Array<Discord.User>()
    public channel: any
    public currentRound : number
    public numRounds: number
    public gameTemplate: GameTemplate
    public started : boolean = false
    
    start() {
        this.started = true
    }

    onPublicMessage(inputSequence, message, channel, author){

    }

    join(user : Discord.User) : ResponseCode{
        if(this.players.indexOf(user) == -1){
            this.players.push(user)
            return ResponseCode.SUCCESS
        }
        else{
            return ResponseCode.ERR_PLAYER_ALREADY_JOINED
        }
    }

    constructor(template : GameTemplate, channel) {
        this.gameTemplate = template;
        this.channel = channel
    }
}

import { RedFlagsInstance, RedFlagsTemplate } from "./game_redflags"
import { TejInstance, TejTemplate } from "./game_tej"