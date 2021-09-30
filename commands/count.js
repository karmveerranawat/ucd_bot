const dotenv = require("dotenv")
dotenv.config()
const mysql = require('mysql')
var query = ""
var trigger = 0;
module.exports = {
	name: 'count',
	description: 'Provide Reason for not attending meeting',
	execute(message, args) {
        if(message.member.roles.cache.has("844603723661836339") || message.member.roles.cache.has("844605032741076992")){
                const pool = mysql.createPool({
                    host: process.env.DB_HOST,
                    user: process.env.REGISTRATION_TABLE_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.REGISTRATION_TABLE_NAME
                })

                const pool2 = mysql.createPool({
                    host: process.env.DB_HOST,
                    user: process.env.EVENTS_TABLE_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.EVENTS_TABLE_NAME
                })

                if(!args.length){
                    query = "SELECT COUNT(DISTINCT(email)) AS count FROM `core_team_reg_21` WHERE pno != ''"
                } else if(args[0] == "tech" || args[0] == "t"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='technical'"
                }else if(args[0] == "design" || args[0] == "d"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='design'"
                }else if(args[0] == "pr"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='pr'"
                }else if(args[0] == "event" || args[0] == "eve"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='events'"
                } else if(args[0] == "creative" || args[0] == "cr"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='creative'"
                } else if(args[0] == "editorial" || args[0] == "e"){
                    query = "SELECT COUNT(*) AS count from core_team_reg_21 where pref1='editorial'"
                } else if(args[0] == "talks"){
                    query = "SELECT COUNT(*) AS count from tech_talk"
                    trigger = 1;
                } else if(args[0] == "bgmi"){
                    message.channel.send("BGMI registrations are closed , the final count is 36");
                    trigger = 1;
                } else {
                    message.channel.send(`breh wrong arguement ${message.author}`);
                    trigger++
                }

                if(trigger == 0){
                    pool.getConnection((err, connection) => {
                    if(err) throw err
                    connection.query(query, (err, rows) =>{
                        connection.release()
                            if(!err){
                                // const res = JSON.stringify(rows)
                                // var parsed = JSON.parse(res);
                                message.channel.send(rows[0].count);
                            } else{
                                console.log(err)
                            }
                        })
                    })
                } else if(trigger == 1){
                    trigger = 0;
                    pool2.getConnection((err, connection) => {
                    if(err) throw err
                    connection.query(query, (err, rows) =>{
                        connection.release()
                            if(!err){
                                // const res = JSON.stringify(rows)
                                // var parsed = JSON.parse(res);
                                message.channel.send(rows[0].count);
                            } else{
                                console.log(err)
                            }
                        })
                    })
                } else {
                    trigger = 0;
                }
        }  else{
            message.channel.send(`${message.author} you are no longer authorized to use this cmd <:ucd_dead:856192103512408064>`)
        }
        
	},
};