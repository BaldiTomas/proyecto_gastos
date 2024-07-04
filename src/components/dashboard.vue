<template>
    <div class="dashboard">
      <h3>Dashboard</h3>
      <div class="metricas">
        <div class="metrica">
          <span class="titulo">Gastos Totales:</span>
          <span class="valor">$ {{ calcularGastosTotales() }}</span>
        </div>
        <!-- Puedes añadir más métricas aquí según sea necesario -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      expenses: {
        type: Array,
        required: true
      }
    },
    methods: {
      calcularGastosTotales() {
        return this.expenses.reduce((total, expense) => total + parseFloat(expense.monto), 0).toFixed(2);
      }
      // Puedes añadir más métodos para calcular otras métricas aquí
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    margin-top: 20px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .dashboard h3 {
    margin-bottom: 10px;
    color: #333;
  }
  
  .metricas {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }
  
  .metrica {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .metrica .titulo {
    font-weight: bold;
  }
  
  .metrica .valor {
    font-size: 1.2rem;
    color: #007bff;
  }
  </style>
  