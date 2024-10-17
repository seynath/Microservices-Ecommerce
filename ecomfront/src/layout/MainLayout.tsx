import {Outlet} from 'react-router-dom'
import Navbar from '../components/custom/Navbar'
import Footer from '../components/custom/Footer'


const MainLayout = () => {

  return (
    <>
    <Navbar />
    <div 
    style={{minHeight: "100vh"}}
    // style={{maxHeight: `calc(100vh - 36px)`, overflow:"auto"}}
    //  className='h-'
    className='px-9'
     >

    <Outlet />
    </div>
    <Footer />
    </>
    
  )
}

export default MainLayout