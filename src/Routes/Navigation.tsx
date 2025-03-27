// import { Home, Group, Notifications } from "@mui/icons-material"
import Group from "../Pages/Group/Main/Group"
import { Home } from "../Pages/Home/Home"
import { Notifications } from "../Pages/Notifications/Main/Notifications"
import SigninForm from "../Authentication/Signin/SigninForm"
import SignupForm from "../Authentication/Signup/SignupForm"
import { GroupList } from "../Pages/GroupList/GroupList"
import { GroupRequests } from "../Pages/Notifications/GroupRequests/GroupRequests"
import Profile from "../Pages/Profile/Profile"
import { TripRequests } from "../Pages/Notifications/TripRequests/TripRequests"
import { TripList } from "../Pages/Group/TripList/Main/TripList"
import { GroupDetails } from "../Pages/Group/GroupDetails/Main/GroupDetails"
import { PlanTrip } from "../Pages/Group/PlanTrip/Main/PlanTrip"

export const publicRoutes = [
    {
        path: '/signin',
        element: <SigninForm />
    },
    {
        path: '/signup',
        element: <SignupForm />
    }
]
export const privateRoutes = [
    {
        path: '/',
        element: <Home />
    },
    {
        path: 'groups',
        element: <GroupList />
    },
    {
        path: 'profile',
        element: <Profile />
    },
    {
        path: 'group',
        element: <Group />,
        childs:[
            {
                path: 'groupdetails',
                element: <GroupDetails/>
            },
            {
                path: 'trips',
                element: <TripList/>
            },
            {
                path: 'plan-trip',
                element: <PlanTrip/>
            }
        ]
    },
    
    {
        path: 'notifications',
        element: <Notifications />,
        childs: [
            {
                path: 'group_requests',
                element: <GroupRequests />,
            },
            {
                path: 'trip_requests',
                element: <TripRequests/>
            }
        ]
    }
]
