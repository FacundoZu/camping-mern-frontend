import React from 'react'

export const ReservarModal = () => {
    return (
        <div>
            <div class="text-center p-6 bg-gray-100 rounded-lg border-2 border-dashed border-green-400 max-w-md mx-auto">
                <h2 class="text-2xl font-bold text-green-600 mb-4">¡Estás a punto de reservar!</h2>
                <p class="text-lg text-gray-800 mb-4"><strong>Detalles de la reserva:</strong></p>
                <div class="text-sm text-gray-700 mb-4">
                    <div><strong>Fecha de inicio:</strong> ${new Date(fechas.fechaInicio).toLocaleDateString('es-ES')}</div>
                    <div><strong>Fecha de fin:</strong> ${new Date(fechas.fechaFinal).toLocaleDateString('es-ES')}</div>
                    <div><strong>Precio total:</strong> ${total} €</div>
                </div>
                <div>
                    <label class="block text-gray-700"><strong>Selecciona un método de pago:</strong></label>
                    <select
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccionar...</option>
                        <option value="transferencia">Transferencia Bancaria</option>
                        <option value="debito">Débito</option>
                        <option value="credito">Crédito</option>
                    </select>

                    {metodoPago === 'transferencia' && (
                        <div className="mt-4">
                            <p><strong>CBU para Transferencia:</strong> 123456789012345678901234</p>
                            <input
                                type="file"
                                onChange={(e) => setComprobante(e.target.files[0])}
                                className="mt-2"
                            />
                            <p className="text-sm text-gray-500">Sube el comprobante de la transferencia</p>
                        </div>
                    )}

                    {(metodoPago === 'debito' || metodoPago === 'credito') && (
                        <div className="mt-4">
                            <div>
                                <label class="block text-gray-700"><strong>Número de tarjeta:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.numero}
                                    onChange={(e) => setTarjeta({ ...tarjeta, numero: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="XXXX XXXX XXXX XXXX"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700"><strong>Vencimiento:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.vencimiento}
                                    onChange={(e) => setTarjeta({ ...tarjeta, vencimiento: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="MM/AA"
                                />
                            </div>
                            <div>
                                <label class="block text-gray-700"><strong>CVV:</strong></label>
                                <input
                                    type="text"
                                    value={tarjeta.cvv}
                                    onChange={(e) => setTarjeta({ ...tarjeta, cvv: e.target.value })}
                                    className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    placeholder="XXX"
                                />
                            </div>
                            {metodoPago === 'credito' && (
                                <div className="mt-4">
                                    <label class="block text-gray-700"><strong>Cuotas:</strong></label>
                                    <select
                                        value={cuotas}
                                        onChange={(e) => setCuotas(e.target.value)}
                                        className="w-full p-2 mt-2 border border-gray-300 rounded-md"
                                    >
                                        <option value={1}>1 cuota</option>
                                        <option value={3}>3 cuotas</option>
                                        <option value={6}>6 cuotas</option>
                                        <option value={12}>12 cuotas</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

