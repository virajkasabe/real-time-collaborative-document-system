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
          type : mongoose.Schema.Types.Mixed,
          default : {}
      },
      isPublic : {
        type : Boolean,
        default : false
      },

  }, { timestamps : true }
)

const Doc =  mongoose.model("Document", documentSchema)
export default Doc;
