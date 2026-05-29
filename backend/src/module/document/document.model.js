<<<<<<< HEAD
import mongoose from 'mongoose'
import { DOCUMENT_ROLES, DOCUMENT_ROLES_ENUM } from '../../utils/constant.js'


const documentSchema = new mongoose.Schema(
  {
      title : {
        type : String,
        default : ""
      },
      ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
      },
      users : [
          {
              userId : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
              },
              role : {
                type : String,
                required : true,
                default :DOCUMENT_ROLES.VIEWER ,
                enum : DOCUMENT_ROLES_ENUM
              },
          },
      ],
      content : {
          type : mongoose.Schema.Types.Mixed
      },
      version : {
        type : Number,
        default : 0
      },
      isPublic : {
        type : Boolean,
        default : false
      },
      isTrash : {
        type : Boolean,
        default : false
      }

  }, { timestamps : true }
)

const Doc =  mongoose.model("Document", documentSchema)
=======
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
>>>>>>> 228be66 (feat(document): implement document creation and fetching with Redis caching)
export default Doc;
