const config                = require(global.appRoot + "/config.json"),
      createRelatedChannels = require(global.appRoot + "/utils/createRelatedChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    if(message.guild !== null && message.guild !== undefined) {
        global.guild = message.guild;
    }

    switch(command) {
        case "dodaj":

            break;
        default:
            sql.serialize(() => {
                sql.get("select id, name, role from cities where name = ?", [command], (err, row) => {
                    let role, member;
                    member = message.member;

                    if(row !== undefined) {
                        role = global.guild.roles.get(row.role);

                        if(!member.roles.has(role.id)) {
                            member.addRole(role).catch(console.error);

                            message.reply(`dodano do ${command}`);

                            createRelatedChannels.run(global.guild, role);
                        } else {
                            message.reply(`już jesteś w ${command}`);
                        }
                    } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === command)) {
                        role = global.guild.roles.find(role => role.name === command);

                        if(!member.roles.has(role.id)) {
                            member.addRole(role).catch(console.error);

                            message.reply(`dodano do ${command}`);

                            createRelatedChannels.run(global.guild, role);
                        } else {
                            message.reply(`już jesteś w ${command}`);
                        }

                        sql.run("insert into cities (name, role) VALUES (?, ?)", [command, role.id], (err) => {
                            if(err) {
                                console.error(err);
                            }
                        });
                    } else {
                        message.reply(`tego miasta jeszcze nie mamy.\nJeśli chcesz je dodać, wpisz \`${config.prefix}miasto dodaj ${command}\``);
                    }
                });
            });
    }
};