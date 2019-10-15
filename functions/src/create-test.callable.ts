import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";
import { CreateTestEndpoint } from "./types";

export const createTestCallable = functions.https.onCall(
  (
    test: CreateTestEndpoint,
    context: functions.https.CallableContext
  ): PromiseLike<any> => {
    const currentUserUid = Auth.getUid(context);
    const db = admin.firestore();
    // TODO CHECK JSON structure

    return Auth.checkIfUserIsClientAdmin(currentUserUid, test.client, db).then(
      () => {
        return db
          .collection(
            `client/${test.client}/campaign.definition/${test.campaign}/test.definition`
          )
          .doc(test.subject)
          .create(test)
          .then(function(response) {
            return response;
          });
      }
    );
  }
);
