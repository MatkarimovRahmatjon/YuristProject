<template>
  <div
    class="flex text-white justify-center items-center md:justify-between px-3 w-full h-[100px] md:h-[150px] lg:h-[200px] opacity-[88%] relative bg-[#0033FF]">
    <div id="particles-js" class="absolute top-0 left-0 w-full h-full"></div>
    <b class="lg:text-[25px] text-center w-full md:w-[40%] lg:w-[35%] z-0 uppercase hidden lg:block"
      style="text-shadow: 2px 2px 50px white;">
      {{ $t('header') }}
    </b>
    <div class="flex justify-center relative ml-2 sm:mx-10 mt-2 z-10">
      <img src="../../public/logo.png" class="w-[200px] md:w-[250px] lg:w-[300px]" alt="Logo" />
    </div>
    <b class="lg:text-[25px] md:text-[16px] text-[10px] text-center w-[80%] md:w-[60%] lg:w-[35%] z-0 uppercase"
      style="text-shadow: 2px 2px 50px white;">
      {{ $t('header') }}
    </b>
  </div>
</template>

<script>
import { onMounted } from "vue";
export default {
  name: "ParticlesHeader",
  setup() {
    onMounted(() => {
      const loadParticlesScript = () => {
        return new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      };

      loadParticlesScript()
        .then(() => {
          particlesJS("particles-js", {
            particles: {
              number: { value: 100, density: { enable: true, value_area: 800 } },
              color: { value: "#ffffff" },
              shape: {
                type: "circle",
                stroke: { width: 0, color: "#000000" },
              },
              opacity: {
                value: 0.7,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.3, sync: false },
              },
              size: {
                value: 4,
                random: true,
                anim: { enable: true, speed: 20, size_min: 0.1, sync: false },
              },
              line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.3,
                width: 2,
              },
              move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: false,
                straight: false,
                out_mode: "out",
                attract: { enable: false },
              },
            },
            interactivity: {
              detect_on: "canvas",
              events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true,
              },
              modes: {
                grab: { distance: 200, line_linked: { opacity: 5 } },
                bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 },
                repulse: { distance: 150, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 },
              },
            },
            retina_detect: true,
          });
        })
        .catch((error) => {
          console.error("Particles.js skriptini yuklashda xato:", error);
        });
    });
  },
};
</script>

<style scoped>
#particles-js {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  /* Orqa fon uchun */
}

b {
  color: white;
  font-weight: bold;
}
</style>
