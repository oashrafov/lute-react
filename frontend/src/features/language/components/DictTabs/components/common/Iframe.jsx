export function IFrame(props) {
  return (
    <iframe
      style={{ border: "none" }}
      width="100%"
      height="100%"
      loading="lazy"
      {...props}
    />
  );
}
