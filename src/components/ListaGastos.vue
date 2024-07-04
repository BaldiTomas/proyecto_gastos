<template>
  <div class="lista-gastos-page">
    <div class="lista-gastos">
      <h2 class="page-title">Lista de Gastos</h2>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Categoría</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gasto, index) in paginatedGastos" :key="gasto.id">
            <td>{{ gasto.descripcion }}</td>
            <td>{{ gasto.monto }}</td>
            <td>{{ gasto.categoria }}</td>
            <td>{{ gasto.fecha }}</td>
            <td class="acciones">
              <button class="btn editar" @click="$emit('editar-gasto', gasto)">Editar</button>
              <button class="btn eliminar" @click="$emit('eliminar-gasto', gasto)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Controles de paginación -->
      <div class="pagination">
        <button class="btn" :disabled="currentPage === 1" @click="prevPage"><- Anterior</button>
        <span>{{ currentPage }}</span>
        <button class="btn" :disabled="currentPage >= totalPages" @click="nextPage">Siguiente -></button>
      </div>
    </div>
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
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 6 // Elementos por página
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.gastos.length / this.itemsPerPage);
    },
    paginatedGastos() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.gastos.slice(startIndex, startIndex + this.itemsPerPage);
    }
  },
  methods: {
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
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
.lista-gastos-page {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  overflow: auto;
  font-family: 'Roboto', sans-serif; /* Fuente moderna */
}

.page-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
}

.lista-gastos table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.lista-gastos th,
.lista-gastos td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.lista-gastos th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.lista-gastos tr:nth-child(even) {
  background-color: #f9f9f9;
}

.acciones {
  display: flex;
  gap: 10px;
  justify-content: flex-start; /* Alinear acciones a la izquierda */
}

.lista-gastos button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.875rem;
}

.lista-gastos button.editar {
  background-color: #007bff;
}

.lista-gastos button.eliminar {
  background-color: #dc3545;
}

.lista-gastos button:hover {
  background-color: #0056b3;
}

.lista-gastos button.eliminar:hover {
  background-color: #c82333;
}

.pagination {
  margin-top: 10px;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}
</style>
