<template>
  <div class="grafico-container">
    <h2 class="grafico-titulo">Gastos por Categoría</h2>
    <div ref="chart" class="grafico"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    gastos: {
      type: Array,
      required: true
    }
  },
  computed: {
    datosGrafico() {
      const categorias = {};

      if (this.gastos && this.gastos.length > 0) {
        this.gastos.forEach(gasto => {
          if (categorias[gasto.categoria]) {
            categorias[gasto.categoria] += parseFloat(gasto.monto);
          } else {
            categorias[gasto.categoria] = parseFloat(gasto.monto);
          }
        });

        const data = Object.keys(categorias).map(categoria => ({
          name: categoria,
          value: categorias[categoria]
        }));

        return data;
      } else {
        console.error('Error: La propiedad "gastos" no está definida o está vacía');
        return []; // Retornar un array vacío para evitar errores
      }
    }
  },
  mounted() {
    this.renderChart();
  },
  methods: {
    renderChart() {
      const chart = echarts.init(this.$refs.chart);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Gastos',
            type: 'pie',
            radius: '50%',
            data: this.datosGrafico,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              color: '#333'
            }
          }
        ]
      };
      chart.setOption(option);
    }
  },
  watch: {
    gastos: {
      handler() {
        this.renderChart();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.grafico-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9;
  padding: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif; /* Fuente moderna */
}

.grafico-titulo {
  margin-bottom: 20px;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
}

.grafico {
  width: 100%;
  height: 400px;
}
</style>
