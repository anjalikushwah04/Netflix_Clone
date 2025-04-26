import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authUser'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import WatchPages from './pages/home/WatchPages'
import SearchPage from './pages/home/SearchPage'
import SearchHistoryPage from './pages/SearchHistoryPage'
import NotFoundPage from './pages/home/NotFoundPage'
import VerifyOtpPage from './pages/VerifyOtpPage'
import ForgetPasswordPage from './pages/ForgetPasswordPage'
import EmailSentPage from './pages/EmailSentPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
// import ResetPasswordPage from './pages/ResetPasswordPage'

function App() {
  const { user, isCheckingAuth, authCheck } = useAuthStore();


  useEffect(()=>{
    authCheck();
  }, [authCheck] );
  if(isCheckingAuth){
    return(
      <div className='h-screen'>
        <div className='flex justify-center items-center bg-black h-full'>
          <Loader className='animate-spin text-red-600 size-10'/>
        </div>

      </div>
    )
  }
  
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage/>}></Route>
        <Route path='/login' element={!user ? <LoginPage/> :<Navigate to={'/'}/> }/>
        <Route path="/verifyotp" element={ <VerifyOtpPage/> } />
        <Route path="/forgetpassword" element={ <ForgetPasswordPage/> } />
        <Route path='/resetpassword/:token/:email' element={ <ResetPasswordPage/> } />
        <Route path="/emailsent" element={<EmailSentPage />} />
        <Route path='/signup' element={!user ? <SignUpPage/> : <Navigate to={'/'}/>}/>
        <Route path='/watch/:id' element={user ? <WatchPages/> : <Navigate to={'/login'}/>}/>
        <Route path='/search' element={user ? <SearchPage/> : <Navigate to={'/login'}/>}/>
        <Route path='/history' element={user ? <SearchHistoryPage/> : <Navigate to={'/login'}/>}/>
        <Route path='/*' element={<NotFoundPage/>}/>
      </Routes>
      <Footer/>
      <Toaster/>
    </>
  )
}

export default App
