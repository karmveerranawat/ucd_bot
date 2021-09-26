const fs = require('fs')
const myURL = new URL('/universal/links.json', 'file://ucdupes.org/');
module.exports = {
	name: 'update',
	description: 'Provide links for team page',
	execute(message, args) {
        var data = fs.readFileSync(myURL)
        var load = JSON.parse(data)
        console.log(load)
        message.channel.send("complete!")
	},
};