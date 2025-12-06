export default function NotificationModal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;

  const typeStyles = {
    success: 'bg-green-100 text-green-800 border-green-500',
    error: 'bg-red-100 text-red-800 border-red-500',
    info: 'bg-blue-100 text-blue-800 border-blue-500',
  };

  const iconStyles = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full overflow-hidden transform transition-all">
        <div className={`p-4 border-l-4 ${typeStyles[type] || typeStyles.info}`}>
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>{iconStyles[type]}</span> {title}
            </h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 font-bold">✕</button>
          </div>
          <p className="mt-2 text-sm">{message}</p>
        </div>
        <div className="bg-gray-50 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
