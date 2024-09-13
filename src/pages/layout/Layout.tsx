
import Footer from './Footer'
import Navbar from './Navbar'
interface LayoutProps {
    children: any;
  }

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Navbar />
      <div className='w-full'>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default Layout