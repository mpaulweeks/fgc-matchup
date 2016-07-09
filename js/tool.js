
var TOOL = (function(){
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

    self.sort = function(arr) {
        return arr.concat().sort();
    };

    self.sortById = function(arr) {
        return arr.concat().sort(function (item1, item2){
            return item1.id > item2.id;
        });
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

    // view stuff

    self.fixValue = function(rawValue){
        // todo cover more edge cases
        return rawValue.replace(' ', '_');
    };

    var optionHTML = '<option value="{1}">{2}</option>';
    self.option = function(item){
        return self.format(optionHTML, item.id, item.name);
    };

    var internalLinkHTML = '<a class="internal {1}" href="javascript:void(0)" data-value="{2}">{3}</a>';
    self.internalLink = function(cssClass, value, name){
        name = name || value;
        return self.format(internalLinkHTML, cssClass, self.fixValue(value), name);
    };

    return self;
})();
