var composer = require('./composer');
module.exports = { 
  componentWillMount: function() {
    composer(this);
  },
  insert: function(){
    if(arguments[1].getDOMNode){
      this.watch(arguments[0])
        .on('new', this.forceUpdate)
        .on('update', function(constr){
          constr.forceUpdate();
        });
    } else {
      this.watch(arguments[0])
        .on('new', this.forceUpdate)
        .on('update', this.forceUpdate);
    }
    return this.compose.apply(this, arguments);
  }
}
