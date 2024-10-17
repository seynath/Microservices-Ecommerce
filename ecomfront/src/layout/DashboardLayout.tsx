
import Sidebar from "@/components/custom/SideBar"
import { Outlet } from "react-router-dom"

const DashboardLayout = () => {
  return (
    
    <div>
      <div 
    style={{minHeight: "100vh",display:"flex", }}
    // style={{maxHeight: `calc(100vh - 36px)`, overflow:"auto"}}
    //  className='h-'
    >
       {/* <Sidebar/> */}

<div style={{display:"flex",width: "100vw", justifyContent:"center"}}>

    <Outlet />
</div>
    </div>


    </div>
  )
}

export default DashboardLayout
