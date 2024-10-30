import { FloatingDockUI } from '../components/uiFrontend/floating-dock';
import FooterComp from '../components/uiFrontend/footer';
import MobileNavbar from '../components/uiFrontend/mobileNavbar';
import { NavbarComp } from '../components/uiFrontend/navbar';
import '../globals.css';
// import { Header, Footer } from '@/components/Layout'
// import 'react-toastify/dist/ReactToastify.css'

export default function ContentRootLayout({ children }: any) {
  return (
    <>
      {/* <Header /> */}
      {/* <NavbarComp /> */}
      <FloatingDockUI />
      {children }
      <FooterComp />
      {/* <Footer /> */}
    </>
  )
}