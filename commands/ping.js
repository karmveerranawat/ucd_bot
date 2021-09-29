module.exports = {
	name: 'ping',
	description: 'Ping!',
	execute(message, args) {
		client.on('message', message => {
 		 const ping = Math.round(client.ping);
 		 if (message.content === '/ping') {
  		  message.channel.send('**Pong!**').then(message => {
     		  message.edit("**Pong!** 🏓Bot Latency : ``" + ping + "ms``")
    		})
  	}
});		
	},
};
