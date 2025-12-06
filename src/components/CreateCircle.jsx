import { useCreateCircle } from '../hooks/useCreateCircle';

export default function CreateCircle() {
  const {
    circleName, setCircleName,
    amount, setAmount,
    frequency, setFrequency,
    newMemberEmail, setNewMemberEmail,
    isSubmitting, isSearchingMember,
    members, submitComplete,
    handleAddMember,
    handleRemoveMember,
    handleSubmit,
    navigate
  } = useCreateCircle();

  if (submitComplete) {
    return (
      <div className={`flex h-screen`}>
        <div className="m-auto">
          <div className="bg-white rounded-lg border-gray-300 border p-3 shadow-lg">
            <div className="flex flex-row">
              <div className="px-2">
                <svg width="24" height="24" viewBox="0 0 1792 1792" fill="#44C997" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1299 813l-422 422q-19 19-45 19t-45-19l-294-294q-19-19-19-45t19-45l102-102q19-19 45-19t45 19l147 147 275-275q19-19 45-19t45 19l102 102q19 19 19 45t-19 45zm141 83q0-148-73-273t-198-198-273-73-273 73-198 198-73 273 73 273 198 198 273 73 273-73 198-198 73-273zm224 0q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z" />
                </svg>
              </div>
              <div className="ml-2 mr-6">
                <span className="font-semibold">Circulo Creado Exitosamente!</span>
                <span className="block text-gray-500">En un momento volveras a la pagina de inicio</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6">
        <button onClick={() => navigate('/dashboard')}
          className="text-blue-600 mb-2 flex items-center gap-2.5 hover:cursor-pointer text-xl"
        >
          <svg className='fill-current w-5' viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 1H4L0 5L4 9H5V6H11C12.6569 6 14 7.34315 14 9C14 10.6569 12.6569 12 11 12H4V14H11C13.7614 14 16 11.7614 16 9C16 6.23858 13.7614 4 11 4H5V1Z"></path> </g></svg>
          Volver
        </button>
        <h1 className="text-2xl font-bold text-blue-800">Crea tu MicroCrédito</h1>
        <p className="text-sm text-gray-500">Define las reglas y los participantes.</p>
      </header>

      <hr className="mb-6" />

      <div className="bg-white p-6 rounded-xl shadow-lg">

        <h2 className="text-xl font-semibold mb-3 text-gray-700">1. Datos del Circulo</h2>
        <div className="space-y-4 mb-8">

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Nombre del Círculo:</span>
            <input
              type="text"
              value={circleName}
              onChange={(e) => setCircleName(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
              placeholder="Ej: Tanda de la Quincena"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Monto por Período (MXN):</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="100"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Frecuencia de Pago:</span>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border bg-white"
            >
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="monthly">Mensual</option>
            </select>
          </label>

        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-700">2. Participantes y Turnos</h2>

        {/* Formulario para añadir miembros */}
        <form onSubmit={handleAddMember} className="flex space-x-2 mb-4">
          <input
            type="email"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            className="grow rounded-md border-gray-300 shadow-sm p-2 border"
            placeholder="Email del nuevo miembro"
            disabled={isSearchingMember}
          />
          <button
            disabled={isSearchingMember}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            {isSearchingMember ? 'Buscando...' : 'Añadir'}
          </button>
        </form>

        {/* Lista de Miembros (Turnos) */}
        <ul className="space-y-2 mb-8">
          {members.map((member, index) => (
            <li key={member.email} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
              <div className="flex items-center space-x-3">
                <span className="font-bold text-lg text-blue-600">{index + 1}.</span>
                <div>
                  <p className="font-medium">{member.name} {member.isAdmin && '(Tú - Admin)'}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
              </div>
              {!member.isAdmin && (
                <svg
                  onClick={() => handleRemoveMember(member.email)}
                  className="w-7 fill-red-500 hover:fill-red-700"
                  viewBox="-3 0 32 32"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <g transform="translate(-259.000000, -203.000000)">
                      <path
                        d="M282,211 L262,211 C261.448,211 261,210.553 261,210 C261,209.448 261.448,209 262,209 L282,209 C282.552,209 283,209.448 283,210 C283,210.553 282.552,211 282,211 L282,211 Z M281,231 C281,232.104 280.104,233 279,233 L265,233 C263.896,233 263,232.104 263,231 L263,213 L281,213 L281,231 L281,231 Z M269,206 C269,205.447 269.448,205 270,205 L274,205 C274.552,205 275,205.447 275,206 L275,207 L269,207 L269,206 L269,206 Z M283,207 L277,207 L277,205 C277,203.896 276.104,203 275,203 L269,203 C267.896,203 267,203.896 267,205 L267,207 L261,207 C259.896,207 259,207.896 259,209 L259,211 C259,212.104 259.896,213 261,213 L261,231 C261,233.209 262.791,235 265,235 L279,235 C281.209,235 283,233.209 283,231 L283,213 C284.104,213 285,212.104 285,211 L285,209 C285,207.896 284.104,207 283,207 L283,207 Z M272,231 C272.552,231 273,230.553 273,230 L273,218 C273,217.448 272.552,217 272,217 C271.448,217 271,217.448 271,218 L271,230 C271,230.553 271.448,231 272,231 L272,231 Z M267,231 C267.552,231 268,230.553 268,230 L268,218 C268,217.448 267.552,217 267,217 C266.448,217 266,217.448 266,218 L266,230 C266,230.553 266.448,231 267,231 L267,231 Z M277,231 C277.552,231 278,230.553 278,230 L278,218 C278,217.448 277.552,217 277,217 C276.448,217 276,217.448 276,218 L276,230 C276,230.553 276.448,231 277,231 L277,231 Z"
                      />
                    </g>
                  </g>
                </svg>

              )}
            </li>
          ))}
        </ul>

        {/* BOTÓN DE CREACIÓN */}
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            disabled={isSubmitting || members.length < 2 || isSearchingMember}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Creando Círculo...' : 'Confirmar y Crear Círculo'}
          </button>

          {members.length < 2 && (
            <p className="text-center text-sm text-red-500 mt-2">
              Añade al menos un miembro para continuar.
            </p>
          )}

        </form>

      </div>

    </div>
  );
}
