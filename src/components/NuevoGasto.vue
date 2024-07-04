<template>
  <div class="nuevo-gasto">
    <h2 class="form-title">Agregar Nuevo Gasto</h2>
    <form @submit.prevent="agregarGasto">
      <input v-model="monto" type="number" placeholder="Monto" required />
      <select v-model="categoria" required>
        <option disabled value="">Seleccione una categoría</option>
        <option value="Alimentación">Alimentación</option>
        <option value="Transporte">Transporte</option>
        <option value="Entretenimiento">Entretenimiento</option>
        <option value="Otros">Otros</option>
      </select>
      <input v-model="descripcion" type="text" placeholder="Descripción" />
      <input v-model="fecha" type="date" placeholder="Fecha" required />
      <button type="submit">Agregar Gasto</button>
    </form>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script>
import { ref, push } from 'firebase/database';
import { database, auth } from '../firebase';

export default {
  data() {
    return {
      monto: "",
      categoria: "",
      descripcion: "",
      fecha: "",
      error: ""
    };
  },
  methods: {
    async agregarGasto() {
      const user = auth.currentUser;
      if (!user) {
        this.error = "Usuario no autenticado. Por favor, inicia sesión.";
        return;
      }

      // Validar que la fecha no sea futura
      const today = new Date();
      const selectedDate = new Date(this.fecha);
      if (selectedDate > today) {
        this.error = "No se puede agregar un gasto en una fecha futura.";
        return;
      }

      if (this.monto && this.categoria && this.fecha) {
        const userId = user.uid;
        const expensesRef = ref(database, 'users/' + userId + '/gastos');

        try {
          await push(expensesRef, {
            monto: this.monto,
            categoria: this.categoria,
            descripcion: this.descripcion,
            fecha: this.fecha,
            timestamp: new Date().toISOString()
          });
          this.monto = "";
          this.categoria = "";
          this.descripcion = "";
          this.fecha = "";
          this.error = "";
          this.$emit('gasto-agregado');
        } catch (error) {
          console.error("Error al agregar el gasto:", error);
          this.error = "Error al agregar el gasto. Inténtalo de nuevo.";
        }
      } else {
        this.error = "Por favor, completa todos los campos requeridos.";
      }
    }
  }
};
</script>

<style scoped>
.nuevo-gasto {
  margin: 10px auto;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  font-family: 'Roboto', sans-serif; /* Cambiar a una fuente moderna */
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  text-align: center;
}

.nuevo-gasto form {
  display: grid;
  gap: 10px;
}

.nuevo-gasto input,
.nuevo-gasto select,
.nuevo-gasto button {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif; /* Asegurarse de que los inputs también usen la fuente */
}

.nuevo-gasto select {
  appearance: none;
  padding-right: 30px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23777777"><path d="M7 10l5 5 5-5z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 18px;
}

.nuevo-gasto button {
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
}

.nuevo-gasto button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 5px;
}

@media (max-width: 500px) {
  .nuevo-gasto {
    max-width: 100%;
  }
}
</style>
