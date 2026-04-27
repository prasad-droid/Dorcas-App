export function Logo({ className = "" }) {
  return (
    <img 
      src="/assets/dorcas-logo.jpeg" 
      alt="Dorcas Logo" 
      className={`object-contain ${className}`}
    />
  );
}

