import Vue from 'vue'
import router from '@/router/index'
import { db, auth, usersCollection, postsCollection, commentsCollection, likesCollection } from '@/firebase/init.js'

export const fetchUserProfile = ({commit, state}) => {
	usersCollection.doc(state.currentUser.user.uid).get().then(res => {
		commit('setUserProfile', res.data())
	}).catch(err => {
		console.log(err)
        commit('setErrMsg', err.message)
	})
}

export const fetchPosts = ({ commit }) => {
    postsCollection.orderBy('createdOn', 'desc').get()
    .then(snap => {
        let arrPosts = []
        snap.forEach(doc => {
            let post = doc.data()
            post.id = doc.id
            arrPosts.push(post)
        })
        commit('setPosts', arrPosts)
    })
}

export const clearData = ({ commit }) => {
	commit('clearData')
}

export const login = ({ commit, dispatch }, objUser) => {
    commit('setErrMsg', "")
    commit('setPerformingRequest', true)
    auth
    .signInWithEmailAndPassword(
        objUser.email,
        objUser.pwd
    )
    .then(user => {
        commit("setCurrentUser", user)
        dispatch("fetchUserProfile")
        dispatch("fetchPosts")
        commit('setPerformingRequest', false)
        router.push("/dashboard")
    })
    .catch(err => {
        commit('setErrMsg', err.message)
        commit('setPerformingRequest', false)
    })
}

export const signup = ({ commit, dispatch }, newUser) => {
    commit('setErrMsg', "")
    commit('setPerformingRequest', true)
    auth
    .createUserWithEmailAndPassword(
        newUser.email,
        newUser.pwd
    )
    .then(user => {
        commit("setCurrentUser", user)

        // create user obj
        usersCollection
        .doc(user.user.uid)
        .set({
            name: newUser.name,
            title: newUser.title
        })
        .then(() => {
            dispatch("fetchUserProfile")
            dispatch("fetchPosts")
            commit('setPerformingRequest', false)
            router.push("/dashboard")
        })
        .catch(err => {
            commit('setErrMsg', err.message)
        })
    })
    .catch(err => {
        commit('setErrMsg', err.message)
        commit('setPerformingRequest', false)
    })
}

export const resetPassword = ({ commit }, email) => {
    commit('setErrMsg', "")
    commit('setPerformingRequest', true)

    auth.sendPasswordResetEmail(email).then(() => {
        commit('setPerformingRequest', false)
        commit('setPasswordResetSuccess', true)
        commit('setErrMsg', "")
    }).catch(err => {
        commit('setPerformingRequest', false)
        commit('setErrMsg', err.message)
    })
}

export const addComment = ({ commit, dispatch }, objComment) => {
    commentsCollection.add(objComment)
    .then(doc => {
        postsCollection.doc(objComment.postId).update({
            comments: (objComment.postComments) + 1
        })
        dispatch('fetchPosts')
    }).catch(err => {
        commit('setErrMsg', err.message)
    })
}

export const likePost = ({ commit, dispatch }, objLike) => {
    likesCollection.doc(objLike.docId).get().then(doc => {
        if (doc.exists) {
            return
        }

        likesCollection.doc(objLike.docId).set({
            postId: objLike.postId,
            userId: objLike.userId
        }).then(() => {
            // update post likes
            postsCollection.doc(objLike.postId).update({
                likes: (objLike.postLikes) + 1
            })
            dispatch('fetchPosts')
        })
    }).catch(err => {
        console.log(err)
    })
}

export const viewPost = ({ commit }, post) => {
    commentsCollection.where('postId', '==', post.id).get().then(docs => {
        let arrComments = []

        docs.forEach(doc => {
            let comment = doc.data()
            comment.id = doc.id
            arrComments.push(comment)
        })

        commit('setPostComments', arrComments)
        commit('setFullPost', post)
    }).catch(err => {
        console.log(err)
    })
}

export const updateProfile = ({ commit, state, dispatch }, data) => {
    let name = data.name
    let title = data.title

    usersCollection.doc(state.currentUser.user.uid).update({ name, title }).then(user => {
        // update all posts by user to reflect new name
        postsCollection.where('userId', '==', state.currentUser.user.uid).get().then(docs => {
            docs.forEach(doc => {
                postsCollection.doc(doc.id).update({
                    userName: name
                })
            })
        })
        // update all comments by user to reflect new name
        commentsCollection.where('userId', '==', state.currentUser.user.uid).get().then(docs => {
            docs.forEach(doc => {
                commentsCollection.doc(doc.id).update({
                    userName: name
                })
            })
        }).then(()=> {
            dispatch("fetchPosts")
            dispatch('fetchUserProfile')
        })

    }).catch(err => {
        console.log(err)
    })
}
