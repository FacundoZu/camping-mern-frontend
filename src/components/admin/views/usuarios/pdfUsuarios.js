import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

/**
 * Genera un PDF con la lista de usuarios usando jspdf-autotable.
 * @param {Array} usuarios - Array de usuarios filtrados
 * @param {String} titulo - Título del PDF
 */
export const generarPDFUsuarios = (usuarios = [], titulo = "Lista de Usuarios") => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, 105, 15, null, null, "center");

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);

    const totalAdmins = usuarios.filter(u => u.role === "admin").length;
    doc.text(`Total de Usuarios: ${usuarios.length}`, 14, 30);
    doc.text(`Total de Admins: ${totalAdmins}`, 14, 40);
    doc.text(`Total de Clientes: ${usuarios.length - totalAdmins}`, 14, 50);

    const tableColumn = ["Nombre", "Email", "Rol"];
    const tableRows = [];

    usuarios.forEach(usuario => {
        const usuarioData = [
            usuario.name,
            usuario.email,
            usuario.role
        ];
        tableRows.push(usuarioData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 60,
        headStyles: {
            fillColor: [44, 62, 80],
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
            0: { cellWidth: 50 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 30, halign: 'center' }
        }
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
};