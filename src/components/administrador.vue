<template>
  <div class="administrador">
    <div class="columna-izquierda">
      <nuevo-gasto @gasto-agregado="cargarGastos"></nuevo-gasto>
      <dashboard :gastos="gastos"></dashboard>
    </div>
    <div class="columna-derecha">
      <filtro-gastos @filtro-aplicado="aplicarFiltro"></filtro-gastos>
      <lista-gastos :gastos="filteredGastos"
                    @editar-gasto="editGasto"
                    @eliminar-gasto="deleteGasto"></lista-gastos>
    </div>
    <!-- Modal o componente de edición de gasto -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h3>Editar Gasto</h3>
        <form @submit.prevent="guardarEdicion">
          <label>Categoría:</label>
          <input type="text" v-model="editedGasto.categoria">
          <label>Descripción:</label>
          <input type="text" v-model="editedGasto.descripcion">
          <label>Monto:</label>
          <input type="number" v-model="editedGasto.monto">
          <button type="submit">Guardar Cambios</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NuevoGasto from './NuevoGasto.vue';
import FiltroGastos from './FiltroGastos.vue';
import ListaGastos from './ListaGastos.vue';
import Dashboard from './dashboard.vue';
import { ref, onValue, remove, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { database, auth } from "../firebase";

export default {
  components: {
    NuevoGasto,
    FiltroGastos,
    ListaGastos,
    Dashboard
  },

  data() {
    return {
      user: null,
      gastos: [],
      filteredGastos: [], // Lista filtrada de gastos
      showEditModal: false,
      editedGasto: {
        id: null,
        categoria: '',
        descripcion: '',
        monto: 0,
        fecha: ''
      }
    };
  },

  created() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.cargarGastos();
      } else {
        this.user = null;
        this.gastos = [];
        this.filteredGastos = [];
      }
    });
  },

  methods: {
    cargarGastos() {
      if (!this.user) return;

      const userId = this.user.uid;
      const gastosRef = ref(database, 'users/' + userId + '/gastos');
      onValue(gastosRef, (snapshot) => {
        const gastos = snapshot.val();
        if (gastos) {
          const gastosList = [];
          for (const id in gastos) {
            gastosList.push({ id, ...gastos[id] });
          }
          this.gastos = gastosList;
          this.filteredGastos = gastosList; // Inicialmente, mostrar todos los gastos
        } else {
          this.gastos = [];
          this.filteredGastos = [];
        }
      });
    },

    aplicarFiltro(filtro) {
      if (filtro.categoria) {
        this.filteredGastos = this.gastos.filter(gasto => gasto.categoria === filtro.categoria);
      } else if (filtro.fechaInicio && filtro.fechaFin) {
        const fechaInicio = new Date(filtro.fechaInicio);
        const fechaFin = new Date(filtro.fechaFin);
        this.filteredGastos = this.gastos.filter(gasto => {
          const fechaGasto = new Date(gasto.fecha);
          return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
        });
      } else {
        this.filteredGastos = this.gastos;
      }
    },

    editGasto(gasto) {
      // Asignar el gasto seleccionado para editar
      this.editedGasto.id = gasto.id;
      this.editedGasto.categoria = gasto.categoria;
      this.editedGasto.descripcion = gasto.descripcion;
      this.editedGasto.monto = gasto.monto;
      this.editedGasto.fecha = gasto.fecha;
      
      // Mostrar el modal de edición
      this.showEditModal = true;
    },

    async guardarEdicion() {
      const { id, categoria, descripcion, monto } = this.editedGasto;
      const user = auth.currentUser;
      const gastoRef = ref(database, 'users/' + user.uid + '/gastos/' + id);
      
      try {
        await update(gastoRef, {
          categoria,
          descripcion,
          monto
        });
        console.log('Gasto editado exitosamente');
        this.closeEditModal();
        this.cargarGastos(); // Actualizar la lista de gastos después de la edición
      } catch (error) {
        console.error('Error al editar el gasto:', error);
      }
    },

    async deleteGasto(gasto) {
      const user = auth.currentUser;
      const gastoRef = ref(database, 'users/' + user.uid + '/gastos/' + gasto.id);
      try {
        await remove(gastoRef);
        console.log('Gasto eliminado:', gasto);
        this.cargarGastos(); // Actualizar lista de gastos después de eliminar
      } catch (error) {
        console.error('Error al eliminar el gasto:', error);
      }
    },

    closeEditModal() {
      // Reiniciar el objeto editedGasto y ocultar el modal
      this.editedGasto = {
        id: null,
        categoria: '',
        descripcion: '',
        monto: 0,
        fecha: ''
      };
      this.showEditModal = false;
    }
  }
};
</script>

<style scoped>
.administrador {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 20px;
}

.columna-izquierda {
  flex: 1;
  margin-right: 20px; /* Ajustar margen entre columnas */
}

.columna-derecha {
  flex: 1;
}

.administrador h2 {
  margin-bottom: 1rem;
  color: #333;
}

.administrador form {
  display: flex;
  flex-direction: column;
}

.administrador input {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.administrador button {
  padding: 0.75rem;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.administrador button:hover {
  background-color: #0056b3;
}

.administrador .error {
  color: red;
  margin-top: 1rem;
}

/* Estilos para el modal de edición */
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>