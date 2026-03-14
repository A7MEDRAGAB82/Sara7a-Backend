import mongoose from "mongoose";
import {
  GenderEnums,
  ProviderEnums,
  generateHash,
  compareHash,
  encrypt,
  roleEnums
} from "../../common/index.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === ProviderEnums.System;
      },
    },
    phone: String,
    DOB: Date,
    gender: {
      type: String,
      enum: Object.values(GenderEnums),
      default: GenderEnums.Male,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnums),
      default: ProviderEnums.System,
    },
    role:{
        type:String,
        enum: Object.values(roleEnums),
        default: roleEnums.User
    },
    passwordChangedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .set(function (value) {
    if (!value) return;
    let split = value.split(" ");
    this.firstName = split[0];
    this.lastName = split.length > 1 ? split[1] : "";
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });

userSchema.pre("save", async function () {
    
    if (this.isModified("password")) {
        this.password = await generateHash(this.password);

        this.passwordChangedAt = Date.now()
    }

    if (this.isModified("phone")) {
        this.phone = encrypt(this.phone);
    }
    
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await compareHash(enteredPassword, this.password);
};

export const userModel = mongoose.model("User", userSchema);
