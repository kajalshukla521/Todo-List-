import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Form,
  Button,
  Table,
  Pagination,
  Row,
  Col,
  Alert,
  InputGroup
} from "react-bootstrap";
import "./Todoapp.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const TodoApp = () => {
  // Load initial data from localStorage if available
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  // State for new todo input
  const [newTodo, setNewTodo] = useState("");
  // State for new name input
  const [newName, setNewName] = useState("");
  // State for the todo being edited
  const [editTodoId, setEditTodoId] = useState(null);
  // State for the text being edited
  const [editTodoText, setEditTodoText] = useState("");
  // State for the name being edited
  const [editTodoName, setEditTodoName] = useState("");
  // State for search filter
  const [searchTerm, setSearchTerm] = useState("");
  // State for current page
  const [currentPage, setCurrentPage] = useState(1);
  // State for error message
  const [errorMessage, setErrorMessage] = useState("");
  // Number of todos per page
  const todosPerPage = 10;



  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);



  // Add a new todo
  const handleAddTodo = () => {
    if (newTodo.trim() === "" || newName.trim() === "") {
      setErrorMessage("Please enter both a name and a task.");
      return;
    }
    if (!isNaN(newName)) {
      setErrorMessage("Please enter a valid name.");
      return;
    }
    // Clear error message if validation passes
    setErrorMessage(""); 



    const maxId =
      todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) : 0;
    setTodos([
      ...todos,
      { id: maxId + 1, text: newTodo, name: newName, completed: false },
    ]);
    // Reset the task input after adding
    setNewTodo("");
    // Reset the name input after adding
    setNewName("");
  };



  // Mark a todo as completed
  const handleCompleteTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };



  // Delete a todo
  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };



  // Edit a todo
  const handleEditTodo = (id, text, name) => {
    setEditTodoId(id);
    setEditTodoText(text);
    setEditTodoName(name);
  };


  // Update the todo after editing
  const handleUpdateTodo = () => {
    setTodos(
      todos.map((todo) =>
        todo.id === editTodoId
          ? { ...todo, text: editTodoText, name: editTodoName }
          : todo
      )
    );
    
    // Reset edit state
    setEditTodoId(null); 
    setEditTodoText("");
    setEditTodoName("");
  };

  // Handle pagination change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter and paginate todos
  const filteredTodos = todos.filter(
    (todo) =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      todo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastTodo = currentPage * todosPerPage;
  const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
  const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo);

  return (
    <Container className="mt-5">
      <h1>Todo-List</h1>

      {/* Error message */}
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      {/* Filter/Search Input and Add Task in one row */}
      <Row className="mb-3">
        <Col md={3}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline-secondary">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Control style={{outline:"none"}}
            type="text"
            placeholder="Enter name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            type="text"
            placeholder="Enter new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
        </Col>
        <Col md={2}>
          <Button className="ms-2" onClick={handleAddTodo}>
            Add Todo
          </Button>
        </Col>
      </Row>

      <Table className="table3">
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Task</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTodos.map((todo, index) => (
            <tr key={todo.id}>
              {/* Sequential number based on index */}
              <td>{index + 1}</td>
              <td>
                {editTodoId === todo.id ? (
                  <Form.Control
                    type="text"
                    value={editTodoName}
                    onChange={(e) => setEditTodoName(e.target.value)}
                  />
                ) : (
                  todo.name
                )}
              </td>
              <td
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {editTodoId === todo.id ? (
                  <Form.Control
                    type="text"
                    value={editTodoText}
                    onChange={(e) => setEditTodoText(e.target.value)}
                  />
                ) : (
                  todo.text
                )}
              </td>
              <td>{todo.completed ? "Completed" : "Pending"}</td>
              <td>
                {editTodoId === todo.id ? (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={handleUpdateTodo}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => setEditTodoId(null)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="primary"
                      className="me-2"
                      onClick={() => handleCompleteTodo(todo.id)}
                      style={{ margin: 0, padding: "6px 12px" }}
                    >
                      {todo.completed ? "Undo" : "Complete"}
                    </Button>

                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() =>
                        handleEditTodo(todo.id, todo.text, todo.name)
                      }
                      style={{ margin: 0, padding: "6px 12px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      className="me-2"
                      onClick={() => handleDeleteTodo(todo.id)}
                      style={{ margin: 0, padding: "6px 12px" }}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-center">
          <Pagination>
            {Array.from({
              length: Math.ceil(filteredTodos.length / todosPerPage),
            }).map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoApp;
