import BannerNotification from '../components/uiFrontend/banner-notification';
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
      <div className="hidden lg:block"> {/* Render NavbarComp for desktop view */}
        <NavbarComp />
      </div>
      <div className="block lg:hidden"> {/* Render MobileNavbar for mobile view */}
        <MobileNavbar />
      </div>
      {children}
      <FooterComp />
      {/* <Footer /> */}
    </>
  )
}