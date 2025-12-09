// Importamos hooks de React
import { useEffect, useState } from 'react'

// Importamos servicios para cargar los datos necesarios
import { ObtenerCompras } from '../../services/compra.service'
import { ObtenerProductos } from '../../services/producto.service'
import { ObtenerClientes } from '../../services/cliente.service'
import { ObtenerVendedores } from '../../services/vendedor.service'

// Importamos componentes de Reporte PDF
import { Document, PDFViewer, Page, Text, StyleSheet, View } from '@react-pdf/renderer'

// Estilos para el PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  titulo: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold'
  },
  subtitulo: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666'
  },
  tabla: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0
  },
  fila: {
    margin: "auto",
    flexDirection: "row"
  },
  columna: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0
  },
  celdaEncabezado: {
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold'
  },
  celdaDatos: {
    margin: 5,
    fontSize: 10
  }
})

const Reporte = () => {
  // Estado para almacenar los datos procesados (Ventas con nombres reales)
  const [ventas, setVentas] = useState([])
  const [cargando, setCargando] = useState(true)

  // Función para cargar y cruzar datos
  // Necesitamos cargar Productos, Clientes y Vendedores para mostrar nombres en lugar de IDs
  const CargarDatos = async () => {
    try {
      const [dataCompras, dataProductos, dataClientes, dataVendedores] = await Promise.all([
        ObtenerCompras(),
        ObtenerProductos(),
        ObtenerClientes(),
        ObtenerVendedores()
      ])

      // Mapeamos las compras reemplazando IDs con nombres
      const ventasProcesadas = dataCompras.map(compra => {
        const producto = dataProductos.find(p => p.id_producto === compra.id_producto)
        const cliente = dataClientes.find(c => c.id_cliente === compra.id_cliente)
        const vendedor = dataVendedores.find(v => v.id_vendedor === compra.id_vendedor)

        return {
          id: compra.id_compra,
          producto: producto ? producto.nombre : 'Desconocido',
          cliente: cliente ? `${cliente.nombre} ${cliente.paterno || ''}` : 'Desconocido',
          vendedor: vendedor ? `${vendedor.nombre} ${vendedor.paterno || ''}` : 'Desconocido',
          cantidad: compra.cantidad,
          // Si tuviéramos precio y total, lo calcularíamos aquí. Asumiremos precio del producto actual.
          totalEstimado: producto ? (producto.precio * compra.cantidad).toFixed(2) : '0.00'
        }
      })

      setVentas(ventasProcesadas)
      setCargando(false)
    } catch (error) {
      console.error("Error al cargar datos para el reporte:", error)
      setCargando(false)
    }
  }

  // Cargar al montar
  useEffect(() => {
    CargarDatos()
  }, [])

  if (cargando) return <div>Cargando reporte...</div>

  // Definición del Documento PDF
  const MiDocumentoPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>Reporte General de Ventas</Text>
        <Text style={styles.subtitulo}>Generado el: {new Date().toLocaleDateString()}</Text>

        {/* Tabla de Ventas */}
        <View style={styles.tabla}>
          {/* Encabezados */}
          <View style={styles.fila}>
            <View style={{ ...styles.columna, width: '10%' }}>
              <Text style={styles.celdaEncabezado}>ID</Text>
            </View>
            <View style={{ ...styles.columna, width: '25%' }}>
              <Text style={styles.celdaEncabezado}>Cliente</Text>
            </View>
            <View style={{ ...styles.columna, width: '25%' }}>
              <Text style={styles.celdaEncabezado}>Producto</Text>
            </View>
            <View style={{ ...styles.columna, width: '20%' }}>
              <Text style={styles.celdaEncabezado}>Vendedor</Text>
            </View>
            <View style={{ ...styles.columna, width: '10%' }}>
              <Text style={styles.celdaEncabezado}>Cant.</Text>
            </View>
            <View style={{ ...styles.columna, width: '10%' }}>
              <Text style={styles.celdaEncabezado}>Total</Text>
            </View>
          </View>

          {/* Datos */}
          {ventas.map((venta, index) => (
            <View key={index} style={styles.fila}>
              <View style={{ ...styles.columna, width: '10%' }}>
                <Text style={styles.celdaDatos}>{venta.id}</Text>
              </View>
              <View style={{ ...styles.columna, width: '25%' }}>
                <Text style={styles.celdaDatos}>{venta.cliente}</Text>
              </View>
              <View style={{ ...styles.columna, width: '25%' }}>
                <Text style={styles.celdaDatos}>{venta.producto}</Text>
              </View>
              <View style={{ ...styles.columna, width: '20%' }}>
                <Text style={styles.celdaDatos}>{venta.vendedor}</Text>
              </View>
              <View style={{ ...styles.columna, width: '10%' }}>
                <Text style={styles.celdaDatos}>{venta.cantidad}</Text>
              </View>
              <View style={{ ...styles.columna, width: '10%' }}>
                <Text style={styles.celdaDatos}>{venta.totalEstimado}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )

  return (
    <PDFViewer width="100%" height="90%" style={{ border: 'none' }}>
      {MiDocumentoPDF()}
    </PDFViewer>
  )
}

export default Reporte
