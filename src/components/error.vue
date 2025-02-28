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
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e215d, #141b8e, #04134f);
  font-family: 'Poppins', sans-serif;
  padding: 20px;
  animation: backgroundFade 6s infinite alternate;
}

.error-card {
  text-align: center;
  padding: 50px;
  border-radius: 20px;
  backdrop-filter: blur(30px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
  max-width: 500px;
  animation: fadeIn 1s ease-in-out, floating 3s ease-in-out infinite;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease-in-out;
}

.error-card:hover {
  transform: scale(1.03);
}

.error-text h1 {
  font-size: 100px;
  font-weight: 900;
  color: #ff4757;
  text-shadow: 0px 10px 30px rgba(255, 71, 87, 0.7);
  margin: 0;
}

.error-text h2 {
  font-size: 30px;
  font-weight: 700;
  color: #ffffff;
  margin: 15px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.error-text p {
  font-size: 18px;
  color: #e0e0e0;
  margin-bottom: 30px;
  opacity: 0.9;
}

.back-home button {
  padding: 14px 36px;
  font-size: 18px;
  font-weight: 700;
  background: linear-gradient(135deg, #ff4757, #ff6b6b);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0px 7px 25px rgba(255, 71, 87, 0.6);
}

.back-home button:hover {
  background: linear-gradient(135deg, #ff6b6b, #ff4757);
  transform: scale(1.12);
  box-shadow: 0px 14px 35px rgba(255, 71, 87, 0.8);
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

@keyframes floating {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
