exports.run = (sql) => {
    sql.serialize(() => {
        sql
            .run("create table if not exists cities (id INTEGER not null constraint cities_pk primary key" +
                     " autoincrement, name VARCHAR(30) not null, role VARCHAR(24) not null)", () => {
                if(this.changes > 0) {
                    console.log("Databases created");
                }
            });
    });
};