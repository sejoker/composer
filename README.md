composer
========
Usage example:


layout.jsx
```javascript
module.exports = React.createClass({
  mixins: [require('composer').mixin],
  render: function(){
    return <div>
      {this.insert('nav-bar')}
      <div className="content">
        {this.insert('content')}
      </div>
    </div>
  }
});
```
route
```javascript
var composer = require('./composer')();
var Landing = require('./comps/Landing');
var Navbar = require('./comps/Navbar');
var Layout = require('./comps/Layout');

module.exports = function(app){
  composer.compose('layout', Layout);
  composer.compose('nav-bar', Navbar);
  composer.compose('content', Landing);
  app.render();
  
  app.route('', function(next){
    composer.compose('content', Landing)
    app.render();
  })
  app.route('login', function(next){
    composer.compose('content', Landing, {user: UserModel, name: UserModel.get('name')})
    app.render();
  })
  return app;
}
```
