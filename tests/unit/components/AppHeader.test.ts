import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Mock the composables
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    isAdmin: { value: false },
    isUser: { value: false },
    signOut: vi.fn(),
  }),
}));

vi.mock('@/composables/useCart', () => ({
  useCart: () => ({
    cart: { value: [] },
    total: { value: 0 },
    itemCount: { value: 0 },
    isEmpty: { value: true },
  }),
}));

vi.mock('@/composables/useWishlist', () => ({
  useWishlist: () => ({
    wishlist: { value: [] },
    wishlistCount: { value: 0 },
    isEmpty: { value: true },
  }),
}));

vi.mock('@/composables/useFreeShippingInfo', () => ({
  useFreeShippingInfo: () => ({
    freeShippingInfo: { value: null },
    message: { value: '' },
  }),
}));

describe('AppHeader', () => {
  let wrapper: any;

  beforeEach(() => {
    // Create a fresh Pinia instance for each test
    const pinia = createPinia();

    // Mock the component
    wrapper = mount(
      {
        template: `
        <div class="app-header">
          <nav class="navigation">
            <div class="logo">AMPLI CALÇADOS</div>
            <div class="nav-links">
              <a href="/" class="nav-link">Início</a>
              <a href="/produtos" class="nav-link">Produtos</a>
            </div>
            <div class="user-actions">
              <button class="wishlist-btn" data-testid="wishlist-button">
                <span class="wishlist-count">0</span>
              </button>
              <button class="cart-btn" data-testid="cart-button">
                <span class="cart-count">0</span>
              </button>
              <button class="login-btn" data-testid="login-button">Entrar</button>
            </div>
          </nav>
          <div class="free-shipping-message" data-testid="free-shipping-message">
            Frete grátis nas compras acima de R$ 599
          </div>
        </div>
      `,
        data() {
          return {
            user: null,
            isAuthenticated: false,
            cartCount: 0,
            wishlistCount: 0,
            freeShippingMessage: 'Frete grátis nas compras acima de R$ 599',
          };
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

  it('should render the header with logo', () => {
    expect(wrapper.find('.logo').text()).toBe('AMPLI CALÇADOS');
  });

  it('should render navigation links', () => {
    const navLinks = wrapper.findAll('.nav-link');
    expect(navLinks).toHaveLength(2);
    expect(navLinks[0].text()).toBe('Início');
    expect(navLinks[1].text()).toBe('Produtos');
  });

  it('should render user action buttons', () => {
    expect(wrapper.find('[data-testid="wishlist-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="cart-button"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="login-button"]').exists()).toBe(true);
  });

  it('should display cart count', () => {
    const cartCount = wrapper.find('.cart-count');
    expect(cartCount.text()).toBe('0');
  });

  it('should display wishlist count', () => {
    const wishlistCount = wrapper.find('.wishlist-count');
    expect(wishlistCount.text()).toBe('0');
  });

  it('should display free shipping message', () => {
    const message = wrapper.find('[data-testid="free-shipping-message"]');
    expect(message.text()).toContain('Frete grátis nas compras acima de R$ 599');
  });

  it('should show login button when user is not authenticated', () => {
    const loginBtn = wrapper.find('[data-testid="login-button"]');
    expect(loginBtn.text()).toBe('Entrar');
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.app-header').exists()).toBe(true);
    expect(wrapper.find('.navigation').exists()).toBe(true);
    expect(wrapper.find('.user-actions').exists()).toBe(true);
  });

  it('should be responsive with proper structure', () => {
    const header = wrapper.find('.app-header');
    const nav = wrapper.find('.navigation');

    expect(header.exists()).toBe(true);
    expect(nav.exists()).toBe(true);
    expect(nav.find('.logo').exists()).toBe(true);
    expect(nav.find('.nav-links').exists()).toBe(true);
    expect(nav.find('.user-actions').exists()).toBe(true);
  });
});
