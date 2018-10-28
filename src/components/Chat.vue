<template lang="html">
  <div class="chat">
    <div class="container">
      <div class="username">{{senderPerson}} <span v-if="heIsTyping">typing...</span> </div>
      <form>
        <textarea placeholder="message..." v-model="myMessage" @keyup.enter="sendMessage"></textarea>
        <button id="send" v-on:click="sendMessage">
          <span class="glyphicon glyphicon-send">send</span>
        </button>
      </form>

      <div id="Box" class = "messages">
        <div>

        </div>

        <div v-for="(message, index) in messages" v-bind:class="JSON.parse(message).class+'-box'">
          <p v-bind:class="JSON.parse(message).class" :data-animation="index==messages.length-1" v-bind:title="new Date(JSON.parse(message).time * 1000)">
            {{JSON.parse(message).text}}

            <!-- <span class="time">
              {{ new Date(JSON.parse(message).time * 1000).getHours() }} : {{ new Date(JSON.parse(message).time * 1000).getMinutes() }}
            </span> -->

            <span class="time">
              {{ formatAMPM(new Date(JSON.parse(message).time * 1000))}}
            </span>
          </p>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
import * as firebase from 'firebase'
export default {
  name: 'Chat',
  data () {
    return {
      messages: [],
      replys: [],
      dateNow: new Date(),
      senderPerson: '',
      myMessage: '',
      iAmTyping: false,
      heIsTyping: false
    }
  },
  methods: {
    getMessages: function(){
      this.messages = [];
      var currentUser = firebase.auth().currentUser.email;
      var senderUser = this.$route.params.name;
      this.senderPerson = senderUser;
      console.log(senderUser);
      console.table(currentUser);
      firebase.firestore().collection("users").doc(currentUser).collection("messages").doc(senderUser).get().then(doc => {
        var uuu = JSON.stringify(doc.data());
        var sss = JSON.parse(uuu);
        for(var i = 0; i < sss.conversation.length; i++) {
          if(sss.conversation[i].sender === currentUser){
            var message = {
              time: sss.conversation[i].created_at.seconds,
              class: 'message',
              text: sss.conversation[i].text
            }
            this.messages.push(JSON.stringify(message))
          }
          else if(sss.conversation[i].sender === senderUser) {
            var message = {
              time: sss.conversation[i].created_at.seconds,
              class: 'reply',
              text: sss.conversation[i].text
            }
            this.messages.push(JSON.stringify(message))
          }
          else {
            console.log('not equal');
          }
        }
        this.messages.toString();
        console.log(this.messages);
      });

    },
    sendMessage: function(e) {
      e.preventDefault();
      var currentUser = firebase.auth().currentUser.email;
      var senderUser = this.$route.params.name;

      if(this.myMessage.length > 0){
        // save to the cuurent user
        firebase.firestore().collection("users").doc(currentUser).collection("messages").doc(senderUser).set({
            participants: [
              {
                name: currentUser,
                typing: false,
              },
              {
                name: senderUser,
                typing: false
              }
            ],
            conversation: firebase.firestore.FieldValue.arrayUnion({
              "created_at": new Date(),
              "sender": currentUser,
              "text": this.myMessage
            })
        }, { merge: true })
        .then(() => {

            this.myMessage = "";
            console.log("Document successfully written!");
        })
        .catch(error =>{
            console.error("Error writing document: ", error);
        });

        // save to the another user
        firebase.firestore().collection("users").doc(senderUser).collection("messages").doc(currentUser).set({
          participants: [
            {
              name: currentUser,
              typing: false,
            },
            {
              name: senderUser,
              typing: false
            }
          ],
            conversation: firebase.firestore.FieldValue.arrayUnion({
              "created_at": new Date(),
              "sender": currentUser,
              "text": this.myMessage
            })
        }, { merge: true })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch(error =>{
            console.error("Error writing document: ", error);
        });
        var box = this.$el.querySelector("#Box");
        box.scrollTop = box.scrollHeight;
      }
      console.log(this.myMessage.length);
      //e.preventDefault();
    },
    clickOnEnter: function(event){
      if(event.keyCode == 13 && !event.shiftKey) {
        event.preventDefault;
        this.sendMessage;
      }
    },
    formatAMPM: function(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    },
    iAmTypingFun: function() {
      // typing for the cuurent user
      firebase.firestore().collection("users").doc(currentUser).collection("messages").doc(senderUser).set({
          participants: [
            {
              name: currentUser,
              typing: true,
            }
          ]
      }, { merge: true })
      .then(() => {
          this.iAmTyping = true;
          console.log("typing successfully done!");
      })
      .catch(error =>{
          console.error("Error writing document: ", error);
      });
    },
    heIsTypingFun: function() {
      // typing for the another user
      firebase.firestore().collection("users").doc(senderUser).collection("messages").doc(currentUser).set({
        participants: [
          {
            name: senderUser,
            typing: true,
          }
        ]
      }, { merge: true })
      .then(() => {
        this.heIsTyping = true;
        console.log("typing successfully done!");
      })
      .catch(error =>{
          console.error("Error writing document: ", error);
      });
    },
    iAmNotTypingFun: function() {
      // not typing for the cuurent user
      firebase.firestore().collection("users").doc(currentUser).collection("messages").doc(senderUser).set({
          participants: [
            {
              name: currentUser,
              typing: false,
            }
          ]
      }, { merge: true })
      .then(() => {
          this.iAmTyping = false;
          console.log("typing successfully done!");
      })
      .catch(error =>{
          console.error("Error writing document: ", error);
      });
    },
    heIsNotTypingFun: function() {
      // not typing for the another user
      firebase.firestore().collection("users").doc(senderUser).collection("messages").doc(currentUser).set({
        participants: [
          {
            name: senderUser,
            typing: false,
          }
        ]
      }, { merge: true })
      .then(() => {
        this.heIsTyping = false;
        console.log("typing successfully done!");
      })
      .catch(error =>{
          console.error("Error writing document: ", error);
      });
    }


  },
  updated () {
    var box = this.$el.querySelector("#Box");
    box.scrollTop = box.scrollHeight;
  },
  created: function() {
    this.messages = [];
    this.getMessages();
    firebase.firestore().collection("users").doc(firebase.auth().currentUser.email).collection("messages").doc(this.senderPerson).onSnapshot(doc => {

        this.messages = [];
        this.getMessages();
    });
    // firebase.firestore().collection("users").doc(this.senderPerson).collection("messages").doc(firebase.auth().currentUser.email).onSnapshot(doc => {
    //     this.messages = [];
    //     this.getMessages();
    // });
    this.messages = [];

  }
}
</script>

<style lang="css">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}


.container {
  height: 90vh;
  width: 100%;
  border: 1px solid black;
  position: relative;
  overflow: hidden;
}

.username {
  color: white;
  background: black;
  position: absolute;
  height: 40px;
  width: 100%;
  left: 0;
  to: 0;
  font-size: 16px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  padding-left: 5px;
  cursor: pointer;
}

textarea {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 80%;
  border: none;
  outline: none;
  border-top: 1px solid black;
  padding: 2px 5px;
  font-size: 15px;
  word-spacing: 2px;
  resize: none;
}

#send {
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  background: black;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  width: 20%;
  cursor: pointer
}
#send span {
  psition: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.messages {
  position: absolute;
  bottom: 40px;
  max-height: calc(100% - 80px);
  left: 0;
  width: 99%;
  overflow-x: hidden;
}

.message-box, .reply-box {
  width: 100%;
  display: block;
  margin: 3px 0px;
}
.message-box{
  text-align: right;
}

.reply-box {
  text-align: left;
}

.message {
  color: white;
  background: black;
  position: relative;
  margin: 0px 5px;
  display: inline-block;
  word-break: break-all;
  max-width: 100%;
  padding: 5px;
  border-radius: 10px;
}

.time{
  display: block;
  margin-top: 15px;
  font-size: 10px;
  color: gray;
}

.reply .time{
  color: black;
}

@keyframes push {
  from {
    opacity: 0;
    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

@keyframes push2 {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }

  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }

  75% {
    transform: translate3d(10px, 0, 0);
  }

  90% {
    transform: translate3d(-5px, 0, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}
.message[data-animation] {
  animation: push 0.3s cubic-bezier(0.49, 1.53, 0.96, 1.03) both;
}

.reply[data-animation] {
  animation: push2 0.3s ease both;
}

.reply {
  color: black;
  background: #f8f8f8;
  position: relative;
  margin: 0px 5px;
  display: inline-block;
  word-break: break-all;
  max-width: 100%;
  padding: 5px;
  border-radius: 10px;
  text-align: left;
}


</style>
