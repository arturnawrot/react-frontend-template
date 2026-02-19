import Navbar from './Navbar'
import { getNavbarLinks } from '@/utils/navbar'

interface NavbarWrapperProps {
  darkVariant?: boolean
}

export default async function NavbarWrapper({ darkVariant = false }: NavbarWrapperProps) {
  const { upperLinks, mainLinks, dropdownQuote } = await getNavbarLinks()

  return (
    <Navbar
      darkVariant={darkVariant}
      upperLinks={upperLinks}
      mainLinks={mainLinks}
      dropdownQuote={dropdownQuote}
    />
  )
}







