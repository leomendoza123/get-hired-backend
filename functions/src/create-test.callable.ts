import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";
import { CreateTestEndpoint } from "./types";

export const createTestCallable = functions.https.onCall(
  (test: CreateTestEndpoint, context: functions.https.CallableContext): PromiseLike<any> => {
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

/* 

createTestCallable({client: "mockClient", campaign: "mockCampaign", subject: "mockSubject", 
      requiredAmountAnswers : 2,
      question:
      [
        {
          id: "1",
          value: "Can multiple a Behavioral subject have multiple observers?",
          expectedAnswerId: "1",
          answers: [
            {
              id: "1",
              value: "Heck yeah!"
            },
            {
              id: "2",
              value: "No way"
            },
            {
              id: "3",
              value: "Only when the subscribers are inside a service"
            },
            {
              id: "4",
              value: "Only when the observer "
            }
          ]
        },
        {
          id: "2",
          value: "If you want to reduce the total size of your application, improve security and have a faster render what would you use? ",
          expectedAnswerId: "1",
          answers: [
            {
              id: "1",
              value: "AOT compilation will do it!"
            },
            {
              id: "2",
              value: "JIT compilation is the best!"
            },
            {
              id: "3",
              value: "RFID compilation for sure!"
            },
            {
              id: "4",
              value: "NAN compilation is what you need"
            }
          ]
        },
        {
          id: "3",
          value: "What’s lazy loading?",
          expectedAnswerId: "1",
          answers: [
            {
              id: "1",
              value:
                "Is loading every module on the first load so the application can remain lazy for the rest of its life cycle"
            },
            {
              id: "2",
              value:
                "Is loading just what you need, when you need it because the application is too lazy to load everything at once"
            },
            {
              id: "3",
              value: "Is loading the application slowly for testing purposes"
            },
            {
              id: "4",
              value:
                "Is loading a lightweight version of the application for the less powerful devices"
            }
          ]
        }
      ]
})

*/
