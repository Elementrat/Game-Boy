import Discord = require('discord.js');
import { Formatter, ResponseCode } from "./utils"
var f = new Formatter()

export class Role {
    name : string
    description : string
}

export class GameManager {
    gameTemplates: Map<String, GameTemplate>
    gameInstances : Map<Discord.Channel, GameInstance>

    constructor() {
        this.gameTemplates = new Map<String, GameTemplate>()
        this.gameTemplates.set("Red-Card", new RedCardTemplate())
        this.gameTemplates.set("Mystery", new MysteryTemplate())
        this.gameTemplates.set("Cards-Against", new CardsAgainstTemplate())
        this.gameInstances = new Map<Discord.Channel,GameInstance>()
    }

    public describeGames(): string {
        var str = ""
        this.gameTemplates.forEach(function (e) {
            str += f.pad_r(e.name, " ") + "  " + e.description + "\n"
        })
        return str
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

    create(channel, gameType) : ResponseCode{
        if(this.gameInstances.get(channel)){
            return ResponseCode.ERR_CHANNEL_ALREADY_HAS_GAME
        }
        else{
            let gameTemplate = this.gameTemplates.get(gameType);
            
            if(!gameTemplate){
                return ResponseCode.ERR_GAME_TEMPLATE_DOESNT_EXIST
            }

            this.gameInstances.set(channel, this.gameTemplates.get(gameType).create());
            return ResponseCode.SUCCESS
        }
        
    }
}

export class GameTemplate {
    public name: string
    public description: string
    public minPlayers : number
    public rules : string
    public roles : Array<Role>

    public constructor(){
        this.roles = new Array<Role>();
    }

    public create() : GameInstance{
        return null
    }
}

export class RedCardTemplate extends GameTemplate {
    public perks: Array<string>
    public redFlags: Array<String>

    constructor() {
        super()
        this.name = "Red-Card"
        this.rules = "Try to ruin the hosts date"
        this.roles = [
            { name : "The Single", description : "" },
            { name : "The Dates", description : "" }
        ]

        this.description = "Try to ruin your friends ideal dates"
        this.perks = ["tick", "tock", "zick", "zook", "zonk"]
        this.redFlags = ["wot", "woot", "wit", "wzt"]
        this.minPlayers = 1
    }

    create() {
        return new RedCardInstance(this);
    }
}

export class MysteryTemplate extends GameTemplate {
    constructor() {
        super()
        this.name = "Mystery"
        this.description = "A test game (Not Implemented)"
    }
}

export class CardsAgainstTemplate extends GameTemplate {
    constructor() {
        super()
        this.name = "Cards Against"
        this.description = "You already know what this is (Not Implemented)"
    }
}

export class GameInstance {
    public players: Array<Discord.User>
    public channel: Discord.GuildChannel
    public currentRoud : Number
    public numRounds: Number
    public gameTemplate: GameTemplate
    public started : boolean

    start() {
        this.started = true
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

    constructor(template : GameTemplate) {
        this.gameTemplate = template;
        this.started = false
        this.players = new Array<Discord.User>()
    }
}

export class RedCardInstance extends GameInstance {
    start() {

    }
}