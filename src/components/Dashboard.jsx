import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { CircleCard } from './CircleCard';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [activeCircles, setActiveCircles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
    } else {
      fetchUserDataAndCircles();
    }
  }, [currentUser, navigate]);

  const fetchUserDataAndCircles = async () => {
    setLoading(true);
    const uid = currentUser.uid;

    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
        const userCircles = userSnap.data().activeCircles || [];

        if (userCircles.length > 0) {
          const circlesQuery = query(
            collection(db, "circles"),
            where("__name__", "in", userCircles) // __name__ es el ID del documento
          );
          const circleSnaps = await getDocs(circlesQuery);

          const circlesData = circleSnaps.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setActiveCircles(circlesData);
        }
      } else {
        // console.error("Perfil de usuario no encontrado.");
      }
    } catch (error) {
      // console.error("Error al cargar datos del dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-gray-700">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium">Cargando MicroCrédito...</p>
      </div>
    );
  }

  const trustScoreData = {
    datasets: [{
      data: [userProfile?.trustScore || 0, 100 - (userProfile?.trustScore || 0)],
      backgroundColor: ['#10B981', '#E5E7EB'],
      hoverBackgroundColor: ['#059669', '#D1D5DB'],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
    }],
  };

  const trustScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '80%', // El grosor de la línea del gráfico
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-extrabold text-blue-800">
            Hola, {userProfile?.displayName.split(' ')[0]}
          </h1>
          <p className="text-sm text-gray-500">
            Tu aval es tu reputación.
          </p>
        </div>

        <div className="relative flex items-center justify-center w-28 h-28">
          <Doughnut data={trustScoreData} options={trustScoreOptions} />
          <div className="absolute inset-0 top-5 flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 font-medium">Score</p>
            <p className="text-2xl font-bold text-green-600 leading-tight">
              {userProfile?.trustScore}
            </p>
          </div>
        </div>
      </header>

      {/* Circles Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Mis Círculos Activos ({activeCircles.length})
          </h2>
        </div>

        <button
          onClick={() => navigate('/create-circle')}
          className="w-full py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          Crear Nuevo Círculo (Tanda)
        </button>

        <div className="mt-6 space-y-4">
          {activeCircles.length === 0 ? (
            <div className="text-center p-8 bg-white rounded-xl shadow text-gray-500">
              Aún no estás en ningún círculo.
              <br />
              ¡Crea uno para empezar!
            </div>
          ) : (
            activeCircles.map(circle => (
              <CircleCard
                key={circle.id}
                circle={circle}
                currentUserId={currentUser.uid}
              />
            ))
          )}
        </div>
      </section>

      {/* Logout */}
      <button
        onClick={logout}
        className="text-red-500 hover:text-red-700 font-medium w-full p-3 text-center"
      >
        Cerrar Sesión
      </button>

    </div>
  );
}

