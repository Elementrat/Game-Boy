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

export class Formatter{
  padLength: number

  constructor(){
    this.padLength = 14
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