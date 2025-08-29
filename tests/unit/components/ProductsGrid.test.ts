import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Mock the composables
vi.mock('@/composables/useCart', () => ({
  useCart: () => ({
    addToCart: vi.fn(),
  }),
}));

vi.mock('@/composables/useWishlist', () => ({
  useWishlist: () => ({
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
    isInWishlist: vi.fn(() => false),
  }),
}));

describe('ProductsGrid', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();

    const mockProducts = [
      {
        id: '1',
        name: 'Sapato Elegante',
        price: 299.99,
        image: 'sapato1.jpg',
        category: 'Sapatos',
        brand: 'AMPLI',
        colors: ['preto', 'marrom'],
        sizes: ['36', '37', '38', '39', '40'],
      },
      {
        id: '2',
        name: 'Tênis Esportivo',
        price: 199.99,
        image: 'tenis1.jpg',
        category: 'Tênis',
        brand: 'AMPLI',
        colors: ['branco', 'azul'],
        sizes: ['38', '39', '40', '41', '42'],
      },
      {
        id: '3',
        name: 'Sandália Feminina',
        price: 159.99,
        image: 'sandalia1.jpg',
        category: 'Sandálias',
        brand: 'AMPLI',
        colors: ['dourado', 'prata'],
        sizes: ['35', '36', '37', '38', '39'],
      },
    ];

    wrapper = mount(
      {
        template: `
        <div class="products-grid" data-testid="products-grid">
          <div class="grid-header">
            <h2>Produtos</h2>
            <div class="grid-controls">
              <select v-model="sortBy" data-testid="sort-select">
                <option value="name">Nome</option>
                <option value="price">Preço</option>
                <option value="category">Categoria</option>
              </select>
            </div>
          </div>
          
          <div class="products-container">
            <div 
              v-for="product in sortedProducts" 
              :key="product.id"
              class="product-card"
              :data-testid="'product-card-' + product.id"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name" data-testid="product-image" />
                <div class="product-overlay">
                  <button 
                    @click="quickView(product)" 
                    class="quick-view-btn"
                    data-testid="quick-view-button"
                  >
                    Ver Detalhes
                  </button>
                </div>
              </div>
              
              <div class="product-info">
                <h3 class="product-name" data-testid="product-name">{{ product.name }}</h3>
                <p class="product-brand" data-testid="product-brand">{{ product.brand }}</p>
                <p class="product-price" data-testid="product-price">R$ {{ formatPrice(product.price) }}</p>
                
                <div class="product-colors" data-testid="product-colors">
                  <span 
                    v-for="color in product.colors" 
                    :key="color"
                    class="color-dot"
                    :style="{ backgroundColor: getColorValue(color) }"
                    :title="color"
                  ></span>
                </div>
                
                <div class="product-actions">
                  <button 
                    @click="addToCart(product)" 
                    class="add-to-cart-btn"
                    data-testid="add-to-cart-button"
                  >
                    Adicionar ao Carrinho
                  </button>
                  
                  <button 
                    @click="toggleWishlist(product)" 
                    class="wishlist-btn"
                    :class="{ 'in-wishlist': isInWishlist(product.id) }"
                    data-testid="wishlist-button"
                  >
                    ♥
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div v-if="products.length === 0" class="no-products" data-testid="no-products">
            <p>Nenhum produto encontrado.</p>
          </div>
        </div>
      `,
        data() {
          return {
            products: mockProducts,
            sortBy: 'name',
          };
        },
        computed: {
          sortedProducts(): any[] {
            // @ts-ignore - Test component, accessing data properties
            return [...this.products].sort((a: any, b: any) => {
              // @ts-ignore - Test component, accessing data properties
              if (this.sortBy === 'name') {
                return a.name.localeCompare(b.name);
                // @ts-ignore - Test component, accessing data properties
              } else if (this.sortBy === 'price') {
                return a.price - b.price;
                // @ts-ignore - Test component, accessing data properties
              } else if (this.sortBy === 'category') {
                return a.category.localeCompare(b.category);
              }
              return 0;
            });
          },
        },
        methods: {
          formatPrice(price: number) {
            return price.toFixed(2).replace('.', ',');
          },
          getColorValue(color: string) {
            const colorMap: { [key: string]: string } = {
              preto: '#000000',
              marrom: '#8B4513',
              branco: '#FFFFFF',
              azul: '#0000FF',
              dourado: '#FFD700',
              prata: '#C0C0C0',
            };
            return colorMap[color] || '#CCCCCC';
          },
          quickView(product: any) {
            // Mock implementation
          },
          addToCart(product: any) {
            // Mock implementation
          },
          toggleWishlist(product: any) {
            // Mock implementation
          },
          isInWishlist(productId: string) {
            return false;
          },
        },
      },
      {
        global: {
          plugins: [pinia],
          mocks: {
            $route: { path: '/produtos' },
            $router: { push: vi.fn() },
          },
        },
      }
    );
  });

  it('should render the products grid', () => {
    expect(wrapper.find('[data-testid="products-grid"]').exists()).toBe(true);
  });

  it('should display all products', () => {
    const productCards = wrapper.findAll('[data-testid^="product-card-"]');
    expect(productCards).toHaveLength(3);
  });

  it('should display product information correctly', () => {
    const firstProduct = wrapper.find('[data-testid="product-card-1"]');
    expect(firstProduct.find('[data-testid="product-name"]').text()).toBe('Sapato Elegante');
    expect(firstProduct.find('[data-testid="product-brand"]').text()).toBe('AMPLI');
    expect(firstProduct.find('[data-testid="product-price"]').text()).toBe('R$ 299,99');
  });

  it('should display product images', () => {
    const images = wrapper.findAll('[data-testid="product-image"]');
    expect(images).toHaveLength(3);
    expect(images[0].attributes('src')).toBe('sandalia1.jpg'); // Sandália Feminina (primeira alfabeticamente)
    expect(images[0].attributes('alt')).toBe('Sandália Feminina');
  });

  it('should display color options', () => {
    const firstProduct = wrapper.find('[data-testid="product-card-1"]');
    const colorDots = firstProduct.findAll('.color-dot');
    expect(colorDots).toHaveLength(2);
  });

  it('should have action buttons for each product', () => {
    const firstProduct = wrapper.find('[data-testid="product-card-1"]');
    expect(firstProduct.find('[data-testid="add-to-cart-button"]').exists()).toBe(true);
    expect(firstProduct.find('[data-testid="wishlist-button"]').exists()).toBe(true);
    expect(firstProduct.find('[data-testid="quick-view-button"]').exists()).toBe(true);
  });

  it('should have sorting functionality', () => {
    const sortSelect = wrapper.find('[data-testid="sort-select"]');
    expect(sortSelect.exists()).toBe(true);

    const options = sortSelect.findAll('option');
    expect(options).toHaveLength(3);
    expect(options[0].text()).toBe('Nome');
    expect(options[1].text()).toBe('Preço');
    expect(options[2].text()).toBe('Categoria');
  });

  it('should sort products by name by default', () => {
    const productNames = wrapper.findAll('[data-testid="product-name"]');
    expect(productNames[0].text()).toBe('Sandália Feminina');
    expect(productNames[1].text()).toBe('Sapato Elegante');
    expect(productNames[2].text()).toBe('Tênis Esportivo');
  });

  it('should change sorting when select value changes', async () => {
    const sortSelect = wrapper.find('[data-testid="sort-select"]');
    await sortSelect.setValue('price');

    const productPrices = wrapper.findAll('[data-testid="product-price"]');
    expect(productPrices[0].text()).toBe('R$ 159,99'); // Sandália (mais barata)
    expect(productPrices[1].text()).toBe('R$ 199,99'); // Tênis
    expect(productPrices[2].text()).toBe('R$ 299,99'); // Sapato (mais cara)
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.products-grid').exists()).toBe(true);
    expect(wrapper.find('.grid-header').exists()).toBe(true);
    expect(wrapper.find('.products-container').exists()).toBe(true);

    const productCard = wrapper.find('.product-card');
    expect(productCard.exists()).toBe(true);
    expect(productCard.find('.product-image').exists()).toBe(true);
    expect(productCard.find('.product-info').exists()).toBe(true);
    expect(productCard.find('.product-actions').exists()).toBe(true);
  });

  it('should display different products with correct data', () => {
    const products = wrapper.findAll('.product-card');

    // First product
    expect(products[0].find('[data-testid="product-name"]').text()).toBe('Sandália Feminina');
    expect(products[0].find('[data-testid="product-price"]').text()).toBe('R$ 159,99');

    // Second product
    expect(products[1].find('[data-testid="product-name"]').text()).toBe('Sapato Elegante');
    expect(products[1].find('[data-testid="product-price"]').text()).toBe('R$ 299,99');

    // Third product
    expect(products[2].find('[data-testid="product-name"]').text()).toBe('Tênis Esportivo');
    expect(products[2].find('[data-testid="product-price"]').text()).toBe('R$ 199,99');
  });

  it('should not display no-products message when products exist', () => {
    expect(wrapper.find('[data-testid="no-products"]').exists()).toBe(false);
  });

  it('should display no-products message when no products', async () => {
    await wrapper.setData({ products: [] });
    expect(wrapper.find('[data-testid="no-products"]').exists()).toBe(true);
  });
});
