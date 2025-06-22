export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

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
