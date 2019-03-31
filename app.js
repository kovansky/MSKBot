global.appRoot = path.resolve(__dirname);

const Discord = require("discord.js"),
      client  = Discord.Client(),
      fs      = require("fs"),

      config  = require(global.appRoot + "/config.json");

// Register events
fs.readdir("./events/", (err, files) => {
    if(err) {
        console.error(err);
    }

    files.forEach(file => {
        let eventFunction = require(`./events/${file}`),
            eventName     = file.split(".")[0];

        client.on(eventName, (...args) => eventFunction.run(client, ...args));
    });
});
