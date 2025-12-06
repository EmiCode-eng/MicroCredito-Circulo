import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCircleData } from '../hooks/useCircleDetail';
import NotificationModal from '../components/NotificationModal';

export default function CircleDetail() {
  const { id: circleId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // URL de ejemplo (se mantiene hardcoded por ahora, si en el futuro se usa Storage, se obtendría aquí)
  const RECEIPT_URL = 'https://www.matrimony.mx/_proy/st/_sis/contabilidad/comprobantes/0/11/11152/ingreso_id_4882/DC4AABC6CBD34D09A3E03CDED16B5742.jpeg';

  const {
    circle, initialLoading, isAdmin, isProcessing, memberScores,
    notification, closeNotify, actions
  } = useCircleData(circleId, currentUser);

  // 1. Pantalla de carga inicial solamente (ya no parpadea al actualizar)
  if (initialLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando círculo...</p>
        </div>
      </div>
    );
  }

  if (!circle) return null;

  // 2. Cálculos Actualizados
  const resolvedMembersCount = circle.members.filter(m => m.hasPaidCurrentTurn || m.isPenalized).length;
  const collectionProgress = (resolvedMembersCount / circle.members.length) * 100;
  const totalCircleAmount = circle.amountPerPeriod * circle.members.length;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NotificationModal isOpen={notification.isOpen} onClose={closeNotify} {...notification} />

      {/* --- NUEVO HEADER "PREMIUM" --- */}
      <div className="bg-white pb-8">
        {/* Barra superior oscura o degradada */}
        <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white pt-8 pb-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <button onClick={() => navigate('/dashboard')} className="text-indigo-200 hover:text-white flex items-center gap-2 mb-6 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Volver al Dashboard
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{circle.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-indigo-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="text-sm">Admin: <span className="font-semibold text-white">{circle.members.find(m => m.isAdmin)?.name}</span></span>
                </div>
              </div>

              {/* Badge de Turno */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-lg text-right">
                <p className="text-xs text-indigo-200 uppercase tracking-wider font-semibold">Turno Actual</p>
                <p className="text-2xl font-bold text-white flex items-center justify-end gap-1">
                  <span className="text-lg text-indigo-300">#</span>
                  {circle.currentTurn} <span className="text-sm text-indigo-400 font-normal">/ {circle.members.length}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de Estadísticas (Flotando sobre el header) */}
        <div className="max-w-4xl mx-auto px-4 -mt-10">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-1 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">

            {/* Stat 1: Fondo Total */}
            <div className="p-6 text-center md:text-left hover:bg-gray-50 transition-colors rounded-l-xl group">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Fondo a Recibir</p>
              </div>
              <p className="text-2xl font-extrabold text-gray-800 ml-1">${totalCircleAmount.toLocaleString()}</p>
            </div>

            {/* Stat 2: Tu Aporte */}
            <div className="p-6 text-center md:text-left hover:bg-gray-50 transition-colors group">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Tu Aporte Mensual</p>
              </div>
              <p className="text-2xl font-extrabold text-gray-800 ml-1">${circle.amountPerPeriod.toLocaleString()}</p>
            </div>

            {/* Stat 3: Estado */}
            <div className="p-6 text-center md:text-left hover:bg-gray-50 transition-colors rounded-r-xl group">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Recaudación</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-extrabold text-gray-800 ml-1">{Math.round(collectionProgress)}%</p>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded-full">{resolvedMembersCount}/{circle.members.length} pagos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8">

        {/* PROGRESS BAR */}
        <section className="mb-10">
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden shadow-inner">
            <div
              className={`h-full transition-all duration-1000 ease-out shadow-lg ${collectionProgress === 100 ? 'bg-linear-to-r from-green-400 to-green-600' : 'bg-linear-to-r from-blue-400 to-indigo-600'}`}
              style={{ width: `${collectionProgress}%` }}
            ></div>
          </div>

          {isAdmin && (
            <button
              onClick={() => actions.advanceTurn(resolvedMembersCount, circle.members.length)}
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg
                        ${resolvedMembersCount === circle.members.length
                  ? 'bg-indigo-900 text-white hover:bg-black ring-4 ring-indigo-50'
                  : 'bg-white text-gray-400 border border-gray-200 cursor-not-allowed'}`}
            >
              {isProcessing ? 'Procesando...' : `Cerrar Turno #${circle.currentTurn} y Avanzar`}
            </button>
          )}
        </section>

        {/* LISTA DE MIEMBROS (Misma lógica, solo pequeños ajustes visuales) */}
        <section className="space-y-4 mb-12">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
            Detalle de Miembros
          </h2>

          {circle.members.map((member) => {
            const currentDebt = member.debt || 0;
            const totalToPay = circle.amountPerPeriod + currentDebt;

            let statusColor = 'border-l-gray-300';
            if (member.hasPaidCurrentTurn) statusColor = 'border-l-green-500 bg-green-50/30';
            else if (member.isPenalized) statusColor = 'border-l-red-500 bg-red-50/30';

            return (
              <div key={member.uid} className={`relative bg-white px-5 py-10 rounded-xl border border-gray-100 shadow-sm border-l-4 transition-all hover:shadow-md ${statusColor}`}>

                {/* Badge de Estado Superior */}
                <div className="absolute top-4 right-5">
                  {member.hasPaidCurrentTurn && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">✅ Pagado</span>}
                  {member.isPenalized && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">⚠️ Penalizado</span>}
                  {!member.hasPaidCurrentTurn && !member.isPenalized && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">⏳ Pendiente</span>}
                </div>

                <div className="flex flex-col md:flex-row gap-4 mt-2">
                  {/* Avatar / Inicial */}
                  <div className="shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-sm ${member.hasPaidCurrentTurn ? 'bg-linear-to-br from-green-400 to-green-600' : 'bg-linear-to-br from-gray-300 to-gray-400'}`}>
                      {member.name.charAt(0)}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="grow">
                    <h3 className="text-lg font-bold text-gray-800">{member.name} {currentUser.uid === member.uid && <span className="text-indigo-500 text-sm">(Tú)</span>}</h3>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span>Turno: <b>#{member.turnNumber}</b></span>
                      <span>Score: <b className={memberScores[member.uid] < 50 ? 'text-red-500' : 'text-yellow-600'}>{memberScores[member.uid] || 100}</b></span>
                    </div>

                    {/* Montos */}
                    <div className="mt-3 flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-lg md:w-auto w-full">
                      <span className="text-gray-500">Total a pagar:</span>
                      <span className="font-bold text-gray-800 text-base">${totalToPay}</span>
                      {currentDebt > 0 && <span className="text-red-500 text-xs font-semibold">(Inc. deuda ${currentDebt})</span>}
                    </div>
                  </div>

                  {/* Acciones Admin */}
                  {isAdmin && (
                    <div className="flex md:flex-col gap-2 justify-end mt-2 md:mt-0">
                      {!member.isAdmin && (
                        <button
                          onClick={() => setShowReceiptModal(true)} // Abre el modal
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          Ver Comprobante
                        </button>
                      )}
                      <button
                        onClick={() => actions.registerPayment(member.uid, !member.hasPaidCurrentTurn, member.isAdmin)}
                        disabled={isProcessing}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2
                                            ${member.hasPaidCurrentTurn
                            ? 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200 hover:shadow-md'}
                                        `}
                      >
                        {member.hasPaidCurrentTurn ? 'Deshacer Pago' : 'Validar Pago'}
                      </button>

                      {member.uid !== currentUser.uid && !member.hasPaidCurrentTurn && !member.isPenalized && (
                        <button
                          onClick={() => actions.penalizeMember(member.uid)}
                          disabled={isProcessing}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 transition-colors"
                        >
                          Penalizar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </section>

        {showReceiptModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 backdrop-blur-sm"
            onClick={() => setShowReceiptModal(false)} // Cierra el modal al hacer clic fuera
          >
            <div
              className="max-w-4xl max-h-[90vh] overflow-hidden relative"
              onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer clic dentro del contenido
            >
              {/* Botón de Cierre */}
              <button
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold z-50 bg-black/50 w-10 h-10 rounded-full hover:bg-black/75 transition-colors flex items-center justify-center"
                aria-label="Cerrar modal"
              >
                &times;
              </button>

              {/* Imagen */}
              <img
                src={RECEIPT_URL}
                alt="Comprobante de Pago"
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl border-4 border-white/20"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
