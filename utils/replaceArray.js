exports.run = (string, find, replace) => {
    let regex;

    for(let i = 0; i < find.length; i++) {
        regex = new RegExp(find[i], "g");
        string   = string.replace(regex, replace[i]);
    }

    return string;
};