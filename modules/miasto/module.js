const config                = require(global.appRoot + "/config.json"),
      createRelatedChannels = require(global.appRoot + "/utils/createRelatedChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    if(message.guild !== null && message.guild !== undefined) {
        global.guild = message.guild;
    }

    switch(command) {
        case "dodaj":
            let city = args[0];

            sql.serialize(() => {
                sql.get("select id from cities where name = ?", [city], (err, row) => {
                    if(err) {
                        console.error(err);
                    }

                    if(row === undefined) {
                        let data = {
                            name:        city,
                            color:       config.cities.defaultColor,
                            mentionable: true
                        };

                        global.guild.createRole(data)
                              .then((role) => {
                                  sql.run("insert into cities (name, role) VALUES (?, ?)", [
                                      role.name, role.id
                                  ], (err) => {
                                      if(err) {
                                          console.error(err);
                                      }

                                      createRelatedChannels.run(guild, role);

                                      message.reply(`utworzono ${role.name}`);
                                  });
                              })
                              .catch(console.error);
                    }
                });
            });
            break;
        default:
            sql.serialize(() => {
                sql.get("select id, name, role from cities where name = ?", [command], (err, row) => {
                    if(err) {
                        console.error(err);
                    }

                    let role;
                    guild.fetchMember(message.author)
                         .then((member) => {
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
                         })
                         .catch(console.error);
                });
            });
    }
};