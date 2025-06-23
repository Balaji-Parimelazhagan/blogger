test('optimized filter is faster than old filter', () => {
  // Increase dataset size for a more realistic benchmark
  const products = Array.from({ length: 100000 }, (_, i) => ({
    id: i,
    availableSizes: ['S', 'M', 'L', 'XL', 'XXL', 'XS', 'XXXL', 'XXS', '4XL', '5XL']
  }));
  const filters = ['M', 'XL', 'XXL', 'XS', 'XXXL', 'XXS', '4XL', '5XL'];

  // Old filter
  const oldStart = performance.now();
  products.filter((p) =>
    filters.find((filter) =>
      p.availableSizes.find((size) => size === filter)
    )
  );
  const oldEnd = performance.now();

  // Optimized filter
  const filterSet = new Set(filters);
  const newStart = performance.now();
  products.filter((p) =>
    p.availableSizes.some((size) => filterSet.has(size))
  );
  const newEnd = performance.now();

  const oldTime = oldEnd - oldStart;
  const newTime = newEnd - newStart;

  console.log(`Old: ${oldTime}ms, New: ${newTime}ms`);
  expect(newTime).toBeLessThan(oldTime);
}); 