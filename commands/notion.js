const { Client } = require("@notionhq/client")
const axios = require('axios');
const dotenv = require("dotenv")

dotenv.config()

const webhook_url=process.env.DISCORD_WEBHOOK_URL;
const notion = new Client({ 
    auth: process.env.NOTION_KEY 
})

let trigger  = 0;
let prevTodos = [
    {
        id: "1625f81b-78cf-49bf-8046-62bbbe3bd6d7",
        text: "Offer Letter",
        checked: true
    },
    {
        id: "68848740-4407-4fde-a69e-44ce534f9755",
        text: "Welcome Freshers Reel and Poste",
        checked: false
    }
];

const blockPayloadGen = {
    path: "blocks/874ca5ac-2fbc-4dbf-9c05-828535214764/children",
    method: "GET",
    body: {
       
    }
};

module.exports = {
	name: 'notion',
	description: 'Notion Api',
	execute(message, args, Discord) {
        const exampleEmbed = new Discord.MessageEmbed();
        exampleEmbed.setColor('#0099ff')
        .setTitle('Notion Todos')
        .setURL('https://ucdupes.org/');

        const differ = (prev, curr) => {
            const titleChange = prev.reduce((acc, currentTodo) => {
                const latesTodo = curr.find(item => item.id === currentTodo.id)
                if(latesTodo.text !== currentTodo.text){
                    return [
                        ...acc,
                        {
                            type: "ToDo Title Update",
                            prevTitle: currentTodo.text,
                            newTitle: latesTodo.text
                        }
                    ]
                } else {
                    return acc;
                }
            }, []);

            const statusChange = prev.reduce((acc, currentTodo) => {
                const latesTodo = curr.find(item => item.id === currentTodo.id)
                if(latesTodo.checked !== currentTodo.checked){
                    return [
                        ...acc,
                        {
                            type: "ToDo Status Update",
                            title: currentTodo.text,
                            prevStatus: currentTodo.checked,
                            newStatus: latesTodo.checked
                        }
                    ]
                } else {
                    return acc;
                }
            }, []);

            const delTodo = prev.reduce((acc, currentTodo) => {
                if(!curr.find(item => item.id === currentTodo.id)){
                    return [
                        ...acc,
                        {
                            type: "ToDo Delete Update",
                            title: currentTodo.text,
                            status: currentTodo.status
                        }
                    ]
                } else {
                    return acc;
                }
            }, []);

            const todoCreate = curr.reduce((acc, currentTodo) => {
                if(!prev.find(item => item.id === currentTodo.id)){
                    return [
                        ...acc,
                        {
                            type: "ToDo Created Update",
                            newTitle: currentTodo.text,
                            newStatus: currentTodo.status
                        }
                    ]
                } else {
                    return acc;
                }
            }, []);

            return {
                titleChange,
                statusChange,
                delTodo,
                todoCreate
            };
        };

        (async() => {
            const allBlocks = await notion.request(blockPayloadGen);
            const todos = allBlocks.results
            .filter(b => b.type === "to_do")
            .map(todo => ({
                text: todo.to_do.text[0].plain_text,
                checked: todo.to_do.checked,
                id: todo.id
            }));


            let emote = "";
            todos.forEach(element => {
                if(element.checked == true){
                    emote = "<:ucd_stonks:845339516671623178>";
                } else {
                    emote = "<:ucd_stinks:845339515135721534>";
                }
                exampleEmbed.addFields(
                    { 
                        name: 'Task ID '+element.id,
                        value: "```"+element.text+" \n"+element.checked+"```"+emote
                    }
                )
                // exampleEmbed.addField('Refferal', element.refferal,true);
                // exampleEmbed.addField('Count', element.count);
            });

            if(trigger  == 0){
                trigger = 1;
                prevTodos=todos;
            } else {
                const diff = differ(prevTodos, todos);
                if(diff.titleChange.length){
                    axios.post(process.env.DISCORD_WEBHOOK_URL,
                    {
                        embeds: [{
                            "title": diff.titleChange[0].type,
                            "color": "14177041",
                            "description": "",
                            "fields": [
                                {
                                    name: "Previous Title : ",
                                    value: "```"+diff.titleChange[0].prevTitle+"```"
                                },
                                {
                                    name: "New Title : ",
                                    value: "```"+diff.titleChange[0].newTitle+"```"
                                }
                            ]
                        }]
                    },
                    {
                        Headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                }

                if(diff.statusChange.length){
                    axios.post(process.env.DISCORD_WEBHOOK_URL,
                    {
                        embeds: [{
                            "title": diff.statusChange[0].type,
                            "color": "1127128",
                            "description": "```"+diff.statusChange[0].title+"```",
                            "fields": [
                                {
                                    name: "Previous Status",
                                    value: "```"+diff.statusChange[0].prevStatus+"```"
                                },
                                {
                                    name: "New Status",
                                    value: "```"+diff.statusChange[0].newStatus+"```"
                                }                                
                        ]
                        }]
                    },
                    {
                        Headers: {
                            'Content-Type': 'application/json'
                        },
                    })
                }

                // if(diff.titleChange.length){
                //     axios.post(process.env.DISCORD_WEBHOOK_URL,
                //     {
                //         embeds: [{
                //             "title": diff.titleChange[0].type,
                //             "description": "```"+"Previous Title: "+diff.titleChange[0].prevTitle+" \n"+"New Title: "+diff.titleChange[0].newTitle+"```",
                //             "Color": "green"
                //         }]
                //     },
                //     {
                //         Headers: {
                //             'Content-Type': 'application/json'
                //         },
                //     })
                // }

                // if(diff.titleChange.length){
                //     axios.post(process.env.DISCORD_WEBHOOK_URL,
                //     {
                //         embeds: [{
                //             "title": diff.titleChange[0].type,
                //             "description": "```"+"Previous Title: "+diff.titleChange[0].prevTitle+" \n"+"New Title: "+diff.titleChange[0].newTitle+"```",
                //             "Color": "green"
                //         }]
                //     },
                //     {
                //         Headers: {
                //             'Content-Type': 'application/json'
                //         },
                //     })
                // }
                console.log(diff);
                
                prevTodos=todos;
            }
            //message.channel.send(JSON.stringify(allBlocks.results.filter(b => b.type === "to_do")));
            //message.channel.send(JSON.stringify(todos));
            message.channel.send("cmd ran noicely");
        })()


    },
};        
