const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object()
  .keys({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
  })
  .messages({
    "any.required": "missing required {#label} field ",
  });

const loginSchema = Joi.object()
  .keys({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
  })
  .messages({
    "any.required": "missing required {#label} field ",
  });

const schemas = {
  registerSchema,
  loginSchema,
};

const User = model("user", userSchema);

module.exports = {
  User,
  schemas,
};
