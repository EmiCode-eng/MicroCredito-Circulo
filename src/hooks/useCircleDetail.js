import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Ajusta la ruta según tu proyecto

export function useCircleData(circleId, currentUser) {
  const [circle, setCircle] = useState(null);
  const [memberScores, setMemberScores] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Estado para el modal de notificaciones
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const isAdmin = circle?.adminId === currentUser?.uid;

  // Helper para mostrar notificaciones
  const showNotify = (type, title, message) => {
    setNotification({ isOpen: true, type, title, message });
  };

  const closeNotify = () => setNotification(prev => ({ ...prev, isOpen: false }));

  // Cargar datos
  const fetchCircleData = useCallback(async (isBackgroundUpdate = false) => {
    if (!circleId) return;

    if (!isBackgroundUpdate) setInitialLoading(true)

    try {
      const circleRef = doc(db, "circles", circleId);
      const circleSnap = await getDoc(circleRef);

      if (circleSnap.exists()) {
        const data = circleSnap.data();
        setCircle(data);

        // Cargar scores
        const memberUids = data.members.map(m => m.uid).filter(uid => !uid.startsWith('mock_'));
        if (memberUids.length > 0) {
          const usersQuery = query(collection(db, "users"), where("uid", "in", memberUids));
          const usersSnap = await getDocs(usersQuery);
          const scores = {};
          usersSnap.forEach(d => scores[d.id] = d.data().trustScore);
          setMemberScores(scores);
        }
      } else {
        showNotify('error', 'Error', 'Círculo no encontrado');
        return false; // Indica fallo
      }
    } catch (error) {
      console.error(error);
      showNotify('error', 'Error de Conexión', 'No se pudo cargar la información.');
    } finally {
      setInitialLoading(false);

    }
  }, [circleId]);

  useEffect(() => {
    fetchCircleData();
  }, [fetchCircleData]);

  // Acciones
  const registerPayment = async (memberUid, hasPaid, memberIsAdmin) => {
    if (!isAdmin || isProcessing) return;
    setIsProcessing(true);
    try {
      // 1. Buscamos el estado actual del miembro antes de modificarlo
      const targetMember = circle.members.find(m => m.uid === memberUid);
      const wasPenalized = targetMember?.isPenalized;
      let scoreRestored = false

      // 2. Lógica de Restauración de Puntos
      // Si estamos validando el pago (hasPaid = true) Y estaba penalizado
      if (hasPaid && wasPenalized) {
        const userRef = doc(db, "users", memberUid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const currentScore = userSnap.data().trustScore || 0;
          const restoredScore = currentScore + 10; // Restauramos los 10 puntos exactos

          await updateDoc(userRef, { trustScore: restoredScore });

          // Actualizamos el score localmente para que se vea reflejado al instante en la UI
          setMemberScores(prev => ({ ...prev, [memberUid]: restoredScore }));
          scoreRestored = true
        }
      }

      // 3. Actualizar el Círculo (Members)
      const updatedMembers = circle.members.map(m => {
        if (m.uid === memberUid) {
          return {
            ...m,
            hasPaidCurrentTurn: hasPaid,
            isPenalized: false, // Siempre quitamos la marca de penalizado al pagar
            debt: hasPaid ? 0 : m.debt
          };
        }
        return m;
      });

      await updateDoc(doc(db, "circles", circleId), { members: updatedMembers });
      await fetchCircleData(true);

    } catch (error) {
      console.error(error);
      showNotify('error', 'Error', 'No se pudo registrar el pago.');
    } finally {
      setIsProcessing(false);
    }
  };

  const penalizeMember = async (memberUid) => {
    if (!isAdmin || isProcessing) return;
    setIsProcessing(true);
    try {
      // 1. Bajar Score en colección Users
      const userRef = doc(db, "users", memberUid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const currentScore = userSnap.data().trustScore || 100;
        await updateDoc(userRef, { trustScore: Math.max(0, currentScore - 10) });
        // Actualizar localmente para feedback inmediato
        setMemberScores(prev => ({ ...prev, [memberUid]: Math.max(0, currentScore - 10) }));
      }

      // 2. Marcar como penalizado en el Círculo
      const updatedMembers = circle.members.map(m =>
        m.uid === memberUid ? { ...m, isPenalized: true } : m
      );

      await updateDoc(doc(db, "circles", circleId), { members: updatedMembers });
      await fetchCircleData(true); // Actualización silenciosa
      //showNotify('info', 'Penalización Aplicada', 'El usuario ha sido penalizado y cuenta para el progreso.');

    } catch (error) {
      showNotify('error', 'Error', 'Fallo al penalizar.');
    } finally {
      setIsProcessing(false);
    }
  };

  const advanceTurn = async (paymentsCollected, totalMembers) => {
    if (!isAdmin || isProcessing) return;

    if (paymentsCollected < totalMembers) {
      showNotify('error', 'Pagos Incompletos', 'Todos deben pagar antes de avanzar.');
      return;
    }

    const nextTurn = circle.currentTurn + 1;
    if (nextTurn > circle.members.length) {
      showNotify('success', 'Ciclo Completado', '¡El círculo ha terminado todos los turnos! 🎉');
      // Aquí podrías añadir una acción para marcar el círculo como 'completed' en Firestore
      return; // Detiene la ejecución
    }


    setIsProcessing(true);
    try {
      // Calculamos la deuda acumulada para el siguiente turno
      const updatedMembers = circle.members.map(m => {
        // Si NO pagó en este turno (aunque esté penalizado), su deuda aumenta
        const addedDebt = m.hasPaidCurrentTurn ? 0 : circle.amountPerPeriod;

        return {
          ...m,
          hasPaidCurrentTurn: false,
          isPenalized: false, // Reseteamos la bandera de penalización para el nuevo turno
          debt: (m.debt || 0) + addedDebt // Acumulamos la deuda
        };
      });

      await updateDoc(doc(db, "circles", circleId), {
        currentTurn: nextTurn,
        members: updatedMembers
      });

      await fetchCircleData(true);
      //showNotify('success', 'Turno Avanzado', `Iniciando Turno ${nextTurn}. Las deudas se han actualizado.`);
    } catch (error) {
      showNotify('error', 'Error', 'No se pudo avanzar el turno.');
    } finally {
      setIsProcessing(false);
    }
  };


  const uploadProof = async (file) => {
    // Implementación placeholder para subir archivo
    if (!file) return;
    setIsProcessing(true);
    try {
      // Lógica de firebase storage aquí...
      // const storageRef = ref(storage, `proofs/${circleId}/${currentUser.uid}`);
      // await uploadBytes(storageRef, file);
      showNotify('success', 'Subida Exitosa', 'Tu comprobante se ha enviado.');
    } catch (e) {
      showNotify('error', 'Error', 'No se pudo subir el archivo.');
    } finally {
      setIsProcessing(false);
    }
  }

  return {
    circle,
    initialLoading,
    isAdmin,
    isProcessing,
    memberScores,
    notification,
    closeNotify,
    actions: {
      registerPayment,
      advanceTurn,
      penalizeMember,
      uploadProof
    }
  };
}
