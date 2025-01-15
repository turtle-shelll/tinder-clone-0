const mongoose = require("mongoose");

function connectDB(url) {
  return new Promise((resolve, reject) => {
    mongoose.connect(url, {
      useNewUrlParser: true,
      // useCreateIndex:true,
      useUnifiedTopology: true,
    }).then(() => {
      resolve(true);
    }).catch((error) => {
      console.error("error from connectDB  -===>>>>>>>>>>", error);
      reject();
    });
  });
};
// module.exports = connectDB;
module.exports = connectDB;
