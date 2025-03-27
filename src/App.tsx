
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import PublicRoute from './Routes/PublicRoute';
import PrivateRoute from './Routes/PrivateRoute';
import AuthLayout from './Layouts/AuthLayout';
import DashboardLayout from './Layouts/DashboardLayout';
import { privateRoutes, publicRoutes } from './Routes/Navigation';
import { PageNotFound } from './Pages/PageNotFound/PageNotFound';


function App() {

  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              {publicRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element}></Route>
              ))}
            </Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              {privateRoutes.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} >
                  {route?.childs && route?.childs.map((nest_route1, index)=>(
                      <Route key={index} path={nest_route1.path} element={nest_route1.element} />
                  ))}
                </Route>
              )
              )}
            </Route>
          </Route>
        <Route path='/*' element={<PageNotFound/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
