import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

/** ✅ REGISTER USER */
export async function register(req, res) {
  console.log("📥 Incoming Register Body:", req.body); // 🪄 Debug log

  try {
    const { username, password, email, profile } = req.body;

    // 1️⃣ Check for missing fields
    if (!username || !password || !email)
      return res.status(400).send({ error: "All fields are required!" });

    // 2️⃣ Check for duplicate username
    const existUsername = await UserModel.findOne({ username });
    if (existUsername) {
      console.log("🚨 Username already exists:", existUsername.username);
      return res.status(400).send({ error: "Username already exists" });
    }

    // 3️⃣ Check for duplicate email
    const existEmail = await UserModel.findOne({ email });
    if (existEmail) {
      console.log("🚨 Email already exists:", existEmail.email);
      return res.status(400).send({ error: "Email already exists" });
    }

    // 4️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ Create user
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
      profile: profile || "",
    });

    await user.save();
    console.log("✅ User Registered:", username);
    return res.status(201).send({ msg: "User Registered Successfully!" });

  } catch (error) {
    console.error("❌ Register Error:", error.message);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** ✅ REGISTER MAIL FUNCTION */
export async function registerMail(req, res) {
  const { username, userEmail, subject, text } = req.body;

  try {
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let message = {
      from: `"Mail Service" <${testAccount.user}>`,
      to: userEmail,
      subject: subject || "Welcome to Our App 🎉",
      text: text || `Hello ${username}, your registration was successful!`,
      html: `
        <div style="font-family:sans-serif; line-height:1.6">
          <h2>Welcome, ${username}!</h2>
          <p>${text || "Your registration was successful!"}</p>
          <p><b>Thank you for joining us!</b></p>
        </div>
      `,
    };

    let info = await transporter.sendMail(message);

    console.log(`✅ Email sent to ${userEmail}`);
    console.log(`🔗 Preview: ${nodemailer.getTestMessageUrl(info)}`);

    return res.status(200).send({
      msg: "Email sent successfully!",
      previewURL: nodemailer.getTestMessageUrl(info),
    });

  } catch (error) {
    console.error("❌ Email sending error:", error.message);
    return res.status(500).send({ error: "Failed to send email" });
  }
}

/** ✅ LOGIN USER */
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck)
      return res.status(400).send({ error: "Incorrect password" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).send({
      msg: "Login successful!",
      username: user.username,
      token,
    });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

/** ✅ GET USER */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });

    const { password, ...rest } = Object.assign({}, user.toJSON());
    return res.status(200).send(rest);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}

/** ✅ UPDATE USER */
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      const updateResult = await UserModel.updateOne({ _id: userId }, body);
      return res.status(201).send({ msg: "Record Updated!" });
    } else {
      return res.status(401).send({ error: "User Not Found!" });
    }
  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

/** ✅ GENERATE OTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** ✅ VERIFY OTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    return res.status(201).send({ msg: "Verify Successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

/** ✅ CREATE RESET SESSION */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

/** ✅ RESET PASSWORD */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Password Updated Successfully!" });
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
  }
}
