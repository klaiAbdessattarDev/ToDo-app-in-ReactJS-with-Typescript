import { Todo } from "./todo";
import TodoItem from "./TodoItem";

export interface TodoListProps {
  todos: Todo[];
  onComplete: (completedTodo: Todo, completed : boolean) => Promise<void>;
  onDelete: (todoToDelete: Todo) => void;
}

function TodoList({ todos, onComplete, onDelete }: TodoListProps) {
  return (
    <>
      <div className="todoList">
        {todos.map((todo) => (
          <div key={todo.id} className={todo.overDue ? 'overDue todoRow' : 'todoRow'}>
            <TodoItem todo={todo} onComplete={onComplete} onDelete={onDelete} />
          </div>
        ))}
      </div>
    </>
  );
}

export default TodoList;
