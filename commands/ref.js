const dotenv = require("dotenv")
dotenv.config()
const mysql = require('mysql')
var query = ""
module.exports = {
	name: 'ref',
	description: 'Check Refferals!',
	execute(message, args, Discord) {
		if(message.member.roles.cache.has("844603723661836339") || message.member.roles.cache.has("844604540640690207")){

                const pool = mysql.createPool({
                    host: process.env.DB_HOST,
                    user: process.env.EVENTS_TABLE_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.EVENTS_TABLE_NAME
                })

            
                query = "SELECT COUNT(*) AS count, refferal from bgmi where payment_status='complete' GROUP BY refferal"
                

                pool.getConnection((err, connection) => {
                if(err) throw err
                connection.query(query, (err, rows) =>{
                    connection.release()
                        if(!err){
                            // const res = JSON.stringify(rows)
                            // var parsed = JSON.parse(res);
                            const exampleEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('BGMI Refferals')
                                .setURL('https://ucdupes.org/')
                                //.setAuthor('TechTeam', 'https://ucdupes.org/img/logo.png', 'https:ucdupes.org')
                                .setThumbnail('https://ucdupes.org/img/logo.png')
                                // .addFields(
                                //     { name: 'Regular field title', value: 'Some value here' },
                                //     { name: '\u200B', value: '\u200B' },
                                //     { name: 'Inline field title', value: 'Some value here', inline: true },
                                //     { name: 'Inline field title', value: 'Some value here', inline: true },
                                // )
                                .setTimestamp();
                                //.setFooter('New feature coming soon', 'https://ucdupes.org/img/logo.png');

                            rows.forEach(element => {
                                exampleEmbed.addFields(
                                    { name: 'Refferal', value: element.refferal },
                                    { name: 'Count', value: element.count, inline: true },
                                )
                                // exampleEmbed.addField('Refferal', element.refferal,true);
                                // exampleEmbed.addField('Count', element.count);
                            });

                            message.channel.send(exampleEmbed);

                        } else{
                            console.log(err)
                        }
                    })
                })
                
        }  else{
            message.channel.send(`${message.author} you are no longer authorized to use this cmd <:ucd_dead:856192103512408064>`)
        }
	},
};