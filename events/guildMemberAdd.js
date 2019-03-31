const Discord      = require("discord.js"),
      config       = require(global.appRoot + "/config.json"),
      replaceArray = require(global.appRoot + "/utils/replaceArray.js");

exports.run = (client, member) => {
    if(config.welcomeDM.enabled) {
        let message      = config.welcomeDM.message,
            replacements = {
                keys:   [
                    "%server%",
                    "%user%"
                ],
                values: [
                    member.guild.name,
                    member.user.username
                ]
            };

        let embed = new Discord.RichEmbed()
            .setColor("#6AB033")
            .setFooter("MSK Bot by Stanisław Kowański", "https://www.basecode.pro/img/msk.png")
            .setThumbnail("https://www.basecode.pro/img/msk.png");

        message.forEach(msg => {
            let title = replaceArray.run(msg.title, replacements.keys, replacements.values),
                text  = replaceArray.run(msg.text, replacements.keys, replacements.values);

            embed.addField(title, text);
        });

        member.createDM().then(channel => {
            channel.send({embed});
        });
    }
};