
export const setCurrentUser = (state, val) => {
    state.currentUser = val
}

export const setErrMsg = (state, msg) => {
    state.errMsg = msg
}


export const setUserProfile = (state, val) => {
    state.userProfile = val
}

export const setPosts = (state, arrPosts) => {
    state.posts = arrPosts
}

export const setFullPost= (state, post) => {
    state.fullPost = post
}

export const setPostComments = (state, arrComments) => {
    state.postComments = arrComments
}

export const setPerformingRequest = (state, status) => {
    state.performingRequest = status
}

export const setPasswordResetSuccess = (state, status) => {
    state.passwordResetSuccess = status
}

export const clearData = state => {
    state.currentUser = null
    state.userProfile = {}
}