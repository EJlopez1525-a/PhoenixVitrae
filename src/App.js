import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";

function WindowModel({
  width,
  height,
  materialColor,
  windowType,
  glassType,
  thicknessMm,
  hasGrid,
}) {
  const w = width / 100;
  const h = height / 100;
  const profileThick = 0.05;
  const depth = 0.08;

  let glassColor = "#aaddff";
  let glassOpacity = 0.4;
  let glassRoughness = 0.1;
  if (glassType === "polarizado") {
    glassColor = "#112233";
    glassOpacity = 0.7;
  } else if (glassType === "esmerilado") {
    glassColor = "#ffffff";
    glassOpacity = 0.85;
    glassRoughness = 0.6;
  }

  return (
    <group>
      <mesh position={[-w / 2 + profileThick / 2, 0, 0]}>
        <boxGeometry args={[profileThick, h, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[w / 2 - profileThick / 2, 0, 0]}>
        <boxGeometry args={[profileThick, h, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0, h / 2 - profileThick / 2, 0]}>
        <boxGeometry args={[w - profileThick * 2, profileThick, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0, -h / 2 + profileThick / 2, 0]}>
        <boxGeometry args={[w - profileThick * 2, profileThick, depth]} />
        <meshStandardMaterial
          color={materialColor}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {windowType === "fija" && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry
            args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
          />
          <meshPhysicalMaterial
            color={glassColor}
            transparent
            opacity={glassOpacity}
            roughness={glassRoughness}
            transmission={0.9}
          />
        </mesh>
      )}

      {windowType === "corrediza" && (
        <group>
          <mesh position={[-w / 4, 0, -0.02]}>
            <boxGeometry
              args={[w / 2 - profileThick, h - profileThick * 2, 0.012]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
          <mesh position={[w / 4, 0, 0.02]}>
            <boxGeometry
              args={[w / 2 - profileThick, h - profileThick * 2, 0.012]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {windowType === "abatible" && (
        <group position={[-w / 2 + profileThick, 0, 0]} rotation={[0, 0.4, 0]}>
          <mesh position={[w / 2, 0, 0]}>
            <boxGeometry
              args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {windowType === "proyectable" && (
        <group position={[0, h / 2 - profileThick, 0]} rotation={[-0.3, 0, 0]}>
          <mesh position={[0, -h / 2, 0]}>
            <boxGeometry
              args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
            />
            <meshPhysicalMaterial
              color={glassColor}
              transparent
              opacity={glassOpacity}
              roughness={glassRoughness}
              transmission={0.9}
            />
          </mesh>
        </group>
      )}

      {windowType === "celosia" && (
        <mesh position={[0, 0, 0]}>
          <boxGeometry
            args={[w - profileThick * 2, h - profileThick * 2, 0.01]}
          />
          <meshPhysicalMaterial
            color={glassColor}
            transparent
            opacity={glassOpacity}
            roughness={glassRoughness}
          />
        </mesh>
      )}

      {hasGrid && windowType === "fija" && (
        <group position={[0, 0, 0.01]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[w - profileThick * 2, 0.015, 0.01]} />
            <meshStandardMaterial color={materialColor} />
          </mesh>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.015, h - profileThick * 2, 0.01]} />
            <meshStandardMaterial color={materialColor} />
          </mesh>
        </group>
      )}
    </group>
  );
}

export default function App() {
  const [width, setWidth] = useState(120);
  const [height, setHeight] = useState(100);
  const [material, setMaterial] = useState(
    JSON.stringify({ name: "S60 - Blanco", price: 680, color: "#FFFFFF" })
  );
  const [windowType, setWindowType] = useState("fija");
  const [glassType, setGlassType] = useState("claro");
  const [thicknessMm, setThicknessMm] = useState("5");
  const [hasGrid, setHasGrid] = useState(false);

  // Lista de ventanas cotizadas (El Carrito)
  const [cart, setCart] = useState([]);

  const parsedMaterial = JSON.parse(material);
  const area = (width / 100) * (height / 100);

  let extraVidrio = 0;
  if (glassType === "polarizado") extraVidrio += 50;
  if (glassType === "esmerilado") extraVidrio += 80;
  if (thicknessMm === "6") extraVidrio += 40;
  if (thicknessMm === "8") extraVidrio += 90;

  let extraTipo = 0;
  if (windowType === "corrediza") extraTipo = 180;
  if (windowType === "abatible") extraTipo = 300;
  if (windowType === "proyectable") extraTipo = 250;
  if (windowType === "celosia") extraTipo = 350;
  if (hasGrid && windowType === "fija") extraTipo += 100;

  const costoActual = area * parsedMaterial.price + extraVidrio + extraTipo;

  // Función para agregar a la lista
  const agregarVentana = () => {
    const nuevaVentana = {
      id: Date.now(),
      descripcion: `${windowType.toUpperCase()} - ${parsedMaterial.name}`,
      medidas: `${width}x{height} cm`,
      w,
      h: height,
      precio: costoActual,
    };
    setCart([...cart, nuevaVentana]);
  };

  const eliminarDeLista = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const totalGeneral = cart.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        margin: 0,
      }}
    >
      {/* PANEL DE CONTROL */}
      <div
        style={{
          width: "380px",
          padding: "20px",
          background: "#f8f9fa",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h2>📐 Cotizador Phoenix Vitrae</h2>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Línea / Material:</b>
          </label>
          <br />
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <optgroup label="uPVC Blanco">
              <option
                value={JSON.stringify({
                  name: "S60 - Blanco",
                  price: 680,
                  color: "#FFFFFF",
                })}
              >
                S60 - Blanco (Q680 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "S80 - Blanco",
                  price: 750,
                  color: "#FFFFFF",
                })}
              >
                S80 - Blanco (Q750 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "Estructuras - Blanco",
                  price: 800,
                  color: "#FFFFFF",
                })}
              >
                Estructuras - Blanco (Q800 / m²)
              </option>
            </optgroup>
            <optgroup label="uPVC Imitación Madera">
              <option
                value={JSON.stringify({
                  name: "S60 - Madera",
                  price: 980,
                  color: "#8B5A2B",
                })}
              >
                S60 - Madera (Q980 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "S80 - Madera",
                  price: 1060,
                  color: "#8B5A2B",
                })}
              >
                S80 - Madera (Q1060 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "Estructuras - Madera",
                  price: 1100,
                  color: "#8B5A2B",
                })}
              >
                Estructuras - Madera (Q1100 / m²)
              </option>
            </optgroup>
            <optgroup label="uPVC Negro">
              <option
                value={JSON.stringify({
                  name: "S60 - Negro",
                  price: 980,
                  color: "#1E1E1E",
                })}
              >
                S60 - Negro (Q980 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "S80 - Negro",
                  price: 1060,
                  color: "#1E1E1E",
                })}
              >
                S80 - Negro (Q1060 / m²)
              </option>
              <option
                value={JSON.stringify({
                  name: "Estructuras - Negro",
                  price: 1100,
                  color: "#1E1E1E",
                })}
              >
                Estructuras - Negro (Q1100 / m²)
              </option>
            </optgroup>
            <optgroup label="Aluminio">
              <option
                value={JSON.stringify({
                  name: "Aluminio Euro",
                  price: 2400,
                  color: "#C0C0C0",
                })}
              >
                Aluminio Euro (Q2400 / m²)
              </option>
            </optgroup>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Tipo de Ventana:</b>
          </label>
          <br />
          <select
            value={windowType}
            onChange={(e) => setWindowType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="fija">Ventana Fija</option>
            <option value="corrediza">Corrediza (2 Hojas)</option>
            <option value="abatible">Abatible</option>
            <option value="proyectable">Proyectable</option>
            <option value="celosia">Celosía</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Ancho: {width} cm</label>
          <input
            type="range"
            min="50"
            max="300"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>Alto: {height} cm</label>
          <input
            type="range"
            min="50"
            max="300"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <b>Tipo y Grosor de Vidrio:</b>
          </label>
          <br />
          <select
            value={glassType}
            onChange={(e) => setGlassType(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="claro">Claro / Transparente</option>
            <option value="polarizado">Polarizado (+Q50)</option>
            <option value="esmerilado">Esmerilado (+Q80)</option>
          </select>
          <select
            value={thicknessMm}
            onChange={(e) => setThicknessMm(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "6px" }}
          >
            <option value="5">Vidrio de 5 mm</option>
            <option value="6">Vidrio de 6 mm</option>
            <option value="8">Vidrio de 8 mm</option>
          </select>
        </div>

        {windowType === "fija" && (
          <div style={{ marginBottom: "12px" }}>
            <label>
              <input
                type="checkbox"
                checked={hasGrid}
                onChange={(e) => setHasGrid(e.target.checked)}
                style={{ marginRight: "8px" }}
              />
              <b>Cuadrículas Decorativas (+Q100)</b>
            </label>
          </div>
        )}

        {/* PRECIO ACTUAL Y BOTÓN DE AGREGAR */}
        <div
          style={{
            padding: "12px",
            background: "#e3f2fd",
            borderRadius: "8px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#1565c0" }}>
            Precio de esta ventana:
          </span>
          <br />
          <strong style={{ fontSize: "20px", color: "#0d47a1" }}>
            Q {costoActual.toFixed(2)}
          </strong>
          <br />
          <button
            onClick={agregarVentana}
            style={{
              marginTop: "8px",
              width: "100%",
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ➕ Agregar a la Cotización
          </button>
        </div>

        {/* LISTA DE VENTANAS AGREGADAS (CARRITO) */}
        <div
          style={{
            background: "#fff",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        >
          <h4 style={{ margin: "0 0 8px 0" }}>
            📋 Ventanas en la Obra ({cart.length})
          </h4>
          {cart.length === 0 ? (
            <p style={{ fontSize: "12px", color: "#777", margin: 0 }}>
              Aún no hay ventanas agregadas.
            </p>
          ) : (
            <ul
              style={{
                paddingLeft: "15px",
                margin: "0 0 10px 0",
                fontSize: "12px",
              }}
            >
              {cart.map((item, index) => (
                <li key={item.id} style={{ marginBottom: "5px" }}>
                  <b>
                    #{index + 1} {item.descripcion}
                  </b>{" "}
                  ({item.w}x{item.h}cm) - <b>Q {item.precio.toFixed(2)}</b>{" "}
                  <button
                    onClick={() => eliminarDeLista(item.id)}
                    style={{
                      background: "#d32f2f",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                      fontSize: "10px",
                      padding: "2px 5px",
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div
            style={{
              borderTop: "1px solid #ddd",
              paddingTop: "8px",
              textAlign: "right",
            }}
          >
            <span style={{ fontSize: "13px" }}>
              <b>Total General: </b>
            </span>
            <span
              style={{ fontSize: "18px", color: "#2e7d32", fontWeight: "bold" }}
            >
              Q {totalGeneral.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* VISOR 3D */}
      <div style={{ flex: 1, background: "#cfd8dc" }}>
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} />
          <WindowModel
            width={width}
            height={height}
            materialColor={parsedMaterial.color}
            windowType={windowType}
            glassType={glassType}
            thicknessMm={thicknessMm}
            hasGrid={hasGrid}
          />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
          />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
}
