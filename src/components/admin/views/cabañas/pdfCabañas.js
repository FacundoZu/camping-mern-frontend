import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con la lista de cabañas usando jspdf-autotable.
 * @param {Array} cabañas - Array de cabañas filtradas
 * @param {String} titulo - Título del PDF
 */
export const generarPDFCabañas = (cabañas, titulo = "Lista de Cabañas") => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 51);
    doc.text(titulo, 14, 22);
    const tableColumn = ["ID", "Nombre", "Estado", "Reservas Históricas"];
    const tableRows = [];

    cabañas.forEach(cabaña => {
        const cabañaData = [
            cabaña._id,
            cabaña.nombre,
            cabaña.estado,
            cabaña.reservasHistoricas?.toString() || '0'
        ];
        tableRows.push(cabañaData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 30,
        
        headStyles: {
            fillColor: [0, 102, 51],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        
        alternateRowStyles: {
            fillColor: [245, 245, 245]
        },
        styles: {
            cellPadding: 3,
            fontSize: 10,
            valign: 'middle'
        },

        columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 40, halign: 'center' },
            3: { cellWidth: 40, halign: 'right' }
        }
    });

    const pdfDataUri = doc.output('bloburl');
    window.open(pdfDataUri, '_blank');
};