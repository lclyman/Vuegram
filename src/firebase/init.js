import firebase from 'firebase'
import firestore from 'firebase/firestore'

var config = {
// your firebase config
};

firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = { timestampsInSnapshots: true }
db.settings(settings)

// firebase collections
const usersCollection = db.collection('vuegram-users')
const postsCollection = db.collection('vuegram-posts')
const commentsCollection = db.collection('vuegram-comments')
const likesCollection = db.collection('vuegram-likes')

export {
	db,
	auth,
	currentUser,
	usersCollection,
	postsCollection,
	commentsCollection,
	likesCollection
}
