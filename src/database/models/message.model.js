import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      trim: true,
      minLength: [1, "Message cannot be empty"],
      maxLength: [5000, "Message is too long"],
    },
    attachment: {
      type: String,
      trim: true,
      default: null,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User",
      index: true,
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      required: [true, "receiverId is required"],
      ref: "User",
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.isDeleted;

        if (ret.attachmentUrl) {
          ret.attachment = ret.attachmentUrl;
        }
        delete ret.attachmentUrl;

        return ret;
      },
    },
    toObject: { virtuals: true },
  },
);

messageSchema.virtual("attachmentUrl").get(function () {
  if (!this.attachment) return null;
  return `${process.env.BASE_URL}/${this.attachment}`;
});

export const messageModel = model("Message", messageSchema);
