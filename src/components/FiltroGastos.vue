<template>
    <div class="filtro-gastos">
      <h2>Filtrar Gastos</h2>
      <form @submit.prevent="aplicarFiltro">
        <label>
          Categoría:
          <select v-model="filtro.categoria">
            <option value="">Todas</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Otros">Otros</option>
          </select>
        </label>
        <label>
          Fecha inicio:
          <input v-model="filtro.fechaInicio" type="date">
        </label>
        <label>
          Fecha fin:
          <input v-model="filtro.fechaFin" type="date">
        </label>
        <button type="submit">Aplicar Filtro</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        filtro: {
          categoria: "",
          fechaInicio: "",
          fechaFin: ""
        }
      };
    },
    methods: {
      aplicarFiltro() {
        this.$emit('filtro-aplicado', this.filtro);
      }
    }
  };
  </script>
  
  <style scoped>
.filtro-gastos {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  overflow: hidden;
}

.filtro-gastos h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.filtro-gastos form {
  display: grid;
  gap: 10px;
}

.filtro-gastos label {
  display: block;
}

.filtro-gastos select,
.filtro-gastos input[type="date"],
.filtro-gastos button {
  width: calc(100% - 20px); /* Ajusta el ancho para compensar el padding y border */
  padding: 10px;
  font-size: 1rem;
}

.filtro-gastos button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.filtro-gastos button:hover {
  background-color: #0056b3;
}
</style>
  