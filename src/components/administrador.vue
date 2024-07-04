<template>
    <div class="administrador">
      <div class="columna-izquierda">
        <nuevo-gasto @gasto-agregado="cargarGastos"></nuevo-gasto>
        <dashboard :expenses="expenses"></dashboard>
      </div>
      <div class="columna-derecha">
        <filtro-gastos @filtro-aplicado="aplicarFiltro"></filtro-gastos>
        <lista-gastos :expenses="filteredExpenses"></lista-gastos>
      </div>
    </div>
  </template>
  
  <script>
  import NuevoGasto from './NuevoGasto.vue';
  import FiltroGastos from './FiltroGastos.vue';
  import ListaGastos from './ListaGastos.vue';
  import dashboard from './dashboard.vue';
  import { ref, onValue } from "firebase/database";
  import { onAuthStateChanged } from "firebase/auth";
  import { database, auth } from "../firebase";
  
  export default {
    components: {
      NuevoGasto,
      FiltroGastos,
      ListaGastos,
      dashboard
    },
  
    data() {
      return {
        user: null,
        expenses: [],
        filteredExpenses: [] // Lista filtrada de gastos
      };
    },
  
    created() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.user = user;
          this.cargarGastos();
        } else {
          this.user = null;
          this.expenses = [];
          this.filteredExpenses = [];
        }
      });
    },
  
    methods: {
      cargarGastos() {
        if (!this.user) return;
        
        const userId = this.user.uid;
        const expensesRef = ref(database, 'users/' + userId + '/gastos');
        onValue(expensesRef, (snapshot) => {
          const expenses = snapshot.val();
          if (expenses) {
            const expensesList = [];
            for (const id in expenses) {
              expensesList.push({ id, ...expenses[id] });
            }
            this.expenses = expensesList;
            this.filteredExpenses = expensesList; // Inicialmente, mostrar todos los gastos
          } else {
            this.expenses = [];
            this.filteredExpenses = [];
          }
        });
      },
  
      aplicarFiltro(filtro) {
        if (filtro.categoria) {
          this.filteredExpenses = this.expenses.filter(gasto => gasto.categoria === filtro.categoria);
        } else if (filtro.fechaInicio && filtro.fechaFin) {
          const fechaInicio = new Date(filtro.fechaInicio);
          const fechaFin = new Date(filtro.fechaFin);
          this.filteredExpenses = this.expenses.filter(gasto => {
            const fechaGasto = new Date(gasto.fecha);
            return fechaGasto >= fechaInicio && fechaGasto <= fechaFin;
          });
        } else {
          this.filteredExpenses = this.expenses;
        }
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
    margin-right: 100px; /* Añadir un margen para separar las columnas */
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
  </style>
  