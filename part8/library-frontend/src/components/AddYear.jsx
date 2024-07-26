import { useState } from "react";

const AddYear = (props) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    try {
      const data = await props.addBirthYear({
        variables: { name, born: parseInt(born) },
      });
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    // props.addBirthYear({
    //   variables: { name, born: parseInt(born) },
    // });

    setName("");
    setBorn("");
    props.setPage("authors");
  };

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <select value={name} onChange={({ target }) => setName(target.value)}>
            <option value="">Select author</option>
            {props.authors.map((a) => (
              <option key={a.id} value={a.name}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button>update author</button>
      </form>
    </div>
  );
};

export default AddYear;
