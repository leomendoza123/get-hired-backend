import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";

Auth.setLocalTestMode(true);
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://get-hired-516c2.firebaseio.com"
});

export { onUserSignUpTrigger } from "./on-user-sign-up.trigger";
export { startTestCallable } from "./start-test.callable";
export { createCampaignCallable } from "./create-campaign.callable";
export { createTestCallable } from "./create-test.callable";
export { answerQuestionCallable } from "./answer-question.callable";
export { finishTestCallable } from "./finish-test.callable";

// UPDATE-USER-DATA (Person):
// return Person
//
// verify Person data is valid

// FINISH-ALL ()
// return Person
//
// verify if all required Person data is filled

// GET-USER-DATA ()
// return Person
