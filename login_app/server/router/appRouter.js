import { Router } from 'express';
import * as controller from '../controller/appController.js';
import { registerMail } from '../controller/mailer.js';
import Auth from '../middleware/auth.js';
import UserModel from "../model/User.model.js";

const router = Router();

// Public routes
router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/registerMail', registerMail);
router.post('/refresh-token', controller.refreshToken || ((req, res) => res.send('OK')));

// ✅ FIXED AUTHENTICATE ROUTE
router.post('/authenticate', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username)
      return res.status(400).send({ error: "Username is required" });

    const user = await UserModel.findOne({ username });

    if (!user)
      return res.status(404).send({ error: "User not found" });

    return res.status(200).send({
      success: true,
      username: user.username,
      email: user.email,
      profile: user.profile || "",
    });

  } catch (error) {
    return res.status(500).send({ error: "Internal Server Error" });
  }
});

// OTP + Reset Password Routes
router.get('/generateOTP', controller.generateOTP);
router.get('/verifyOTP', controller.verifyOTP);
router.get('/createResetSession', controller.createResetSession);
router.put('/resetPassword', controller.resetPassword);

// Protected routes
router.get('/user/:username', controller.getUser);
router.put('/updateuser', Auth, controller.updateUser);

export default router;
