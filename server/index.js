const PORT = 8000;
const express = require("express");
const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt_decode = require("jwt-decode");
const bodyParser = require("body-parser");

require("dotenv").config();

// const uri = process.env.URI
const uri =
  "mongodb+srv://aviad:aviad3983@cluster0.0rsxald.mongodb.net/Cluster0?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json({ limit: "1mb" }));
app.use(cors());
app.use(express.json());

// Default
app.get("/", (req, res) => {
  res.json("Hello to my app");
});


// Default
app.get("/health-check", (req, res) => {
  res.json("working....tested");
});


// google sign up

app.post("/googleSignUp", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, authToken } = req.body;

  try {
    await client.connect();

    const database = client.db("app-data");
    const users = database.collection("users");

    const userObject = jwt_decode(authToken);
    const sanitizedEmail = userObject.email.toLowerCase();
    const userId = userObject.sub;

    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log("user already here, logging in...");
      await users.updateOne(
        { email },
        { $set: { email_verified: true, user_id: userId } }
      );
      const userToken = {
        userId: existingUser.user_id,
        email: existingUser.email,
      };
      const token = jwt.sign(userToken, email, {
        expiresIn: 60 * 24,
      });
      return res.status(200).json({ token, userId: existingUser.user_id });
    }

    const data = {
      user_id: userId,
      first_name: userObject.given_name,
      email: sanitizedEmail,
      email_verified: userObject.email_verified,
      dob_day: "",
      dob_month: "",
      dob_year: "",
      show_gender: false,
      gender_identity: "",
      gender_interest: "",
      images: [],
      url: userObject.picture || "", // populate with picture
      about: "",
      matches: [],
      likes: [],
      signUpDate: new Date(), // Add sign up date to the data object
    };

    const insertedUser = await users.insertOne(data);

    const userToken = {
      userId: insertedUser.insertedId,
      email: sanitizedEmail,
    };
    const token = jwt.sign(userToken, sanitizedEmail, {
      expiresIn: 60 * 24,
    });

    res.status(201).json({ token, userId: insertedUser.insertedId });
  } catch (err) {
    console.log(err);
    res.status(500).send("Internal server error");
  } finally {
    await client.close();
  }
});

// Sign up to the Database
app.post("/signup", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(409).send("User already exists. Please login");
    }

    const sanitizedEmail = email.toLowerCase();

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hashed_password: hashedPassword,
      first_name: "",
      email_verified: false,
      dob_day: "",
      dob_month: "",
      dob_year: "",
      show_gender: false,
      gender_identity: "",
      gender_interest: "",
      images: [],
      url: "", // populate with picture
      about: "",
      matches: [],
      likes: [],
      signUpDate: new Date(), // Add sign up date to the data object
    };

    const signData = await users.insertOne(data);

    const token = jwt.sign(signData, sanitizedEmail, {
      expiresIn: 60 * 24,
    });
    res.status(201).json({ token, userId: generatedUserId });

    sendVerificationEmail(sanitizedEmail, token);
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// Log in to the Database
app.post("/login", async (req, res) => {
  const client = new MongoClient(uri);
  const { email, password } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const user = await users.findOne({ email });

    if (user && user.hashed_password) {
      const correctPassword = await bcrypt.compare(
        password,
        user.hashed_password
      );
      if (correctPassword) {
        const token = jwt.sign(user, email, {
          expiresIn: 60 * 24,
        });
        res.status(201).json({ token, userId: user.user_id });
      }
    }

    res.status(400).json("Invalid Credentials");
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
});

// Get individual user
app.get("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const user = await users.findOne(query);

    res.send(user);
  } finally {
    await client.close();
  }
});

// Update User with a match
app.put("/addmatch", async (req, res) => {
  const client = new MongoClient(uri);
  const { userId, matchedUserId } = req.body;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: userId };
    const updateDocument = {
      $addToSet: { likes: { user_id: matchedUserId } },
    };
    const result = await users.updateOne(query, updateDocument);

    // Check if the matched user has already liked the current user
    const matchedUser = await users.findOne({ user_id: matchedUserId });
    const matchedUserLikes = matchedUser.likes || [];
    const isMatch = matchedUserLikes.some((like) => like.user_id === userId);

    // If the matched user has also liked the current user, add a match to both users
    if (isMatch) {
      const currentUserMatches = await users.findOne({ user_id: userId });
      const currentUserMatchIds = currentUserMatches.matches.map(
        (match) => match.user_id
      );
      if (!currentUserMatchIds.includes(matchedUserId)) {
        const currentUserUpdate = {
          $addToSet: { matches: { user_id: matchedUserId } },
        };
        await users.updateOne({ user_id: userId }, currentUserUpdate);

        const matchedUserUpdate = {
          $addToSet: { matches: { user_id: userId } },
        };
        await users.updateOne({ user_id: matchedUserId }, matchedUserUpdate);
      }
    }

    res.send(result);
  } finally {
    await client.close();
  }
});

// Get all Users by userIds in the Database
app.get("/users", async (req, res) => {
  const client = new MongoClient(uri);
  const userIds = JSON.parse(req.query.userIds);

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const pipeline = [
      {
        $match: {
          user_id: {
            $in: userIds,
          },
        },
      },
    ];

    const foundUsers = await users.aggregate(pipeline).toArray();

    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

// Get all the Gendered Users in the Database
app.get("/gendered-users", async (req, res) => {
  const client = new MongoClient(uri);
  const gender = req.query.gender;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");
    const query = { gender_identity: { $eq: gender } };
    const foundUsers = await users.find(query).toArray();
    res.json(foundUsers);
  } finally {
    await client.close();
  }
});

// Update a User in the Database
app.put("/user", async (req, res) => {
  const client = new MongoClient(uri);
  const formData = req.body.formData;

  try {
    await client.connect();
    const database = client.db("app-data");
    const users = database.collection("users");

    const query = { user_id: formData.user_id };

    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.show_gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        images: formData.images,
        about: formData.about,
        matches: formData.matches,
      },
    };

    const insertedUser = await users.updateOne(query, updateDocument);

    res.json(insertedUser);
  } finally {
    await client.close();
  }
});

// Get Messages by from_userId and to_userId
app.get("/messages", async (req, res) => {
  const { userId, correspondingUserId } = req.query;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const query = {
      from_userId: userId,
      to_userId: correspondingUserId,
    };
    const foundMessages = await messages.find(query).toArray();
    res.send(foundMessages);
  } finally {
    await client.close();
  }
});

// Add a Message to our Database
app.post("/message", async (req, res) => {
  const client = new MongoClient(uri);
  const message = req.body.message;

  try {
    await client.connect();
    const database = client.db("app-data");
    const messages = database.collection("messages");

    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } finally {
    await client.close();
  }
});

// SOCKET
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Add event listeners for socket.io connections
io.on("connection", async (socket) => {
  console.log("A user connected");
  const client = new MongoClient(uri);
  // Handle incoming messages
  socket.on("message", async (data) => {
    socket.broadcast.emit("recive_msg", data);
    try {
      await client.connect();
      const database = client.db("app-data");
      const messages = database.collection("messages");

      const insertedMessage = await messages.insertOne(data);
      console.log("insertedMessage", data.message);
    } catch (err) {
      console.log("err", err);
    }
  });
});

app.get("/verify", async (req, res) => {
  const client = new MongoClient(uri);
  const { code, email } = req.query;

  try {
    await client.connect();

    // Get the user from the database
    const usersCollection = client.db("app-data").collection("users");
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Verify the code
    if (user.verificationCode !== code) {
      return res.status(401).send("Invalid verification code.");
    }

    // Update the user's verified field
    await usersCollection.updateOne(
      { email },
      { $set: { email_verified: true } }
    );

    res.status(200).send(`
    User verified successfully. Please visit to finish your profile: <a href="https://stutz.co.il/dashboard">https://stutz.co.il/dashboard</a>
  `);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  } finally {
    await client.close();
  }
});

app.get("/adminStats", async (req, res) => {
  const client = await MongoClient.connect(uri);
  try {
    await client.connect();
    const db = client.db("app-data");
    const users = await db.collection("users").find().toArray();

    const filteredUsers = users.filter(
      (user) =>
        user.gender_identity === "man" || user.gender_identity === "woman"
    );

    const counts = {};
    filteredUsers.forEach((user) => {
      const oppositeGender = user.gender_identity === "man" ? "woman" : "man";
      counts[user._id] = 0;
      user.matches.forEach((match) => {
        const matchUser = users.find((u) => u._id === match);
        if (matchUser && matchUser.gender_identity === oppositeGender) {
          counts[user._id]++;
        }
      });
    });

    const sortedUsers = filteredUsers.sort(
      (user1, user2) => counts[user2._id] - counts[user1._id]
    );

    const mostPopularMan = sortedUsers.find(
      (user) => user.gender_identity === "man"
    );
    const mostPopularWoman = sortedUsers.find(
      (user) => user.gender_identity === "woman"
    );

    res.json({
      mostPopularMan,
      mostPopularWoman,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    client.close();
  }
});

httpServer.listen(PORT, () => console.log("server running on PORT " + PORT));

// move to other file
async function sendVerificationEmail(userEmail) {
  try {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "lola.kellner@gmail.com", // replace with your Gmail address
        pass: "yxmknonghwvmnbkx", // replace with your Gmail password
      },
    });

    // Generate a verification URL with the verification code and email
    const verificationUrl = `http://localhost:8000/verify?code=${verificationCode}&email=${userEmail}`;

    // Update the user's verification code in the database
    const client = new MongoClient(uri);
    await client.connect();
    const usersCollection = client.db("app-data").collection("users");
    await usersCollection.updateOne(
      { email: userEmail },
      { $set: { verificationCode } }
    );
    await client.close();

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "lola.kellner@gmail.com", // replace with your Gmail address
      to: userEmail,
      subject: "Email Verification",
      html: `
        <p>Hello,</p>
        <p>Thank you for signing up! Please click on the following link to confirm your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
      `,
    });

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error(error);
  }
}
