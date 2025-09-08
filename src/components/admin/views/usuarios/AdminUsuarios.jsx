import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Global } from '../../../../helpers/Global';
import { Peticion } from '../../../../helpers/Peticion';
import { jsPDF } from "jspdf";
import { FaRegFilePdf } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [todosLosUsuarios, setTodosLosUsuarios] = useState([]); // Estado para todos los usuarios filtrados
    const [cargando, setCargando] = useState(true);
    const [filtros, setFiltros] = useState({ id: '', name: '', email: '' });
    const [pagina, setPagina] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortRole, setSortRole] = useState('asc');

    useEffect(() => {
        const obtenerUsuarios = async () => {
            let url = `${Global.url}user/getAllUsers?page=${pagina}&limit=10`;

            if (filtros.name) url += `&name=${filtros.name}`;
            if (filtros.email) url += `&email=${filtros.email}`;
            if (sortRole) url += `&sortRole=${sortRole}`;

            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.status === 'success') {
                setUsuarios(datos.users);
                setTotalPages(datos.totalPages);
                setCargando(false);
            }
        };

        obtenerUsuarios();
    }, [pagina, filtros, sortRole]);

    // Nueva función para cargar todos los usuarios filtrados
    useEffect(() => {
        const cargarTodosLosUsuarios = async () => {
            let url = `${Global.url}user/getAllUsers?limit=1000`; // Ajusta el límite según sea necesario

            // Añadir filtros a la URL
            if (filtros.name) url += `&name=${filtros.name}`;
            if (filtros.email) url += `&email=${filtros.email}`;
            if (sortRole) url += `&sortRole=${sortRole}`;

            const { datos } = await Peticion(url, "GET", null, false, 'include');
            if (datos.status === 'success') {
                setTodosLosUsuarios(datos.users);
            }
        };

        cargarTodosLosUsuarios();
    }, [filtros, sortRole]);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
            setPagina(nuevaPagina);
        }
    };

    const manejarFiltro = (e) => {
        const { name, value } = e.target;
        setFiltros((prevFiltros) => ({
            ...prevFiltros,
            [name]: value,
        }));
    };

    const cambiarOrdenRol = () => {
        setSortRole((prevSortRole) => (prevSortRole === 'asc' ? 'desc' : 'asc'));
    };

    const generarPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.setTextColor(40, 40, 40);

        doc.setFont("helvetica", "bold");
        doc.text("Lista de Usuarios", 105, 15, null, null, "center");

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(`Total de Usuarios: ${todosLosUsuarios.length}`, 10, 30);
        const totalAdmins = todosLosUsuarios.filter((usuario) => usuario.role === "admin").length;
        doc.text(`Total de Admins: ${totalAdmins}`, 10, 40);
        doc.text(`Total de Clientes: ${todosLosUsuarios.length - totalAdmins}`, 10, 50);

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

        todosLosUsuarios.forEach((usuario) => {
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

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Gestión de Usuarios</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={generarPDF}
                        className="flex items-center px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition duration-200"
                    >
                        <FaRegFilePdf className="mr-2" size={20} /> Generar
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    name="name"
                    value={filtros.name}
                    onChange={manejarFiltro}
                    placeholder="Buscar por Nombre"
                    className="px-4 py-2 border rounded mr-4"
                />
                <input
                    type="text"
                    name="email"
                    value={filtros.email}
                    onChange={manejarFiltro}
                    placeholder="Buscar por Correo"
                    className="px-4 py-2 border rounded mr-4"
                />
                <button
                    onClick={cambiarOrdenRol}
                    className="px-4 py-2 bg-lime-600 text-white rounded mb-4"
                >
                    Ordenar por Rol: {sortRole === 'asc' ? 'Admin' : 'Gerente'}
                </button>
            </div>

            <table className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
                <thead>
                    <tr>
                        <th className="py-3 px-4">Nombre</th>
                        <th className="py-3 px-4">Correo</th>
                        <th className="py-3 px-4">Rol</th>
                        <th className="py-3 px-4">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario.id || usuario._id} className="bg-white border-b hover:bg-gray-100 transition duration-200">
                            <td className="py-3 px-4 text-gray-700">{usuario.name}</td>
                            <td className="py-3 px-4 text-gray-700">{usuario.email}</td>
                            <td className="py-3 px-4 text-gray-700 capitalize text-center" style={{ color: usuario.role === 'admin' ? 'red' : 'green' }}>
                                {usuario.role}
                            </td>
                            <td className=" text-center">
                                <div className="flex items-center justify-center">
                                    <Link to={`/admin/EditarUsuario/${usuario.id || usuario._id}`} title="Editar" className="flex items-center justify-center text-gray-700 py-2 px-2 rounded-full hover:bg-gray-300 mr-2 transition duration-200">
                                        <MdModeEdit size={20} />
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="flex justify-center mt-6">
                <button
                    onClick={() => cambiarPagina(pagina - 1)}
                    className="px-4 py-2 bg-gray-300 rounded-l"
                    disabled={pagina === 1}
                >
                    <RiArrowLeftSLine size={20} />
                </button>
                <span className="px-4 py-2">{pagina} de {totalPages}</span>
                <button
                    onClick={() => cambiarPagina(pagina + 1)}
                    className="px-4 py-2 bg-gray-300 rounded-r"
                    disabled={pagina === totalPages}
                >
                    <RiArrowRightSLine size={20} />
                </button>
            </div>

            {cargando && <p className="text-center text-gray-500 mt-4">Cargando usuarios...</p>}
        </div>
    );
};
