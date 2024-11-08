import React, { useEffect, useState } from "react";

//include images into your bundle
import rigoImage from "../../img/rigo-baby.jpg";

//create your first component
const Home = () => {
	const [taskList, setTaskList] = useState([]);
	const [task, setTask] = useState("");

	console.log(taskList)


	const listarTareas = async () => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/users/joaquin")
			if(response.status === 404){
				crearUsuario();
				return;
			}
			const data = await response.json();
			console.log(data.todos)
			setTaskList(data.todos);
			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	const agregarTareaAPI = async (task) => {
		try {
			const response = await fetch("https://playground.4geeks.com/todo/todos/joaquin", {
				method: "POST",
				body: JSON.stringify({
					"label": task,
					"is_done": false
				  }),
				headers: {
				  "Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'
				}})

				if (response.ok) {
					const data = await response.json(); // Parseamos el JSON de la respuesta
					return data;
				} else {
					throw new Error("Error al agregar tarea");
				}
		} catch (error) {
			alert("tarea no agregada, verifica tu conexión");
			console.error(error);
			return false;
		}
	}


	const crearUsuario = async ()=>{
		try {
			
			const response = await fetch("https://playground.4geeks.com/todo/users/joaquin",{
				method:"POST",
				headers:{"Content-Type":"application/json"}
			})
			if(response.status === 201) {
				listarTareas();
				return true;
			}
		} catch (error) {
			console.error(error)
			return false;
		}
	}

	const borrarTareaAPI = async (tarea) => {
		try {
			console.log(tarea.id)
			const response = await fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
				method: "DELETE",
				headers: {
				  "Content-Type": "application/json"
				}})
				if(response.status === 201) {
					listarTareas();
					return true;
				}

		} catch (error) {
			console.error(error)
			return false;
		}
	}

	const borrarTarea = (e, index) => {
		e.preventDefault();
		let tareaAborrar;
		let listaFiltro = taskList.filter((task,id)=>{
			if (id === index){
				tareaAborrar = task;
			}
			return (id!=index)
		})

		console.log(tareaAborrar)
		if(tareaAborrar != undefined){
			borrarTareaAPI(tareaAborrar)
		}

		setTaskList(listaFiltro);
	}

	const agregarTarea = async (e) => {
		e.preventDefault();
		try {
			const taskToAdd = await agregarTareaAPI(task);
			if (taskToAdd) {
				setTaskList([...taskList, taskToAdd]); 
				setTask("");
			}
		} catch (error) {
			console.error("Error al agregar la tarea:", error);
		}
	}

	const eventoEnter = (e) => {
		if(e.key === "Enter"){
			agregarTarea(e)
		}
	}

	useEffect(()=>{
		listarTareas()
	},[])

	return (
		<div className="container text-center">
			<h1>Lista de tareas</h1>
			<input onKeyDown={eventoEnter} placeholder="Añade una tarea" className="form-control" type="text" onChange={(e)=>setTask(e.target.value)} value={task} />
			<ul className="list-group">
				{taskList.map((currentTask, index)=>(
					<li key={index} className=" list-group-item">
						{currentTask.label} <i onClick={(e)=>{
							borrarTarea(e,index)
						}} className="text-danger cursor-pointer fa fa-trash float-end"></i>
					</li>
				))}
			</ul>
		</div>
	);
};

export default Home;
