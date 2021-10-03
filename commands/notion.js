const { Client } = require("@notionhq/client");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const webhook_url = process.env.DISCORD_WEBHOOK_URL;
const notion = new Client({
  auth: process.env.NOTION_KEY,
});

let trigger = 0;
let time = 30000;
let prevTodos = [
  {
    id: "1625f81b-78cf-49bf-8046-62bbbe3bd6d7",
    text: "Offer Letter",
    checked: true,
  },
  {
    id: "68848740-4407-4fde-a69e-44ce534f9755",
    text: "Welcome Freshers Reel and Poste",
    checked: false,
  },
];

const blockPayloadGen = {
  path: "blocks/874ca5ac-2fbc-4dbf-9c05-828535214764/children",
  method: "GET",
  body: {},
};

module.exports = {
  name: "notion",
  description: "Notion Api",
  execute(Discord) {
    console.log(
      "Notion Pulls Have been started Succesfully , it will run every 30 seconds"
    );
    setInterval(() => {
      const exampleEmbed = new Discord.MessageEmbed();
      exampleEmbed
        .setColor("#0099ff")
        .setTitle("Notion Todos")
        .setURL("https://ucdupes.org/");

      const differ = (prev, curr) => {
        const delTodo = prev.reduce((acc, currentTodo) => {
          if (!curr.find((item) => item.id === currentTodo.id)) {
            return [
              ...acc,
              {
                title: "ToDo Delete Update",
                color: "1127128",
                description: "",
                fields: [
                  {
                    name: "~~Deleted Todo's Title~~",
                    value: "~~```" + currentTodo.text + "```~~",
                  },
                  {
                    name: "~~Deleted Todo's Status~~",
                    value: "~~```" + currentTodo.status + "```~~",
                  },
                ],
              },
            ];
          } else {
            return acc;
          }
        }, []);

        const todoCreate = curr.reduce((acc, currentTodo) => {
          if (!prev.find((item) => item.id === currentTodo.id)) {
            return [
              ...acc,
              {
                title: "New ToDo Added",
                color: "1127128",
                description: "",
                fields: [
                  {
                    name: "New Todo's Title",
                    value: "```" + currentTodo.text + "```",
                  },
                  {
                    name: "New Todo's Status",
                    value: "```" + currentTodo.status + "```",
                  },
                ],
              },
            ];
          } else {
            return acc;
          }
        }, []);

        const titleChange = prev.reduce((acc, currentTodo) => {
          const latesTodo = curr.find((item) => item.id === currentTodo.id);
          if (latesTodo == undefined) {
            return acc;
          } else if (latesTodo.text !== currentTodo.text) {
            return [
              ...acc,
              {
                title: "ToDo Title Update",
                color: "14177041",
                description: "",
                fields: [
                  {
                    name: "Previous Title : ",
                    value: "```" + currentTodo.text + "```",
                  },
                  {
                    name: "New Title : ",
                    value: "```" + latesTodo.text + "```",
                  },
                ],
              },
            ];
          } else {
            return acc;
          }
        }, []);

        const statusChange = prev.reduce((acc, currentTodo) => {
          const latesTodo = curr.find((item) => item.id === currentTodo.id);
          if (latesTodo == undefined) {
            return acc;
          } else if (latesTodo.checked !== currentTodo.checked) {
            return [
              ...acc,
              {
                title: "ToDo Status Update",
                color: "1127128",
                description: "```" + currentTodo.text + "```",
                fields: [
                  {
                    name: "Previous Status",
                    value: "```" + currentTodo.checked + "```",
                  },
                  {
                    name: "New Status",
                    value: "```" + latesTodo.checked + "```",
                  },
                ],
              },
            ];
          } else {
            return acc;
          }
        }, []);

        return {
          titleChange,
          statusChange,
          delTodo,
          todoCreate,
        };
      };

      (async () => {
        const allBlocks = await notion.request(blockPayloadGen);
        const todos = allBlocks.results
          .filter((b) => b.type === "to_do")
          .map((todo) => ({
            text: todo.to_do.text[0].plain_text,
            checked: todo.to_do.checked,
            id: todo.id,
          }));

        // todos.forEach(element => {
        //     exampleEmbed.addFields(
        //         {
        //             name: 'Task ID '+element.id,
        //             value: "```"+element.text+" \n"+element.checked+"```"+emote
        //         }
        //     )
        //     // exampleEmbed.addField('Refferal', element.refferal,true);
        //     // exampleEmbed.addField('Count', element.count);
        // });

        if (trigger == 0) {
          trigger = 1;
          prevTodos = todos;
        } else {
          const diff = differ(prevTodos, todos);
          if (diff.titleChange.length) {
            axios.post(
              process.env.DISCORD_WEBHOOK_URL,
              {
                embeds: diff.titleChange,
              },
              {
                Headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          if (diff.statusChange.length) {
            axios.post(
              process.env.DISCORD_WEBHOOK_URL,
              {
                embeds: diff.statusChange,
              },
              {
                Headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          if (diff.delTodo.length) {
            axios.post(
              process.env.DISCORD_WEBHOOK_URL,
              {
                embeds: diff.delTodo,
              },
              {
                Headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }

          if (diff.todoCreate.length) {
            axios.post(
              process.env.DISCORD_WEBHOOK_URL,
              {
                embeds: diff.todoCreate,
              },
              {
                Headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }
          console.log(diff);
          prevTodos = todos;
        }
        //message.channel.send(JSON.stringify(allBlocks.results.filter(b => b.type === "to_do")));
        //message.channel.send(JSON.stringify(todos));
      })();
    }, time);
  },
};
