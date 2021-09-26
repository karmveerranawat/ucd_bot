const { Client } = require("@notionhq/client")
const dotenv = require("dotenv")
dotenv.config()

const webhook_url=process.env.DISCORD_WEBHOOK_URL;
const notion = new Client({ 
    auth: process.env.NOTION_KEY 
})

let prevTodos = [
    {
        id: "1625f81b-78cf-49bf-8046-62bbbe3bd6d7",
        text: "Offer Letter",
        checked: "false"
    },
    {
        id: "68848740-4407-4fde-a69e-44ce534f9755",
        text: "Welcome Freshers Reel and Poster",
        checked: "false"
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
                            type: "Status Update",
                            prevTitle: currentTodo.text,
                            newTitle: latesTodo.text
                        }
                    ]
                } else {
                    return acc;
                }
            }, []);

            return {
                titleChange
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

            if(prevTodos){
                const diff = differ(prevTodos, todos);
                console.log(diff);
                prevTodos=todos;
            }
            //message.channel.send(JSON.stringify(allBlocks.results.filter(b => b.type === "to_do")));
            //message.channel.send(JSON.stringify(todos));
            message.channel.send(exampleEmbed);
            console.log(todos);
        })()


    },
};        
