import React, { useEffect, useState } from 'react';
import '../assets/styles/Todo.css';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SORTING_OPTIONS } from '../utils/constants';

function Todo() {
  const [tasks, setTasks] = useLocalStorage('tasks', []); 
  const [task, setTask] = useState(''); 
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const currentDate = new Date().toISOString().substring(0, 16);
  const [isEdit, setIsEdit] = useState(null);
  const [toggleSubmit, setToggleSubmit] = useState(true);
  const [dropdown, setDropdown] = useState(0);
  const [open, setOpen] = useState(false);
  const [chooseCreate, setChooseCreate] = useLocalStorage('created', false);
  const [chooseClosingDate, setChooseClosingDate] = useLocalStorage('closed', false);
  const [dateCreate, setDateCreate] = useState([]);
  const [dateClose, setDateClose] = useState([]);

  useEffect(() => {
    if (chooseCreate) {
      const filteredTasks =  tasks.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
      });
      setDateCreate(filteredTasks);
    }
  }, [tasks, chooseCreate]);

  useEffect(() => {
    if (chooseClosingDate) {
      const filteredTasks =  tasks.sort((a,b) => {
        return new Date(a.deadline) - new Date(b.deadline);
      });
      setDateClose(filteredTasks);
    }
  }, [tasks, chooseClosingDate]);

  useEffect(() => {
    tasks.filter((item) => {
      const timer = setTimeout(() => {
        alert(`Не забудьте выполнить задачу ${item.description}`);
      }, 3000);
      return () => clearTimeout(timer);
    });
  }, []);
  
  const handleTaskChange = (e) => { 
    setTask(e.target.value); 
  };

  const handleDescriptionChange = (e) => { 
    setDescription(e.target.value); 
  }; 

  const handleDeadlineChange = (e) => { 
    setDeadline(e.target.value); 
  };

  const addTask = () => { 
    const newTask = { 
      id: tasks.length + 1, 
      task, 
      description, 
      deadline, 
      done: false,
      date: currentDate,
    }; 
    if (!toggleSubmit) {
      setTasks(
        tasks.map((item) => {
          if (item.id === isEdit) {
            return { ...item, task, description, deadline };
          }
          return item;
        })
      );
      setTask(''); 
      setDescription(''); 
      setDeadline('');
      setToggleSubmit(true);
    } else {
      setTasks([...tasks, newTask]); 
      setTask(''); 
      setDescription(''); 
      setDeadline('');
    } 
  };

  const markDone = (id) => { 
    const updatedTasks = tasks.map((t) => 
        t.id === id ? { ...t, done: true } : t 
    ); 
    setTasks(updatedTasks); 
  };

  const changeTask = (id) => {
    setToggleSubmit(false);
    const newEditTask = tasks.find((c) => c.id === id);
    setTask(newEditTask.task);
    setDescription(newEditTask.description);
    setDeadline(newEditTask.date);
    setIsEdit(id);
  }

  const deleteTask = (id) => {
    const delTask = tasks.filter((c) => c.id !== id);
    setTasks(delTask);
  }

  const handleOpen = () => {
    setOpen(!open);
  };

  const dropdownListClick = (index) => {
    setDropdown(index);
    if (index === 0) {
      setChooseClosingDate(false);
      setChooseCreate(false);
      return;
    }
    if (index === 1) {
      setChooseClosingDate(true);
      setChooseCreate(false);
      return;
    }
    if (index === 2) {
      setChooseCreate(true);
      setChooseClosingDate(false);
      return;
    }
  };

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) {
      handleOpen();
    }
    handleOpen();
  };

  return (
    <main className='task'>
      <form className='task__form'>
        <input type='text'
                className='task__task' 
                id='task' 
                name='task'
                placeholder='Введите задачу...' 
                value={task}
                onChange={handleTaskChange} 
        />
        <input type='text'
                className='task__description'
                id='description'
                name='description'
                placeholder='Введите описание...' 
                value={description}
                onChange={handleDescriptionChange} 
        />
        <input type='datetime-local' 
                className='task__date'
                id='date'
                name='date'
                value={deadline}
                onChange={handleDeadlineChange} 
        />
        <button className='task__add-button' 
                type='button'
                onClick={addTask}
        >
          Добавить задачу
        </button>
      </form>
      <h2 className='task__title'>Список задач</h2>
      <div className={`showcase__dropdown dropdown `}>
        <button className='dropdown__button'
                type='button'
                id='dropdownButton'
                data-toggle='dropdown'
                aria-haspopup='true'
                aria-expanded='false'
                onClick={() => handleOpen()}
        >
          {SORTING_OPTIONS[dropdown].labelName}
          <span className='dropdown__button-icon'></span>
        </button>
        {open ? (
          <ul className={`dropdown__list ${open && 'dropdown_is-open'}`}
              aria-labelledby='dropdown-list'
              onClick={(e) => { handleOverlay(e) }}
          >
            {SORTING_OPTIONS.map((item, index) => {
              return (
                <li className='dropdown__item'
                    onClick={() => dropdownListClick(index)}
                    key={index}
                    value={item.value}
                >
                  {item.labelName}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
      <ul className='task__list'>
        {tasks.map((item, index) => {
          return(
            <li className='task__item' key={item.id}>
              <p className='task__line task__line_type_task'>{item.task}</p>
              <p className='task__line task__line_type_description'>{item.description}</p>
              <p className='task__line task__line_type_date'>{item.deadline}</p>
              {!item.done ? (
                <button className='task__mark-done task__mark-done_type_not' 
                        onClick={ () => markDone(item.id) }
                >
                  В процессе
                </button>
              ) : (
                <button className='task__mark-done task__mark-done_type_done'>
                    Завершено
                </button>
              )}
              <button className='task__mark-done task__mark-done_type_change' 
                      onClick={ () => changeTask(item.id) }
              >
                Изменить
              </button>
              <button className='task__mark-done task__mark-done_type_not' 
                        onClick={() => deleteTask(item.id)}
              >
                Удалить
              </button>
            </li>
          )
        })}
      </ul>
    </main>
  );
}

export default Todo;