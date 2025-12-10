// Importamos hooks de React
import { useEffect, useState } from 'react'

// Importamos servicios para cargar los datos necesarios
import { ObtenerCompras, ObtenerComprasPorFecha } from '../../services/compra.service'
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
  const [cargando, setCargando] = useState(false) // Iniciamos en false para esperar que el usuario elija fecha

  // Estado para la fecha seleccionada
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

  // Estado para el Total
  const [totalVentas, setTotalVentas] = useState(0);

  // Función para cargar los datos FILTRADOS por fecha
  const CargarReporte = async () => {
    if (!fechaSeleccionada) {
      alert("Por favor seleccione una fecha");
      return;
    }

    setCargando(true);
    try {
      // 1. Cargamos las compras de ESA FECHA
      const dataCompras = await ObtenerComprasPorFecha(fechaSeleccionada);

      // 2. Cargamos catálogos para cruzar nombres (Productos, Clientes, Vendedores)
      // Nota: Si son muchos datos, esto podría optimizarse cargándolos una sola vez al inicio.
      const [dataProductos, dataClientes, dataVendedores] = await Promise.all([
        ObtenerProductos(),
        ObtenerClientes(),
        ObtenerVendedores()
      ])

      let sumaTotal = 0;

      // 3. Procesamos y Cruzamos
      const ventasProcesadas = dataCompras.map(compra => {
        const producto = dataProductos.find(p => p.id_producto === compra.id_producto)
        const cliente = dataClientes.find(c => c.id_cliente === compra.id_cliente)
        const vendedor = dataVendedores.find(v => v.id_vendedor === compra.id_vendedor)

        // Calculamos subtotal de esta venta
        const precioUnitario = producto ? parseFloat(producto.precio) : 0;
        const subtotal = precioUnitario * compra.cantidad;
        sumaTotal += subtotal;

        return {
          id: compra.id_compra,
          producto: producto ? producto.nombre : 'Desconocido',
          precio: precioUnitario.toFixed(2), // Añadimos precio unitario visual
          cliente: cliente ? `${cliente.nombre} ${cliente.paterno || ''}` : 'Desconocido',
          vendedor: vendedor ? `${vendedor.nombre} ${vendedor.paterno || ''}` : 'Desconocido',
          cantidad: compra.cantidad,
          totalEstimado: subtotal.toFixed(2)
        }
      })

      setVentas(ventasProcesadas);
      setTotalVentas(sumaTotal); // Guardamos la suma total
      setCargando(false);

      if (ventasProcesadas.length === 0) {
        alert("No se encontraron ventas para la fecha seleccionada.");
      }

    } catch (error) {
      console.error("Error al cargar datos para el reporte:", error)
      alert("Hubo un error al generar el reporte. Verifique la consola o intente nuevamente.");
      setCargando(false)
      setVentas([]); // Limpiamos si hay error
    }
  }

  // Definición del Documento PDF
  const MiDocumentoPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.titulo}>Reporte de Ventas por Fecha</Text>
        <Text style={styles.subtitulo}>Fecha de Reporte: {fechaSeleccionada}</Text>

        {/* Tabla de Ventas */}
        <View style={styles.tabla}>
          {/* Encabezados */}
          <View style={styles.fila}>
            <View style={{ ...styles.columna, width: '20%' }}>
              <Text style={styles.celdaEncabezado}>Cliente</Text>
            </View>
            <View style={{ ...styles.columna, width: '20%' }}>
              <Text style={styles.celdaEncabezado}>Producto</Text>
            </View>
            <View style={{ ...styles.columna, width: '15%' }}>
              <Text style={styles.celdaEncabezado}>Vendedor</Text>
            </View>
            <View style={{ ...styles.columna, width: '15%' }}>
              <Text style={styles.celdaEncabezado}>Precio U.</Text>
            </View>
            <View style={{ ...styles.columna, width: '10%' }}>
              <Text style={styles.celdaEncabezado}>Cant.</Text>
            </View>
            <View style={{ ...styles.columna, width: '20%' }}>
              <Text style={styles.celdaEncabezado}>Subtotal</Text>
            </View>
          </View>

          {/* Datos */}
          {ventas.map((venta, index) => (
            <View key={index} style={styles.fila}>
              <View style={{ ...styles.columna, width: '20%' }}>
                <Text style={styles.celdaDatos}>{venta.cliente}</Text>
              </View>
              <View style={{ ...styles.columna, width: '20%' }}>
                <Text style={styles.celdaDatos}>{venta.producto}</Text>
              </View>
              <View style={{ ...styles.columna, width: '15%' }}>
                <Text style={styles.celdaDatos}>{venta.vendedor}</Text>
              </View>
              <View style={{ ...styles.columna, width: '15%' }}>
                <Text style={styles.celdaDatos}>{venta.precio}</Text>
              </View>
              <View style={{ ...styles.columna, width: '10%' }}>
                <Text style={styles.celdaDatos}>{venta.cantidad}</Text>
              </View>
              <View style={{ ...styles.columna, width: '20%' }}>
                <Text style={styles.celdaDatos}>{venta.totalEstimado}</Text>
              </View>
            </View>
          ))}

          {/* FILA DE TOTAL - Al final de la tabla */}
          <View style={styles.fila}>
            <View style={{ ...styles.columna, width: '80%', backgroundColor: '#f0f0f0' }}>
              <Text style={{ ...styles.celdaEncabezado, textAlign: 'right', paddingRight: 5 }}>
                TOTAL VENTAS:
              </Text>
            </View>
            <View style={{ ...styles.columna, width: '20%', backgroundColor: '#f0f0f0' }}>
              <Text style={styles.celdaEncabezado}>
                {totalVentas.toFixed(2)} BS
              </Text>
            </View>
          </View>

        </View>
      </Page>
    </Document>
  )

  return (
    <div style={{ padding: 20 }}>
      {/* Selector de Fecha */}
      <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
        <label style={{ fontWeight: 'bold' }}>Seleccione Fecha:</label>
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          style={{ padding: 5 }}
        />
        <button
          onClick={CargarReporte}
          style={{
            padding: '5px 15px',
            backgroundColor: '#2C7873',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Generar Reporte
        </button>
      </div>

      {/* Visualizador PDF */}
      {cargando ? (
        <div>Generando reporte...</div>
      ) : (
        ventas.length > 0 ? (
          <PDFViewer width="100%" height="600px" style={{ border: 'none' }}>
            {MiDocumentoPDF()}
          </PDFViewer>
        ) : (
          <div>No hay ventas para la fecha seleccionada o aún no se ha generado el reporte.</div>
        )
      )}
    </div>
  )
}

export default Reporte
