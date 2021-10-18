const Discord = require("discord.js");
//const {token} = require('./config.json');
const dotenv = require("dotenv");
const fs = require("fs");
const Imap = require("node-imap");
const inspect = require("util").inspect;
const { resolve } = require("path");
const { exit } = require("process");
const prefix = ".";
const status = require("./globals/cmd_status_check");
const { channel } = require("diagnostics_channel");


dotenv.config();
const token = process.env.TOKEN;
const client = new Discord.Client();
client.commands = new Discord.Collection();
var temp_cmds;


const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

client.once("ready", () => {
  client.commands.get("notion").execute(Discord);
  console.log("UCD bot online");
  client.user.setPresence({
    activity: {
      name: "UPCOMING TECH TALK",
      type: "WATCHING",
    },
    status: "online",
  });
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "ping") {
    if (!status(command))
      return message.channel.send(
        `<:ucd_rage:872884631328948234> This command is disabled in server, ${message.author}! `
      );
    client.commands.get("ping").execute(message, args);
  } else if (command === "leave-reason") {
    if (!args.length)
      return message.channel.send(
        `Please provide a reason for your leave, ${message.author}!`
      );
    client.commands.get("leave-reason").execute(message, args);
  } else if (command === "count" || command === "c") {
    temp_cmds = "count";
    if (status(temp_cmds))
      return message.channel.send(
        `<:ucd_rage:872884631328948234> This command is disabled in server, ${message.author}! `
      );
    client.commands.get("count").execute(message, args);
  } else if (command === "ref") {
    if (status(command) == true)
      return message.channel.send(
        `<:ucd_rage:872884631328948234> This command is disabled in server, ${message.author}! `
      );
    client.commands.get("ref").execute(message, args, Discord);
  } else if (command === "send-mail") {
    client.commands.get("send-mail").execute(message, args);
  } else if (command === "mark") {
    if (status(command) == true)
      return message.channel.send(
        `<:ucd_rage:872884631328948234> This command is disabled in server, ${message.author}! `
      );
    client.commands.get("mark").execute(message, args);
  } else if (command === "update") {
    client.commands.get("update").execute(message, args);
  } else if (command === "join") {
    // client.commands.get('update').execute(message, args);
    message.channel.send("soon <:ucd_evil_racoon:845339340024578069>");
  } else if (command === "disable") {
    if (!message.member.roles.cache.has("844600000461012993"))
      return message.channel.send(
        `This is Admin only command <:ucd_badelog:856192103629062185> `
      );
    if (!args.length)
      return message.channel.send(
        `<:ucd_saste_nashe:845329317071683644> Atleast specify what to disable, ${message.author}! `
      );
    client.commands.get("disable").execute(message, args);
  } else if (command === "enable") {
    if (!message.member.roles.cache.has("844600000461012993"))
      return message.channel.send(
        `This is Admin only command <:ucd_badelog:856192103629062185> `
      );
    if (!args.length)
      return message.channel.send(
        `<:ucd_saste_nashe:845329317071683644> Atleast specify what to enable, ${message.author}! `
      );
    client.commands.get("enable").execute(message, args);
  } else if (command === "notion") {
    // if(!message.member.roles.cache.has("844600000461012993")) return message.channel.send(`This is Admin only command <:ucd_badelog:856192103629062185> `);
    // if (!args.length) return message.channel.send(`<:ucd_saste_nashe:845329317071683644> Atleast specify what to enable, ${message.author}! `);
    client.commands.get("notion").execute(message, args, Discord);
  } else if (command === "discord") {
    message.channel.send("UCD DISCORD LINK : https://ucdupes.org/discord");
  } else if (command === "shutdown") {
    if (!message.member.roles.cache.has("844600000461012993"))
      return message.channel.send(
        `This is Admin only command <:ucd_badelog:856192103629062185> `
      );
    timeinMS = 500;
    delay(timeinMS, exit());
    async function delay(timeinMS) {
      await new Promise((resolve) => setTimeout(resolve, timeinMS));
    }
    message.channel.send("done! will there be anything else ?");
  } else if (command === "botdev") {
    message.channel.send("<:ucd_lesgo:845329319920402472>Bot Developer: @cyberwizard#7831 , @Aayushi Singh#5570 and @Pankaj🦅#3376");
  } else if (command === "help"){
    message.channel.send("Pre fix ```.``` ");
  }
});

// const OLDMAILS = new Map();

// const imap = new Imap({
//     user: "",
//     password: "",
//     host: "",
//     port: "",
//     tls: ""
// })

// function openInbox(callback){
//     imap.openBox("INBOX", true, callback)
// }

// function sendNewest(){

// }

// imap.on("ready", async function(){
//     while(1 !== 0){
//         console.log("Fetching Mails...")
//         await sendNewest()
//         await delay(1*60*1000)
//     }
// })

// imap.connect()
// function delay(delayInMS){
//     return new Promise(resolve =>{
//         setTimeout(()=>{
//             resolve(2)
//         }, delayInMS)
//     })
// }

client.login(token);
