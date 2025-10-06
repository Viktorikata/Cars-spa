// src/App.tsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Car as CarType, CarForm, SortKey } from "./types";
import type { RootState, AppDispatch } from "./store";
import {
  fetchCars,
  createCar,
  deleteCar,
  setSort,
  setEditingId,
  updateCar,
  applyInlineEdit,
} from "./carsSlice";
import CarMap from "./components/CarMap";

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error, sortKey, sortOrder, editingId } = useSelector(
    (s: RootState) => s.cars
  );

  const [form, setForm] = useState<CarForm>({
    name: "",
    model: "",
    color: "",
    year: "",
    price: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    dispatch(fetchCars());
  }, [dispatch]);

  const sorted = useMemo(() => {
    if (!sortKey) return items;
    const copy = [...items];
    copy.sort((a, b) => {
      const vA = a[sortKey] as number;
      const vB = b[sortKey] as number;
      return sortOrder === "asc" ? vA - vB : vB - vA;
    });
    return copy;
  }, [items, sortKey, sortOrder]);

  const onCreate = async () => {
    if (!form.name.trim() || !form.model.trim()) {
      alert("Name и Model обязательны");
      return;
    }

    const year = Number(form.year);
    const price = Number(form.price);
    const latitude = Number(form.latitude);
    const longitude = Number(form.longitude);

    if (
      !Number.isFinite(year) ||
      !Number.isFinite(price) ||
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
      alert("Year, Price, Latitude и Longitude обязательны и должны быть числами");
      return;
    }

    await dispatch(
      createCar({
        name: form.name.trim(),
        model: form.model.trim(),
        color: form.color.trim(),
        year,
        price,
        latitude,
        longitude,
      } as Omit<CarType, "id">)
    );

    // сброс формы
    setForm({
      name: "",
      model: "",
      color: "",
      year: "",
      price: "",
      latitude: "",
      longitude: "",
    });
  };

  const onSort = (key: SortKey) => dispatch(setSort(key));

  const onInlineSave = async (car: CarType) => {
    await dispatch(updateCar(car));
    dispatch(setEditingId(null));
  };

  return (
    <div className="container">
      <h1>Автомобили</h1>

      {/* Широкий блок добавления */}
      <div className="card" style={{ flexBasis: "100%" }}>
        <h2>Добавить машину</h2>
        <div className="row">
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Model"
            value={form.model}
            onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
          />
          <input
            className="input"
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          />
          <input
            className="input"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          />
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />
          <input
            className="input"
            type="number"
            step="0.000001"
            placeholder="Lat"
            value={form.latitude}
            onChange={(e) =>
              setForm((f) => ({ ...f, latitude: e.target.value }))
            }
          />
          <input
            className="input"
            type="number"
            step="0.000001"
            placeholder="Lng"
            value={form.longitude}
            onChange={(e) =>
              setForm((f) => ({ ...f, longitude: e.target.value }))
            }
          />
          <button className="btn primary" onClick={onCreate}>
            Создать
          </button>
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          padding: "0 8px 12px 8px",
          borderBottom: "1px solid #eaeaea",
        }}
      >
        <h2 style={{ margin: 0 }}>Список машин</h2>
        <div className="controls">
          <button className="btn" onClick={() => onSort("year")}>
            Сортировать по году {sortKey === "year" ? `(${sortOrder})` : ""}
          </button>
          <button className="btn" onClick={() => onSort("price")}>
            Сортировать по цене {sortKey === "price" ? `(${sortOrder})` : ""}
          </button>
        </div>
      </div>

      <div className="card" style={{ border: "none", boxShadow: "none", paddingTop: 0 }}>
        {loading && <p>Загрузка…</p>}
        {error && <p style={{ color: "crimson" }}>Ошибка: {error}</p>}
        {!loading && !error && (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Model</th>
                <th>Year</th>
                <th>Price</th>
                <th>Color</th>
                <th>Coords</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>

                  <td>
                    {editingId === c.id ? (
                      <input
                        className="input"
                        value={c.name}
                        onChange={(e) =>
                          dispatch(
                            applyInlineEdit({ id: c.id, name: e.target.value })
                          )
                        }
                      />
                    ) : (
                      c.name
                    )}
                  </td>

                  <td>{c.model}</td>

                  <td>
                    {typeof c.year === "number" && Number.isFinite(c.year) ? (
                      <span className="badge">{c.year}</span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>
                    {editingId === c.id ? (
                      <input
                        className="input"
                        type="number"
                        value={c.price ?? ""}
                        onChange={(e) =>
                          dispatch(
                            applyInlineEdit({
                              id: c.id,
                              price:
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                            })
                          )
                        }
                      />
                    ) : typeof c.price === "number" &&
                      Number.isFinite(c.price) ? (
                      `$${c.price.toLocaleString()}`
                    ) : (
                      "—"
                    )}
                  </td>

                  <td>{c.color}</td>

                  <td>
                    {Number.isFinite(c.latitude) &&
                    Number.isFinite(c.longitude) ? (
                      <span className="hint">
                        {c.latitude.toFixed(3)}, {c.longitude.toFixed(3)}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="controls">
                    {editingId === c.id ? (
                      <>
                        <button
                          className="btn primary"
                          onClick={() => onInlineSave(c)}
                        >
                          Сохранить
                        </button>
                        <button
                          className="btn"
                          onClick={() => dispatch(setEditingId(null))}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn"
                          onClick={() => dispatch(setEditingId(c.id))}
                        >
                          Редакт.
                        </button>
                        <button
                          className="btn danger"
                          onClick={() => dispatch(deleteCar(c.id))}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Карта (Leaflet)</h2>
        <CarMap cars={items} />
      </div>
    </div>
  );
}
