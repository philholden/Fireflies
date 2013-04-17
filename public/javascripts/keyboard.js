 /**
 * Translates key presses into joystick state where
 * where up, down, left and right are true or false 
 */

function Keyboard() {
  var k = this;

  //keycodes corrosponding to up, down left and right
  k.trans = {
    "37":"l", 
    "38":"u",
    "39":"r",
    "40":"d"
  };
  
  //state object exposes current joystick state
  k.state = {
    "u":false,
    "d":false,
    "l":false,
    "r":false
  }
  
  /**
   * to be called on keyUp listener updates state object
   * returns lower case letter representing direction released 
   * @param  {number} key keycode
   * @return {string}     u d l r or false if key not a direction
   */
  k.keyUp = function(key) {
    key = k.trans[key];
    if(key) {
      if(k.state[key]) {
        k.state[key]=false;
        return key;
      }
      return false;
    }
  };

  /**
   * to be called on keyDown listener updates state object
   * returns upper case letter representing direction pressed
   * @param  {number} key keycode
   * @return {string}     U L R D or false if key not a direction
   */
  k.keyDown = function(key) {
    key = k.trans[key];
    if(key) {
      if(!k.state[key]) {
        k.state[key]=true;
        return key.toUpperCase();
      }
      return false;
    }
  };
}
