
function Tool(){

    var self = {};

    self.is_local = window.location.href.indexOf('file:///') > -1;
    self.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    self.log = function(message){
        if (self.is_local){
            console.log(message);
        }
    };

    self.option = function(value, name){
        name = name || value;
        return '<option value="' + value + '">' + name + '</option>';
    };

    self.sort = function(arr) {
        return arr.concat().sort();
    };


    self.format = function(str) {
        var args = arguments;
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };

    return self;
}

var TOOL = Tool();
