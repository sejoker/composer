var composer = require('./composer');
module.exports = { 
  componentWillMount: function() {
    composer(this);
  },
  insert: function(){
    return this.compose.apply(this, arguments);
  }
}
