// const { save } = require('../firestoreClient');
// const firestoreClient = require('../firestoreClient');
// const FirestoreClient = require('../firestoreClient');

// module.exports = {
// 	name: 'point',
// 	description: 'Managing point system',
// 	execute(message, args) {
//         if(!args.length){
//             return message.channel.send(`You didn't provide any operation to perform, ${message.author}!`);
//         } else if(args[0] === '+'){
//             score='+1'
//         } else if(args[0] === '-') {
//             score='-1'
//         } else {
//             message.channel.send(`Invalid operation provided ${message.author}`);
//         }
//         const record = {
//             name: message.author.username,
//             //reason: args.toString(),
//             point: score
//         };

//         // const saveSubCollection = async() => {
//         //     await FirestoreClient.saveSubCollection('leave-reason', record.meetingDate, 'record', record);
//         // }
//         // saveSubCollection();
//         const save = async() => {
//             await FirestoreClient.save('points', record);
//         }
//         save();
//         message.channel.send(`${message.author} Leave Reason Recorded`);
// 	},
// };