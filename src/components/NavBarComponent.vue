<template>
  <nav>
    <router-link to="/projects">Projects</router-link>
    <router-link to="/datasession">Data Session</router-link>
  </nav>
</template>

<style scoped>
nav {
  background-color: red;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
}

router-link {
  color: white;
  text-decoration: none;
}

/* Style for the active route */
.router-link-active {
  font-weight: bold;
}
</style>
