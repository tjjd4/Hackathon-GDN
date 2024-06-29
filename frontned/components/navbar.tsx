// src/components/NavBar.js
import Link from 'next/link';
// import styles from './NavBar.module.css'; // Assuming you have some styles

const NavBar = () => {
  return (
    <nav >
      <Link href="/">
        <a >Home</a>
      </Link>
      <Link href="/market">
        <a >Market</a>
      </Link>
    </nav>
  );
};

export default NavBar;
