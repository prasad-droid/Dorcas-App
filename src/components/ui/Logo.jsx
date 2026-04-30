export function Logo({ className = "" }) {
  return (
    <img 
      src="/assets/dorcas-logo.jpeg" 
      alt="Dorcasaid Logo" 
      className={`object-contain ${className}`}
    />
  );
}

