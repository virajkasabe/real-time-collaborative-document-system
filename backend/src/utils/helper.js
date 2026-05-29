import User from "../module/auth/auth.model.js";
import Doc from "../module/document/document.model.js";
import { getDocument, setDocument } from "../redis/client.js";

export const secureUser =  async(userId) => {
  await User.findById(userId).select("-password -refreshToken -emailVerificationToken -emailVerificationExpiry")
}

export const fetchDoc = async(docId) => {
    let document = null;
    document = await getDocument(docId)
    if(!document) {
          document = await Doc.findById(docId)
            if(document) {
                  await setDocument(docId, document)
            }
    }
    return document
}
