export default function Map() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Google Map</h2>

      <iframe
        title="map"
        width="100%"
        height="400"
        src="https://maps.google.com/maps?q=hyderabad&t=&z=13&output=embed"
      />
    </div>
  );
}