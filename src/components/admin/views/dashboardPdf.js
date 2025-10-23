import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con el resumen del Dashboard.
 * @param {number} año - Año seleccionado
 * @param {object} estadisticas - Objeto con { cabañasDisponibles, reservasTotales, ingresosTotales }
 * @param {Array} cabañas - Array completo de cabañas
 * @param {object} campersStats - Objeto con estadísticas de acampantes
 * @param {object} dataReservasMensuales - Objeto de datos para el gráfico de líneas
 * @param {object} dataReservasPorCabaña - Objeto de datos para el gráfico de pastel
 * @param {object} dataMetodosPago - Objeto de datos para el gráfico de pastel
 */
export const generarPDFDashboard = (
    año,
    estadisticas,
    cabañas = [],
    campersStats = {},
    dataReservasMensuales = { labels: [], datasets: [] },
    dataReservasPorCabaña = { labels: [], datasets: [] },
    dataMetodosPago = { labels: [], datasets: [] }
) => {

    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let finalY = 0;

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Reporte General del Dashboard - Año ${año}`, 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen de Cabañas", 14, 35);

    const cabañasOcupadas = cabañas.length - estadisticas.cabañasDisponibles;
    const kpiReservasBody = [
        ["Cabañas Disponibles", estadisticas.cabañasDisponibles],
        ["Cabañas Ocupadas", cabañasOcupadas],
        ["Reservas Totales (Año)", estadisticas.reservasTotales],
        ["Ingresos Estimados (Año)", `$${Number(estadisticas.ingresosTotales || 0).toLocaleString()}`],
    ];

    autoTable(doc, {
        startY: 40,
        margin: { right: 105 },
        body: kpiReservasBody,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontStyle: 'bold',
            cellPadding: 3,
            fontSize: 10
        },
        columnStyles: {
            0: { fillColor: [240, 240, 240], textColor: [50, 50, 50] },
            1: { halign: 'right' }
        },
        didParseCell: (data) => {
            if (data.section === 'head') {
                data.cell.styles.fillColor = [255, 255, 255]; 
            }
        }
    });

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Resumen de Acampantes", 155, 35, { align: 'center' });
    
    const kpiCampersBody = [
        ["Total Acampantes", campersStats.totalCampers || 0],
        ["Total Personas", Number((campersStats.totalPersonas || 0) + (campersStats.totalNiños || 0))],
        ["Total Vehículos", campersStats.totalVehiculos || 0],
        ["Total Motorhomes", campersStats.totalMotorhomes || 0],
        ["Promedio Estancia", `${Number(campersStats.promedioEstancia || 0).toFixed(1)} días`],
        ["Ingresos Estimados", `$${Number(campersStats.totalIngresos || 0).toLocaleString()}`],
    ];

    autoTable(doc, {
        startY: 40,
        margin: { left: 105 }, 
        body: kpiCampersBody,
        theme: 'grid',
        styles: {
            font: 'helvetica',
            fontStyle: 'bold',
            cellPadding: 3,
            fontSize: 10
        },
        columnStyles: {
            0: { fillColor: [240, 240, 240], textColor: [50, 50, 50] },
            1: { halign: 'right' }
        },
        didParseCell: (data) => {
            if (data.section === 'head') {
                data.cell.styles.fillColor = [255, 255, 255]; 
            }
        }
    });

    const meses = dataReservasMensuales.labels || [];
    const datosReservas = dataReservasMensuales.datasets[0]?.data || new Array(12).fill(0);
    const datosAcampantes = dataReservasMensuales.datasets[1]?.data || new Array(12).fill(0);

    const bodyReservasMes = meses.map((mes, index) => [
        mes,
        datosReservas[index],
        datosAcampantes[index]
    ]);

    autoTable(doc, {
        head: [['Mes', 'Reservas', 'Acampantes']],
        body: bodyReservasMes,
        startY: 105,
        headStyles: {
            fillColor: [44, 62, 80],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: {
            1: { halign: 'right' },
            2: { halign: 'right' }
        },
        
        didDrawPage: function (data) {
            const pageCount = doc.internal.getNumberOfPages();
            const fecha = new Date().toLocaleDateString('es-AR');
            
            doc.setFontSize(10);
            doc.setTextColor(150);
            const footerY = pageHeight - 15;
            
            doc.text(`Generado el: ${fecha}`, data.settings.margin.left, footerY);
            doc.text(
                `Página ${data.pageNumber} de ${pageCount}`,
                doc.internal.pageSize.width - data.settings.margin.right,
                footerY,
                { align: 'right' }
            );
        }
    });

    finalY = (doc).lastAutoTable.finalY + 15;

    const labelsCabañas = dataReservasPorCabaña.labels || [];
    const datosCabañas = dataReservasPorCabaña.datasets[0]?.data || [];
    const bodyCabañas = labelsCabañas.map((label, i) => [label, datosCabañas[i] || 0]);

    const labelsPagos = dataMetodosPago.labels || [];
    const datosPagos = dataMetodosPago.datasets[0]?.data || [];
    const bodyPagos = labelsPagos.map((label, i) => [label, datosPagos[i] || 0]);

    if (finalY > 230) { 
        doc.addPage();
        finalY = 20; 
    }

    autoTable(doc, {
        head: [['Cabaña', 'N° Reservas']],
        body: bodyCabañas,
        startY: finalY,
        margin: { right: 105 }, 
        headStyles: {
            fillColor: [39, 174, 96], 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: { 1: { halign: 'right' } }
    });

    autoTable(doc, {
        head: [['Método de Pago', 'Usos']],
        body: bodyPagos,
        startY: finalY,
        margin: { left: 105 }, 
        headStyles: {
            fillColor: [41, 128, 185], 
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        columnStyles: { 1: { halign: 'right' } }
    });


    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
};