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
import toast from 'react-hot-toast';

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth0();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Real-time sync
  useEffect(() => {
    const uid = user?.sub || user?.email;

    if (!isAuthenticated || !uid) {
      console.warn('Firestore sync skipped — user not authenticated or missing uid');
      return;
    }

    console.log('🔄 Listening to Firestore for UID:', uid);
    const tasksRef = collection(db, 'users', uid, 'tasks');

    const unsubscribe = onSnapshot(
      tasksRef,
      (snapshot) => {
        const loadedTasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Task, 'id'>),
        }));
        console.log('✅ Snapshot received with', loadedTasks.length, 'tasks');
        setTasks(loadedTasks);
      },
      (error) => {
        console.error('❌ Firestore onSnapshot error:', error);
        toast.error('Error syncing tasks.');
      }
    );

    return () => unsubscribe();
  }, [isAuthenticated, user]);

  const addTask = async (task: Task) => {
    const uid = user?.sub || user?.email;
    if (!uid) {
      console.warn('addTask failed — no uid');
      toast.error('Not authenticated');
      return;
    }

    try {
      console.log('📦 Saving task for UID:', uid, task);
      const taskRef = doc(db, 'users', uid, 'tasks', task.id);
      await setDoc(taskRef, task);
      toast.success('Task saved!');
    } catch (err) {
      console.error('❌ Failed to save task:', err);
      toast.error('Failed to save task');
    }
  };

  const updateTask = async (updatedTask: Task) => {
    const uid = user?.sub || user?.email;
    if (!uid) return;

    try {
      const taskRef = doc(db, 'users', uid, 'tasks', updatedTask.id);
      await setDoc(taskRef, updatedTask, { merge: true });
      toast.success('Task updated');
    } catch (err) {
      console.error('❌ Failed to update task:', err);
      toast.error('Update failed');
    }
  };

  const deleteTask = async (id: string) => {
    const uid = user?.sub || user?.email;
    if (!uid) return;

    try {
      const taskRef = doc(db, 'users', uid, 'tasks', id);
      await deleteDoc(taskRef);
      toast.success('Task deleted');
    } catch (err) {
      console.error('❌ Failed to delete task:', err);
      toast.error('Delete failed');
    }
  };

  const clearAllTasks = async () => {
    const uid = user?.sub || user?.email;
    if (!uid) return;

    try {
      const deletions = tasks.map((task) =>
        deleteDoc(doc(db, 'users', uid, 'tasks', task.id))
      );
      await Promise.all(deletions);
      toast.success('All tasks cleared');
    } catch (err) {
      console.error('❌ Failed to clear tasks:', err);
      toast.error('Clear failed');
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        clearAllTasks,
        currentUser: user ?? null,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
