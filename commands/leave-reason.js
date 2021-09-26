const { save } = require('../firestoreClient');
const firestoreClient = require('../firestoreClient');
const FirestoreClient = require('../firestoreClient');

module.exports = {
	name: 'leave-reason',
	description: 'Provide Reason for not attending meeting',
	execute(message, args) {
        const record = {
            name: message.author.username,
            reason: args.toString(),
            meetingDate: '01-01-01'
        };

        const saveSubCollection = async() => {
            await FirestoreClient.saveSubCollection('leave-reason', record.meetingDate, 'record', record);
        }
        saveSubCollection();
        // const save = async() => {
        //     await FirestoreClient.save('leave-reason', record);
        // }
        // save();
        message.channel.send(`${message.author} Leave Reason Recorded`);
	},
};