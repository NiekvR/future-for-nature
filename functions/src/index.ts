import * as functions from "firebase-functions";
const cors = require('cors')({ origin: true });

const { firebaseHelper } = require('firebase-functions-helper');
// @ts-ignore
import * as serviceAccount from './serviceAccount.json';
const app = firebaseHelper.initializeApp(serviceAccount);
const db = app.firestore;
db.settings({ timestampsInSnapshots: true });

exports.addUser = functions.https.onRequest((req, res) => {
  (async () => {
    if (req.method === 'OPTIONS') {
      cors(req, res, () => {
        res.status(200).send();
      });
    } else {
      try {
        const user = await firebaseHelper.createUser({
          email: req.body.data.email,
          emailVerified: false,
          password: 'WelkomFfN2022!',
          displayName: req.body.data.name,
          disabled: false,
        });

        cors(req, res, () => {
          res.status(200).send({data: { uid: user.data.uid }});
        });
      } catch (error) {
        cors(req, res, () => {
          res.status(400).send({data: {error: error}});
        });
      }
    }
  })();
});

exports.updateUser = functions.https.onRequest((req, res) => {
  (async () => {
    if (req.method === 'OPTIONS') {
      cors(req, res, () => {
        res.status(200).send();
      });
    } else {
      try {
        await firebaseHelper.updateUser(req.body.data.uid, {
          email: req.body.data.email,
          displayName: req.body.data.name
        });

        cors(req, res, () => {
          res.status(200).send({data: {}});
        });
      } catch (error) {
        cors(req, res, () => {
          res.status(400).send({data: {error: error}});
        });
      }
    }
  })();
});


exports.deleteUser = functions.https.onRequest((req, res) => {
  (async () => {
    if (req.method === 'OPTIONS') {
      cors(req, res, () => {
        res.status(200).send();
      });
    } else {
      try {
        await firebaseHelper.deleteUser(req.body.data.uid);

        cors(req, res, () => {
          res.status(200).send({data: {}});
        });
      } catch (error) {
        cors(req, res, () => {
          res.status(400).send({data: {error: error}});
        });
      }
    }
  })();
});
