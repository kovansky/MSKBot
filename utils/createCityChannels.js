exports.run = (client, guild, role) => {
    let names = {
        category: role.name,
        channel:  `ogólny-${role.name.toLowerCase()}`
    };

    if(!guild.channels.find(chan => chan.name === names.category && chan.type === "category")) {
        guild.createChannel(names.category, "category", [
            {
                id:   guild.defaultRole.id,
                deny: ["VIEW_CHANNEL"]
            },
            {
                id:    role.id,
                allow: ["VIEW_CHANNEL"]
            }
        ])
             .then((category) => {
                 guild.createChannel(names.channel, "text", [
                     {
                         id:   guild.defaultRole.id,
                         deny: ["VIEW_CHANNEL"]
                     },
                     {
                         id:    role.id,
                         allow: ["VIEW_CHANNEL"]
                     },
                     {
                         id:    client.user.id,
                         allow: ["VIEW_CHANNEL"]
                     }
                 ])
                      .then((channel) => {
                          channel.setParent(category)
                                 .catch(console.error);
                      })
                      .catch(console.error);
             })
             .catch(console.error);
    }
};