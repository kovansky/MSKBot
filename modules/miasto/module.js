const config                = require(global.appRoot + "/config.json"),
      createCityChannels = require(global.appRoot + "/utils/createCityChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    let city;

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

                                          createCityChannels.run(client, guild, role);

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
                    city = command;

                    if(args.length > 0) {
                        city += " " + args.join(" ");
                    }

                    sql.get("select id, name, role from cities where name = ?", [city], (err, row) => {
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

                                          message.reply(`dodano do ${city}`);

                                          createCityChannels.run(client, global.guild, role);
                                      } else {
                                          message.reply(`już jesteś w ${city}`);
                                      }
                                  } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === city)) {
                                      role = global.guild.roles.find(role => role.name === city);

                                      if(!member.roles.has(role.id)) {
                                          member.addRole(role).catch(console.error);

                                          message.reply(`dodano do ${city}`);

                                          createCityChannels.run(client, global.guild, role);
                                      } else {
                                          message.reply(`już jesteś w ${city}`);
                                      }

                                      sql.run("insert into cities (name, role) VALUES (?, ?)", [
                                          city, role.id
                                      ], (err) => {
                                          if(err) {
                                              console.error(err);
                                          }
                                      });
                                  } else {
                                      message.reply(`tego miasta jeszcze nie mamy.\nJeśli chcesz je dodać, wpisz \`${config.prefix}miasto dodaj ${city}\``);
                                  }
                              })
                              .catch(console.error);
                    });
                });
        }
    } else {
        message.reply(`użyj \`${config.prefix}miasto [nazwa miasta]\`, aby dołączyć do miasta, lub \`${config.prefix}miasto dodaj [nazwa miasta]\`, aby utworzyć nieistniejące miasto.`);
    }
};