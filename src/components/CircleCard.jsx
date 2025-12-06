import { useNavigate } from 'react-router-dom'

export const CircleCard = ({ circle, currentUserId }) => {
  const navigate = useNavigate();
  const totalPeriods = circle.members.length;
  const currentTurn = circle.currentTurn;

  // Encontrar la información del usuario actual dentro del círculo
  const userMemberInfo = circle.members.find(member => member.uid === currentUserId);
  const nextRecipient = circle.members.find(member => member.turnNumber === currentTurn);

  // Determinar el mensaje de estado
  let statusText = "";
  let statusColor = "bg-gray-100 text-gray-700";

  if (nextRecipient?.uid === currentUserId) {
    statusText = "¡TE TOCA RECIBIR A TI!";
    statusColor = "bg-green-100 text-green-700 border-green-500";
  } else if (userMemberInfo?.hasPaidCurrentTurn) {
    statusText = "¡Tú ya pagaste este turno! 👍";
    statusColor = "bg-blue-100 text-blue-700 border-blue-500";
  } else {
    statusText = `Pendiente: Pagar $${circle.amountPerPeriod} pesos.`;
    statusColor = "bg-red-100 text-red-700 border-red-500";
  }

  return (
    <div
      className={`p-4 mb-4 bg-white rounded-xl shadow-lg border-l-4 ${statusColor}`}
      onClick={() => navigate(`/circle/${circle.id}`)}
    >
      <h3 className="text-lg font-bold mb-1">{circle.name}</h3>
      <p className="text-sm text-gray-500 mb-3">Monto por turno: <span className='font-bold'>${circle.amountPerPeriod}</span></p>

      {/* Barra de Progreso */}
      <div className="mb-3">
        <div className="flex justify-between text-xs font-medium text-gray-600">
          <span>Progreso del Círculo</span>
          <span>{currentTurn} / {totalPeriods}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-blue-500"
            style={{ width: `${(currentTurn / totalPeriods) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Estado Personal y Siguiente Receptor */}
      <div className="mt-4 p-3 rounded-lg border border-dashed border-gray-300">
        <p className={`text-sm font-semibold ${statusColor.includes('green') ? 'text-green-800' : statusColor.includes('red') ? 'text-red-800' : 'text-gray-800'}`}>
          {statusText}
        </p>
        {!statusColor.includes('green') && nextRecipient && (
          <p className="text-xs text-gray-600 mt-1">
            Próximo en recibir: <span className='font-bold'>{nextRecipient.name}</span>
          </p>
        )}
      </div>

    </div>);
}
