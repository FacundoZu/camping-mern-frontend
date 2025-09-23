// src/helpers/pdfUsuarios.js
import { jsPDF } from "jspdf";

/**
 * Genera un PDF con la lista de usuarios.
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

    doc.text(`Total de Usuarios: ${usuarios.length}`, 10, 30);

    const totalAdmins = usuarios.filter(u => u.role === "admin").length;
    doc.text(`Total de Admins: ${totalAdmins}`, 10, 40);
    doc.text(`Total de Clientes: ${usuarios.length - totalAdmins}`, 10, 50);

    doc.setDrawColor(200, 200, 200);
    doc.line(10, 55, 200, 55);

    let yPosition = 65;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Nombre", 10, yPosition);
    doc.text("Email", 80, yPosition);
    doc.text("Rol", 150, yPosition);
    doc.line(10, yPosition + 2, 200, yPosition + 2);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    yPosition += 10;

    usuarios.forEach((usuario) => {
        if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
        }
        doc.text(usuario.name, 10, yPosition);
        doc.text(usuario.email, 80, yPosition);
        doc.text(usuario.role, 150, yPosition);
        yPosition += 10;
    });

    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, "_blank");
};
