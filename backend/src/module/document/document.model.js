import mongoose from "mongoose";
import { docsUserType, docsUserTypeEnum } from "../../utils/constant.js";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
    },
    users: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          default: docsUserType.VIEWR,
          enum: docsUserTypeEnum,
        },
      },
    ],
    content: {
      // TODO : CONTENT WILL BE ANY FORM I WILL DICIDE FIRST AND THEN I WILL WRITE TYPE
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);


const Doc = mongoose.model("Document", documentSchema);
export default Doc;
