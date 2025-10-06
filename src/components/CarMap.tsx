import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Car } from "../types";
import { useMemo } from "react";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

export default function CarMap({ cars }: { cars: Car[] }) {
  const carsWithCoords = useMemo(
    () => cars.filter((c) => isNum(c.latitude) && isNum(c.longitude)),
    [cars]
  );

  const center = useMemo(() => {
    if (!carsWithCoords.length) return { lat: 59.93, lng: 30.31 }; // дефолт СПб
    const lat =
      carsWithCoords.reduce((s, c) => s + (c.latitude as number), 0) / carsWithCoords.length;
    const lng =
      carsWithCoords.reduce((s, c) => s + (c.longitude as number), 0) / carsWithCoords.length;
    return { lat, lng };
  }, [carsWithCoords]);

  return (
    <div style={{ height: 420 }}>
      <MapContainer center={[center.lat, center.lng]} zoom={11} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {carsWithCoords.map((c) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={icon}>
            <Popup>
              <b>{c.name} {c.model}</b><br />
              Year: {isNum(c.year) ? c.year : "—"}<br />
              Price: {isNum(c.price) ? `$${c.price.toLocaleString()}` : "—"}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
