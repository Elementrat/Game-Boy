import { GameTemplate, GameInstance } from "./games"
import { Utils, ResponseCode} from "./utils"
import { DBManager , DBResponseCode} from "./db"
import Discord = require("discord.js")

export class TejQuote{
    real:number // Number because SQLIte uses 0/1 Numbers as Bools
    author:string
    quote:string
}

export class TejTemplate extends GameTemplate{
    public quoteDeck:Array<TejQuote>

    constructor(){
        super()
         this.name = "Tej";
         this.description = "I'll give you a quote. You tell me if he actually said it\nDM me `.realtej <quote>` or `.faketej <quote>` to contribute to the TejDB!";
         this.requiresExplicitJoin = false;
         this.minPlayers = 0;
         this.requiresVoice = false;
         this.quoteDeck = new Array<TejQuote>()
    }

    create(channel){
        var inst = new TejInstance(this);
        inst.channel = channel;
        inst.initialSetup();
        return inst;
    }
}

export enum TejState{
    OMG_PREGAME,
    OMG_AWAITING_REACS,
    OMG_POST_ROUND
}

export class TejInstance extends GameInstance{

    public dbManager:DBManager
    public gameState:TejState
    public quoteDeck:Array<TejQuote>
    public currentQuote: TejQuote
    public reacCollector : Discord.ReactionCollector
    public tejState : TejState
    public quoteMsg:Discord.Message

    constructor(gameTemplate){
        super(gameTemplate)
        this.dbManager = new DBManager()
        this.tejState = TejState.OMG_PREGAME
        this.currentRound = 0;
    }

    public initialSetup(){
        var me = this;
        me.drawDeck(function (status, results) {
            if (status != ResponseCode.SUCCESS) {
                me.channel.send("I had an issue asking the TejDB for quotes. Maybe Tej hacked me. Haxo? Are you out there?");
                return;
            }
            else {
                me.quoteDeck = results;
                me.round();
                return;
            }
        });
    }

    public round(){
        if (!this.quoteDeck || this.quoteDeck.length == 0) {
            this.channel.send("Sorry, we're fresh out of Tej. DM me your supply with `.realtej <quote>` and `.faketej <quote>`");
            return;
        }
        this.currentRound+= 1;

        if (this.currentRound == 1) {
            var e = new Discord.RichEmbed({ color: Utils.colors.get("tej") });
            this.channel.send("Brace yourself: You have entered the *TejZone*\n");

            var str = "";
            str += " I'll give you a quote.\n";
            str += " - If you think tej said it, hit it with :100: \n";
            str += " - If you think it's fake love, use :poop: \n";
            e.addField("Rules of The TejZone", str, false);
            this.channel.sendEmbed(e);
        }
        this.currentQuote = this.quoteDeck.pop();
        var me = this;
        setTimeout(function () {
            me.channel.send("**Tej Quote #" + me.currentRound + ":** " + Utils.code("\"" + me.currentQuote.quote + "\"")).then(function (msg) {
                me.quoteMsg = msg;
                me.reacCollector = new Discord.ReactionCollector(msg, function (reac) { return true; });
                me.tejState = TejState.OMG_AWAITING_REACS;

                setTimeout(function(){
                    me.channel.send("When guesses are in, say `.reveal` ");
                }, Utils.delays.get("short"))
            });
        }, Utils.delays.get("medium"));
    }

    public drawDeck(callback){
        var arr = new Array();
        var me = this
        this.dbManager.getTejQuotes(function (status, quotes) {
            if (status == DBResponseCode.ERR) {
                callback(ResponseCode.FAILURE, null);
            }
            for (var x in quotes) {
                var q = new TejQuote();
                q.real = quotes[x].realness;
                q.author = quotes[x].author;
                q.quote = quotes[x].quote;
                arr.push(q);
            }
            arr = Utils.shuffle(arr);
            callback(ResponseCode.SUCCESS, arr);
        });
    }

    public onPublicMessage(inputSequence, message, channel, author){
        message.content = message.content.replace(Utils.botPrefix, "");
        switch (message.content) {
            case "more":
                if (this.tejState == TejState.OMG_POST_ROUND) {
                    this.round();
                }
                break;
            case "reveal":
                if (this.tejState == TejState.OMG_AWAITING_REACS) {
                    var reacs = this.reacCollector.collected.array();
                    var e = new Discord.RichEmbed({ color: Utils.colors.get("tej") });
                    var me = this;
                    for (var _i = 0, reacs_1 = reacs; _i < reacs_1.length; _i++) {
                        var reac = reacs_1[_i];
                        var isFakeEmoji = reac.emoji.name === '💩';
                        var isRealEmoji = reac.emoji.name === '💯';
                        var thoughtStr = "Thought this whole game was some kind of joke";
                        if (isFakeEmoji)
                            thoughtStr = "Guessed fake";
                        if (isRealEmoji)
                            thoughtStr = "Guessed real";
                        var usrStr = "";
                        reac.users.forEach(function (user, key) {
                            usrStr += user.username + (user != reac.users.last() ? ", " : "");
                        });
                        e.addField(thoughtStr, usrStr);
                    }
                    if (reacs.length == 0) {
                        channel.send("No guesses were received. Sad!");
                    }
                    else {
                        this.channel.sendEmbed(e);
                    }
                    this.channel.send("Now, let's find out if it was real. Querying the TejDB...");
                    setTimeout(function () {
                        var realStr = "fake";
                        if (me.currentQuote.real == 1) {
                            realStr = "real";
                        }
                        me.channel.send("It was **" + realStr + "**!");
                        me.channel.send("That quote was added by " + me.currentQuote.author);
                        me.channel.send("Say `.more` for another, or `.end` to finish.");
                        me.tejState = TejState.OMG_POST_ROUND;
                    }, Utils.delays.get("short"));
                }
                break;
        }
    }
}