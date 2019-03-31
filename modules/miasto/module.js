const config = require(global.appRoot + "/config.json");

exports.run = (sql, client, message, [command, ...args]) => {
    if(message.guild !== null && message.guild !== undefined) {
        global.guild = message.guild;
    }

    switch(command) {
        default:
            sql.serialize(() => {
                sql.get("select id, name, role from cities where name = ?", [command], (err, row) => {
                    if(row !== undefined) {

                    } else if(global.guild !== null && global.guild !== undefined && global.guild.roles.find(role => role.name === command)) {
                        let role   = global.guild.roles.find(role => role.name === command),
                            member = message.member;

                        member.addRole(role).catch(console.error);

                        message.reply(`dodano do ${command}`);

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