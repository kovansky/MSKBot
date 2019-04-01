const config                = require(global.appRoot + "/config.json"),
      createRelatedChannels = require(global.appRoot + "/utils/createRelatedChannels.js");

exports.run = (sql, client, message, [command, ...args]) => {
    let city;

    if(message.guild !== null && message.guild !== undefined) {
        global.guild = message.guild;
    }

    switch(command) {
        case "dodaj":
            city = args.join(" ");

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

                                      createRelatedChannels.run(client, guild, role);

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
                city = command;

                if(args.length > 0) {
                    city += " " + args.join(" ");
                }

                console.log(city);

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

                                      createRelatedChannels.run(client, global.guild, role);
                                  } else {
                                      message.reply(`już jesteś w ${city}`);
                                  }
                              } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === city)) {
                                  role = global.guild.roles.find(role => role.name === city);

                                  if(!member.roles.has(role.id)) {
                                      member.addRole(role).catch(console.error);

                                      message.reply(`dodano do ${city}`);

                                      createRelatedChannels.run(client, global.guild, role);
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
};