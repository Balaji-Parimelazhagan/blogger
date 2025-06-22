# Gilded Rose: "Extract Method" Refactoring Report

This report provides a step-by-step guide to refactoring the complex `updateQuality` function into smaller, more manageable pieces using the "Extract Method" pattern.

---

### **🎯 BEFORE: The Complex Function**

The current `updateQuality` function is a single, monolithic block of code with deeply nested conditionals. The logic for any single item is scattered across different parts of the function, making it extremely difficult to understand and maintain.

```typescript
// In app/gilded-rose.ts

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name != 'Aged Brie' && this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
            this.items[i].quality = this.items[i].quality - 1
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1
          if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
          }
        }
      }
      if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != 'Aged Brie') {
          if (this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                this.items[i].quality = this.items[i].quality - 1
              }
            }
          } else {
            this.items[i].quality = this.items[i].quality - this.items[i].quality
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1
          }
        }
      }
    }

    return this.items;
  }
}
```

---

### **ANALYSIS NEEDED**

*   **Distinct Responsibilities**:
    1.  Updating logic for **"Normal" items**.
    2.  Updating logic for **"Aged Brie"** (quality increases).
    3.  Updating logic for **"Backstage passes"** (quality increases based on `sellIn`).
    4.  Updating logic for **"Sulfuras"** (which never changes).
    5.  Iterating over the list of items and dispatching to the correct logic.
*   **Natural Break Points**: The most natural way to break down this function is to group all logic related to a single item type into its own dedicated function.
*   **Suggested Function Names**:
    *   `updateNormalItem`
    *   `updateAgedBrie`
    *   `updateBackstagePass`
*   **Maintain Existing Functionality**: The goal is to move code, not change its behavior. By extracting the logic verbatim for each item type, we ensure the functionality remains identical.

---

### **REFACTORING STEPS**

#### **Step 1: Extract Logic for "Normal" Items**

*   **Code Block to Extract**: The logic for a normal item is spread out. We need to collect it.
*   **New Function Name**: `updateNormalItem`
*   **Parameters**: `item: Item`
*   **Return Value**: `void` (mutates the item directly)

```typescript
// This logic combines lines 21-25 and 50-54
private updateNormalItem(item: Item) {
    if (item.quality > 0) {
        item.quality = item.quality - 1;
    }
    
    item.sellIn = item.sellIn - 1;

    if (item.sellIn < 0) {
        if (item.quality > 0) {
            item.quality = item.quality - 1;
        }
    }
}
```

#### **Step 2: Extract Logic for "Aged Brie"**

*   **Code Block to Extract**: The logic for Aged Brie is in the `else` blocks.
*   **New Function Name**: `updateAgedBrie`
*   **Parameters**: `item: Item`
*   **Return Value**: `void`

```typescript
// This logic combines lines 30-32 and 66-68
private updateAgedBrie(item: Item) {
    if (item.quality < 50) {
        item.quality = item.quality + 1;
    }

    item.sellIn = item.sellIn - 1;

    if (item.sellIn < 0) {
        if (item.quality < 50) {
            item.quality = item.quality + 1;
        }
    }
}
```

#### **Step 3: Extract Logic for "Backstage Passes"**

*   **Code Block to Extract**: The most complex logic, also in `else` blocks.
*   **New Function Name**: `updateBackstagePass`
*   **Parameters**: `item: Item`
*   **Return Value**: `void`

```typescript
// This logic combines lines 30-41 and 62-64
private updateBackstagePass(item: Item) {
    if (item.quality < 50) {
        item.quality = item.quality + 1;
        if (item.sellIn < 11) {
            if (item.quality < 50) {
                item.quality = item.quality + 1;
            }
        }
        if (item.sellIn < 6) {
            if (item.quality < 50) {
                item.quality = item.quality + 1;
            }
        }
    }

    item.sellIn = item.sellIn - 1;

    if (item.sellIn < 0) {
        item.quality = 0; // Set quality to 0 after the concert
    }
}
```

---

### **✅ AFTER: The Refactored Code**

After applying the "Extract Method" pattern, the main `updateQuality` function becomes a clean, readable dispatcher. The complex logic is now isolated in small, well-named private methods, each with a single responsibility.

```typescript
// In app/gilded-rose.ts

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  // 1. The main function is now a simple, clean dispatcher.
  updateQuality() {
    for (const item of this.items) {
      if (item.name === 'Aged Brie') {
        this.updateAgedBrie(item);
        continue;
      }
      if (item.name === 'Backstage passes to a TAFKAL80ETC concert') {
        this.updateBackstagePass(item);
        continue;
      }
      if (item.name === 'Sulfuras, Hand of Ragnaros') {
        // Sulfuras items do not change, so we do nothing.
        continue;
      }
      
      // Default case for all other items
      this.updateNormalItem(item);
    }
    return this.items;
  }

  // 2. All complex logic is moved into small, focused private methods.
  private updateNormalItem(item: Item): void {
    if (item.quality > 0) {
      item.quality = item.quality - 1;
    }
    item.sellIn = item.sellIn - 1;
    if (item.sellIn < 0) {
      if (item.quality > 0) {
        item.quality = item.quality - 1;
      }
    }
  }

  private updateAgedBrie(item: Item): void {
    if (item.quality < 50) {
      item.quality = item.quality + 1;
    }
    item.sellIn = item.sellIn - 1;
    if (item.sellIn < 0) {
      if (item.quality < 50) {
        item.quality = item.quality + 1;
      }
    }
  }

  private updateBackstagePass(item: Item): void {
    if (item.quality < 50) {
      item.quality = item.quality + 1;
      if (item.sellIn < 11) {
        if (item.quality < 50) {
          item.quality = item.quality + 1;
        }
      }
      if (item.sellIn < 6) {
        if (item.quality < 50) {
          item.quality = item.quality + 1;
        }
      }
    }
    item.sellIn = item.sellIn - 1;
    if (item.sellIn < 0) {
      item.quality = 0;
    }
  }
}
```

### **IMPROVEMENTS EXPECTED & ACHIEVED**

*   **Reduced Complexity**: The `updateQuality` function's cyclomatic complexity is reduced from **19** to **5**. Each new function has a very low complexity (2-4).
*   **Better Testability**: Each private method can now be tested independently (with a testing library that allows testing private methods, or by making them internal/public for testing).
*   **Improved Readability**: The code now clearly expresses its intent. The `updateQuality` loop shows *what* it's doing (dispatching based on name), and the helper methods show *how* it's done for each specific case.
*   **Single Responsibility Principle**: The `updateQuality` function is now only responsible for iteration and dispatch. Each helper function is responsible for the update logic of exactly one item type. 