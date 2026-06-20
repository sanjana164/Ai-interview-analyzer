import { useContext, useEffect } from "react";
import { AuthContext } from "../services/auth.context.jsx";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
    const {user,setUser,loading,setLoading} = useContext(AuthContext) 
    
    const handlelogin = async ({email,password}) => {
        setLoading(true)
        try{
            const normalizedEmail = email && email.trim().toLowerCase()
            const data = await login({email: normalizedEmail,password})
            setUser(data.user)
            return data
        }catch(err){
            console.log(err)
            throw err
        }finally{
            setLoading(false)
        }
    }

    const handleRegister = async ({username,email,password}) => {
        setLoading(true)
        try{
            const normalizedEmail = email && email.trim().toLowerCase()
            const data = await register({username,email: normalizedEmail,password})
            setUser(data.user)
        }catch(err){
            console.log(err)
        }
        finally{
            setLoading(false)
        }
    }
    
    const handleLogout = async () => {
        setLoading(true)
        try{
        await logout()
        setUser(null)
        }
        catch(err){
            console.log(err)
        }       
        finally{  
            setLoading(false)
          }

     
    }

     useEffect(() => {
        
              const getAndSetUser = async () => {
                try {
                const data = await getMe()
                setUser(data.user)
            }catch(err){} finally{
                setLoading(false)
            }
            
                
            }

            getAndSetUser()
        },[])
    return{user,loading,login:handlelogin,register:handleRegister,logout:handleLogout}

}