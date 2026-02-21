const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <p className="text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Candido
        </p>
      </div>
    </footer>
  );
};

export default Footer;
