const mongoose = require("mongoose");
// mongodb+srv://redwantapu1234:redwan@#$@cluster0.y2wf7zz.mongodb.net/ecomapp?retryWrites=true&w=majority
mongoose
  .connect("mongodb://localhost:27017/ecomsiteRegistration", {
    useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true
  })
  .then(() => {
    console.log("connnection successfull");
  })
  .catch((e) => {
    console.log("no connection");
  });
