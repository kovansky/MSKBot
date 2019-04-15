const config                = require(global.appRoot + "/config.json"),
      createRelatedChannels = require(global.appRoot + "/utils/createRelatedChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    let group;

    if(command !== undefined) {
        switch(command) {
            case "dodaj":
                city = args.join(" ");

                sql.serialize(() => {
                    sql.get("select id from cities where name = ?", [city], (err, row) => {
                        if(err) {
                            console.error(err);
                        }

                        if(row === undefined && global.guild !== null && global.guild !== undefined && !global.guild.roles.find(role => role.name === city)) {
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

                                          createRelatedChannels.run(client, guild, role);

                                          message.reply(`utworzono ${role.name}.\nJeśli chcesz dołączyć, użyj \`${config.prefix}miasto ${role.name}\``);
                                      });
                                  })
                                  .catch(console.error);
                        } else {
                            message.reply(`to miasto już istnieje`);
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

                                          // createRelatedChannels.run(client, global.guild, role);
                                      } else {
                                          message.reply(`już jesteś w grupie ${group}`);
                                      }
                                  } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === `grupa ${group}`)) {
                                      role = global.guild.roles.find(role => role.name === `grupa ${group}`);

                                      if(!member.roles.has(role.id)) {
                                          member.addRole(role).catch(console.error);

                                          message.reply(`dodano do grupy ${group}`);

                                          createRelatedChannels.run(client, global.guild, role);
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