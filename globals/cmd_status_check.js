var fs = require('fs');
var cmd;

const status = (args) => {
        cmd = args
        var temp_status = JSON.parse(fs.readFileSync("commands_status.json", 'utf-8'))
        if(temp_status[cmd]){
            return true;
        } else{
            return false;
        }
    }

module.exports = status;    