/*

     === auth model ===
    === fields ===

      name,
      email,
      password -> before user save hash the password,
      refreshToken,
      isEmailVerified,
      avatar,
      loginType, in import from constant file
      verifyEmailToken,
      verifyEmailTokenExpiry,


     === methods ===

      password hashes,
      accessToken generate,
      refreshToken generate,
      generateTmporaryToken


*/
