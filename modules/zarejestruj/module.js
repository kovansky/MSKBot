const config                = require(global.appRoot + "/config.json"),
      createRelatedChannels = require(global.appRoot + "/utils/createRelatedChannels.js"),
      cityModule            = require(global.appRoot + "/modules/miasto/module.js");

exports.run = (sql, client, message, args) => {
    if(args.length >= 3) {
        global.guild.fetchMember(message.author)
              .then((member) => {
                  let user     = {
                          name:    args[0],
                          surname: args[1],
                          city:    args.slice(2).join(" ")
                      },
                      nickname = user.name + " " + user.surname + " (" + user.city + ")";

                  if(nickname.length > 32) {
                      nickname = user.name.charAt(0) + ". " + user.surname + " (" + user.city + ")";
                  }

                  console.log(user.city);

                  member.setNickname(nickname)
                        .then(() => {
                            cityModule.run(sql, client, message, [user.city]);

                            message.reply(`zarejestrowano jako \`${nickname}\`!`);
                        })
                        .catch((err) => {
                            console.error(err);

                            if(err.code === 50035 && err.message.indexOf("32 or fewer") !== -1) {
                                message.reply("nick jest za długi!");
                            }
                        });
              });
    } else {
        message.reply(`użyj \`${config.prefix}zarejestruj [imię] [nazwisko] [nazwa miasta]\`, aby się zarejestrować.`);
    }
};