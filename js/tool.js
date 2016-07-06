
function Tool(){

    var self = {};

    self.is_local = window.location.href.indexOf('file:///') > -1;
    self.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    self.log = function(message){
        if (self.is_local){
            console.log(message);
        }
    }

    self.option = function(value, name){
        name = name || value;
        return '<option value="' + value + '">' + name + '</option>';
    }

    return self;
}

var TOOL = Tool();
