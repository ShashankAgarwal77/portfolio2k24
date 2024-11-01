import { FloatingDockUI } from '../components/uiFrontend/floating-dock';
import FooterComp from '../components/uiFrontend/footer';
import '../globals.css';

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