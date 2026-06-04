import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import AddCustomer from './components/AddCustomer'
import ViewCustomer from './components/ViewCustomer'
import UpdateCustomer from './components/UpdateCustomer'
import RenewCustomer from './components/RenewCustomer'
import FavCustomers from './components/FavCustomers'
import EditCustomer from './components/EditCustomer'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup/>}></Route>
        <Route path="/Login" element={<Login/>}></Route>
        <Route path='/Dashboard' element={<Dashboard/>}></Route>
        <Route path='/AddCustomer' element={<AddCustomer/>}></Route>
        <Route path='/Viewcustomer' element={<ViewCustomer/>}></Route>
        <Route path='/Updatecustomer/:id' element={<UpdateCustomer/>}></Route>
        <Route path='/RenewCustomer/:id' element={<RenewCustomer/>}></Route>
        <Route path="/Favorites" element={<FavCustomers />} />
        <Route path="/EditCustomer/:id" element={<EditCustomer />} />
        </Routes>
        
      </BrowserRouter>
    </>
  )
}

export default App
