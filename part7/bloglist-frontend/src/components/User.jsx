import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import userService from "../services/users"
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper
} from "@mui/material"

const User = () => {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getOne(id),
    refetchOnWindowFocus: false,
    retry: 1
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  const user = data

  return (
    <div>
      <h2>{user.name}</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Added Blogs:</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {user.blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default User
