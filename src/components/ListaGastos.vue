<template>
    <div class="lista-gastos">
      <h2>Lista de Gastos</h2>
      <ul>
        <li v-for="gasto in expenses" :key="gasto.id">
          <strong>{{ gasto.categoria }}</strong> - {{ gasto.descripcion }} - {{ gasto.monto }}
        </li>
        <li v-if="expenses.length === 0">No hay gastos para mostrar.</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      expenses: {
        type: Array,
        default: () => []
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
    color: #666;
  }
  </style>  