const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
const body = document.getElementById('body');
const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modalButton');
const meetingWrapper = document.getElementById('meetingWrapper');
// const showChat = document.querySelector("#showChat");
// const backBtn = document.querySelector(".header__back");
myVideo.muted = true;

let user = "";

modalBtn.addEventListener("click", () => {
   modal.classList.remove("flex");
   modal.classList.add("hidden");

   meetingWrapper.classList.remove("hidden");
   meetingWrapper.classList.add("block");

   user = prompt("Enter your name");
   body.requestFullscreen({ navigationUI: "show" }).then(() => { }).catch((err) => {
      alert(`An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`);
   });
});

var peer = new Peer(undefined, {
   path: "/peerjs",
   host: "/",
   port: "443",
});

let myVideoStream;
navigator.mediaDevices
   .getUserMedia({
      audio: true,
      video: true,
   })
   .then((stream) => {
      myVideoStream = stream;
      addVideoStream(myVideo, stream);

      peer.on("call", (call) => {
         call.answer(stream);
         const video = document.createElement("video");
         call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
         });
      });

      socket.on("user-connected", (userId) => {
         connectToNewUser(userId, stream);
      });
   });

const connectToNewUser = (userId, stream) => {
   const call = peer.call(userId, stream);
   const video = document.createElement("video");
   call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
   });
};

peer.on("open", (id) => {
   socket.emit("join-room", ROOM_ID, id, user);
});

const addVideoStream = (video, stream) => {
   video.srcObject = stream;
   video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(video);
   });
};

let text = document.getElementById("chat_message");
let send = document.getElementById("send");
let messages = document.getElementById("messages");

send.addEventListener("click", (e) => {
   if (text.value.length !== 0) {
      socket.emit("message", text.value);
      text.value = "";
   }
});

text.addEventListener("keydown", (e) => {
   if (e.key === "Enter" && text.value.length !== 0) {
      socket.emit("message", text.value);
      text.value = "";
   }
});

const inviteButton = document.getElementById("inviteButton");
const muteButton = document.getElementById("micBtn");
const stopVideo = document.getElementById("videoBtn");
const endBtn = document.getElementById("endBtn");

muteButton.addEventListener("click", () => {
   const enabled = myVideoStream.getAudioTracks()[0].enabled;
   if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      //   html = `<i class="fas fa-microphone-slash"></i>`;
      //   muteButton.classList.toggle("background__red");
      //   muteButton.innerHTML = html;
      muteButton.classList.add("bg-red-600");
      muteButton.classList.remove("bg2");
      muteButton.innerHTML = `<i class="fa-solid fa-microphone-slash"></i>`;
   } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      //   html = `<i class="fas fa-microphone"></i>`;
      //   muteButton.classList.toggle("background__red");
      //   muteButton.innerHTML = html;
      muteButton.classList.add("bg2");
      muteButton.classList.remove("bg-red-600");
      muteButton.innerHTML = `<i class="fa-regular fa-microphone"></i>`;
   }
});

stopVideo.addEventListener("click", () => {
   const enabled = myVideoStream.getVideoTracks()[0].enabled;
   if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      //   html = `<i class="fas fa-video-slash"></i>`;
      //   stopVideo.classList.toggle("background__red");
      //   stopVideo.innerHTML = html;
      stopVideo.classList.add("bg-red-600");
      stopVideo.classList.remove("bg2");
      stopVideo.innerHTML = `<i class="fa-regular fa-video-slash"></i>`;
   } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      //   html = `<i class="fas fa-video"></i>`;
      //   stopVideo.classList.toggle("background__red");
      //   stopVideo.innerHTML = html;
      stopVideo.classList.add("bg2");
      stopVideo.classList.remove("bg-red-600");
      stopVideo.innerHTML = `<i class="fa-regular fa-video"></i>`;
   }
});

inviteButton.addEventListener("click", (e) => {
   prompt(
      "Copy this link and send it to people you want to meet with",
      window.location.href
   );
});

endBtn.addEventListener("click", () => {
   if (endBtn.classList.contains("bg2")) {
      endBtn.classList.add("bg-red-600");
      endBtn.classList.remove("bg2");
      endBtn.innerHTML = `<i class="fa-regular fa-phone-slash"></i>`;
   } else {
      endBtn.classList.add("bg2");
      endBtn.classList.remove("bg-red-600");
      endBtn.innerHTML = `<i class="fa-regular fa-phone"></i>`;
   }
});
const CodeMirrorCode = document.querySelector('.CodeMirror-code')
socket.on("createEditor", (code, userName) => {
   let str = CodeMirrorCode.innerHTML;
   str += code;
   CodeMirrorCode.innerHTML = str;
});
socket.on("createMessage", (message, userName) => {
   let str = messages.innerHTML;
   if (userName === user) {
      str += `
      <div
      class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
    >
      <div>
        <div
          class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg"
        >
          <p class="text-sm">
            ${message}
          </p>
        </div>
        <span class="text-xs text-gray-500 leading-none"
          >2 min ago</span
        >
      </div>
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"
      ></div>
    </div>`
   } else {
      str += `
      <div class="flex w-full mt-2 space-x-3 max-w-xs">
      <div
        class="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"
      ></div>
      <div>
        <div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p class="text-sm">
            ${message}.
          </p>
        </div>
        <span class="text-xs text-gray-500 leading-none"
          >2 min ago</span
        >
      </div>
    </div>
      `
   }
   messages.innerHTML = str;
   // messages.innerHTML =
   //   messages.innerHTML +
   //   `<div class="message">
   //       <b><i class="far fa-user-circle"></i> <span> ${userName === user ? "me" : userName
   //   }</span> </b>
   //       <span>${message}</span>
   //   </div>`;
});

// ===========================================================
let cppCode = '//Ace Interview\n#include<bits/stdc++.h>\nusing namespace std;\nint main()\n{\ncout<<"Allkj";\nreturn 0;\n}'
let javaCode = 'import java.util.*;\nimport java.lang.*;\nimport java.io.*;\n\nclass AceInterview\n{\npublic static void main (String[] args) throws java.lang.Exception\n{\n		// your code goes here  \n}\n}';

let pythonCode = '#Ace Interview\n#your code goes here..';

const langSelector = document.getElementById("languages");
const languages = [cppCode, javaCode, pythonCode];

langSelector.addEventListener("change", () => {
   console.log(langSelector.options[langSelector.selectedIndex].text);
});

const editor = CodeMirror(document.querySelector("#editor"), {
   // lineNumbers: true,
   tabSize: 2,
   value: "Write code here....",
   mode: "javascript",
   theme: "dracula",
   autofocus: true
});

let menuBtn = document.getElementById("menu");
let sidebar = document.getElementById("sidebar");
let mainContent = document.getElementById("mainContent");

menuBtn.addEventListener("click", () => {
   console.log("click");
   if (sidebar.classList.contains("flex")) {
      // not hidden
      sidebar.classList.remove("flex");
      sidebar.classList.add("hidden");
      mainContent.classList.remove("w-3/4");
      mainContent.classList.add("w-full");
   } else {
      sidebar.classList.add("flex");
      sidebar.classList.remove("hidden");
      mainContent.classList.remove("w-full");
      mainContent.classList.add("w-3/4");
   }
});

 // const micBtn = document.getElementById("micBtn");
 // const videoBtn = document.getElementById("videoBtn");
 // const endBtn = document.getElementById("endBtn");