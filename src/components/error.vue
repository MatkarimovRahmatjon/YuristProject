<template>
  <div class="error-container">
    <div class="error-card">
      <div class="error-text">
        <h1>{{ errorCode }}</h1>
        <h2>{{ title }}</h2>
        <p>{{ message }}</p>
      </div>
      <router-link to="/" class="back-home">
        <button>Asosiy sahifaga qaytish</button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errorCode: {
      type: Number,
      required: true
    }
  },
  computed: {
    title() {
      const titles = {
        404: "Sahifa topilmadi",
        500: "Server xatosi",
        403: "Ruxsat berilmagan",
        400: "Noto‘g‘ri so‘rov"
      };
      return titles[this.errorCode] || "Noma'lum xato";
    },
    message() {
      const messages = {
        404: "Siz qidirgan sahifa mavjud emas.",
        500: "Ma'lum sabablarga ko‘ra, tizim vaqtincha faoliyat ko‘rsatmayapti. Agar tizim sizga zarur bo‘lsa, operatorlarga bog‘laning.",
        403: "Bu sahifaga kirish uchun ruxsatingiz yo‘q.",
        400: "So‘rovingiz noto‘g‘ri shakllangan."
      };
      return messages[this.errorCode] || "Noma'lum xatolik yuz berdi.";
    }
  }
};
</script>

<style scoped>
/* Enhanced Glassmorphism with Blur and Depth */
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #04134f, #1E215D, #141b8e);
  font-family: 'Poppins', sans-serif;
  padding: 20px;
}

.error-card {
  text-align: center;
  padding: 50px;
  border-radius: 20px;
  backdrop-filter: blur(25px);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.4);
  max-width: 520px;
  animation: fadeIn 1s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.error-text h1 {
  font-size: 100px;
  font-weight: 900;
  color: #ff6b6b;
  text-shadow: 0px 8px 18px rgba(255, 107, 107, 0.5);
  margin: 0;
}

.error-text h2 {
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 20px 0;
  letter-spacing: 1px;
}

.error-text p {
  font-size: 20px;
  color: #d1d1d1;
  margin-bottom: 30px;
  opacity: 0.9;
}

.back-home button {
  padding: 15px 35px;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 7px 20px rgba(255, 107, 107, 0.5);
}

.back-home button:hover {
  background: linear-gradient(135deg, #ff4757, #ff6b6b);
  transform: scale(1.1);
  box-shadow: 0px 10px 25px rgba(255, 107, 107, 0.7);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>