export default function FilterButtons({ categories, filter, setFilter }) {
  return (
    <div className="mb-6 flex gap-2 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setFilter(cat.value)}
          className={`px-4 py-2 rounded font-semibold transition ${
            filter === cat.value
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}