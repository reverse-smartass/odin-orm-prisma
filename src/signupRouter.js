import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { Router } from 'express';

const signupRouter = Router();

signupRouter.get("/", (req, res) => res.render("sign-up-form"));

const validateSignUp = [
  body("first_name")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .escape(),
  body("last_name")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .escape(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("email must be a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // Custom validator to check if passwords match
  body("password_confirm").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

signupRouter.post("/", validateSignUp, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("sign-up-form", {
      errors: errors.array(),
      previousData: req.body,
    });
  }
  const { first_name, last_name, email, password, password_confirm } = req.body;
  if (first_name && last_name && email && password && password_confirm) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name: first_name + " " + last_name,
          email: email,
          password: hashedPassword,
        },
        include: {
          posts: true,
        },
      });
      console.log("Created user:", user);
      res.redirect("/");
    } catch (err) {
      return next(err);
    }
  }
});

export default signupRouter;
