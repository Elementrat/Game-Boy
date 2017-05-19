export enum ResponseCode{
    SUCCESS,
    FAILURE,
    ERR_ALREADY_EXISTS,
    ERR_CHANNEL_ALREADY_HAS_GAME,
    ERR_GAME_INSTANCE_DOESNT_EXIST,
    ERR_GAME_TEMPLATE_DOESNT_EXIST,
    ERR_PLAYER_ALREADY_JOINED,
    ERR_NOT_ENOUGH_PLAYERS,
    ERR_GAME_ALREADY_STARTED
}

export class Utils{
  padLength: number
  colors:Map<string, number>
  delays:Map<string,number>
  botPrefix:string

  constructor(){
    this.padLength = 14
    this.botPrefix = "."
    this.colors = new Map<string, number>()
    this.colors.set("theme", 0x00FF00)
    this.colors.set("tej", 0xEB1D89)

    this.delays = new Map<string, number>()
    this.delays.set("short", 2000)
    this.delays.set("medium", 4000)
  }

  public shuffle(array){
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
    
  public code(string){
    return "```" + string + "```"
  } 

  public bold(string){
    return "**" + string + "**"
  }

  // right padding s with c to a total of n chars taken from 
  //https://eureka.ykyuen.info/2011/08/23/javascript-leftright-pad-a-string/
  public pad_r(s, c) {
  if (! s || ! c || s.length >= this.padLength) {
    return s;
  }
  var max = (this.padLength - s.length)/c.length;
  for (var i = 0; i < max; i++) {
    s += c;
  }
    return s;
  }

}