const express = require("express");
const cors = require("cors");
const helmet=require("helmet");
const path = require("path");
const Register = require("../models/register");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");
require("dotenv").config();
const { error } = require("console");
const app = express();

require("../db/connect");
// app.use(cors());
// app.use(helmet());
app.use(
  cors({
    origin: "https://infinityshop.onrender.com",
  })
);
app.use(
  cors({
    methods: ["GET", "POST", "PUT"],
  })
);
app.use(
  cors({
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(
  cors({
    credentials: true,
  })
);
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Origin', 'https://infinityshop.onrender.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
const port =process.env.PORT || 4000;

// const static_path = path.join(__dirname, "../public");
// app.use(express.static(static_path));
// app.set("view engine", "hbs");
// console.log(path.join(__dirname, "../public/index.html"));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.post("/newProduct", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  try {
    const { Id } = req.body;
    const userData = await Product.findOne({ Id: Id })
     
      .then((product) => {
        if (product) {
          console.log("product already added");
          res.status(200).send("product already exist");
        } else {
          const {
            Id,
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            thumbnail,
            image1,
            image2,
            image3,
            image4,
          } = req.body;
          const newProduct = new Product({
            Id,
            title,
            description,
            price,
            discountPercentage,
            rating,
            stock,
            brand,
            category,
            thumbnail,
            image1,
            image2,
            image3,
            image4,
          });
          console.log(newProduct);
          newProduct.save();
          res.status(200).send("successful");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (error) {
    res.status(404).send("error");
  }
});
//for getting all products
app.get("/products", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  try {
    const userData = await Product.find()
      .then((product) => {
        if(product){
        console.log(product);
        res.status(200).json(product);}
        else{
          res.status(200).send("no products to show");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        res.status(500).send("Failed to fetch products");
      });
  } catch (error) {
    res.status(404).send("error");
  }
});
//for getting singleproduct
app.get("/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const Id = req.params.id;
  console.log(Id);
  try {
    const userData = await Product.findOne({ Id: Id })
      
      .then((product) => {
        if (product) {
          res.status(200).json(product);
        } else {
          res.status(200).send("not any signeproduct with this id");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch (error) {
    res.status(404).send("error");
  }
});
//for updating product
app.patch("/update/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const Id = req.params.id;
  const updatedProduct = req.body;
  console.log(Id);
  console.log(updatedProduct);
  try {
    const result = await Product.updateOne({ Id: Id }, { $set: updatedProduct })
      
      .then((product) => {
        if (product) {
          res.status(200).send(`updated product with ID: ${Id}`);
        } else {
          res.status(200).send(`Product with ID: ${Id} not found`);
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch {
    res.status(404).send("error");
  }
});
// for deleting product
app.delete("/delete/:id", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const Id = req.params.id;
  // console.log(Id);
  try {
    const result = await Product.deleteOne({ Id: Id })
      
      .then((product) => {
        if (product) {
          res.status(200).send(`Deleted product with ID: ${Id}`);
        } else {
          res.status(200).send(`Product with ID: ${Id} not found`);
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch  {
    res.status(404).send("error");
  }
});

// for placing order by user and save the data in mongodb
app.post("/orders", async (req, res) => {
  try {
    const orderData = req.body;
    const { phoneNumber } = req.body;
    const userData = await Order.findOne({ phoneNumber: phoneNumber })
      
      .then((user) => {
        if (user) {
          console.log("order already exist");
          res.status(200).send("order already exist");
        } else {
          const order = new Order(orderData);
          order.save();
          res.redirect(`/userOrderData?userNumber=${phoneNumber}`);
        }
      })
      .catch((err) => {
        res.status(404).send("error");
      });
  } catch {
    res.status(404).send("error");
  }
});
// for getting placed order data by user
app.get("/order/:phnNumber", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const phnNumber = req.params.phnNumber;
  console.log(phnNumber);
  try {
    const userData = await Order.findOne({ phoneNumber: phnNumber })
    
      .then((order) => {
        if (order) {
          res.status(200).json(order);
        } else {
          res.status(200).send("not any order");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch {
    res.status(404).send("error");
  }
});
//order data for userDashboard
app.get("/ordered/:email", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const email = req.params.email;
  console.log(email);
  try {
    const userData = await Order.findOne({ email: email })
      .exec()
      .then((order) => {
        if (order) {
          res.status(200).json(order);
        } else {
          res.status(200).send("not any order");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch {
    res.status(404).send("error");
  }
});

//for being registered by user
app.post("/register", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  try {
    // const password = req.body.password;
    const confirmpasssword = req.body.confirmpassword;
    // console.log(password);
    console.log(confirmpasssword);
    const { email, password } = req.body;
    const userData = await Register.findOne({ email: email })
      .exec()
      .then((user) => {
        if (user) {
          console.log("user already exist");
          res.send("user already exist");
        } else {
          if (password === confirmpasssword) {
            const registerEmployee = new Register({
              image: req.body.image,
              username: req.body.username,
              email: req.body.email,
              phone: req.body.phone,
              password: req.body.password,
              // confirmpasssword: req.body.confirmpassword,
              description: req.body.description,
            });
            registerEmployee.save();
            res.send("successful");
            res.redirect('/login');
          } else {
            res.send("passwords are not matching");
          }
        }
      })
      .catch((err) => {
        res.status(404).send("error");
      });
  } catch (error) {
    res.status(404).send("error");
  }
});
//for being logged by user
app.post("/loguser", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await Register.findOne({ email:email,password:password })

      .then((user) => {
        if (user) {
          
          
            console.log("login successfull");
            res.send(user);
            res.redirect('/userDashboard');
           
        
        } else {
          // User not found, return error message or handle error condition
          res.status(200).json("not any user");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch {
    res.status(404).send(error);
  }
});

//after redirecting the user  login to userdashboard and getting single user data
app.get("/user/:email", async (req, res) => {
  // res.sendFile(path.join(__dirname, "../public/index.html"));
  // res.render(path.join(__dirname, "../views/pages/express.hbs"));
  const email = req.params.email;
  console.log(email);
  try {
    const userData = await Register.findOne({ email: email })
      .exec()
      .then((product) => {
        if (product) {
          console.log(product);
          res.status(200).json(product);
        } else {
          res.status(200).send("not any user");
        }
      })
      .catch((err) => {
        res.status(404).send(err);
      });
  } catch  {
    res.status(404).send("error");
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
