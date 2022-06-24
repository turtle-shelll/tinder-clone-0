const dotenv = require("dotenv");
dotenv.config(); // env configaration
require("express-async-errors"); /// express error handler for catching error from async functions
const express = require("express");
const ConnectDB = require("./DB/ConnectDB");

const fs = require("fs");
const https = require("https");
const path = require("path");
const http = require("http");

const app = express();
const cors = require("cors"); // we need cors to make our server to be able to access from other domains

// /////****** trying to scale node server with cluster modulw in nodejs ****************/
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
// ///trying to compress the text base data when sending it to client side**************************/
const compression = require("compression");
app.use(
  compression({
    level: 6,
    threshold: 0,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
// app.use(express.json({ extended: false }));
app.disable("x-powered-by");
app.disable("etag");
const Chats = require("./DBmodels/chatDb_model");
// const Conversations = require("./DBmodels/conversation_model");
const PORT = process.env.PORT || 5000;
// const { OAuth2Client } = require("google-auth-library");// we need this but in userController file to
//// decryt the token from gooogle id token

// const jwt = require("jsonwebtoken");

//// router to provide some functions to our server
const userRouter = require("./Routes/user_routes");
const conversation = require("./Routes/conversation_route");
const chatsRouter = require("./Routes/chats_routes");

///// socket io
const socketIO = require("socket.io");
// import socket from "socket.io"
const multer = require("multer");
const userPost = require("./DBmodels/userPost");
const socketioFileUploader = require("socketio-file-upload");
app.use(cors());
const server = http.createServer(app);
// const sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
//   },
//   app
// );

//// dont need to use cookieParser becouse it we are using react so it cant requsting from our server so it can't
//// work
// app.use(cookieParser());
// const io = socketIO(sslServer);
const io = socketIO(server);

///// here i am getting destructuring littel bit for socket.io were in this function we can pass data or socket
/////// to our function**********
const {
  saveMessage,
  saveImageMessage,
  updateImage,
} = require("./userControllers/chatControllers");

///   this bilow middleware is for sending images as static file to client side
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/css", express.static("tinder_clone/build/static/css"));
// app.use("/js", express.static("tinder_clone/build/static/js"));
// app.use(express.static(path.join(__dirname, "tinder_clone", "build")));
// app.use(express.static("tinder_clone/build"));
// app.use(express.static("tinder_clone/build/index.html"));
//// or we can use this below requste responce handeler

// app.get("/uploads/:image", async (req, res) => {
//   const image = req.params.image;
//   console.log("image", image);
//   res.sendFile(path.join(__dirname, "uploads", req.params.image));
// });

app.use(express.json());

/// socket.io for getting real time images from client side socket handeler
app.use(socketioFileUploader.router);

////  initializing socket.io to web socket uploader basicly uploader is using socket.io connection***
const uploader = new socketioFileUploader();

///// ***********************  Socket.io *************************

///////////////

//////////// below this all are web socket  which responce to the client**********

io.on("connection", (socket) => {
  // console.log("new connection added", socket.id);

  // uploader.dir = path.join(__dirname, "public/uploads");
  uploader.dir = "uploads";

  uploader.listen(socket);
  // uploader.on("saved", (event) => {
  //   console.log("data from socket");
  //   event.file.clientDetail.filePath = event.file.name;
  // });
  uploader.on("complete", (event) => {
    event.file.clientDetail.filePath = event.file.name;
  });

  uploader.on("error", (event) => {
    console.log("error from socket", event);
  });

  ///// bilow here when we arre using socket we are getting responce from client side socket
  ///// and when we want to send back we are using io.emit to give responce to client side
  socket.on("connect", () => {
    console.log("conneccted", socket.id);
  });

  socket.on("image", (image) => {
    // console.log("image", image);
    if (image) {
      saveImageMessage(image, io);
      // io.emit("onGetImage", newImage);
    }
  });

  socket.on("updateImage", (imageData, imageID) => {
    // console.log("from update imageData", imageData);
    // console.log("imageID", imageID);
    updateImage(imageData, imageID, io);
  });
  socket.on("join", async (data) => {
    console.log("data from join", data);
    try {
      if (data) {
        const previosMessages = await Chats.find({ conversationBy: data })
          .limit(20)
          .sort({ createdAt: -1 });
        // console.log("previosMessages", previosMessages);
        const messages = previosMessages.sort();
        socket.emit("getPreviousMessages", messages);
      }
    } catch (error) {
      console.log("error from join", error);
    }
  });
  socket.on("message", async (data, socketID) => {
    console.log("message coming fron react", data, "&& socketID", socketID);
    if (data) {
      const newMessage = await saveMessage(data);
      // io.emit("backToUser", newMessage);
      socket.to().emit("backToUser", newMessage);
    }
  });
});

///////

////  below are all http handlers routes
// app.get("/", async (req, res) => {
//   res.send("its Working express server");
// });
// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "tinder_clone", "build", "index.html"));
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }, //fieldname is the name of the input field    //Date.now().toString is the current time in milliseconds
});

const upload = multer({ storage: storage });

//// this is for uploading images to server using multer as middleware  but it is not real time upload as
///   we are using socket.io for real time upload images
app.post("/uploadImage", upload.single("testImage"), async (req, res) => {
  // console.log("req.file==", req.file);
  const userId = req.body;

  try {
    const newPost = {
      // userID: userId,
      image: {
        data: fs.readFileSync("uploads/" + req.file.filename), ////pendding
        contentType: "image/png",
      },
      fileName: req.file.filename,
      fileSize: req.file.size,
      filePath: req.file.path,
    };
    // console.log("fileName: " + req.file.filename);
    const image = await userPost.create({ ...newPost });
    // console.log("we are from the uploadImage route");
    res.status(200).json({
      success: true,
      imageName: image.fileName,
      imageUrl: `http:///localhost:5000/uploads/${image.fileName}`,
      image: image,
    });
    // res.send("we are from the uploadImage route");
  } catch (error) {
    console.log("error from uploadImage", error);
    res.send("we are from the uploadImage error");
  }
});

//// deleting image from the server
app.delete("/deleteImage/:imageName/:imageID", async (req, res) => {
  const { imageName, imageID } = req.params;
  // console.log("delete req.query", imageName, " img_id", imageID);
  if (!imageName) {
    return res.status(400).json({
      success: false,
      message: "imageName is required",
    });
  }
  try {
    const deleteImage = await Chats.findOneAndDelete({ _id: imageID });
    // console.log("deleted_image", deleteImage);
    const image = await fs.unlinkSync(`./uploads/${imageName}`);
  } catch (error) {
    console.log("error from deleteImage", error);
  }

  res.send("image has been deleted");
});

app.use("/", userRouter);
app.use("/", conversation);
app.use("/", chatsRouter);
if (process.env.NODE_ENV === "production") {
  // console.log("production");
  app.use(express.static(path.join(__dirname, "tinder_clone", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "tinder_clone", "build", "index.html"));
  });
  app.get("/", (req, res) => {
    res.send("Welcome server is lestening on ssl server.");
  });
}
app.use((err, req, res, next) => {
  console.log("error from server endpoint", err);
  // socket.emit("error", err);
  io.emit("error", err);
});
async function start() {
  try {
    await ConnectDB(process.env.MONGODB_URL);
    // console.log("numCPUs", numCPUs);
    // const sslServer = https.createServer(
    //   {
    //     key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
    //     cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")),
    //   },
    //   app
    // );
    if (cluster.isMaster) {
      for (let i = 0; i < numCPUs + 2; i++) {
        cluster.fork();
      }
      cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.id} exiteddied`, worker.process.pid);
        cluster.fork();
      });
    } else {
      server.listen(PORT, () => {
        console.log(
          `server Is listening on http://localhost:${PORT} && cluster ID", ${process.pid}`
        );
      });
      // sslServer.listen(PORT, () => {
      //   console.log(`Server is listening on port https://localhost:${PORT}...`);
      // });
    }
    // sslServer.listen(PORT, () => {
    //     console.log(`Server is listening on port https://localhost:${PORT}...`);
    //   });
    // server.listen(PORT, () => {
    //   console.log(
    //     `server Is listening on http://localhost:${PORT} && cluster ID", ${process.pid}`
    //   );
    // });
  } catch (error) {
    console.log("error from Connection making via Mongoose", error);
  }
}
start();
