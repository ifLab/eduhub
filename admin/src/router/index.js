import AdminPage from "@/pages/AdminPage";
import Login from "@/pages/Login";
import { createBrowserRouter } from "react-router-dom";
import  RequireAuth from "../components/RequireAuth";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login/>,
    },
    {
        path: "/AdminPage",
        element:(
            <RequireAuth>
                <AdminPage/>
            </RequireAuth>
        ),
    },

]);

export default router;