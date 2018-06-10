<template>
    <div id="dashboard">
        <section>
            <div class="col1">
                <div class="profile">
                    <h5>{{ userProfile.name }}</h5>
                    <p>{{ userProfile.title }}</p>
                    <div class="create-post">
                        <p>create a post</p>
                        <form @submit.prevent>
                            <textarea v-model.trim="post.content" id="post" v-focus></textarea>
                            <button @click="createPost" :disabled='post.content===""' class="button">post</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col2">
              <div v-if="posts.length">
                  <div v-for="(post, idx ) in posts" class="post" :key="idx">
                      <h5>{{ post.userName }}</h5>
                      <span>{{ post.createdOn | formatTS }}</span>
                      <p>{{ post.content }}</p>
                      <ul>
                          <li><a @click="openCommentModal(post)">comments {{ post.comments }}</a></li>
                          <li><a @click="likePost(post.id, post.likes)">likes {{ post.likes }}</a></li>
                          <li><a @click="viewPost(post)">view full post</a></li>
                      </ul>
                  </div>
              </div>
                <div v-else>
                    <p class="no-results">There are currently no posts</p>
                </div>

                <!-- comment modal -->
                <transition name="fade">
                    <div v-if="showCommentModal" class="c-modal">
                        <div class="c-container">
                            <a @click="closeCommentModal">X</a>
                            <p>add a comment</p>
                            <form @submit.prevent>
                                <textarea v-model.trim="comment.content"></textarea>
                                <button @click="addComment" :disabled="comment.content == ''" class="button">add comment</button>
                            </form>
                        </div>
                    </div>
                </transition>

                <!-- post modal -->
                <transition name="fade">
                    <div v-if="showPostModal" class="p-modal">
                        <div class="p-container">
                            <a @click="closePostModal" class="close">X</a>
                            <div class="post">
                                <h5>{{ fullPost.userName }}</h5>
                                <span>{{ fullPost.createdOn | formatTS }}</span>
                                <p>{{ fullPost.content }}</p>
                                <ul>
                                    <li><a>comments {{ fullPost.comments }}</a></li>
                                    <li><a>likes {{ fullPost.likes }}</a></li>
                                </ul>
                            </div>
                            <div v-show="postComments.length" class="comments">
                                <div v-for="(comment, idx) in postComments" class="comment" :key="idx">
                                    <p>{{ comment.userName }}</p>
                                    <span>{{ comment.createdOn | formatTS }}</span>
                                    <p>{{ comment.content }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition>

            </div>
        </section>
    </div>
</template>

<script>
import { mapState } from "vuex"
import { postsCollection } from "@/firebase/init.js"
export default {
  data() {
    return {
      post: {
        content: ""
      },
      showCommentModal: false,
      showPostModal: false,
    //   fullPost: {},
    //   postComments: [],
      comment: {
        postId: "",
        userId: "",
        content: "",
        postComments: 0
      }
    }
  },
  computed: {
    ...mapState(["userProfile", "currentUser", "posts", "postComments", "fullPost"])
  },
  methods: {
    createPost() {
      postsCollection
        .add({
          createdOn: Date.now(),
          content: this.post.content,
          userId: this.currentUser.user.uid,
          userName: this.userProfile.name,
          comments: 0,
          likes: 0
        })
        .then(ref => {
          this.$store.dispatch("fetchPosts")
          this.post.content = ""
        })
        .catch(err => {
          console.log(err)
        })
    },
    openCommentModal(post) {
      this.comment.postId = post.id
      this.comment.userId = post.userId
      this.comment.postComments = post.comments
      this.showCommentModal = true
    },
    closeCommentModal() {
      this.comment.postId = ""
      this.comment.userId = ""
      this.comment.content = ""
      this.showCommentModal = false
    },
    addComment() {
      let objComment = {
        createdOn: Date.now(),
        content: this.comment.content,
        postId: this.comment.postId,
        userId: this.currentUser.user.uid,
        userName: this.userProfile.name,
        postComments: this.comment.postComments
      }
      this.$store.dispatch("addComment", objComment).then(() => {
        this.closeCommentModal()
      })
    },
    likePost(postId, postLikes) {
      let docId = `${this.currentUser.user.uid}_${postId}`
      let objLike = {
        postId,
        postLikes,
        docId,
        userId: this.currentUser.user.uid
      }
      this.$store.dispatch("likePost", objLike)
    },
    viewPost(post) {
      this.$store.dispatch("viewPost", post)
      this.showPostModal = true
    },
    closePostModal() {
      this.postComments = []
      this.showPostModal = false
    }
  }
}
</script>

<style scoped>
</style>