import { useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { TaskContext } from './TaskContextObject';
import { db } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useAuth0 } from '@auth0/auth0-react';


export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth0();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Real-time sync
  useEffect(() => {
    const uid = user?.sub || user?.email;
    if (!isAuthenticated || !uid) return;

    const tasksRef = collection(db, 'users', uid, 'tasks');

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }));
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  const addTask = async (task: Task) => {
    const uid = user?.sub || user?.email;
    if (!uid) return;
    const taskRef = doc(db, 'users', uid, 'tasks', task.id);
    await setDoc(taskRef, task);
  };

  const updateTask = async (updatedTask: Task) => {
    const uid = user?.sub || user?.email;
    if (!uid) return;
    const taskRef = doc(db, 'users', uid, 'tasks', updatedTask.id);
    await setDoc(taskRef, updatedTask, { merge: true });
  };

  const deleteTask = async (id: string) => {
    const uid = user?.sub || user?.email;
    if (!uid) return;
    const taskRef = doc(db, 'users', uid, 'tasks', id);
    await deleteDoc(taskRef);
  };

  const clearAllTasks = async () => {
    const uid = user?.sub || user?.email;
    if (!uid) return;
    const deletions = tasks.map((task) =>
      deleteDoc(doc(db, 'users', uid, 'tasks', task.id))
    );
    await Promise.all(deletions);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        clearAllTasks,
        currentUser: user ?? null, // ✅ Type-safe fallback
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
