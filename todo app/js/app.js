// selecting all requirements

let createToDo = document.getElementById('EnterTask');

let tasksContainer = document.getElementById('taskdiv');

let singleTask = document.getElementsByClassName('task');

let showAllBtn = document.getElementById('all');

let activeBtn = document.getElementById('active');

let completedBtn = document.getElementById('completed');

let clearBtn = document.getElementById('clear');

let markAsBtn = document.getElementById('mark');

let check = document.getElementById('check');

const filter = document.getElementById('filter');

const mode = document.getElementById('modebtn');

const counter = document.getElementById('counter');

const wrapper = document.getElementById('wrapper');

let taskCompleted = false;

//load all tasks from local storage
loadtasks();

mode.addEventListener('click' , ()=>{
    darkMode();
})

clearBtn.addEventListener('click' , function(){
    clearAllCompleted();
})

activeBtn.addEventListener('click' , function(){
    loadtasks('active');
})

//
completedBtn.addEventListener('click' , function(){
    loadtasks('completed');
})


//
showAllBtn.addEventListener('click' , function(){
    loadtasks('all');
})

markAsBtn.addEventListener('click', function(){
    //
    if(this.classList.contains('checkbox-checked'))
        {
            this.classList.remove('checkbox-checked');
            check.classList.remove(...['fa-solid','fa-check' , 'checked']);
            taskCompleted = false;
        }
        else
        {
            taskCompleted = true;
            this.classList.add('checkbox-checked');
            check.classList.add(...['fa-solid','fa-check' , 'checked']);
            
        }
    
    //
})




createToDo.addEventListener('keyup' , function(event){
    if(event.key == 'Enter')
    {
        if(this.value == '')
        {
            alert(`You can't add an empty to-do task!`)
        }
        else
        {
            if(taskCompleted)
        {
            addTask(this.value , 'completed');
        }
        else
        {
            addTask(this.value);            
        }
        // alert('');
        }
    }
})

////////////// functions ///////////////
count();
function count()
{
    const tasks = getAllTasks();
      const activeTasks = tasks.filter((task)=>{
        return task.tstatus == 'active';
    })

    counter.textContent =`${activeTasks.length} items left`;
}

function darkMode()
{
    const body = document.body;
    if(body.classList.contains('bodydark'))
    {
        mode.classList.remove('mode','fa-regular' ,'fa-sun');
        mode.classList.add("fa-solid", "fa-moon")
        body.classList.replace('bodydark' ,'light');
        tasksContainer.classList.replace('containerDart' , 'light')
        filter.classList.add('footer-light');
        createToDo.classList.add('light');
    }
    else
    {
        mode.classList.add('mode' ,'fa-regular' ,'fa-sun');
        mode.classList.remove("fa-solid", "fa-moon")
        body.classList.replace('light' , 'bodydark');
        tasksContainer.classList.replace( 'light' , 'containerDart')
        filter.classList.remove('footer-light');
        createToDo.classList.remove('light');
    }
}

function clearAllCompleted()
{
    const tasks = getAllTasks();
    const completedtasks = tasks.filter(function(item)
    {
        return item.tstatus != 'completed';
    })
    saveAllTasks(completedtasks);
    const divcompleted = document.querySelectorAll('.checkbox-active');
    divcompleted.forEach(function(item){
        // console.log(item.parentElement);
         tasksContainer.removeChild(item.parentElement);
    })
}

function removetasks()
{
    const taskdiv = document.querySelectorAll('.task');
    taskdiv.forEach((item)=>{
        tasksContainer.removeChild(item);
    });
}

function loadtasks(loadingoption = 'all')
{
     removetasks();
    const tasks = getAllTasks();
    switch(loadingoption)
    {
        case 'active':
            //
            const activeTasks = tasks.filter(function(item){ return item.tstatus=='active'})
            //
            activeTasks.forEach(item =>{
                const element =  createTaskElement(item.id ,item.value , item.tstatus);
                tasksContainer.appendChild(element);
             })

             activeBtn.classList.add('active-btn');
             showAllBtn.classList.remove('active-btn');
             completedBtn.classList.remove('active-btn');



            //
            break;
        case 'completed':
             //
             const completedTasks = tasks.filter(function(item){return item.tstatus=='completed'})
             //
             completedTasks.forEach(item =>{
                 const element =  createTaskElement(item.id ,item.value , item.tstatus);
                 tasksContainer.appendChild(element);
              })

              completedBtn.classList.add('active-btn');
              activeBtn.classList.remove('active-btn');
              showAllBtn.classList.remove('active-btn');
             
 
             //
             break;
             //
             default:
            //
            tasks.forEach(item =>{
               const element =  createTaskElement(item.id ,item.value , item.tstatus);
               tasksContainer.appendChild(element);

            })
            showAllBtn.classList.add('active-btn');
            activeBtn.classList.remove('active-btn');
            completedBtn.classList.remove('active-btn');
            //
            break;

        
    }
}


// get all existing to-do tasks from local storage

function getAllTasks()
{
    return JSON.parse(localStorage.getItem('todo') || '[]');
    //if there is no tasks return an empty array
}

//add to-to-task function
function addTask(todoTask , currentstatus = false)
{
    const tasks = getAllTasks(); // getting all tasks from local storage
    const todoTaskValue = todoTask;  
    let taskInfo ={ // creating task object
        id:Date.now(),
        value:todoTaskValue,
        tstatus:'active',
    }
    if(currentstatus)
    {
        taskInfo.tstatus ='completed';
    }
    tasks.push(taskInfo);
    saveAllTasks(tasks);
    let taskElement = createTaskElement(taskInfo.id , taskInfo.value , taskInfo.tstatus )  ; 
    //
    tasksContainer.appendChild(taskElement);
    createToDo.value = '';
    count();
}

function createTaskElement(id, value , tstatus)
{
    let taskdiv = document.createElement('div') // creating task div
    taskdiv.classList.add('task');
    //
    let taskInput = document.createElement('input') // create task input
    taskInput.type = 'text';
    taskInput.value = value;
    //
    taskInput.classList.add('to-do-task');
    //
    let checkboxdiv = document.createElement('div'); // creating checkbox
    checkboxdiv.classList.add('checkbox');
    let checkmark = document.createElement('span');
    //
    if(tstatus == 'completed')
    {
            checkboxdiv.classList.add('checkbox-active');
            checkmark.classList.add(...['fa-solid','fa-check' , 'checked']);
            taskInput.classList.add('text-completed');
    }
    //
    checkboxdiv.appendChild(checkmark)
    //
    taskdiv.appendChild(taskInput);

    //
    //
     checkboxdiv.addEventListener('click' , function(){
        if(this.classList.contains('checkbox-active'))
        {
            const list = getAllTasks();
            const statustask = list.find((task)=>task.id == id);
            statustask.tstatus = 'active';
            saveAllTasks(list);
            this.classList.remove('checkbox-active');
            checkmark.classList.remove(...['fa-solid','fa-check' , 'checked']);
            taskInput.classList.remove('text-completed');
        }
        else
        {
            const tasks = getAllTasks();
            const statustask = tasks.find((task)=>task.id == id);
            statustask.tstatus = 'completed';
            saveAllTasks(tasks);
            this.classList.add('checkbox-active');
            checkmark.classList.add(...['fa-solid','fa-check' , 'checked']);
            taskInput.classList.add('text-completed');
        }
        
     })
    //
    taskdiv.appendChild(checkboxdiv);
    //

    let operationDiv = document.createElement('div');
    operationDiv.classList.add('operation');
    //
    let editbtn = document.createElement('button');
    editbtn.textContent ='edit';
    editbtn.classList.add('edit');
    

    //
    let deletebtn = document.createElement('button');
    deletebtn.textContent ='delete';
    deletebtn.classList.add('delete');
    
    //
    operationDiv.appendChild(editbtn);
    operationDiv.appendChild(deletebtn);
    taskdiv.appendChild(operationDiv);

    //
    //
    deletebtn.addEventListener('click',()=>{
        const doDelete = confirm('Are You sure you wanna delete this task ?');
        if(doDelete)
        {
            deleteTask(id , taskdiv)
            count();
        }
        
    });
    editbtn.addEventListener('click' , ()=>{
        if(createToDo.value != '')
        {
            updateTask(id,taskInput.value,tstatus);
        }
        else
        {
            taskInput.placeholder='Make sure to describe your task';
        }
    })
    
    return taskdiv;

}



// update task 

function updateTask(id , value , tstatus)
{
    const tasks = getAllTasks();
    let updatedtask = tasks.find((task)=>task.id == id)
    updatedtask.id = id;
    updatedtask.value = value;
    updatedtask.tstatus = tstatus;
    saveAllTasks(tasks);
}

//delete task


function deleteTask(id , element)
{
    const tasks = getAllTasks();
    const target = tasks.filter((taskInfo) => {return taskInfo.id !== id} );
    saveAllTasks(target);
    tasksContainer.removeChild(element);
}



//save tasks
function saveAllTasks(tasks)
{
    localStorage.setItem('todo' , JSON.stringify(tasks) || '[]');
}






