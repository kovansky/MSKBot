exports.run = (sql, client, message, args) => {
    if(message.guild !== null && message.guild !== undefined) {
        global.guild        = message.guild;
        global.botActivated = true;

        message.reply("Aktywowano")
               .then((reply) => {
                   message.delete(2000);
                   reply.delete(2000);
               });
    } else {
        message.reply("Nie można aktywować bota. Wyślij wiadomość z serwera.")
               .then((reply) => {
                   message.delete(2000);
                   reply.delete(2000);
               });
    }
};