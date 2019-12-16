const express = require("express");
const mysql = require("mysql");
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(session({
    secret: "top secret!",
    resave: true,
    saveUninitialized: true
}));
app.use(express.urlencoded({extended: true}));

////////////////////////////////////////////////////////////
// ROUTING
////////////////////////////////////////////////////////////

app.get("/", async function (req, res) {
    let timeSlots = await getTimeSlots();
    res.render("index", {"timeSlots":timeSlots});
});//index

app.get("/addTime", async function (req, res) {
    res.render("addTime");
});//addTime

app.get("/deleteTime", async function (req, res) {
    res.render("deleteTime");
});//deleteTime

app.get("/rubric", async function (req, res) {
    res.render("rubric");
});//deleteTime

app.get("/insertTS", async function (req, res) {
    insertTimeSlot(req.query);
    console.log("in insertTS");
    
});//insertTS

app.get("/deleteTS", async function(req,res) {
    deleteTimeSlot();
    console.log("in delete");
    
});//deleteTS

////////////////////////////////////////////////////////////
// FUNCTIONS
////////////////////////////////////////////////////////////

function getTimeSlots(query) {
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject) {
        conn.connect(function(err) {
            if(err) throw err;
            
            console.log("in database");
            let sql=`SELECT dateOfSlot, startTime, endTime, bookedByFirstName, bookedByLastName FROM final_timeslots`;
            conn.query(sql, function(err,rows,fields) {
                if(err) throw err;
                conn.end();
                resolve(rows);
            });
        });//conn
    });//promise
}//getTimeSlots

function insertTimeSlot(query) {
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject) {
        conn.connect(async function(err) {
            if(err) throw err;
            
            let sql = `INSERT INTO \`final_timeslots\`
                      (slotId, dateOfSlot, startTime, endTime, bookedByFirstName, bookedByLastName)
                      VALUES (?,?,?,?,?,?)
                      `;
                      
            let params = [1, query.inputDate, query.inputStartTime, query.inputEndTime, 'Not', 'Booked'];
            
            conn.query(sql, params, function(err, rows, fields) {
                if(err) throw err;
                conn.end();
                resolve(rows);
            });
        });//connect
    });//promise
}//insertTimeSlot

function deleteTimeSlot() {
    let conn = dbConnection();
    
    return new Promise(function(resolve, reject) {
        conn.connect(async function(err) {
            if(err) throw err;
            
            let sql = `DELETE FROM final_timeslots WHERE slotId=1`;
        conn.query(sql, function (err, rows, fields) {
            if (err) throw err;
            conn.end();
            resolve(rows);
            });
        });//connect
    });//promise
}//deleteTimeSlot


//Building connection to database
function dbConnection() {
    let conn = mysql.createConnection({
        host: "olxl65dqfuqr6s4y.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
        user: "lhgmlbcss59s9m0p",
        password: "vrf2lrmgmpwe02g5",
        database: "id9he8k3oeqj35ei"
    });//createConnection
    return conn;
}//dbConnection



// starting server
app.listen(process.env.PORT || 3000, process.env.IP, function () {
    console.log("Express server is running...");
});