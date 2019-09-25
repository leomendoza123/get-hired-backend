import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://get-hired-516c2.firebaseio.com"
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  const db = admin.firestore();
  db.collection("campaign/avantica/test/angular/question")
    .get()
    .then(function(data) {
      response.send(data.docs);
    })
    .catch(err => {
      console.log(err);
    });
});

// CREATE-USER-PROFILE
export const newUser = functions.auth
  .user()
  .onCreate((user: admin.auth.UserRecord) => {
    const db = admin.firestore();
    const jsonUser =  JSON.parse(JSON.stringify(user.toJSON()));
    console.log(jsonUser);
    db.collection("user")
      .doc(user.uid)
      .create(jsonUser)
      .then(value => {
        console.log(value);
        return value;
      })
      .catch(error => console.log(error));
  });

// START-TEST (subject, force)
// return {question}
//
// verify the test subject is valid
// if force finish any pre-existing un-finished tests
// start a new tests and save send question and test as last send elements

export const startTest = functions.https.onRequest((request, response) => {
  const db = admin.firestore();
  db.collection("campaign/react-angular/tests/angular/questions")
    .get()
    .then(function(data) {
      response.send(data);
    })
    .catch(err => {
      console.log(err);
    });
});

// ANSWER-QUESTION (Question)
// return {Question}
//
// verify the object is valid
// verify the question and answer exists
// save question on the test object
// save send question as last asked question

// FINISH-TEST ()
// return Person
//
// verify that is possible to finish the test

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
