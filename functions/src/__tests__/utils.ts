import admin = require("firebase-admin");
const firebase_tools = require("firebase-tools");
import { exampleUserRecord } from "firebase-functions-test/lib/providers/auth";

import {
  CreateClientEndpoint,
  CreateCampaignEndpoint,
  CreateTestEndpoint,
  StartTestEndpoint,
  TestInProgress,
  AnswerEndPoint
} from "../types";

export const MOCK_USER = {
  uid: "122",
  displayName: "lee",
  phoneNumber: "000000000"
};

export const MOCK_CLIENT: CreateClientEndpoint = {
  name: "mockClient"
};

export const MOCK_CAMPAIGN: CreateCampaignEndpoint = {
  name: "mockCampaign",
  client: MOCK_CLIENT.name
};

export const MOCK_TEST: CreateTestEndpoint = {
  client: MOCK_CAMPAIGN.client,
  campaign: MOCK_CAMPAIGN.name,
  subject: "mockTest",
  requiredAmountAnswers: 2,
  question: [
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
      value:
        "If you want to reduce the total size of your application, improve security and have a faster render what would you use? ",
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
};

export const MOCK_TEST_IN_PROGRESS: TestInProgress = {
  lastSendQuestion: {
    optional: false,
    ...MOCK_TEST.question[0]
  },
  startDate: new Date(),
  canFinish: false,
  ...MOCK_TEST
};

export const MOCK_START_TEST: StartTestEndpoint = {
  client: MOCK_TEST.client,
  subject: MOCK_TEST.subject,
  campaign: MOCK_TEST.campaign
};

export const MOCK_ANSWER: AnswerEndPoint = {
  client: MOCK_TEST.client,
  subject: MOCK_TEST.subject,
  campaign: MOCK_TEST.campaign,
  id: MOCK_TEST_IN_PROGRESS.lastSendQuestion.answers[0].id
};

export function createMockClient() {
  return admin
    .firestore()
    .doc(`/client/${MOCK_CLIENT.name}`)
    .create(MOCK_CLIENT)
    .then(data => data);
}

export function createMockCampaign() {
  return admin
    .firestore()
    .doc(
      `/client/${MOCK_TEST.client}/campaign.definition/${MOCK_CAMPAIGN.client}`
    )
    .create(MOCK_CAMPAIGN)
    .then(data => data);
}

export function createMockTest() {
  return admin
    .firestore()
    .doc(
      `/client/${MOCK_TEST.client}/campaign.definition/${MOCK_TEST.campaign}/test.definition/${MOCK_TEST.subject}`
    )
    .create(MOCK_TEST)
    .then(data => data);
}

export function createMockTestInProgress() {
  return admin
    .firestore()
    .doc(
      `/client/${MOCK_TEST_IN_PROGRESS.client}/campaign/${
        MOCK_TEST_IN_PROGRESS.campaign
      }/user/${exampleUserRecord().uid}/test/${MOCK_TEST_IN_PROGRESS.subject}`
    )
    .create(MOCK_TEST_IN_PROGRESS)
    .then(data => data);
}

export async function deleteMockClient() {
  return await firebase_tools.firestore.delete(`/client/${MOCK_TEST.client}`, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true
  });
}
