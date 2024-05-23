const mysql = require('mysql2')
var md5 = require('md5')

const con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

con.connect((err) => {
    if (err) {
        console.log("createdb")
        console.error(err.message);
        throw err
    };
    console.log('Connected to the MySQL database.')

    // create tables
    con.query(`CREATE TABLE user (
        id INTEGER NOT NULL AUTO_INCREMENT,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        colour VARCHAR(10) NOT NULL,
        employee BOOLEAN DEFAULT TRUE NOT NULL,
        PRIMARY KEY (id)
    );`, (err) => {
        let default_admin = {
            username: process.env.DEFAULT_USERNAME,
            password: md5(process.env.DEFAULT_PASSWORD)
        };
        if (err) {
            const sql = "SELECT COUNT(*) AS count FROM user WHERE role = ?";
            con.query(sql, ['admin'], (err, result) => {
                if (err) {
                    console.error(err);
                } else {
                    if (result[0].count == 0) {
                        // add default admin if no admin yet
                        const sql = 'INSERT INTO user (username, password, role, colour) VALUES (?, ?, ?, ?)';
                        con.query(sql, [default_admin.username, default_admin.password, "admin", "#000000"]);
                    }
                }
            });
        } else {
            // table just created, add default admin
            console.log("user table has been created.");
            const sql = 'INSERT INTO user (username, password, role, colour) VALUES (?, ?, ?, ?)'
            con.query(sql, [default_admin.username, default_admin.password, "admin", "#000000"]);
        }
    });

    con.query(`CREATE TABLE visit (
        visit_id    INTEGER NOT NULL AUTO_INCREMENT,
        visit_responsible   VARCHAR(100),
        visit_support   VARCHAR(100),
        visit_dt    DATETIME,
        visit_appointment   VARCHAR(100),
        visit_company   VARCHAR(100),
        visit_address   VARCHAR(500),
        visit_pic   VARCHAR(100),
        visit_contact   VARCHAR(50),
        visit_agenda    VARCHAR(100),
        visit_plan  VARCHAR(100),
        visit_remark    VARCHAR(500),
        visit_status    BOOLEAN,
        PRIMARY KEY (visit_id)
    )`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created
            console.log("visit table has been created");
        }
    });

    con.query(`CREATE TABLE task (
        task_id     INTEGER NOT NULL AUTO_INCREMENT,
        task_involved   VARCHAR(100),
        task_task	VARCHAR(100),
        task_start_dt	DATETIME,
        task_end_dt     DATETIME,
        task_venue  VARCHAR(100),
        task_address	VARCHAR(500),
        task_pic	VARCHAR(100),
        task_agenda	VARCHAR(100),
        task_plan	VARCHAR(100),
        task_remark	VARCHAR(500),
        task_status	BOOLEAN,
        PRIMARY KEY (task_id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("task table has been created");
        }
    });

    con.query(`CREATE TABLE trip (
        trip_id	INTEGER NOT NULL AUTO_INCREMENT,
        trip_involved	VARCHAR(100),
        trip_mode	VARCHAR(50),
        trip_from	INTEGER,
        trip_to	INTEGER,
        trip_start_dt	DATETIME,
        trip_end_dt	DATETIME,
        trip_venue	VARCHAR(100),
        trip_remark	VARCHAR(500),
        trip_status	BOOLEAN,
        PRIMARY KEY (trip_id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("trip table has been created");
        }
    });

    con.query(`CREATE TABLE country (
        country_id	INTEGER NOT NULL AUTO_INCREMENT,
        country_name	VARCHAR(100),
        PRIMARY KEY (country_id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("country table has been created");
        }
    });

    con.query(`CREATE TABLE state (
        state_id	INTEGER NOT NULL AUTO_INCREMENT,
        state_name	VARCHAR(100),
        country_id	INTEGER NOT NULL,
        PRIMARY KEY (state_id),
        FOREIGN KEY (country_id) REFERENCES country (country_id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
            // console.log(err.message)
        } else {
            // Table just created, can creating some rows
            console.log("state table has been created");
        }
    });

    con.query(`CREATE TABLE customer (
        customer_id	INTEGER NOT NULL AUTO_INCREMENT,
        company_name	VARCHAR(100),
        company_website	VARCHAR(100),
        company_country	INTEGER,
        company_state	INTEGER,
        company_nature	VARCHAR(100),
        company_industries	VARCHAR(100),
        company_facilities	VARCHAR(100),
        company_interested	VARCHAR(200),
        company_lastResult	VARCHAR(20),
        company_mainContact	INTEGER,
        company_mainAddress	INTEGER,
        PRIMARY KEY (customer_id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
            // console.log(err.message)
        } else {
            // Table just created, can creating some rows
            console.log("customer table has been created");
        }
    });

    con.query(`CREATE TABLE address (
        id	INTEGER NOT NULL AUTO_INCREMENT,
        address	VARCHAR(500),
        customer_id	INTEGER NOT NULL,
        PRIMARY KEY (id),
        FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("address table has been created");
        }
    });

    con.query(`CREATE TABLE contact (
        contact_id	INTEGER NOT NULL AUTO_INCREMENT,
        contact_name	VARCHAR(50),
        contact_designation	VARCHAR(50),
        contact_phoneNo	VARCHAR(50),
        contact_email	VARCHAR(50),
        contact_remark	VARCHAR(500),
        customer_id	INTEGER NOT NULL,
        PRIMARY KEY (contact_id),
        FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
            // console.log(err.message)
        } else {
            // Table just created, can creating some rows
            console.log("contact table has been created");
        }
    });

    con.query(`CREATE TABLE activity (
        activity_id	INTEGER NOT NULL AUTO_INCREMENT,
        activity_start_dt	DATETIME,
        activity_end_dt	DATETIME,
        activity_details	TEXT,
        activity_created_on	DATETIME,
        user_id	INTEGER NOT NULL,
        customer_id INTEGER NOT NULL,
        activity_last_modify_user   INTEGER,
        activity_last_modify_on DATETIME,
        PRIMARY KEY (activity_id),
        FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE NO ACTION,
        FOREIGN KEY (customer_id) REFERENCES customer (customer_id) ON DELETE NO ACTION
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("activity table has been created");
        }
    });

    con.query(`CREATE TABLE product (
        product_id	INTEGER NOT NULL AUTO_INCREMENT,
        product_name	VARCHAR(100),
        product_description	TEXT,
        product_group	VARCHAR(20),
        PRIMARY KEY (product_id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("product table has been created");
        }
    });

    con.query(`CREATE TABLE inquiry (
        inquiry_id	INTEGER NOT NULL AUTO_INCREMENT,
        model_id	INTEGER NOT NULL,
        quantity	INTEGER,
        remark	VARCHAR(500),
        activity_id	INTEGER NOT NULL,
        PRIMARY KEY (inquiry_id),
        FOREIGN KEY (model_id) REFERENCES product (product_id) ON DELETE NO ACTION,
        FOREIGN KEY (activity_id) REFERENCES activity (activity_id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("inquiry table has been created");
        }
    });

    con.query(`CREATE TABLE accommodation (
        id	INTEGER NOT NULL AUTO_INCREMENT,
        name	VARCHAR(100),
        address	VARCHAR(500),
        pic	VARCHAR(100),
        phoneNo	VARCHAR(50),
        PRIMARY KEY (id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("accommodation table has been created");
        }
    });

    con.query(`CREATE TABLE plan (
        week	VARCHAR(20),
        user_id	INTEGER NOT NULL,
        checklist	VARCHAR(50),
        CONSTRAINT PK_plan PRIMARY KEY (week, user_id),
        FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("plan table has been created");
        }
    });

    con.query(`CREATE TABLE location (
        id	INTEGER NOT NULL AUTO_INCREMENT,
        name	VARCHAR(100),
        PRIMARY KEY (id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("location table has been created");
        }
    });

    con.query(`CREATE TABLE media (
        id	INTEGER NOT NULL AUTO_INCREMENT,
        gid     VARCHAR(50) NOT NULL,
        name	VARCHAR(100) NOT NULL,
        link    VARCHAR(200) NOT NULL,
        filetype    VARCHAR(20) NOT NULL,
        activity_id INTEGER NOT NULL,
        PRIMARY KEY (id)
    );`, (err) => {
        if (err) {
            // console.log("Table already exist");
        } else {
            // Table just created, can creating some rows
            console.log("media table has been created");
        }
    });
});

module.exports = con