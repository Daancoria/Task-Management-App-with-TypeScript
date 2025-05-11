import { useState, useEffect, ReactNode } from 'react';
import { Task } from '../types';
import { TaskContext } from './TaskContextObject';
import { auth, db } from '../firebase';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const tasksRef = collection(db, 'users', user.uid, 'tasks');

    const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
      const loadedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }));
      setTasks(loadedTasks);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (task: Task) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', task.id);
    await setDoc(taskRef, task);
  };

  const updateTask = async (updatedTask: Task) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', updatedTask.id);
    await setDoc(taskRef, updatedTask, { merge: true });
  };

  const deleteTask = async (id: string) => {
    const user = auth.currentUser;
    if (!user) return;
    const taskRef = doc(db, 'users', user.uid, 'tasks', id);
    await deleteDoc(taskRef);
  };

  const clearAllTasks = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const tasksToDelete = tasks.map((task) =>
      deleteDoc(doc(db, 'users', user.uid, 'tasks', task.id))
    );
    await Promise.all(tasksToDelete);
  };

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, updateTask, deleteTask, clearAllTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
};
