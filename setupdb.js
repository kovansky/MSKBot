exports.run = (sql) => {
    sql.serialize(() => {
        sql.run("create table if not exists cities (id INTEGER not null constraint cities_pk primary key" +
                    " autoincrement, name TEXT not null, role INTEGER not null)");

        console.log("Databases created");
    })
}