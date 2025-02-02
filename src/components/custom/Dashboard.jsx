import Header from "@/components/custom/Header";
import { useContext } from "react";
import { AppContext } from "@/store/AppContext";
import NotePage from "@/components/custom/NotePage";
import TodoPage from "@/components/custom/TodoPage";

const Dashboard = () => {
  const { page } = useContext(AppContext);
  return (
    <Header>
      {page === "notes" ? (
        <NotePage />
      ) : page === "todos" ? (
        <TodoPage />
      ) : null}
    </Header>
  );
};

export default Dashboard;
