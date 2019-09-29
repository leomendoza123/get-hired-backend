import * as functions from "firebase-functions";
import { Client } from "./types";
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export class Auth {
  static setLocalTestMode(useMockUser: boolean = true) {
    this.useMockUser = useMockUser;
  }

  static mockUser = {
    uid: "mock",
    token: {
      aud: "01",
      auth_time: 0,
      exp: 0,
      firebase: {
        identities: {
          test: ""
        },
        sign_in_provider: "custom"
      },
      iat: 0,
      iss: "0",
      sub: "mock",
      uid: "mock"
    }
  };

  static useMockUser = false;

  static getUid(context: functions.https.CallableContext) {
    if (this.useMockUser) {
      context.auth = this.mockUser;
    }
    if (context && context.auth && context.auth.uid) {
      return context.auth.uid;
    } else {
      throw new functions.https.HttpsError(
        "failed-precondition",
        `The function must be called while authenticated.`
      );
    }
  }

  static async checkIfUserIsClientAdmin(
    currentUserUid: string,
    client: string,
    db: FirebaseFirestore.Firestore
  ) {
    return db
      .doc(`client/${client}`)
      .get()
      .then((value: DocumentSnapshot) => {
        const clientDoc = value.data() as Client;
        if (clientDoc) {
          const isAdmin = clientDoc.admin.find(
            adminUid => adminUid === currentUserUid
          );
          if (!isAdmin) {
            throw new functions.https.HttpsError(
              "permission-denied",
              `The current user (${currentUserUid}) is not an administrator of the client ${client}.`
            );
          }
        } else {
          throw new functions.https.HttpsError(
            "not-found",
            `Client ${client} not found.`
          );
        }
      });
  }
}
