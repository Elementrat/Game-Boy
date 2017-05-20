import { GameInstance, GameTemplate } from "./games"
import { Utils } from "./utils"
import { Scoreboard } from "./stats"
import Discord = require('discord.js');

var utils = new Utils()

export enum RedFlagState{
    PREGAME,
    ACCEPTINGPERKS,
    REVEALINGPERKS,
    ACCEPTINGREDFLAGS,
    REVEALINGREDFLAGS,
    WAITINGFORDECISION,
    POSTROUND
}

export enum RedFlagResponseCode{
    ERR_ALREADY_HANDED_IN,
    ERR_INDEX_OUT_OF_BOUNDS,
    ERR_SAME_PICKS,
    ERR_NAN,
    SUCCESS
}

export class RedFlagsTemplate extends GameTemplate{
     public redFlagHandSize:number
     public perkHandSize:number
     public redFlags:Array<string>
     public perks:Array<string>

     constructor(){
        super()
        this.perkHandSize = 4;
        this.redFlagHandSize = 3;
        this.requiresExplicitJoin = true;
        this.requiresVoice = true;
        this.name = "Red-Flags";
        this.rules = "\n**The Dates** \n";
        this.rules += "When a round starts, you will receive *Perks* and *Red Flags.* \n";
        this.rules += "- Choose *Perks* to create an ideal date for the *The Single* \n";
        this.rules += "- Then, use a *Red Flag* to ruin someone else's chances. \n";
        this.rules += "- Finally, convince *The Single* to choose your date. \n";
        this.rules += "\n**The Single** \n";
        this.rules += " On round start, The Singles will choose their perks to try to win you over. \n";
        this.rules += " - When everyone's submitted, you get to choose your favorite.";
        this.roles = [
            { name: "The Single", description: "You're trying to pick the best date." },
            { name: "The Dates", description: "You're trying to be the best date." }
        ];
        this.description = "Try to ruin each others' dates with freaky dealbreakers";
        this.perks = [
            "Amazing at tennis", "Friends with Tej", "Owns 4 Giraffes", "Cute", "You make them drip like an egg sandwich", "They've got a huge dick, huge.", "Funniest person in the world",
            "Has incredible stamina", "20/20 vision", "Rich", "Never says No", "Glows in the dark", "Has wash-board abs", "Gives great oral", "Will always thiink you're the best in bed", "Has the same favorite music as you",
            "Is a genius", "Is a ninja", "Keeps you warm when you're cold", "Can always fire your most hated co-worker or boss", "They love dogs", "Has unlimited flyer miles", "Owns a teleporter", "Always takes you to the tippity top restaurants and gets you the bisuity best table",
            "is _ _ _ _ 's child", "Has the most attractive _ _ _ _ you've ever seen", "Can get rid of anyone you want", "They'll wear anything you want", "Tastes like honey", "Loves hiking", "Astronaut", "Can solve any math problem", "Their power level is over 9000", "They buy you nice things, lots of nice things",
            "Always picks up the tab", "Drives well", "Infinite supply of girl scout cookies", "Is magical, like a unicorn", "They love cats", "Honest", "Has super-powers", "Is literally forever-21", "Looks good in all clothing", "Always naked, always", "Treats you like a gentleman/woman", "Owns a genie in a lamp", "Will do _ _ _ _ for you whenever you please",
            "Good listener", "Never instigates an argument", "They're adventurous", "Plays piano", "Never gets bored of you", "Is royalty", "Good with money", "Knows and perfected every sex position", "They love participating with you in your favorite hobby", "Can solve any puzzle instantly",
            "Would walk 1000 miles for you", "Made completely out of your favorite candy and they regenerate", "Tolerant", "Has great common sense", "Owns and lives in a castle", "Made of solid gold", "Always knows the word on the tip of your tongue", "Capable of making any body modifications of your choice", "Owns a private jet",
            "Gives great massages", "Affectionate", "Has an awesome beard", "Always prepared for any situation", "Never sarcastic", "Famous chef, and cooks for you daily", "Is a merperson", "Always knows where they want to eat", "Plays violin", "Amazing hair", "Respectful", "Can shapeshift", "Will always defend you from thugs",
            "They're patient with you", "Porn star", "Lumberjack", "Can run a 4 minute mile", "Always kills the bug", "Owns a farm filled with ponies", "Has Bill Gates on speed dial", "They have the same favorite foods as you", "Buff as fuck", "Mechanic", "Spin instructor", "Stunning eyes", "Smoothest talker you've ever met", "CEO of your favorite company", "Wears glasses",
            "Loves the 60's", "Makes you feel secure", "Owns a hot tub", "Has a great personality", "Poops diamonds", "Loves to cuddle", "Enthusiastic", "Always comes up with the best comebacks", "Loves their job", "Never farts", "Looks great without makeup", "Has excellent hand-eye coordination", "Can travel between universes", "Has X-Ray vision", "Firefighter", "Great time-management skills",
            "Can breathe underwater", "Never gets jealous", "Likes to sleep in", "Can make you instantly orgasm with three words", "Makes the world's best banana bread", "You will not age while you date them", "Can mimic anybody's voice perfectly", "Professional fighter", "Drops everything to take care of you when you're sick", "Always says just the right thing at just the right time", "College english professor",
            "Incapable of mood-swings", "Plays guitar", "Loves the 80's", "Can polymorph into Danny Devito", "Can make all your online orders appear overnight", "Knows the name of every actor/actress", "Gives millions to your favorite charity", "gets along great with your friends", "Respects your boundaries", "Delivers milk to you every day", "Can transform into any vehicle", "Brain surgeon",
            "Will never kink-shame you", "Part elf", "Prioritizes you above all else", "Great dancer", "Has the voice of an angel", "Never offends anyone", "Completely devoted to you", "Has 16 hot relatives all ready to sleep with you. They're ok with it.", "Owns a yacht", "Farts rainbows that smell like candy", "Smiles often", "Smells really nice", "Is convinced you're the most interesting person in the world",
            "Always understands your references", "Is always down for threesomes", "Treats your parents well", "Owns a sex swing", "Can never get physically hurt", "Doesn't hold grudges", "Can talk to animals", "Lead singer of your favorite band", "Magician", "Tells the best scary stories", "Is Global in CS:GO", "Tech Savy", "Wakes up early", "Is always down for sex", "Optimistic", "Will never judge you", "They're helpful", "Pays for every meal",
            "A very quiet sleeper", "Writes poetry", "Never complains", "Owns your favorite museum", "Tall", "Loves children", "Touches you in all the right places", "Best personal coach", "Can silence your enemies with a snap of the fingers", "Lives off the grid", "Spoils you", "Your pets will never die while you date them", "Owns a real leprechaun as a pet", "World's best advertising executive", "Always understands your sarcasm",
            "Loves staying in", "Capable of speaking every known language", "Knows all the best places around town", "Soft skin", "Loves video games", "Rodeo champion", "Can lift any heavy object", "Loyal", "Never blames you for anything", "Can get you into a threesome with anyone you want", "Has the cutest animal ever", "Most physically attractive person you have ever seen", "Only attracted to you",
            "Every time they orgasm you gain 100 dollars", "Is an actual pokemon trainer", "Can and will get you ANYTHING", "You are exempt from taxes while dating them", "Got amazing breasts", "Received Whitney houston's inheritance", "Has an excellent retirement plan", "Likes to talk dirty", "Always greets you at the door with a martini", "Great in bed", "Loves the outdoors", "Likes to cosplay", "Owns an island in the bahamas", "Will always take your side",
            "Trusting", "Neither of you gain weight while dating", "Great conversationalist", "Former astonaut", "Reliable", "Owns one of every car", "Emotionally understanding", "Olympic gymnast", "Has an 8-pack", "Only takes one trip bringing in groceries", "Famous rapper", "Has been in love with you since childhood", "When you have children, they'll be absolutely perfect", "YouTube Celebrity", "Well known athlete", "Published author", "Supportive",
            "Will never cheat", "Predicts the future with 100 percent accuracy", "Has an excellent singing voice", "Walking Wi-Fi hotspot", "Double jointed", "Literally has 9 lives", "Has a handlebar moustache", "Knows the answer to the meaning of life", "Model", "They've got that poppin booty", "Extremely flexible", "Owns an actual unicorn", "Hot barista", "Completely blind to all your flaws", "Plays the cello", "Famous actor", "Yoga instructor",
            "Owns a goose that lays designer clothing", "Billionare", "Never arrives prematurely", "Is always courteous", "Tucks you into bed every night", "Millionaire"
        ];
        this.redFlags = [
            "Invisible", "1 foot long tongue", "Wears garbage pail on head", "Only eats frogs", "Has 4 other relationships",
            "Only plays 8 bit video games", "Runs a pawn shop deals exclusively in stinky old fish", "Eats ANYTHING (not including you)", "Has extreme dementia", "Seductively SCREAMS your name every time they see you",
            "Is religious to the max", "Is \"Gender Fluid \"", "Constantly tries to bang your friends", "Keeps a shock collar on you at all times", "Emotionally distant", "Fakes all their orgasms", "Always bragging about past sexual conquests",
            "All your friends hate you for dating them", "Forces you to walk them around like a dog... Everywhere", "Fakes all their orgasms", "Is a hardcore drug addict", "Will \"Zippity boppity boopity your drink every chance they get \"",
            "Eats your head after sex, like a spider", "GIANT grammar nazi", "Every time you have sex, they have a chance of turning into an old man", "Is afraid of stoplights", "Has a four year old child with one of your parents",
            "Can't fall asleep without a glass of warm blood", "Only speaks in slang from 1913", "Is married", "Is 40 years older than they were in the profile picture", "Washed up pornstar", "The only conversation they'll have in public with you is about your sex life",
            "Open mouth kisses their pets", "Shits on the floor like an untrained puppy", "Ends every sentence with \"Im not clingy \"", "Nicknames your genitals Princess", "Only speaks in iambic pentameter", "Posts \"So umm, what are we?\" on your FB wall every day",
            "Talks to your parents about how bad you are in bed", "Literally melts you with their kisses", "Insults your appearance and humiliates you every chance they get", "Roleplays as a tentacle monster during sex", "You are allergic to them",
            "Greets people by sniffing their butts", "Willing to believe any and all conspiracy theories", "Actually your cousin", "Has never heard of the internet", "Enjoys sucking on edible nuts", "Has kidnapped the entier cast of your favorite TV show and is keeping them in a German sex dungeon",
            "Only gives money to homeless people who are hot", "Is always down for sex... especially with your mother", "Actually a 450 lb ogre in diguise", "Is dead", "Constantly trying to replace you", "Will straight up murder anyone who gets too close to you",
            "Refers to their genitals as the \"no-no zone\"", "Actually fucking sucks in bed... Not literally", "Has fucked all your friends", "Leaves butchered animals around your house", "Puts \"Air Quotes\" around every word they say", "Is convinced your cousin is in love with you, and always brings it up at family dinners",
            "You are allergic to them", "Is afraid of stoplights", "Is part of an extreme knitting club", "Hates you", "Massive stalker", "Talks dirty to all their food", "Snorts the ashes of their dead relatives", "Practices the act of foot binding",
            "Dices, cooks, and eats medical waste", "Collects removed moles", "Forcefully shoves ice up your ass during sex", "Has their exes watch and commentate while you have sex", "Before they have sex, they enter the room in a fully realistic E.T outfit... Damn, is E.T hung or what?",
            "Only eats play-doh and has you force feed it to them", "Pops acne and gets you to pop theirs", "Owns and drives a truck filled with dead babies", "Calls every server \"Fuck Face\"", "Hasn't showered since birth", "They have the same sexual organs as ducks. Google it.",
            "Forcefully feeds you by vomiting into your mouth", "Their fetish is vomiting", "They always wear protective porcupine genital armor during sex", "Every time you have an orgasm with them, you lose a year of life", "Makes you spank them till they're bloody during sex", "Directs pornography",
            "Rubs cum in your eyes after sex", "Drives an ice-cream van, but only sells their own \"Cream\" to customers", "Grinds up against class when they're horny", "Masturbates exclusively to kid rock", "Will only eat food from your ass", "Bites during oral",
            "Spends most of their time doing at-home low-budget circumcisions", "Constantly catcalls children in public", "Never eats cooked meat, only raw organs", "They are never allowed to touch you. If they do, it results in a slow death",
            "They only ever get aroused when covered in baby vomit", "shits while cumming", "Is Kim-Jong Un", "Only gets turned on when you fuck their gauges", "Every time you put underwear on, they fill it with wet mud", "The only position they do is the fipped version of 69",
            "Only fucks in a Sonic The Hedgehog costume", "Owns a dead baby they're convinced is a teddybear", "Their pubes have deadlocks. No, they're not shaving", "Uses gym chalk as lubricant", "Ejaculates enough to fill enough to fill an entire bathub. (Either gender!)", "Digs up graves and fucks their bodies",
            "Has blatant dirty sex talks with your mom every hour", "Castrated themselves, they're plotting to castrate you", "They've got an inverted nose, they love eskimo kissing", "Their underwear collection is constantly covered in crusty shit", "Cums on your parents daily", "Kills animals for fun",
            "They only let you eat their lactated milk (Any gender!)", "Bathes in mud, and never uses water", "They don't realize their dog is dead. They walk it too", "Owns a clown suit they use to abduct children", "Staples their genitals, as well as yours, duringsex", "Has a severe 3rd degree burn fetish",
            "Can only have sex if your grand parents are watching", "Stuffs their ass with rotten waffles during sex", "Posts all of your sex tapes to facebook"
        ];
        this.minPlayers = 1;
     }

        create (channel) {
            var inst = new RedFlagsInstance(this);
            inst.channel = channel;
            return inst;
        }
}

export class RedFlagsInstance extends GameInstance{
    public gameState:RedFlagState
    public gameTemplate:RedFlagsTemplate

    public redFlagDeck:Array<string>
    public perkDeck:Array<string>

    public singlePointer:number
    public revealerPointer:number

    public receivedFlags:Map<Discord.User, string>
    public receivedPerks:Map<Discord.User,Array<string>>

    public theSingle:Discord.User
    public theDates:Array<Discord.User>

    public hands:Map<Discord.User,Array<string>>
    public flagHands:Map<Discord.User, Array<string>>

    public scoreBoard:Scoreboard

    public currentDateRevealer:Discord.User

    public neighbors:Map<Discord.User,Discord.User>

    constructor(template){
        super(template)
        this.gameState = RedFlagState.PREGAME
    }

    initialSetup(){
        this.redFlagDeck = Utils.shuffle(this.gameTemplate.redFlags.slice());
        this.perkDeck = Utils.shuffle(this.gameTemplate.perks.slice());
        this.players = Utils.shuffle(this.players);
        this.scoreBoard = new Scoreboard()
        this.singlePointer = 0;
        this.revealerPointer = 0;
        this.currentRound = 0;
    }

    transitionGameState(newState) {
        this.gameState = newState;
    }

    checkRedFlagsComplete() {
        var me = this;
        var complete = true;
        this.theDates.forEach(function (date) {
            if (!me.receivedFlags.get(date)) {
                complete = false;
            }
        });
        return complete;
    };

    checkPerksComplete = function () {
        var me = this;
        var complete = true;
        
        this.theDates.forEach(function (date) {
            if (!me.receivedPerks.get(date)) {
                complete = false;
            }
        });
    
        return complete;
    }

    acceptPerks(author, indexOne, indexTwo) {
        if (isNaN(indexOne) || isNaN(indexTwo))
            return RedFlagResponseCode.ERR_NAN
        
        if (indexOne == indexTwo)
            return RedFlagResponseCode.ERR_SAME_PICKS;

        //TODO CHANGE THIS TO TEMPLATE VALUE
        var handSize = this.gameTemplate.perkHandSize;

        if (indexOne < 0 || indexTwo < 0 || indexOne >= handSize || indexTwo >= handSize)
            return RedFlagResponseCode.ERR_INDEX_OUT_OF_BOUNDS;

        if (this.receivedPerks.get(author))
            return RedFlagResponseCode.ERR_ALREADY_HANDED_IN;

        var str1 = this.hands.get(author)[indexOne].toString();
        var str2 = this.hands.get(author)[indexTwo].toString();
        var arr = new Array();
        arr.push(str1);
        arr.push(str2);
        this.receivedPerks.set(author, arr);
        return RedFlagResponseCode.SUCCESS;
    }

    acceptFlag (author, theDate, index) {
        if (isNaN(index))
            return RedFlagResponseCode.ERR_NAN;
        if (index < 0 || index >= this.flagHands.get(author).length)
            return RedFlagResponseCode.ERR_INDEX_OUT_OF_BOUNDS;
        if (this.receivedFlags.get(theDate))
            return RedFlagResponseCode.ERR_ALREADY_HANDED_IN;

        this.receivedFlags.set(theDate, this.flagHands.get(author)[index]);
        return RedFlagResponseCode.SUCCESS;
    }

    drawPerks = function (num) {
        var hand = new Array();
        for (var x = 0; x < num; x++) {
            hand.push(this.perkDeck.pop());
        }
        return hand;
    }

    getDateEmbed(user, showFlags) {
        var e = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
        var hand = this.hands.get(user);
        var str = "";
        str += hand[0] + "\n" + hand[1];
        e.addField("The perks of dating " + user.username, str, false);
        if (showFlags) {
            e.addField("Red Flags", this.receivedFlags.get(user), false);
        }
        return e;
    }

    drawFlags(num) {
        var flags = new Array();
        for (var x = 0; x < num; x++) {
            flags.push(this.redFlagDeck.pop());
        }
        return flags;
    }

    grantPoints(user, num) {
        var curScore = this.scoreBoard.scores.get(user);
        if (curScore == undefined) {
            this.scoreBoard.scores.set(user, 1);
        }
        else {
            this.scoreBoard.scores.set(user, curScore + num);
        }
    }

    getScoreBoardEmbed () {
        var scores = this.scoreBoard.scores;
        var str = "";
        var embed = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
        scores.forEach(function (value, key) {
            str += key.username + ": " + value + "\n";
        });
        if (scores.size == 0) {
            str = "No scores recorded yet";
        }
        embed.addField("Scores", str, false);
        return embed;
    };

    onPublicMessage (inputSequence, message, channel, author) {
        switch (this.gameState) {
            case RedFlagState.PREGAME:
                if (message.content == Utils.botPrefix + "round") {
                    this.initialSetup();
                    channel.send(this.round());
                }
                break;
            case RedFlagState.POSTROUND:
                if (message.content == Utils.botPrefix + "round") {
                    channel.send(this.round());
                }
                break;
            case RedFlagState.WAITINGFORDECISION:
                if (this.theSingle == author && message.content.startsWith(Utils.botPrefix + "date")) {
                    if (!inputSequence[1] || message.mentions.users.size == 0) {
                        channel.send("To select your date, `.date <@user>`");
                    }
                    else {
                        var user = message.mentions.users.first();
                        if (user == this.theSingle) {
                            channel.send("As cool as that would be, you can't date yourself.");
                            return;
                        }
                        if (this.theDates.indexOf(user) == -1) {
                            channel.send("They have to actually be playing this game. Nice try.");
                            return;
                        }
                        this.grantPoints(user, 1);
                        channel.send("Point granted to <@" + user.id + "> \n");
                        channel.sendEmbed(this.getScoreBoardEmbed());
                        channel.send("To play another round, say `.round`");
                        this.transitionGameState(RedFlagState.POSTROUND);
                    }
                }
                break;
            case RedFlagState.REVEALINGREDFLAGS:
                if (this.theSingle == author && message.content == Utils.botPrefix + "reveal") {
                    this.revealerPointer = 0;
                    var toReveal = this.theDates[0];
                    var dateStr = "";
                    channel.sendEmbed(this.getDateEmbed(toReveal, true));
                    channel.send("Interesting! " + this.theSingle.username + ", when everyone's weighed in, say `.next` to move along");
                }
                if (this.theSingle == author && message.content == Utils.botPrefix + "next") {
                    this.revealerPointer++;
                    this.revealerPointer = this.revealerPointer % this.theDates.length;
                    if (this.revealerPointer != 0) {
                        var toReveal = this.theDates[this.revealerPointer];
                        channel.sendEmbed(this.getDateEmbed(toReveal, true));
                        channel.send("Interesting... " + this.theSingle.username + ", say `.next` to move along");
                    }
                    else {
                        channel.send("All dates have been revealed.\nNow, time for the final deliberation!");
                        channel.send("Everyone, feel free to lobby The Single for favor.");
                        channel.send("<@" + this.theSingle.id + ">, when you've come to a decision, let the winner know by saying `.date @user`");
                        this.transitionGameState(RedFlagState.WAITINGFORDECISION);
                    }
                }
                break;
            case RedFlagState.REVEALINGPERKS:
                if (this.theSingle == author && message.content == ".next") {
                    this.revealerPointer++;
                    this.revealerPointer = this.revealerPointer % this.theDates.length;
                    if (this.revealerPointer != 0) {
                        this.currentDateRevealer = this.theDates[this.revealerPointer];
                        this.channel.send("Moving to next date: <@" + this.currentDateRevealer.id + ">");
                        var perks = this.receivedPerks.get(this.currentDateRevealer);
                        var perkEmbed = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
                        perkEmbed.addField(this.currentDateRevealer.username + "'s perks", perks[0] + "\n" + perks[1], false);
                        this.channel.sendEmbed(perkEmbed);
                        this.channel.send("<@" + this.theSingle.id + ">, when everyone's weighed in, and you're ready to move on, say `.next`");
                    }
                    else if (this.revealerPointer == 0) {
                        this.transitionGameState(RedFlagState.ACCEPTINGREDFLAGS);
                        this.channel.send("All perks have been revealed! \nNow, dates will choose Red Flags to ruin each others' chances with the desirable " + this.theSingle.username + ".");
                        var me = this;
                        var i = 0;
                        this.theDates.forEach(function (date) {
                            var theNeighbor = me.neighbors.get(date);
                            date.send("You'll be trying to mess up " + theNeighbor.username + "'s date.");
                            date.sendEmbed(me.getDateEmbed(theNeighbor, false));
                            var e = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
                            var index = 1;
                            var flagStr = "";
                            me.flagHands.get(date).forEach(function (card) {
                                flagStr += "\n" + index + ") " + card;
                                index++;
                            });
                            e.addField("Your Red Flag Options \n", flagStr, false);
                            date.sendEmbed(e);
                            date.send("Use the format `.pick 1` to play a Red Flag and ruin " + theNeighbor.username + "'s chances with " + me.theSingle.username + ".");
                        });
                    }
                }
                break;
        }
    };

    onDM(message, DMChannel, author) {
        var content = message.content;
        var sequence = message.content.split(" ").filter(function (elm) {
            return elm != " ";
        });
        if (!content.startsWith(Utils.botPrefix))
            return;
        content = content.replace(Utils.botPrefix, "");
        var me = this;
        switch (this.gameState) {
            case RedFlagState.REVEALINGREDFLAGS:
                break;
            case RedFlagState.REVEALINGPERKS:
                break;
            case RedFlagState.ACCEPTINGREDFLAGS:
                if (author == this.theSingle) {
                    DMChannel.send("Sit tight while The Dates figure out how to ruin each others' chances");
                    return;
                }
                if (!sequence[1]) {
                    DMChannel.send("You need to choose a perk.");
                    return;
                }
                var index = Number.parseInt(sequence[1]) - 1;
                var flagAccepted = this.acceptFlag(author, this.neighbors.get(author), index);
                switch (flagAccepted) {
                    case RedFlagResponseCode.SUCCESS:
                        me.channel.send("Red Flag received from " + author);
                        var neighbor = this.neighbors.get(author);
                        DMChannel.send("Got it. " + neighbor.username + "'s Red Flag is: " + this.receivedFlags.get(neighbor));
                        if (this.checkRedFlagsComplete()) {
                            this.channel.send("All Red Flags have been received.");
                            me.transitionGameState(RedFlagState.REVEALINGREDFLAGS);
                            this.channel.send("<@" + this.theSingle.id + ">, when you're ready to hear what these dates will *really* be like, say `.reveal`");
                        }
                        break;
                    case RedFlagResponseCode.ERR_INDEX_OUT_OF_BOUNDS:
                        DMChannel.send("Sorry, that's out of bounds. :)");
                        break;
                    case RedFlagResponseCode.ERR_ALREADY_HANDED_IN:
                        DMChannel.send("Already got it. You're good!");
                        break;
                    case RedFlagResponseCode.ERR_NAN:
                        DMChannel.send("Sorry, you need to pick a number. I don't sanitize my input, please don't try to kill me .");
                        break;
                }
                break;
            case RedFlagState.ACCEPTINGPERKS:
                if (author == this.theSingle) {
                    DMChannel.send("Sit tight while The Dates figure out how to earn your favor.");
                    return;
                }
                if (!sequence[1] || !sequence[2]) {
                    DMChannel.send("You need to choose 2 perks.");
                    return;
                }
                var indexOne = Number.parseInt(sequence[1]) - 1;
                var indexTwo = Number.parseInt(sequence[2]) - 1;
                var perksAccepted = this.acceptPerks(author, indexOne, indexTwo);
                switch (perksAccepted) {
                    case RedFlagResponseCode.ERR_ALREADY_HANDED_IN:
                        DMChannel.send("Got em. Thanks!");
                        break;
                    case RedFlagResponseCode.ERR_SAME_PICKS:
                        DMChannel.send("Can't pick the same perk twice.");
                        break;
                    case RedFlagResponseCode.ERR_INDEX_OUT_OF_BOUNDS:
                        DMChannel.send("Out of bounds. That's my no-no zone.");
                        break;
                    case RedFlagResponseCode.ERR_NAN:
                        DMChannel.send("Please don't try to kill me with weird inputs. Use `.pick # #`");
                        break;
                    case RedFlagResponseCode.SUCCESS:
                        var hand = this.hands.get(author);
                        var str = "Got it. Your Perks are: ";
                        str += this.hands.get(author)[indexOne] + ", ";
                        str += this.hands.get(author)[indexTwo];
                        DMChannel.send(str);
                        this.channel.send("Perks received from <@" + author.id + ">");
                        if (this.checkPerksComplete() == true) {
                            console.log("somehow it was true here");
                            me.transitionGameState(RedFlagState.REVEALINGPERKS);
                            this.currentDateRevealer = this.theDates[0];
                            var str_1 = "All the lovely dates have submitted their perks! \nNow, we'll learn a little about them."
                                + "\nStarting with... <@" + this.theDates[0].id + ">";
                            this.channel.send(str_1);
                            this.channel.sendEmbed(this.getDateEmbed(this.currentDateRevealer, false));
                            var finalStr = "<@" + this.theSingle.id + ">, when everyone's had a chance to discuss, and you've formed an opinion, say `.next` to hear from your next option";
                            this.channel.send(finalStr);
                        }
                        break;
                }
                break;
        }
    }

    round() {
        var str = "";
        this.currentRound++;
        this.singlePointer = (this.currentRound - 1) % this.players.length;
        this.theSingle = this.players[this.singlePointer];
        this.theDates = new Array();
        this.hands = new Map();
        this.flagHands = new Map();
        this.receivedPerks = new Map();
        this.receivedFlags = new Map();
        this.neighbors = new Map();
        //Set up the date array
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var x = _a[_i];
            console.log(x.username);
            if (x != this.theSingle) {
                this.theDates.push(x);
                this.hands.set(x, this.drawPerks(this.gameTemplate.perkHandSize));
                this.flagHands.set(x, this.drawFlags(this.gameTemplate.redFlagHandSize));
            }
        }
        this.theDates = Utils.shuffle(this.theDates);
        str += "Round " + this.currentRound + "'s lucky single is <@" + this.players[this.singlePointer].id + ">\nThe Dates will now choose their perks.";
        var me = this;
        //Set up the dates array
        var neighborIndex = 0;
        this.theDates.forEach(function (date) {
            var e = new Discord.RichEmbed({ color: Utils.colors.get("theme") });
            var perkIndex = 1;
            var perkStr = "";
            neighborIndex += 1;
            if (neighborIndex == me.theDates.length) {
                neighborIndex = 0;
            }
            me.neighbors.set(date, me.theDates[neighborIndex]);
            me.hands.get(date).forEach(function (card) {
                perkStr += "\n" + perkIndex + ") " + card;
                perkIndex++;
            });
            e.addField("Your Perk Options \n", perkStr, false);
            date.sendEmbed(e);
            date.send("Use the format `.pick 4 2` to choose the two perks " + me.theSingle.username + " would like.");
        });
        this.gameState = RedFlagState.ACCEPTINGPERKS;
        this.theSingle.send("Sit back, relax, and prepare to be woo-ed, you lucky single.");
        return str;
    };

}


