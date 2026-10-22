export default function CategoryTabs({ categories, currentCategory, onChangeCategory }) {
  const selectCategory = (categoryId) => {
    onChangeCategory(categoryId);
    window.requestAnimationFrame(() => {
      document.getElementById("services-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <section className="categories">
      <div className="container category-list">
        {categories.map((category) => (
          <button
            key={category.id}
            className={currentCategory === category.id ? "category-btn active" : "category-btn"}
            onClick={() => selectCategory(category.id)}
            type="button"
          >
            {category.label}
          </button>
        ))}
      </div>
    </section>
  );
}
