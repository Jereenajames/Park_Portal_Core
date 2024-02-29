const express = require("express");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

var cookieParser = require("cookie-parser");

const RoleDB = require("./models/userrole");

const app = express();
app.use(express.json());

const connectDB = require("./config/db");

connectDB();

// ADD THIS
// Enable cors at the server side.
const cors = require("cors");
const corsOption = {
  origin: ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Handle CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", async (req, res) => {
  res.send(uuidv4());
});

// app.get("/checkRoleName/:roleName", (req, res) => {
//   const { roleName } = req.params;
//   const exists = roles.some(role => role.RoleName === roleName);
//   res.json({ exists });
// });

// app.post("/create", (req, res) => {
//   const newRole = req.body;

// //   // Check if the Role Name already exists
// //   const exists = roles.some(role => role.RoleName === newRole.RoleName);
// //   if (exists) {
// //     return res.status(400).json({ error: "Role Name already exists. Choose a different one." });
// //   }

// //   // If Role Name doesn't exist, add the new role
// //   roles.push(newRole);
// //   res.json({ success: true, message: "Role Created successfully!" });
// // });

app.post("/checkRoleName", async (req, res) => {
  await RoleDB.findOne({ RoleName: req.body.RoleName })
    .then((result) => {
      if (result == null) {
        res.send("failed");
      } else {
        res.send("Alredy Name found with RoleCode" +" " + result.RoleCode);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(404).send("Could not get");
    });
});

app.post("/create", async (req, res) => {
  await RoleDB.create({ ...req.body, RoleCode: uuidv4() })
    .then((result) => {
      res.send("Role created");
    })
    .catch((error) => {
      console.log(error, "create");
      res.status(404).send("role not created ");
    });
});

app.post("/oldvalue", async (req, res) => {
  await RoleDB.findOne({ RoleCode: req.body.RoleCode })
    .then((result) => {
      if (result == null) {
        res.send("No User Found");
      } else {
        res.json(result);
      }
    })
    .catch((error) => {
      res.status(404).send("Could not get");
    });
});

// app.get("/read", async (req, res) => {
//   await RoleDB.find()
//     .then((result) => {
//       console.log(result, "then");
//       res.json(result);
//     })
//     .catch((error) => {
//       console.log(error, "err");
//       res.status(404).send("user not found ");
//     });
// });

// app.get("/read/page", async (req, res) => {
//   const page = parseInt(req.params.page) || 1;
//   const limit = Math.min(parseInt(req.query.limit) || 10); 
//   await RoleDB.find()
//     .then((result) => {
//     console.log(result, "then");
//       res.json(result);
//     })

//   const skip = (page - 1) * limit;

//   try {
//     const roles = await RoleDB.find()
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     res.json(roles);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });


// app.get("/pages", async (req, res) => {
  
//   try{
//     let {page,size} = req.query;
//     if(!page){
//       page =1;
//     }
//     if(!size){
//       size =5;
//     }
//     const limit = parseInt(size);
//     const skip = (page-1)
//     const pages = await userrole.find({},{},{limit: limit,skip: skip});
//   }
//     catch (error) {
//       console.error(error);
//       res.status(500).send("Internal Server Error");
//     }
//   });
  

//read final

app.get("/read", async (req, res) => {
  
  const { page = 1, pageSize = 10, sortField = "RoleCode", sortOrder = "asc" } = req.query;

  const skip = (page - 1) * pageSize;

  const sort = {};
  sort[sortField] = sortOrder === "asc" ? 1 : -1;

  try {
    const roles = await RoleDB.find()
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(pageSize));

    const totalRolesCount = await RoleDB.countDocuments();

    res.json({
      roles,
      totalPages: Math.ceil(totalRolesCount / pageSize),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/update", async (req, res) => {
  console.log(req.body._id, "update");

  await RoleDB.findOneAndUpdate({ _id: req.body._id }, req.body)
    .then((result) => {
      res.send("Update Success");
    })
    .catch((err) => {
      res.status(404).send("Not updated");
    });
});

app.post("/delete", async (req, res) => {
  console.log(req.body.RoleCode, "delete");

  await RoleDB.findOneAndUpdate(
    { RoleCode: req.body.RoleCode },
    { IsActive: !req.body.IsActive }
  )
    .then((response) => {
      console.log(response, "delete");
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server satarted on port ${PORT}`));
module.exports = app;
