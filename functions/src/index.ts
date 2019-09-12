import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
 export const helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});



// START-TEST (subject, force) 
// return {question}
//
// verify the test subject is valid
// if force finish any pre-existing un-finished tests
// start a new tests and save send question and test as last send elements

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