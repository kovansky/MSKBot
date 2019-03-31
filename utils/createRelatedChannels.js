exports.run = (guild, role) => {
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
                 guild.createChannel(names.channel)
                      .then((channel) => {
                          channel.setParent(category, 'text', [
                              {
                                  id:   guild.defaultRole.id,
                                  deny: ["VIEW_CHANNEL"]
                              },
                              {
                                  id:    role.id,
                                  allow: ["VIEW_CHANNEL"]
                              }
                          ]);
                      })
                      .catch(console.error);
             })
             .catch(console.error);
    }
};