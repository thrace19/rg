const Discord = require('discord.js');
const prefix = "++";
const botconfig = require("./botconfig.json");
const ms = require("ms");

const bot = new Discord.Client({disableEveryone: true});

bot.on("ready", async () => {
  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity(`++help | ${bot.guilds.size} GUILDS` , {type: "STREAMING"});
});

bot.on("message", async message => {
  if(message.author.bot) return;
  if(message.channel.type === "dm") return;

  let prefix = botconfig.prefix;
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  bot.on('guildMemberAdd', member => {
      let channel = member.guild.channels.find('name', 'welcome');
      let memberavatar = member.user.avatarURL
          if (!channel) return;
          let embed = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setThumbnail(memberavatar)
          .addField(':bust_in_silhouette: | name : ', `${member}`)
          .addField(':microphone2: | Welcome!', `Welcome to the server, ${member}`)
          .addField(':id: | User :', "**[" + `${member.id}` + "]**")
          .addField(':family_mwgb: | Your are the member', `${member.guild.memberCount}`)
          .addField("Name", `<@` + `${member.id}` + `>`, true)
          .addField('Server', `${member.guild.name}`, true )
          .setFooter(`**${member.guild.name}**`)
          .setTimestamp()

          channel.sendEmbed(embed);
  });

  bot.on('guildMemberRemove', member => {
      let channel = member.guild.channels.find('name', 'leave');
      let memberavatar = member.user.avatarURL
          if (!channel) return;
          let embed = new Discord.RichEmbed()
          .setColor('RANDOM')
          .setThumbnail(memberavatar)
          .addField('Name:', `${member}`)
          .addField('Has Let the Server', ';(')
          .addField('Bye Bye :(', 'We will all miss you!')
          .addField('The server now as', `${member.guild.memberCount}` + " members")
          .setFooter(`**${member.guild.name}`)
          .setTimestamp()

          channel.sendEmbed(embed);
  });
    bot.on("guildCreate", guild => {
      const channel = member.guild.channels.find('name', 'welcome');
      if (!channel) return;
      channel.send('Thanks for adding me!:wave:');
  })
    if(cmd === `${prefix}tempmute`){
      let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if(!tomute) return message.reply("Couldn't find user.");
      if(tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can't mute them!");
      let muterole = message.guild.roles.find(`name`, "muted");
      if(!muterole){
        try{
          muterole = await message.guild.createRole({
            name: "muted",
            color: "RANDOM",
            permissions:[]
          })
          message.guild.channels.forEach(async (channel, id) => {
            await channel.overwritePermissions(muterole, {
              SEND_MESSAGES: false,
              ADD_REACTIONS: false
            });
          });
        }catch(e){
          console.log(e.stack);
        }
      }
      let mutetime = args[1];
      if(!mutetime) return message.reply("You didn't specify a time!");

      await(tomute.addRole(muterole.id));
      message.reply(`<@${tomute.id}> has been muted for ${ms(ms(mutetime))}`);

      setTimeout(function(){
        tomute.removeRole(muterole.id);
        message.channel.send(`<@${tomute.id}> has been unmuted!`);
      }, ms(mutetime));
    }
    if(cmd === `${prefix}kick`){

    let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("Can't find user!");
    let kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You Must Have Permission");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor("#e56b00")
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    let kickChannel = message.guild.channels.find(`name`, "mod-log");
    if(!kickChannel) return message.channel.send("Can't Find mod log Pls Create A Channel modlog .");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);

    return;
  }

  if(cmd === `${prefix}ban`){

    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find user!");
    let bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("You Must Have Permission");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That person can't be kicked!");

    let banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor("#bc0000")
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "mod-log");
    if(!incidentchannel) return message.channel.send("Can't Find mod log Pls Create A Channel mod log.");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);


    return;
  }
  if(cmd === `${prefix}report`){

    let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("Couldn't find user.");
    let rreason = args.join(" ").slice(22);

    let reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor("#15f153")
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    let reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("Couldn't find reports channel.");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);

    return;
  }
    if(cmd === `${prefix}serverinfo`){

      let sicon = message.guild.iconURL;
      let serverembed = new Discord.RichEmbed()
      .setDescription("Server Information")
      .setColor("#15f153")
      .setThumbnail(sicon)
      .addField("Server Name", message.guild.name)
      .addField("Created On", message.guild.createdAt)
      .addField("You Joined", message.member.joinedAt)
      .addField("Total Members", message.guild.memberCount);

      return message.channel.send(serverembed);
    }
    if(cmd === `${prefix}botinfo`){

      let bicon = bot.user.displayAvatarURL;
      let botembed = new Discord.RichEmbed()
      .setDescription("Bot Information")
      .setColor("#15f153")
      .setThumbnail(bicon)
      .addField("Bot Name", bot.user.username)
      .addField("Created On", bot.user.createdAt);

      return message.channel.send(botembed);
    }
    if(cmd === `${prefix}help`){

      let serverembed = new Discord.RichEmbed()
      .setDescription("Commands For LITHIUM ©")
      .setColor("#03FF44")
      .addField("++serverinfo", 'Give Info About Your Server')
      .addField("++botinfo", 'Give Info About LITHIUM')
      .addField("++kick", 'Kick A User From Server')
      .addField("++ban", 'Bans A User From Server')
      .addField("++report",'Reports A User In Server')
      .addField("++userinfo", 'Show User AVATAR')
      .addField("++support", 'Give Link Of Bot Support Server')
      .addField("++tempmute",'Mutes A User For Limited Time Eg @user 1s')
      .addField("++say",'Eg ++say hello bot will reply hello')
      .addField("++invite",'Give Bot Invite Link')

      return message.channel.send(serverembed);
      }
    if(cmd === `${prefix}userinfo`){

       let userembed = new Discord.RichEmbed()
       .setDescription('User Info')
       .setColor('03FF44')
       .setThumbnail(message.author.avatarURL)
       .setTimestamp()

       return message.channel.send(userembed);
}
  if(cmd === `${prefix}support`){

    let supportembed = new Discord.RichEmbed()
    .setDescription('LITHIUM © BOT Support Server Link')
    .setColor('03FF44')
    .addField('https://discord.gg/UTU7ShG')
    .setTimestamp()

    return message.channel.send(supportembed);
  }
  if(cmd === `${prefix}say`){
    message.delete();
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return err.noPerms(message, "MANAGE_MESSAGES");
    let botmessage = args.join(" ");
    message.channel.send(botmessage);
  }
  if(cmd === `${prefix}invite`){

    let binvitembed = new Discord.RichEmbed()
    .setDescription('LITHIUM © BOT Invite Link')
    .setColor('RANDOM')
    .addField('https://goo.gl/54uoNf')
    .setTimestamp()

    return message.channel.send(binvitembed);
  }
});
bot.login('process.env.TOKEN')
