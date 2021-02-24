const http = require("http");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 8001;
const app = express();
const { dataFirstName, dataLastName, country, dataJobTitle, workingHours } = require("./dataSet.js");

let server;
let userData = [
  {
    ID: "",
    jobTitle: "",
    emailAddress: "",
    firstName_lastName: "",
    country: "",
    salaryForQ1: "",
    salaryForQ2: "",
    salaryForQ3: "",
    salaryForQ4: "",
    workingHoursQ1: "",
    workingHoursQ2: "",
    workingHoursQ3: "",
    workingHoursQ4: "",
  },
];

app.use(cors());
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "/")));

app.get("/generateRandomData", (req, res) => {
  for (let i = 0; i < 100000; i++) {
    let firstName = dataFirstName[Math.floor(Math.random() * (19 - 0 + 1)) + 0];
    let lastName = dataLastName[Math.floor(Math.random() * (19 - 0 + 1)) + 0];
    userData.push({
      ID: String(i + 1).padStart(5, "0"),
      jobTitle: dataJobTitle[Math.floor(Math.random() * (14 - 0 + 1)) + 0],
      emailAddress: `${firstName}_${lastName}@xyz.com`,
      firstName_lastName: `${firstName} ${lastName}`,
      country: country[Math.floor(Math.random() * (19 - 0 + 1)) + 0],
      salaryForQ1: Math.floor(1000 + Math.random() * 2000),
      salaryForQ2: Math.floor(2000 + Math.random() * 4000),
      salaryForQ3: Math.floor(4000 + Math.random() * 8000),
      salaryForQ4: Math.floor(8000 + Math.random() * 9000),
      workingHoursQ1: workingHours[Math.floor(Math.random() * (19 - 0 + 1)) + 0],
      workingHoursQ2: workingHours[Math.floor(Math.random() * (19 - 0 + 1)) + 0],
      workingHoursQ3: workingHours[Math.floor(Math.random() * (19 - 0 + 1)) + 0],
      workingHoursQ4: workingHours[Math.floor(Math.random() * (19 - 0 + 1)) + 0],
    });
  }
  userData.shift();
  res.status(200).send(userData);
});

app.get("/groupBy/:data", (req, res) => {
  const { data } = req.params;
  let updateData = [];
  let groupBy = (xs, key) => {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };
  let result = groupBy(userData, data);

  Object.values(result).forEach((item) => updateData.push(...item));
  res.status(200).send(updateData);
});

app.get("/filterBy/:data", (req, res) => {
  const { data } = req.params;
  const filteredData = userData.filter((item) => item.country === data);

  res.status(200).send(filteredData);
});

app.delete("/update", (req, res) => {
  const { ID, emailAddress, jobTitle } = req.body;

  userData.forEach((item, i) => {
    if (item.ID === ID && item.emailAddress === emailAddress && item.jobTitle === jobTitle) {
      userData.splice(i, 1);
    }
  });
  res.status(204).send("Deleted Successfully!!!");
});

app.post("/add", (req, res) => {
  userData.push(req.body);
  res.status(200).send(userData);
});

server = http.createServer(app);
server.listen(port, () => console.log("Server Started at port", port));
