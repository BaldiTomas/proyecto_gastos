<template>
  <div class="filtro-gastos">
    <h2 class="form-title">Filtrar Gastos</h2>
    <form @submit.prevent="aplicarFiltro">
      <label class="form-label">
        Categoría:
        <select v-model="filtro.categoria" class="form-input">
          <option value="">Todas</option>
          <option value="Alimentación">Alimentación</option>
          <option value="Transporte">Transporte</option>
          <option value="Entretenimiento">Entretenimiento</option>
          <option value="Otros">Otros</option>
        </select>
      </label>
      <label class="form-label">
        Fecha inicio:
        <input v-model="filtro.fechaInicio" type="date" class="form-input">
      </label>
      <label class="form-label">
        Fecha fin:
        <input v-model="filtro.fechaFin" type="date" class="form-input">
      </label>
      <button type="submit" class="form-button">Aplicar Filtro</button>
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
  margin-top: 10px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  max-width: 400px;
  font-family: 'Roboto', sans-serif;
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
}

.filtro-gastos form {
  display: grid;
  gap: 10px;
}

.form-label {
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.875rem;
  box-sizing: border-box;
}

.form-button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
}

.form-button:hover {
  background-color: #0056b3;
}
</style>