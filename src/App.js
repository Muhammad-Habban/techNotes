import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import NewUserForm from "./features/users/NewUserForm";
import EditUser from "./features/users/EditUser";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}></Route>
      <Route index element={<Public />} />
      <Route path="login" element={<Login />} />

      <Route path="dash" element={<DashLayout />}>
        <Route index element={<Welcome />} />
        <Route path="users">
          <Route index element={<UsersList />} />
          <Route path="new" element={<NewUserForm />} />
          <Route path=":id" element={<EditUser />} />
        </Route>
        <Route path="notes">
          <Route index element={<NotesList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
