import { useLocation } from "react-router-dom";
import { urls } from "../layouts/noNavbarUrls";

function Footer() {
  const location = useLocation();
  if (urls.includes(location.pathname)) return <></>;
  return <footer>&copy; Paweł Pasternak 2023</footer>;
}

export default Footer;
