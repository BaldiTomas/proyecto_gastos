<template>
  <div>
    <h2 class="total-gastos">Total de Gastos: ${{ calcularGastosTotales() }}</h2>
    <Grafico :gastos="gastos" />
  </div>
</template>

<script>
import Grafico from './grafico.vue';

export default {
  components: {
    Grafico
  },
  props: {
    gastos: {
      type: Array,
      required: true
    }
  },
  methods: {
    calcularGastosTotales() {
      return this.gastos.reduce((total, gasto) => total + parseFloat(gasto.monto), 0).toFixed(2);
    }
  }
};
</script>

<style scoped>
.total-gastos {
  text-align: center;
  margin-bottom: 10px;
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  font-family: 'Roboto', sans-serif; /* Fuente moderna */
}
</style>
