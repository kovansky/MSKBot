const Discord = require("discord.js"),
      SQLite  = require("sqlite3"),
      client  = new Discord.Client(),
      fs      = require("fs"),
      path    = require("path"),
      sql     = new SQLite.Database("./sqlite/msk.sqlite");

global.appRoot = path.resolve(__dirname);

const config = require(global.appRoot + "/config.json");

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

// Message reader
client.on("message", message => {
    if(message.author.bot) {
        return;
    }

    if(message.content.indexOf(config.prefix) !== 0) {
        return;
    }

    // Execute command
    const args   = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const module = args.shift().toLowerCase();
    try {
        let moduleFile = require(`./modules/${module}/module.js`);

        console.log(message.author + ": " + args.join(" "));

        moduleFile.run(config, client, message, args);
    } catch(error) {
        console.error(error);
    }
});

// Login to Discord
client.login(config.token).then(() => {
    console.log("Logged in");
});
