import Login from '~/pages/login'
import AuthLayout from '~/layouts/AuthLayout'
import Dashboard from '~/pages/dashboard'
import AdminLayout from '~/layouts/AdminLayout'
import Driver from '~/pages/driver'
import Trip from '~/pages/trip'
import Epmloyee from '~/pages/employee'
import Pricing from '~/pages/pricing'

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
    },
    {
        path: "/drivers",
        Component: Driver,
        Layout: AdminLayout,
    },
    {
        path: "/trips",
        Component: Trip,
        Layout: AdminLayout,
    },
    {
        path: "/employees",
        Component: Epmloyee,
        Layout: AdminLayout,
    },
    {
        path: "/pricings",
        Component: Pricing,
        Layout: AdminLayout,
    }
]

export default routes