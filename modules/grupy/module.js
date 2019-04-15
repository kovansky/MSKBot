const Discord = require("discord.js"),
      config  = require(global.appRoot + "/config.json");

exports.run = (sql, client, message, args) => {
    sql.serialize(() => {
        let list = [];

        sql.each("select name from groups", (err, row) => {
            if(err) {
                console.error(err);
            }

            if(row !== undefined) {
                list.push(row.name);
            }
        });

        let guildRoles = global.guild.roles.filter(role => role.name.startsWith("grupa ")).array();
        for(let group of guildRoles) {
            let name = group.name.slice("grupa ".length);

            if(!list.includes(name)) {
                list.push(name);

                sql.run("insert into groups (name, role) VALUES (?, ?)", [
                    name, group.id
                ], (err) => {
                    if(err) {
                        console.error(err);
                    }
                });
            }
        }

        let embed       = new Discord.RichEmbed()
                .setTitle("Dostępne grupy")
                .setColor("#6AB033")
                .setFooter("MSK Bot by Stanisław Kowański", "https://www.basecode.pro/img/msk.png")
                .setThumbnail("https://www.basecode.pro/img/msk.png"),
            description = "";

        for(let group of list) {
            if(description.length !== 0) {
                description += "\n";
            }

            description += `- ${group}`;
        }

        embed.setDescription(description);

        message.channel.send({embed})
    });
};