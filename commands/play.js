const ytdl = require('ytdl-core');
const ytSearch = require('yt-Search');
const { query } = require('express');

module.exports = {
    name: 'play',
    description: 'join and play song from Youtube',
    async execute(message, args){
        const voiceChannel = message.member.voice.channel;

        if(!voiceChannel) return message.channel.send('Please join voice channel to execute this command!');

        const permissions = voiceChannel.permissionsFor(message.client.user);
        if(!permissions.has('CONNECT')) return message.channel.send('You do not have the correct permissions');
        if(!permissions.has('SPEAK')) return message.channel.send('You do not have the correct permissions');
        if(!args.length) return message.channel.send('You need to send the second argument!');
    
        const connection = await voiceChannel.join();

        const videoFinder = async (query) => {
            const videoResult = await ytSearch(query);

            return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
        }

        const video = await videoFinder(args.join(' '));
        
        if(video){
            const stream = ytdl(video.url, {filter: 'audioonly'});
            connection.play(stream, {seek: 0, volume: 40})
            .on('finish', () =>{
                voiceChannel.leave();
            });

            await message.reply(`:thumbsup: Now Playing ***${video.title}***`)
        } else{
            message.channel.send('No Video Result Found');
        }
    }
}