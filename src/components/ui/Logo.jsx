import logo from "../../../public/assets/dorcas-logo.jpeg";

export function Logo({ className = "" }) {
  return (
    <img 
      src={logo} 
      alt="Dorcasaid Logo" 
      className={`object-contain ${className}`}
    />
  );
}

