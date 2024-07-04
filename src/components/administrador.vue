<template>
  <div class="administrador">
    <div class="columna-izquierda">
      <div class="contenedor">
        <nuevo-gasto @gasto-agregado="cargarGastos"></nuevo-gasto>
        <filtro-gastos @filtro-aplicado="aplicarFiltro"></filtro-gastos>
      </div>
    </div>
    <div class="columna-derecha">
      <dashboard :gastos="gastos"></dashboard>
      <lista-gastos :gastos="filteredGastos" @editar-gasto="editGasto" @eliminar-gasto="deleteGasto"></lista-gastos>
    </div>
    <!-- Modal de edición de gasto -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="closeEditModal">&times;</span>
        <h3>Editar Gasto</h3>
        <form @submit.prevent="guardarEdicion">
          <label>
            Categoría:
            <select v-model="editedGasto.categoria" required>
              <option disabled value="">Seleccione una categoría</option>
              <option v-for="categoria in categorias" :key="categoria" :value="categoria">{{ categoria }}</option>
            </select>
          </label>
          <label>
            Descripción:
            <input type="text" v-model="editedGasto.descripcion">
          </label>
          <label>
            Monto:
            <input type="number" v-model="editedGasto.monto">
          </label>
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
      },
      categorias: ["Alimentación", "Transporte", "Entretenimiento", "Otros"]
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
          this.filteredGastos = gastosList;
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
        this.cargarGastos();
      } catch (error) {
        console.error('Error al eliminar el gasto:', error);
      }
    },

    closeEditModal() {
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
  justify-content: center;
  padding: 1rem;
  background-image: url('~@/assets/billetes.jpeg');
  background-size: cover;
  border-radius: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: #30190b;
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.header-left h2 {
  color: #fff;
  margin: 0;
}

.header-right button {
  background-color: #d9534f;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.header-right button:hover {
  background-color: #c9302c;
}

.columna-izquierda{
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  max-width: 25%;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  margin-right: 1rem;
}

.columna-derecha {
  flex: 1;
  max-width: 40%;
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 10px;
  margin-right: 10rem;
}

.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nuevo-gasto,
.filtro-gastos {
  width: 100%;
  min-width: 300px;
  margin-bottom: 1rem;
}

.administrador h2 {
  margin-bottom: 1rem;
  color: #333;
}

.administrador form {
  display: flex;
  flex-direction: column;
}

.administrador input,
.administrador select,
.administrador button {
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.administrador button {
  background-color: #007bff;
  color: #fff;
  border: none;
  cursor: pointer;
}

.administrador button:hover {
  background-color: #0056b3;
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 60%;
  max-width: 400px;
  font-family: 'Roboto', sans-serif;
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
