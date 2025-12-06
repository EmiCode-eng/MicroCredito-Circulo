import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, arrayUnion, query, where, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useCreateCircle() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [circleName, setCircleName] = useState('');
  const [amount, setAmount] = useState(500);
  const [frequency, setFrequency] = useState('weekly');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSearchingMember, setIsSearchingMember] = useState(false);
  const [submitComplete, setSubmitComplete] = useState(false)

  const [members, setMembers] = useState([{
    uid: currentUser.uid,
    name: currentUser.displayName,
    email: currentUser.email,
    isAdmin: true
  }]);

  // ---- Lógica: añadir miembro ----
  const handleAddMember = async (e) => {
    e.preventDefault();
    const email = newMemberEmail.trim();

    if (!email || members.some(m => m.email === email)) {
      alert("Email inválido o ya agregado.");
      return;
    }

    setIsSearchingMember(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let memberData = null;

      if (querySnapshot.empty) {
        const newUid = `invited_${Date.now()}`;
        const name = email.split('@')[0];

        await setDoc(doc(db, "users", newUid), {
          uid: newUid,
          displayName: name,
          email,
          trustScore: 100,
          activeCircles: [],
          isInvited: true,
          createdAt: new Date()
        });

        memberData = { uid: newUid, name, email, isAdmin: false };

      } else {
        const existing = querySnapshot.docs[0].data();
        memberData = {
          uid: querySnapshot.docs[0].id,
          name: existing.displayName,
          email: existing.email,
          isAdmin: false
        };
      }

      setMembers(prev => [...prev, memberData]);
      setNewMemberEmail('');
    } catch (err) {
      console.error(err);
      alert("Error al procesar el miembro.");
    } finally {
      setIsSearchingMember(false);
    }
  };

  const handleRemoveMember = (email) => {
    setMembers(members.filter(m => m.email !== email));
  };

  // ---- Lógica: crear círculo ----
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (members.length < 2) {
      alert("Un círculo necesita al menos 2 personas.");
      return;
    }

    setIsSubmitting(true);

    try {
      const membersWithTurns = members.map((m, i) => ({
        uid: m.uid,
        name: m.name,
        isAdmin: m.isAdmin,
        turnNumber: i + 1,
        hasPaidCurrentTurn: false
      }));

      const circleData = {
        name: circleName,
        adminId: currentUser.uid,
        amountPerPeriod: Number(amount),
        frequency,
        startDate: new Date(),
        status: "active",
        currentTurn: 1,
        members: membersWithTurns,
        totalMembers: members.length
      };

      const circleRef = await addDoc(collection(db, "circles"), circleData);
      const id = circleRef.id;

      for (const member of members) {
        await updateDoc(doc(db, "users", member.uid), {
          activeCircles: arrayUnion(id)
        });
      }

      setSubmitComplete(true)

      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)

      //alert(`Círculo '${circleName}' creado con éxito!`);
      //navigate('/dashboard');

    } catch (error) {
      console.error(error);
      alert("Error al crear el círculo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
