import TodoList from "./TodoList";
import { Todo } from "./todo";
import { useState, useEffect } from "react";
import { todoAPI } from "./todoAPI";
import TodoAddForm from "./TodoAddForm";


function TodoPage() {
  const [loading, setLoading] = useState<Boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [todos, setTodos] = useState<Todo[]>([]);

  const saveCompletedTodo = async (completedTodo: Todo, completed : boolean) => {
    try {
      await todoAPI.put(completedTodo, completed); 
      let updatedTodos = todos.map((t: Todo) => {
        return t.id === completedTodo.id ? completedTodo : t;
      });
      setTodos(updatedTodos);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const deleteTodo = async (todoToDelete: Todo) => {
    try {
      await todoAPI.delete(todoToDelete);
      let updatedTodos = todos.filter((t: Todo) => t.id !== todoToDelete.id);
      setTodos(updatedTodos);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  const addTodo = async (newTodo: Todo) => {
    try {
      const addedTodo = await todoAPI.post(newTodo);
      let updatedTodos = todos.slice();

      console.log(newTodo);
      setTodos([
        newTodo,
        ...updatedTodos
      ]);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };
  

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoAPI.get();
      setError("");
      setTodos(data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTodos();

    const intervalId = setInterval(fetchTodos, 60000); // Fetch every 60,000 ms (1 minute)
    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  
  // useEffect(() => {
  //   async function loadTodos() {
  //     setLoading(true);
  //     try {
  //       const data = await todoAPI.get();
  //       setError("");
  //       setTodos(data);
  //     } catch (e) {
  //       if (e instanceof Error) {
  //         setError(e.message);
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   loadTodos();
  // }, []);

  return (
    <>
      <h1 className="pageHeader">todos</h1>
      {error && (
        <div className="row">
          <div className="pageError">
            <section>
              <p>
                <span></span>
                {error}
              </p>
            </section>
          </div>
        </div>
      )}

      <div className="todoContainer">
        <TodoAddForm existingTodos={todos} onAdd={addTodo} />
        <TodoList todos={todos} onComplete={saveCompletedTodo} onDelete={deleteTodo} />
      </div>

      {loading && (
        <div className="center-page">
          <span className="spinner primary"></span>
          <p>Loading...</p>
        </div>
      )}
    </>
  );
}

export default TodoPage;
