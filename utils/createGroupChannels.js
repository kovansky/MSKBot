exports.run = (client, guild, city, role) => {
    let names = {
        category: city,
        channel:  role.name.toLowerCase().replace(' ', '-')
    };

    let category = guild.channels.find(chan => chan.name === names.category && chan.type === "category");

    if(!guild.channels.find(chan => chan.name === names.channel && chan.parentID === category.id)) {
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
    }
};