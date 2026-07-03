export default function Inicio() {
  return (
   <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Bienvenido a Transpol SRL</h1>
        <p className="text-gray-700">
          Este sistema le permite gestionar vehículos, stock, servicios, vencimientos y más.
        </p>
        <p className="m-4 text-sm text-gray-500">
          Usá el menú superior para acceder a los módulos del sistema.
        </p>
      </div>
    </div>
  );
}
