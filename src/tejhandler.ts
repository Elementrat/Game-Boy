import Discord = require("discord.js")

let thugs = new Map<string, string>()

thugs.set("tej", "192841484939165696")
thugs.set("gameboy", "313847241557409792")
thugs.set("haxo", "178326606283145217")

export class TejHandler {
    onMessage(inputSequence :Array<string>, message : Discord.Message, channel, author :Discord.User) {

        if (author.id == thugs.get("gameboy"))
            return

        if (author.id == thugs.get("haxo")) {

        }

        if (author.id == thugs.get("tej")) {

            var tejMoj = message.guild.emojis.array()
            //var hunned = "💯"

            tejMoj = tejMoj.filter(function (emoj) {
                return emoj.name == 'tej'
            })

            //the tej react exists on this server
            if (tejMoj.length != 0) {
                var tejReact = tejMoj[0]

                //Give it the tej react based on a 1/10 chance
                var rand = Math.random();

                console.log(rand)
                if (rand < .1) {
                    message.react(tejReact)
                    //message.react("💯")
                }
            }
        }

        for (var mention of message.mentions.users.array()) {

            //THIS MESSAGE MENTIONS TEJ
            if (mention.id == thugs.get("tej")) {

            }
        }

    }
}