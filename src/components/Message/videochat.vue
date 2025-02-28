<script setup>
import { ref, onMounted, nextTick } from "vue";
import io from "socket.io-client";
import { URL } from "../../auth/url.js";

const socket = io(URL);
const localStream = ref(null);
const peers = ref({});
const remoteStreams = ref({});
const remoteVideos = ref({});
const pendingCandidates = ref({});

// **Video elementni stream bilan to‘ldirish**
const attachStreamToVideo = (videoEl, stream) => {
  if (videoEl && stream) {
    if (videoEl.srcObject) {
      videoEl.srcObject.getTracks().forEach(track => track.stop()); // ⛔ Oldingi streamni to‘xtatish
    }
    videoEl.srcObject = stream;

    setTimeout(() => {
      videoEl.play().catch(err => console.error("⛔ Video autoplay xatosi:", err));
    }, 100); // 🔥 100ms kechikish qo‘shildi
  }
};


// **PeerConnection yaratish**
const createPeerConnection = (socketId) => {
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { target: socketId, candidate: event.candidate });
    }
  };

  peer.ontrack = (event) => {
    console.log("✅ Video stream qabul qilindi:", socketId);
    remoteStreams.value[socketId] = event.streams[0];

    nextTick(() => attachStreamToVideo(remoteVideos.value[socketId], event.streams[0]));
  };

  localStream.value.getTracks().forEach((track) => peer.addTrack(track, localStream.value));
  return peer;
};

// **Komponent yuklanganda ishga tushadi**
onMounted(async () => {
  try {
    localStream.value = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // **Local videoga stream bog‘lash**
    nextTick(() => attachStreamToVideo(document.getElementById("localVideo"), localStream.value));

    socket.emit("join-room", "defaultRoom");

    socket.on("user-joined", async (socketId) => {
      console.log("👤 Yangi foydalanuvchi qo‘shildi:", socketId);
      const peer = createPeerConnection(socketId);
      peers.value[socketId] = peer;

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit("offer", { target: socketId, offer });
    });

    socket.on("offer", async ({ sender, offer }) => {
      console.log("📡 Offer qabul qilindi:", sender);
      if (!peers.value[sender]) {
        peers.value[sender] = createPeerConnection(sender);
      }

      const peer = peers.value[sender];

      setTimeout(async () => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { target: sender, answer });
      }, 500);
    });

    socket.on("answer", async ({ sender, answer }) => {
      console.log("📩 Answer qabul qilindi:", sender);
      const peer = peers.value[sender];

      if (peer.signalingState === "have-local-offer") {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    socket.on("ice-candidate", async ({ sender, candidate }) => {
      console.log("❄ ICE Candidate qabul qilindi:", sender);
      const peer = peers.value[sender];

      if (!peer || !peer.remoteDescription) {
        console.warn("🚧 ICE Candidate vaqtincha saqlanmoqda:", sender);
        if (!pendingCandidates.value[sender]) {
          pendingCandidates.value[sender] = [];
        }
        pendingCandidates.value[sender].push(candidate);
        return;
      }

      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on("user-disconnected", (socketId) => {
      console.log("❌ Foydalanuvchi chiqdi:", socketId);
      peers.value[socketId]?.close();
      delete peers.value[socketId];
      delete remoteStreams.value[socketId];
    });

  } catch (error) {
    console.error("⛔ getUserMedia xatosi:", error);
  }
});

// **ICE kandidatlarni kechiktirib qo‘shish**
async function processPendingCandidates(socketId) {
  const peer = peers.value[socketId];
  if (!peer || !pendingCandidates.value[socketId]) return;

  for (const candidate of pendingCandidates.value[socketId]) {
    await peer.addIceCandidate(new RTCIceCandidate(candidate));
  }

  pendingCandidates.value[socketId] = []; // Tozalash
}
</script>

<template>
  <div class="flex flex-col items-center p-4">
    <h1 class="text-xl font-bold">🖥️ Video Chat</h1>
    <div class="flex gap-4 mt-4">
      <!-- Local video -->
      <video
          id="localVideo"
          autoplay
          muted
          class="w-40 border border-blue-500 rounded-lg"
      ></video>

      <!-- Remote videos -->
      <div v-for="(stream, id) in remoteStreams" :key="id">
        <video
            v-if="stream"
            :ref="(el) => (remoteVideos[id] = el)"
            autoplay
            class="w-40 border border-green-500 rounded-lg"
        ></video>
      </div>
    </div>
  </div>
</template>
