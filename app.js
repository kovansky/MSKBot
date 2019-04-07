const Discord = require("discord.js"),
      SQLite  = require("sqlite3"),
      client  = new Discord.Client(),
      fs      = require("fs"),
      path    = require("path"),
      sql     = new SQLite.Database("./sqlite/msk.sqlite");

global.appRoot = path.resolve(__dirname);
global.guild   = null;

const config  = require(global.appRoot + "/config.json"),
      setupdb = require(global.appRoot + "/setupdb");


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

    // Check if bot activated
    if(global.botActivated || module === "activate") {
        // Execute
        try {
            let moduleFile = require(`./modules/${module}/module.js`);

            console.log(`${message.author}: ${args.join(" ")} [${module}]`);

            moduleFile.run(sql, client, message, args);
        } catch(error) {
            console.error(error);

            message.reply("Komenda nieznana");
        }
    } else {
        // Reject execution
        message.reply("Bot nie jest aktywowany. Skontaktuj się z `kovansky#0451`")
               .then((reply) => {
                   message.delete(2000);
                   reply.delete(2000);
               });
    }
});

// Login to Discord
client.login(config.token).then(() => {
    console.log("Logged in");
    console.log("===");
    setupdb.run(sql);
});
