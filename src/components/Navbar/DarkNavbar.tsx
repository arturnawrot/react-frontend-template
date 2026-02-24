import NavbarWrapper from './NavbarWrapper'

export default async function DarkNavbar() {
  return (
    <div className="bg-transparent md:bg-[var(--strong-green)]">
      <NavbarWrapper darkVariant={true} />
    </div>
  )
}
