let theme=localStorage.getItem("theme");
let modeEmoji=document.querySelector('#mode-emoji');

console.log(theme)
if(theme){
    document.body.classList.add(theme)
    updateEmoji()
}


let taskList=JSON.parse(localStorage.getItem('tasks'))||[];
let mode=document.querySelector("#theme");
let createBtn=document.querySelector("#create-task")
let close=document.querySelector(".close")
let cancelTask=document.querySelector("#cancel-task")
let overlay= document.querySelector('#overlay')
let todo=document.querySelector('#todo');
let saveTask=document.querySelector('#save-task');
let priority=document.querySelector('#priority');
const taskInp = document.querySelector('#task-inp');
let inProgress=document.querySelector('#progress')
let done=document.querySelector('#done')
let grid=document.querySelector('#grid-it')
let tasks=document.querySelectorAll('.tasks')
let todoSpan=document.getElementById("todo-span");
let progress=document.getElementById("progress-span");
let Done=document.getElementById("done-span");

function updateEmoji(){
    if(document.body.classList.contains('dark')){
        modeEmoji.textContent='🌙';
    }
    else{
        modeEmoji.textContent='☀️'
    }
}
taskList.forEach((item)=>{
    let li=document.createElement('li');
    li.classList.add('tasks');
    li.setAttribute('data-id',item.curr);
    console.log(item.curr)
    li.innerHTML=`<div><h5>${item.task}</h5><span class="date">${item.curr}</span></div><button class="delete">&times;</button>`
    li.style.borderLeftColor=item.color;
    li.setAttribute('draggable',"true");
    li.addEventListener('dragstart',(e)=>{
        e.currentTarget.classList.add('dragging');
    })
    li.addEventListener('dragend',(e)=>{
        e.currentTarget.classList.remove('dragging');
        console.log(e.currentTarget)
        taskList.forEach((item)=>{
            console.log(item.curr,e.currentTarget.dataset.id)
            if(item.curr===e.currentTarget.dataset.id){
                item.status=e.currentTarget.parentNode.id;
            }
        })
        localStorage.setItem('tasks',JSON.stringify(taskList))
        console.log(taskList)
        update()
    })
 
    if(item.status==='todo'){
        todo.append(li);
    }
    else if(item.status==='progress'){
        inProgress.append(li);
    }
    else if(item.status==='done'){
        done.append(li); 
    }  
    update()
}) 
mode.addEventListener('click',()=>{
    document.body.classList.toggle('dark');
    document.body.classList.contains("dark")?localStorage.setItem("theme","dark"):localStorage.setItem("theme","light");
    updateEmoji();
})
createBtn.addEventListener('click',()=>{
   overlay.style.display='flex';
})
cancelTask.addEventListener('click',(e)=>{
    e.preventDefault();
    overlay.style.display='none';
})
saveTask.addEventListener('click',(e)=>{
    e.preventDefault();
    let task=taskInp.value;
    let pri=priority.value;
    let curr=new Date();
    taskInp.value='';
    overlay.style.display='none';
    let li=document.createElement('li');
    li.innerHTML=`<div><h5>${task}</h5><span class="date">${curr.toLocaleString()}</span></div><button class="delete">&times;</button>`
    li.setAttribute('data-id',curr.toLocaleString());
    li.setAttribute('draggable',"true");
    let color;
    if(pri==='low'){
        li.style.borderLeftColor='lightgreen'
        color='lightgreen'
    }
    else if(pri==='medium'){
        li.style.borderLeftColor="#841ee4"
        color="#841ee4" 
    }
    else{
        li.style.borderLeftColor="red"
        color='red'
    }
    li.addEventListener('dragstart',(e)=>{
        e.currentTarget.classList.add('dragging');
    })
    li.addEventListener('dragend',(e)=>{
        e.currentTarget.classList.remove('dragging');
        taskList.forEach((item)=>{
            if(item.curr===e.currentTarget.dataset.id){
                item.status=e.currentTarget.parentNode.id;
            }
        })
        localStorage.setItem('tasks',JSON.stringify(taskList))
        console.log(taskList)
        update()
    })
    taskList.push({task:task,priority:pri,curr:curr.toLocaleString(),status:'todo',color:color})
    li.classList.add('tasks');
    todo.append(li);
    console.log(pri)
    localStorage.setItem("tasks",JSON.stringify(taskList));
    console.log("saved")
    update()
})

grid.addEventListener('click',(e)=>{
    if(e.target.matches('button')){
        let id=e.target.parentNode.dataset.id;
        e.target.parentNode.remove();
        taskList=taskList.filter((item)=> item.curr!==id
        )
        localStorage.setItem('tasks',JSON.stringify(taskList));
        update();
    }
})
function dragOver(e) {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    e.currentTarget.append(dragging);
}

todo.addEventListener('dragover', dragOver);
inProgress.addEventListener('dragover', dragOver);
done.addEventListener('dragover', dragOver);
function update(){
    let todoCount=0;
    let progressCount=0;
    let doneCount=0;
    for(let i of taskList){
        console.log(i)
        if(i.status==='todo'){
            todoCount++;
        }
        else if(i.status==='progress'){
            progressCount++;
        }
        if(i.status==='done'){
            doneCount++;
        }
    }
    todoSpan.textContent=String(todoCount);
    progress.textContent=String(progressCount);
    Done.textContent=String(doneCount);

}