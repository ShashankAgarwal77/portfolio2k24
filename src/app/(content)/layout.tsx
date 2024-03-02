import FooterComp from '../components/uiFrontend/footer'
import { NavbarComp } from '../components/uiFrontend/navbar'
import '../globals.css'
// import { Header, Footer } from '@/components/Layout'
// import 'react-toastify/dist/ReactToastify.css'
export const metadata = {
  description: 'A UX portfolio website of Shashank Agarwal. Designed & Developed by Shashank Agarwal using NextJs, Typescript and Framer Motion',
  title: 'Shashank Agarwal - Product Designer',
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