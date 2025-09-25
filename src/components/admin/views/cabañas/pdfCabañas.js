
import { jsPDF } from "jspdf";


/**
 * Genera un PDF con la lista de cabañas.
 * @param {Array} cabañas - Array de cabañas filtradas
 * @param {String} titulo - Título del PDF
 */
export const generarPDFCabañas = (cabañas, titulo = "Lista de Cabañas") => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(0, 102, 51);
    doc.text(titulo, 20, 20);

    let yPosition = 30;

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('ID', 20, yPosition);
    doc.text('Nombre', 80, yPosition);
    doc.text('Estado', 130, yPosition);
    doc.text('Reservas Históricas', 165, yPosition);

    yPosition += 10;
    doc.setFont('helvetica', 'normal');

    cabañas.forEach((cabaña) => {
        doc.text(cabaña._id, 20, yPosition);
        doc.text(cabaña.nombre, 80, yPosition);
        doc.text(cabaña.estado, 130, yPosition);
        doc.text(cabaña.reservasHistoricas.toString(), 180, yPosition);
        yPosition += 10;
    });

    const pdfDataUri = doc.output('bloburl');
    window.open(pdfDataUri, '_blank');
};
