<script setup>
const menuItems = [
  {id: 1, text: "Sudlar ro'yxati", url: "/admin"},
  {id: 2, text: "Interaktiv xizmatlar ro'yxati", url: "/appeals"},
  {id: 3, text: "Hamkorlar ro'yxati", url: "/partners"},
  {id: 3, text: "Yuristlar ro'yxati", url: "/yurists"},
  {id: 4, text: "Adminlar ro'yxati", url: "/admins"},
  {id: 4, text: "Operatorlar ro'yxati", url: "/operators"},
];
</script>

<template>
  <aside class="aside-nav">
    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.id" class="my-1">
          <router-link :to="item.url">{{ item.text }}</router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.aside-nav {
  width: 280px;
  height: 100vh;
  background-color: #1e3a8a;
  color: white;
  padding-top: 20px;
  position: fixed;
  inset: 0;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 15px 20px;
  background-color: #1e88e5;
  transition: background-color 0.3s;
}

router-link {
  color: #e5e7eb;
  text-decoration: none;
  font-size: 1.1rem;
  display: block;
}

li:hover {
  background-color: rgba(229, 231, 235, 0.1);
  cursor: pointer;
}
</style>
