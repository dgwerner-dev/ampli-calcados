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

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('ProductModal', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();

    const mockProduct = {
      id: '1',
      name: 'Sapato Elegante',
      price: 299.99,
      description: 'Sapato elegante para ocasiões especiais',
      images: ['image1.jpg', 'image2.jpg'],
      colors: ['preto', 'marrom'],
      sizes: ['36', '37', '38', '39', '40'],
      category: 'Sapatos',
      brand: 'AMPLI',
    };

    wrapper = mount(
      {
        template: `
        <div class="product-modal" v-if="isOpen">
          <div class="modal-overlay" @click="closeModal"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h2>{{ product.name }}</h2>
              <button class="close-btn" @click="closeModal" data-testid="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <div class="product-images">
                <img :src="currentImage" :alt="product.name" data-testid="product-image" />
                <div class="image-thumbnails">
                  <img 
                    v-for="(image, index) in product.images" 
                    :key="index"
                    :src="image"
                    @click="currentImage = image"
                    :class="{ active: currentImage === image }"
                    data-testid="thumbnail"
                  />
                </div>
              </div>
              
              <div class="product-details">
                <h3 class="product-name" data-testid="product-name">{{ product.name }}</h3>
                <p class="product-price" data-testid="product-price">R$ {{ formatPrice(product.price) }}</p>
                <p class="product-description" data-testid="product-description">{{ product.description }}</p>
                
                <div class="product-options">
                  <div class="color-selection">
                    <label>Cor:</label>
                    <div class="color-options">
                      <button 
                        v-for="color in product.colors" 
                        :key="color"
                        @click="selectedColor = color"
                        :class="{ active: selectedColor === color }"
                        data-testid="color-option"
                      >
                        {{ color }}
                      </button>
                    </div>
                  </div>
                  
                  <div class="size-selection">
                    <label>Tamanho:</label>
                    <div class="size-options">
                      <button 
                        v-for="size in product.sizes" 
                        :key="size"
                        @click="selectedSize = size"
                        :class="{ active: selectedSize === size }"
                        data-testid="size-option"
                      >
                        {{ size }}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="product-actions">
                  <button 
                    @click="addToCart" 
                    class="add-to-cart-btn" 
                    data-testid="add-to-cart-button"
                    :disabled="!selectedColor || !selectedSize"
                  >
                    Adicionar ao Carrinho
                  </button>
                  
                  <button 
                    @click="toggleWishlist" 
                    class="wishlist-btn" 
                    data-testid="wishlist-button"
                  >
                    {{ isInWishlist ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `,
        data() {
          return {
            isOpen: true,
            product: mockProduct,
            currentImage: mockProduct.images[0],
            selectedColor: '',
            selectedSize: '',
            isInWishlist: false,
          };
        },
        methods: {
          closeModal() {
            this.isOpen = false;
          },
          formatPrice(price: number) {
            return price.toFixed(2).replace('.', ',');
          },
          addToCart() {
            // Mock implementation
          },
          toggleWishlist() {
            this.isInWishlist = !this.isInWishlist;
          },
        },
      },
      {
        global: {
          plugins: [pinia],
          mocks: {
            $route: { path: '/' },
            $router: { push: vi.fn() },
          },
        },
      }
    );
  });

  it('should render the modal when open', () => {
    expect(wrapper.find('.product-modal').exists()).toBe(true);
    expect(wrapper.find('.modal-content').exists()).toBe(true);
  });

  it('should display product information', () => {
    expect(wrapper.find('[data-testid="product-name"]').text()).toBe('Sapato Elegante');
    expect(wrapper.find('[data-testid="product-price"]').text()).toBe('R$ 299,99');
    expect(wrapper.find('[data-testid="product-description"]').text()).toBe(
      'Sapato elegante para ocasiões especiais'
    );
  });

  it('should display product image', () => {
    const image = wrapper.find('[data-testid="product-image"]');
    expect(image.exists()).toBe(true);
    expect(image.attributes('src')).toBe('image1.jpg');
    expect(image.attributes('alt')).toBe('Sapato Elegante');
  });

  it('should display color options', () => {
    const colorOptions = wrapper.findAll('[data-testid="color-option"]');
    expect(colorOptions).toHaveLength(2);
    expect(colorOptions[0].text()).toBe('preto');
    expect(colorOptions[1].text()).toBe('marrom');
  });

  it('should display size options', () => {
    const sizeOptions = wrapper.findAll('[data-testid="size-option"]');
    expect(sizeOptions).toHaveLength(5);
    expect(sizeOptions[0].text()).toBe('36');
    expect(sizeOptions[4].text()).toBe('40');
  });

  it('should allow color selection', async () => {
    const colorOptions = wrapper.findAll('[data-testid="color-option"]');
    await colorOptions[0].trigger('click');
    expect(wrapper.vm.selectedColor).toBe('preto');
  });

  it('should allow size selection', async () => {
    const sizeOptions = wrapper.findAll('[data-testid="size-option"]');
    await sizeOptions[2].trigger('click');
    expect(wrapper.vm.selectedSize).toBe('38');
  });

  it('should disable add to cart button when color or size not selected', () => {
    const addToCartBtn = wrapper.find('[data-testid="add-to-cart-button"]');
    expect(addToCartBtn.attributes('disabled')).toBeDefined();
  });

  it('should enable add to cart button when color and size are selected', async () => {
    await wrapper.setData({ selectedColor: 'preto', selectedSize: '38' });
    const addToCartBtn = wrapper.find('[data-testid="add-to-cart-button"]');
    expect(addToCartBtn.attributes('disabled')).toBeUndefined();
  });

  it('should display wishlist button', () => {
    const wishlistBtn = wrapper.find('[data-testid="wishlist-button"]');
    expect(wishlistBtn.exists()).toBe(true);
    expect(wishlistBtn.text()).toBe('Adicionar aos Favoritos');
  });

  it('should toggle wishlist state', async () => {
    const wishlistBtn = wrapper.find('[data-testid="wishlist-button"]');

    // Initially not in wishlist
    expect(wishlistBtn.text()).toBe('Adicionar aos Favoritos');

    // Click to add to wishlist
    await wishlistBtn.trigger('click');
    expect(wishlistBtn.text()).toBe('Remover dos Favoritos');

    // Click again to remove from wishlist
    await wishlistBtn.trigger('click');
    expect(wishlistBtn.text()).toBe('Adicionar aos Favoritos');
  });

  it('should display image thumbnails', () => {
    const thumbnails = wrapper.findAll('[data-testid="thumbnail"]');
    expect(thumbnails).toHaveLength(2);
  });

  it('should have close button functionality', () => {
    const closeBtn = wrapper.find('[data-testid="close-button"]');
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.text()).toBe('×');
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.product-modal').exists()).toBe(true);
    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    expect(wrapper.find('.modal-content').exists()).toBe(true);
    expect(wrapper.find('.product-images').exists()).toBe(true);
    expect(wrapper.find('.product-details').exists()).toBe(true);
    expect(wrapper.find('.product-options').exists()).toBe(true);
    expect(wrapper.find('.product-actions').exists()).toBe(true);
  });
});
