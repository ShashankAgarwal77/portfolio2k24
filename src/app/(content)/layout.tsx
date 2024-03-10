import FooterComp from '../components/uiFrontend/footer';
import { NavbarComp } from '../components/uiFrontend/navbar';
import '../globals.css';
// import { Header, Footer } from '@/components/Layout'
// import 'react-toastify/dist/ReactToastify.css'

import MetaDataThumbnail from '@/app/Assets/Images/MetaDataThumbnail.png';

import Head from 'next/head';

export const metadata = {
  description: 'A UX portfolio website of Shashank Agarwal',
  title: 'Shashank Agarwal | Product Designer and Developer',
  image: MetaDataThumbnail,

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