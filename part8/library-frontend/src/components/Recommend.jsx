import { useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { ME, BOOKS_BY_GENRE } from "../queries";

const Recommend = (props) => {
  if (!props.show) {
    return null;
  }

  const { data: userData, loading: userLoading } = useQuery(ME);

  const [getFavourites, { data: booksData }] = useLazyQuery(BOOKS_BY_GENRE);

  useEffect(() => {
    if (userData?.me && !userLoading) {
      getFavourites({ variables: { genre: userData.me.favouriteGenre } });
    }
  }, [userData, userLoading, getFavourites]);

  const books = booksData?.allBooks || [];

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre{" "}
        <strong>{userData?.me?.favouriteGenre}</strong>
      </p>
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

export default Recommend;
