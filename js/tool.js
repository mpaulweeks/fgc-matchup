
function Tool(){

    var self = {};

    self.is_local = window.location.href.indexOf('file:///') > -1;
    self.is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

    self.log = function(message){
        if (self.is_local){
            console.log(message);
        }
    };

    self.visuLog = function(message){
        if (self.is_local){
            $('#log').append(self.format("<p>{1}</p>", message));
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

    self.readUrlParam = function(param_name, as_list){
        as_list = as_list || false;
        var vars = {};
        var q = document.URL.split('?')[1];
        if(q != undefined){
            q = q.split('&');
            for(var i = 0; i < q.length; i++){
                var param = q[i].split('=');
                var name = param[0];
                var value = param[1];
                vars[name] = vars[name] || [];
                vars[name].push(value);
            }
        }
        if (vars.hasOwnProperty(param_name)){
            if (vars[param_name].length == 1 && !as_list){
                return vars[param_name][0];
            }
            return vars[param_name];
        }
        return null;
    };

    return self;
}

var TOOL = Tool();
