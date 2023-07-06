const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://redwantapu1234:redwan@#$@cluster0.y2wf7zz.mongodb.net/ecomapp?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connnection successfull");
  })
  .catch((e) => {
    console.log("no connection");
  });
