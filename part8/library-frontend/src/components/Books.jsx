import { useEffect, useState } from "react";

const Books = (props) => {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [books, setBooks] = useState(props.books);

  if (!props.show) {
    return null;
  }

  const genres = [
    ...new Set(props.books.flatMap((b) => b.genres).filter(Boolean)),
  ];

  const filterBooks = (genre) => {
    setSelectedGenre(genre);
  };

  useEffect(() => {
    if (selectedGenre) {
      setBooks(props.books.filter((b) => b.genres.includes(selectedGenre)));
    } else {
      setBooks(props.books);
    }
  }, [selectedGenre, props.books]);

  return (
    <div>
      <h2>books</h2>

      <div>
        {selectedGenre ? (
          <div>
            in genre <strong>{selectedGenre}</strong>
          </div>
        ) : (
          <div>all genres</div>
        )}
        <select
          value={selectedGenre}
          onChange={({ target }) => filterBooks(target.value)}
        >
          <option value="">All</option>
          {genres.map((genre, index) => (
            <option key={index} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;
