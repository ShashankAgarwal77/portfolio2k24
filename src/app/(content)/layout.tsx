import FooterComp from '../components/uiFrontend/footer';
import { NavbarComp } from '../components/uiFrontend/navbar';
import '../globals.css';
// import { Header, Footer } from '@/components/Layout'
// import 'react-toastify/dist/ReactToastify.css'




export const metadata = {
  description: 'A UX portfolio website of Shashank Agarwal',
  title: 'Shashank Agarwal | Product Designer and Developer',

}

export default function ContentRootLayout({ children } : any) {
  return (
    <>
      {/* <Header /> */}
      <NavbarComp />
      {children}
      <FooterComp />
      {/* <Footer /> */}
    </>
  )
}