import React, {useState, useCallback} from 'react';

import axios from 'axios';

import {TaskList, Task} from '../types/tasks'



export const useTasks = () => {
	const [tasks, setTasks] = useState<TaskList>([]);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const fetchTasks = useCallback(async()=>{
		setLoading(true);
		setError('');
		try{
		  const getTasks = await axios.get('http://localhost:3000/tasks');
		  setTasks(getTasks.data.data);
		} catch(err){
		  setError((err as Error).message);
		} finally {
		  setLoading(false);
		}
	}, [])

	const deleteTask = useCallback(async(id:string)=>{
		setLoading(true);
		setError('');
		try{
		  const getTasks = await axios.delete(`http://localhost:3000/tasks/${id}`);
		  fetchTasks();
		} catch(err){
		  if(err?.response?.data?.message[0]){
            setError(err?.response?.data?.message[0]);
		  } else{
			setError((err as Error).message);
		  }
		} finally {
		  setLoading(false);
		}
	}, []);

	const createTask = useCallback(async(taskData:Task)=>{
		setLoading(true);
		setError('');
		try{
		  const getTasks = await axios.post('http://localhost:3000/tasks', taskData);
		  fetchTasks();
		} catch(err){
			if(err?.response?.data?.message[0]){
                setError(err?.response?.data?.message[0]);
			} else{
				setError((err as Error).message);
			}
		} finally {
		  setLoading(false);
		}
	}, [])

	const updateTask = useCallback(async(id:string, taskData:Task)=>{
		setLoading(true);
		setError('');
		try{
		  const getTasks = await axios.put(`http://localhost:3000/tasks/${id}`, taskData);
		  fetchTasks();
		} catch(err){
			if(err?.response?.data?.message[0]){
               setError(err?.response?.data?.message[0]);
			} else{
				setError((err as Error).message);
			}
		  
		} finally {
		  setLoading(false);
		}
	}, [])

	return {
		tasks,
		error,
		setError, 
		loading,
		fetchTasks,
		deleteTask,
		createTask,
		updateTask
	}
}