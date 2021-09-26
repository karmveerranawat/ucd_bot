const { google } = require('googleapis')
var query = ""
var trigger = 0;



module.exports = {
	name: 'mark',
	description: 'Marking Attendace on sheet',
	execute(message, args) {
        if(message.member.roles.cache.has("844603723661836339") || message.member.roles.cache.has("844604540640690207")){
                const load = async() => {
                const auth = new google.auth.GoogleAuth({
                    keyFile: "credentials.json",
                    scopes: "https://www.googleapis.com/auth/spreadsheets",
                })

                //client instance of auth
                const client = await auth.getClient()

                //client instance of sheets
                const googleSheets = google.sheets({version: "v4", auth: client})

                const spreadsheetId = "1eysRX5AxZeEMdWx-2gMvwhMUCh7pH2qZTdsTg-7xN4o"

                // //get data
                // const metaData = await googleSheets.spreadsheets.get({
                //     auth,
                //     spreadsheetId,

                // });

                //read data
                // const getRows = await googleSheets.spreadsheets.values.get({
                //     auth,
                //     spreadsheetId,
                // });

                //write data to sheet
                await googleSheets.spreadsheets.values.append({
                    auth,
                    spreadsheetId,
                    range: "Sheet1!A:C",
                    valueInputOption: "USER_ENTERED",
                    resource: {
                        values: [[message.author.username, "present", "25 Aug"]],
                    },

                })

            message.channel.send(`${message.author} your attendance has been marked!`);
            
            }
            load();
        } else {
            message.channel.send(`${message.author}, you are not authorized to run this command! <:ucd_just_pain:857143949017743420> `)
        }
	},
};