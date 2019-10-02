// CREATE-USER-PROFILE

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Person } from "./types";
import { Auth } from "./auth.helper";

export const onUserSignUpTrigger = functions.auth
  .user()
  .onCreate((createdUser: admin.auth.UserRecord) => {
    if (Auth.useMockUser) {
      // tslint:disable-next-line:no-parameter-reassignment
      createdUser = Auth.userRecord;
    }

    const db = admin.firestore();

    // Creates a Person object with the collected data
    const user: Person = {};
    createdUser.phoneNumber ? (user.phone = createdUser.phoneNumber) : null;
    createdUser.email ? (user.email = createdUser.email) : null;

    return db
      .collection("person")
      .doc(createdUser.uid)
      .create(user)
      .then(value => {
        return value;
      })
      .catch(error => console.log(error));
  });
