export default function DynamicListInput({
  label,
  items,
  setItems,
  placeholder,
  error,
}) {
  const updateItem = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, ""]);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>

      {items.map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            value={item}
            placeholder={placeholder}
            onChange={(e) => updateItem(index, e.target.value)}
            className={`flex-1 border rounded-lg px-3 py-2 text-sm ${error ? "border-red-400" : "border-gray-200"}`}
          />

          <button
            type="button"
            onClick={addItem}
            className="px-3 rounded bg-green-600 text-white"
          >
            +
          </button>

          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 rounded bg-red-600 text-white"
            >
              -
            </button>
          )}
        </div>
      ))}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
