define(function(){
  return {
    load: function(name, require, load){
      require([name], function(result){
        if (result.then){
          result.then(function() {
            load.apply(null, arguments);
          }, function() {
            load.error.apply(null, arguments);
          });
        } else {
          load(result);
        }
      });
    }
  };
});

//# sourceURL=promised.js