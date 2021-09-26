var fs = require('fs');
const status = require("./../globals/cmd_status_check");
var cmd;

module.exports = {
	name: 'enable',
	description: 'enabling commands',
	execute(message, args) {

        if(!status(args)){
            message.channel.send(`${message.author} , Command is already enabled! <:ucd_cringe:849590578249203742>`);
        } else{
            cmd = args[0]
            var temp_status = JSON.parse(fs.readFileSync("commands_status.json", 'utf-8'))
            temp_status[cmd] = false;
            fs.writeFileSync("commands_status.json", JSON.stringify(temp_status));
            message.channel.send(`${message.author} , Command has been enabled now! <:ucd_stonks:845339516671623178>`);
        }

        //fs.writeFileSync('commands_status.json', JSON.stringify(data), 'utf8');
        
	},
};