import { FloatingDockUI } from '../components/uiFrontend/floating-dock';
import FooterComp from '../components/uiFrontend/footer';
import { CaseStudyTransitionProvider } from '../components/PageTransition';
import '../globals.css';

export default function ContentRootLayout({ children }: any) {
  return (
    <>
      {/* <Header /> */}
      {/* <NavbarComp /> */}
      <FloatingDockUI />
      {/* The transition provider lives in the layout, not the page: its
          card-expand overlay must survive the navigation it covers. */}
      <CaseStudyTransitionProvider>
        {children}
      </CaseStudyTransitionProvider>
      <FooterComp />
      {/* <Footer /> */}
    </>
  )
}