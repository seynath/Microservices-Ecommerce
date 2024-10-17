import { getUser } from "@/features/userSlice"
import { useEffect } from "react"
import { useDispatch , useSelector} from "react-redux"


const Profile = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.user)
  

  useEffect(() => {
    dispatch(getUser())
  }, [dispatch])
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome, {user?.email}!</p>
      
    </div>
  )
}

export default Profile