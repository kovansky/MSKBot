const config                = require(global.appRoot + "/config.json"),
      createGroupChannels = require(global.appRoot + "/utils/createGroupChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    let group;

    if(command !== undefined) {
        switch(command) {
            case "dodaj":
                let color = args[1];
                group = args[0];

                sql.serialize(() => {
                    sql.get("select id from groups where name = ?", [group], (err, row) => {
                        if(err) {
                            console.error(err);
                        }

                        if(row === undefined && global.guild !== null && global.guild !== undefined && !global.guild.roles.find(role => role.name === `grupa ${group}`)) {
                            let data = {
                                name:        `grupa ${group}`,
                                color:       config.groups.defaultColor,
                                mentionable: true
                            };

                            if(color !== undefined) {
                                data.color = color;
                            }

                            global.guild.createRole(data)
                                  .then((role) => {
                                      sql.run("insert into groups (name, role) VALUES (?, ?)", [
                                          group, role.id
                                      ], (err) => {
                                          if(err) {
                                              console.error(err);
                                          }

                                          createGroupChannels.run(client, guild, "Warszawa", role);

                                          message.reply(`utworzono grupę ${role.name}.\nJeśli chcesz do niej dołączyć, użyj \`${config.prefix}grupa ${group}\``);
                                      });
                                  })
                                  .catch(console.error);
                        } else {
                            message.reply(`ta grupa już istnieje`);
                        }
                    });
                });
                break;
            default:
                sql.serialize(() => {
                    group = command;

                    sql.get("select id, name, role from groups where name = ?", [group], (err, row) => {
                        if(err) {
                            console.error(err);
                        }

                        let role;
                        global.guild.fetchMember(message.author)
                              .then((member) => {
                                  if(row !== undefined) {
                                      role = global.guild.roles.get(row.role);

                                      if(!member.roles.has(role.id)) {
                                          member.addRole(role).catch(console.error);

                                          message.reply(`dodano do grupy ${group}`);

                                          createGroupChannels.run(client, global.guild, "Warszawa", role);
                                      } else {
                                          message.reply(`już jesteś w grupie ${group}`);
                                      }
                                  } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === `grupa ${group}`)) {
                                      role = global.guild.roles.find(role => role.name === `grupa ${group}`);

                                      if(!member.roles.has(role.id)) {
                                          member.addRole(role).catch(console.error);

                                          message.reply(`dodano do grupy ${group}`);

                                          createGroupChannels.run(client, global.guild, "Warszawa", role);
                                      } else {
                                          message.reply(`już jesteś w ${group}`);
                                      }

                                      sql.run("insert into groups (name, role) VALUES (?, ?)", [
                                          group, role.id
                                      ], (err) => {
                                          if(err) {
                                              console.error(err);
                                          }
                                      });
                                  } else {
                                      message.reply(`taka grupa nie istnieje.`);
                                  }
                              })
                              .catch(console.error);
                    });
                });
        }
    } else {
        message.reply(`użyj \`${config.prefix}grupa [nazwa grupy]\`, aby dołączyć do grupy.`);
    }
};