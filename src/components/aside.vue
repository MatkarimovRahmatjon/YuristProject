<script setup>
const menuItems = [
  {id: 1, text: "Sudlar ro'yxati", url: "/admin"},
  {id: 2, text: "Interaktiv xizmatlar ro'yxati", url: "/appeal"},
  {id: 3, text: "Yuristlar ro'yxati", url: "/yurists"},
  {id: 4, text: "Adminlar ro'yxati", url: "/admins"},
  {id: 5, text: "Operatorlar ro'yxati", url: "/operators"},
  {id: 6, text: "Hamkorlar ro'yxati", url: "/partners"},
];
</script>

<template>
  <aside class="aside-nav bg-blue-800">
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
  width: 420px;
  height: 100vh;
  color: white;
  padding-top: 20px;
  position: fixed;
  top: 200px;
  }

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 15px 20px;
  background-color: #f0d73a;
  color: black;
  transition: background-color 0.3s;
  transition-duration: 500ms;

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
  color: white;
  transition-duration: 500ms;
}
</style>
