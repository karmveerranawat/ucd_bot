module.exports = {
    name: 'leave',
    description: 'stop the bot and leave the channel',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send(" <:ucd_oye:845339542743547914>  You need to be in voice channel to stop music!");
        await voiceChannel.leave();
        await message.channel.send('Leaving channel <:ucd_exit:849588746855776286> ')
    }
}

//test phase 1