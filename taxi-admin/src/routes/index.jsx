import Login from '~/pages/login'
import AuthLayout from '~/layouts/AuthLayout'
import Dashboard from '~/pages/dashboard'
import AdminLayout from '~/layouts/AdminLayout'

const routes = [
    {
        path: "/login",
        Component: Login,
        Layout: AuthLayout,
    },
    {
        path: "/",
        Component: Dashboard,
        Layout: AdminLayout,
    }
]

export default routes