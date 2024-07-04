<template>
  <div id="app">
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>

export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>

<style>
#app {
  font-family: 'Mulish', sans-serif;
  background-color: #E6E3DD; /* Color de fondo de respaldo */
  background-size: cover; /* Ajuste para cubrir todo el contenedor */
  min-height: 100vh; /* Mínimo alto de la ventana */
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>