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
  public static padLength:number = 14
  public static botPrefix:string = "."

  public static colors:Map<string, number> = new Map([
    ["theme",0x00FF00],
    ["tej", 0xEB1D89]
  ])

  public static delays:Map<string,number> = new Map([
    ["short", 2000],
    ["medium", 4000]
  ])

  //Everybody do the knuth shuffle
  public static shuffle(array){
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
    
  public static code(string){
    return "```" + string + "```"
  } 

  public static bold(string){
    return "**" + string + "**"
  }

  // right padding s with c to a total of n chars taken from 
  //https://eureka.ykyuen.info/2011/08/23/javascript-leftright-pad-a-string/
  public static pad_r(s, c) {
  if (! s || ! c || s.length >= Utils.padLength) {
    return s;
  }
  var max = (Utils.padLength - s.length)/c.length;
  for (var i = 0; i < max; i++) {
    s += c;
  }
    return s;
  }
}