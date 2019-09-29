// CREATE-USER-PROFILE

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {Person} from "./types"


export const onUserSignUpTrigger = functions.auth
  .user()
  .onCreate((createdUser: admin.auth.UserRecord) => {

    const db = admin.firestore();

    // Creates a Person object with the collected data
    const user: Person = {
      phone: createdUser.phoneNumber || undefined,
      email: createdUser.email || undefined
    }

    return db.collection("user")
      .doc(createdUser.uid)
      .create(user)
      .then(value => {
        return value;
      })
      .catch(error => console.log(error));
  });
