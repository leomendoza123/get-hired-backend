import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Auth } from "./auth.helper";
import { CreateCampaignEndpoint } from "./types/campaign.interface";

export const createCampaignCallable = functions.https.onCall(
  (
    campaign: CreateCampaignEndpoint,
    context: functions.https.CallableContext
  ): PromiseLike<any> => {
      
    const currentUserUid = Auth.getUid(context);
    const db = admin.firestore();

    return Auth.checkIfUserIsClientAdmin(
      currentUserUid,
      campaign.client,
      db
    ).then(() => {
      return db
        .collection(`client/${campaign.client}/campaign.definition`)
        .doc(campaign.name)
        .create(campaign)
        .then(function(response) {
          return response;
        });
    });
  }
);

/*
   createCampaignCallable({client: "mockClient", name: "mockCampaign"})
*/
