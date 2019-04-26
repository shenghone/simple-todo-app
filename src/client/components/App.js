import React, { useState, useEffect, useRef } from "react";
import "../style/app.css";
import "../style/modal.css";
import Button from "@material-ui/core/Button";

import TextField from "@material-ui/core/TextField";

function App() {
  const [todo, setTodo] = useState([]);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [description, setDescription] = useState("");
  let inputRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch("/todos");
      setTodo(await result.json());
    };
    fetchData();
  }, []);

  const deleteTodo = async t => {
    const options = {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ item: t })
    };
    const res = await fetch("/todos", options);
    setTodo(await res.json());
  };

  return (
    <div className="appWrapper">
      <h1>Todo app</h1>
      <div className="contentWrapper">
        <div className="contentInnerWrapper">
          {todo.map((t, index) => {
            return (
              <p
                className="todoList"
                key={index}
                onClick={() => setCurrentTodo(t)}
              >
                {t}
              </p>
            );
          })}
        </div>
      </div>
      <form
        className="inputForm"
        onSubmit={async event => {
          event.preventDefault();
          const options = {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({ todo: description })
          };
          const res = await fetch("/todos", options);
          setTodo(await res.json());
          setDescription("");
        }}
      >
        <TextField
          value={description}
          type="text"
          name="description"
          onChange={e => {
            setDescription(e.target.value);
          }}
          placeholder="description"
        />

        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </form>
      {currentTodo && (
        <Modal
          deleteTodo={deleteTodo}
          setCurrentTodo={setCurrentTodo}
          currentTodo={currentTodo}
          setTodo={setTodo}
        />
      )}
    </div>
  );
}

function Modal(props) {
  const [editting, setEditting] = useState(false);
  const [tempTodo, setTempTodo] = useState("");
  const handleChange = val => {
    setTempTodo(val);
  };
  const handleSubmit = async () => {
    const options = {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        modifiedTodo: tempTodo,
        originalTodo: props.currentTodo
      })
    };

    const newTodo = await fetch("/todos", options);
    props.setTodo(await newTodo.json());
    props.setCurrentTodo(null);
  };
  return (
    <div className="modalWrapper">
      <span className="closeModal" onClick={() => props.setCurrentTodo(null)}>
        x
      </span>
      {editting ? (
        <TextField
          onChange={e => {
            handleChange(e.target.value);
          }}
          label="editting"
          value={tempTodo}
        />
      ) : (
        <h3 className="modalContent">{props.currentTodo}</h3>
      )}
      <div className="buttonsArea">
        {editting && (
          <Button
            variant="contained"
            onClick={() => {
              handleSubmit();
            }}
          >
            {" "}
            Submit
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          className="buttons"
          onClick={() => {
            setEditting(true);
            setTempTodo(props.currentTodo);
          }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="buttons"
          onClick={() => {
            props.deleteTodo(props.currentTodo);
            props.setCurrentTodo(null);
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

export default App;
