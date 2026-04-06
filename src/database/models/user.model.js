import {  Schema ,  model } from "mongoose";

import {
  GenderEnums,
  ProviderEnums,
  generateHash,
  compareHash,
  encrypt,
  roleEnums
} from "../../common/index.js";

const userSchema = new Schema(
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
    shareProfileName: {
      type: String,
      required: [true,"Share profile name is required"],
      unique: true,
      lowercase:true,
      trim:true,
      minLength: [3, "Share profile name must be at least 3 characters"]
    },
    bio: {
      type: String,
      maxLength: 30,
      trim: true,
    },
    profilePic: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id; 
        delete ret.id;
        delete ret.password;
        delete ret.email;
        delete ret.phone;
        delete ret.role;
        delete ret.provider;
        delete ret.updatedAt;
        delete ret.createdAt;
        delete ret.passwordChangedAt;
        
        delete ret.firstName;
        delete ret.lastName;

        // Replace raw path with absolute URL
        if (ret.profilePicUrl) {
          ret.profilePic = ret.profilePicUrl;
        }
        delete ret.profilePicUrl;

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

userSchema.virtual("profilePicUrl").get(function () {
  if (!this.profilePic) return null;
  return `${process.env.BASE_URL}/${this.profilePic}`;
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

export const userModel = model("User", userSchema);
