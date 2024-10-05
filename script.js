
const tasks = [] // arreglo para almacenar las tareas
let time = 0  // inicializa en 0 la cuenta regresiva
let timer = null  // va a estar asociado a setInterval
let timerBreak = null // para el descanso
let current = null // tarea actual q se esta ejecutando

const bAdd = document.querySelector("#bAdd") // boton para agregar tarea
const itTask = document.querySelector("#itTask")
const form = document.querySelector("#form")
const taskName = document.querySelector("#time #taskName") // nombre de la tarea

// para mostrar la cuenta regresiva al inicio
renderTime()
renderTasks()

form.addEventListener("submit", (e) => {
  e.preventDefault()   // evita que se recargue la pagina
  if (itTask.value !== "") { // si el input no esta vacio
    createTask(itTask.value) // crea la tarea
    itTask.value = "" // y limpia el input para q se pueda agregar otra tarea
    renderTasks() // mando llamar una funcion que renderiza las tareas
  }
})

function createTask(value) {  // funcion para crear tarea - recibe el valor del input - cada tarea es un objeto: id, titulo y completado
  const newTask = {
    id: (Math.random() * 100).toString(36).slice(3), // genera un id aleatorio/dinamico
    title: value,
    completed: false,
  }
  tasks.unshift(newTask) // agrega la tarea al arreglo
}

function renderTasks() { // funcion para renderizar las tareas
  const html = tasks.map(task => { // recorre el arreglo de tareas y por cada tarea crea un template string
    return `
      <div class="task"> 
        <div class="completed">${task.completed ? `<span class="done">Done</span>` : `<button class="start-button" data-id="${task.id}">Start</button>`}</div>
        <div class="title">${task.title}</div>
      </div>
    `
  })
  const tasksContainer = document.querySelector("#tasks") // selecciona el contenedor de las tareas
  tasksContainer.innerHTML = html.join("") // agrega las tareas al contenedor

  const startButtons = document.querySelectorAll(".task .start-button") // selecciona todos los botones de start

  startButtons.forEach(button => { // por cada boton de start
    button.addEventListener("click", (e) => { // agrega un evento click
      if(!timer){
        const id = button.getAttribute("data-id") // obtiene el id de la tarea
        startButtonHandler(id) // manda llamar la funcion startButtonHandler
        button.textContent = "In Progress..." // cambia el texto del boton a en progreso
      }
    })
  })
}

function startButtonHandler(id) { // funcion para manejar el boton de start
  time = 25 *60 // tiempo de trabajo
  current = id // tarea actual

  const taskIndex = tasks.findIndex((task) => task.id === id) // busca la tarea en el arreglo

  taskName.textContent = tasks [taskIndex].title // cambia el nombre de la tarea en el DOM

  timer = setInterval(() => { // inicia el intervalo
    timerHandler(id) // manda llamar la funcion timerHandler
  }, 1000)
}

function timerHandler(id) { // funcion para manejar el tiempo
  time-- // decrementa el tiempo
  renderTime() // manda llamar la funcion renderTime

  if (time === 0) { // si el tiempo es menor o igual a 0
    clearInterval(timer) // limpia el intervalo
    markCompleted(id) // manda llamar la funcion markCompleted
    timer = null // limpia el tiempo
    renderTasks() // manda llamar la funcion renderTime
    startBreak() // manda llamar la funcion startBreak
  }
}

function renderTime() { // funcion para renderizar el tiempo
  const timeDiv = document.querySelector("#time #value") // selecciona el contenedor del tiempo
  const minutes = parseInt(time / 60) // convierte el tiempo a minutos
  const seconds = parseInt (time % 60) // obtiene los segundos

  timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}` // cambia el texto del contenedor del tiempo
}

function markCompleted(id) { // funcion para marcar la tarea como completada
  const taskIndex = tasks.findIndex((task) => task.id === id) // busca la tarea en el arreglo
  tasks[taskIndex].completed = true // cambia el estado de la tarea a completada
  current = null // limpia la tarea actual
  time = 0 // limpia el tiempo
}

function startBreak() { // funcion para iniciar el descanso
  time = 5 *60 // tiempo de descanso
  taskName.textContent = "Break" // cambia el nombre de la tarea a descanso
  timerBreak = setInterval(() => { // inicia el intervalo
    timerBreakHandler() // manda llamar la funcion timerBreakHandler
  }, 1000)
}

function timerBreakHandler() { // funcion para manejar el tiempo de descanso
  time-- // decrementa el tiempo
  renderTime() // manda llamar la funcion renderTime

  if (time === 0) { // si el tiempo es menor o igual a 0
    clearInterval(timerBreak) // limpia el intervalo
    current = null // limpia la tarea actual
    time = 0 // limpia el tiempo
    taskName.textContent = "" // limpia el nombre de la tarea
    renderTasks() // manda llamar la funcion renderTasks
  }
}

