<template>
  <div class="lista-gastos">
    <h2>Lista de Gastos</h2>
    <ul>
      <li v-for="gasto in gastos" :key="gasto.id">
        <strong>{{ gasto.categoria }}</strong> - {{ gasto.descripcion }} - {{ gasto.monto }}
        <span>
          <button @click="editarGasto(gasto)">Editar</button>
          <button @click="eliminarGasto(gasto)">Eliminar</button>
        </span>
      </li>
      <li v-if="gastos.length === 0">No hay gastos para mostrar.</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    gastos: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    editarGasto(gasto) {
      this.$emit('editar-gasto', gasto); // Emitir evento editar-gasto
    },
    eliminarGasto(gasto) {
      this.$emit('eliminar-gasto', gasto); // Emitir evento eliminar-gasto
    }
  }
};
</script>

<style scoped>
.lista-gastos {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  overflow: hidden;
}

.lista-gastos h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
}

.lista-gastos ul {
  list-style-type: none;
  padding: 0;
}

.lista-gastos li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
}

.lista-gastos li:last-child {
  border-bottom: none;
}

.lista-gastos li strong {
  margin-right: 10px;
}

.lista-gastos li span {
  display: flex;
  gap: 10px;
}
</style>
