export default function CategoryTabs({ categories, currentCategory, onChangeCategory }) {
  return (
    <section className="categories">
      <div className="container category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className={currentCategory === category.id ? "category-btn active" : "category-btn"}
            onClick={() => onChangeCategory(category.id)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}
