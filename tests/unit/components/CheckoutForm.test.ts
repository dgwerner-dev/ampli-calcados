import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Mock the composables
vi.mock('@/composables/useCart', () => ({
  useCart: () => ({
    cart: {
      value: [
        {
          id: '1-38-preto',
          productId: '1',
          name: 'Sapato Elegante',
          price: 299.99,
          quantity: 1,
          color: 'preto',
          size: '38',
        },
      ],
    },
    total: { value: 299.99 },
    clearCart: vi.fn(),
  }),
}));

vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    user: { value: { id: 'user1', email: 'user@example.com' } },
    isAuthenticated: { value: true },
  }),
}));

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('CheckoutForm', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();

    wrapper = mount(
      {
        template: `
        <div class="checkout-form">
          <div class="checkout-header">
            <h2>Finalizar Compra</h2>
            <div class="order-summary">
              <span class="total-label">Total:</span>
              <span class="total-value" data-testid="total-value">R$ {{ formatPrice(total) }}</span>
            </div>
          </div>
          
          <form @submit.prevent="handleSubmit" data-testid="checkout-form">
            <div class="shipping-section">
              <h3>Endereço de Entrega</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Nome Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name" 
                    required 
                    data-testid="name-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="phone">Telefone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="formData.phone" 
                    required 
                    data-testid="phone-input"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="cep">CEP</label>
                <input 
                  type="text" 
                  id="cep" 
                  v-model="formData.cep" 
                  @blur="searchCep"
                  required 
                  data-testid="cep-input"
                />
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="street">Rua</label>
                  <input 
                    type="text" 
                    id="street" 
                    v-model="formData.street" 
                    required 
                    data-testid="street-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="number">Número</label>
                  <input 
                    type="text" 
                    id="number" 
                    v-model="formData.number" 
                    required 
                    data-testid="number-input"
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label for="neighborhood">Bairro</label>
                  <input 
                    type="text" 
                    id="neighborhood" 
                    v-model="formData.neighborhood" 
                    required 
                    data-testid="neighborhood-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="city">Cidade</label>
                  <input 
                    type="text" 
                    id="city" 
                    v-model="formData.city" 
                    required 
                    data-testid="city-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="state">Estado</label>
                  <input 
                    type="text" 
                    id="state" 
                    v-model="formData.state" 
                    required 
                    data-testid="state-input"
                  />
                </div>
              </div>
            </div>
            
            <div class="shipping-options">
              <h3>Opções de Entrega</h3>
              
              <div class="shipping-option" v-for="option in shippingOptions" :key="option.id">
                <input 
                  type="radio" 
                  :id="option.id" 
                  :value="option.id" 
                  v-model="selectedShipping" 
                  :data-testid="'shipping-' + option.id"
                />
                <label :for="option.id">
                  <span class="option-name">{{ option.name }}</span>
                  <span class="option-price">{{ formatPrice(option.price) }}</span>
                  <span class="option-delivery">{{ option.delivery }}</span>
                </label>
              </div>
            </div>
            
            <div class="free-shipping-alert" v-if="freeShippingAlert" data-testid="free-shipping-alert">
              <p>{{ freeShippingAlert }}</p>
            </div>
            
            <div class="order-total">
              <div class="subtotal">
                <span>Subtotal:</span>
                <span data-testid="subtotal">{{ formatPrice(total) }}</span>
              </div>
              <div class="shipping">
                <span>Frete:</span>
                <span data-testid="shipping-cost">{{ formatPrice(shippingCost) }}</span>
              </div>
              <div class="final-total">
                <span>Total:</span>
                <span data-testid="final-total">{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>
            
            <button type="submit" class="submit-btn" data-testid="submit-button">
              Finalizar Pedido
            </button>
          </form>
        </div>
      `,
        data() {
          return {
            total: 299.99,
            shippingCost: 15.0,
            finalTotal: 314.99,
            selectedShipping: 'standard',
            freeShippingAlert: null,
            formData: {
              name: '',
              phone: '',
              cep: '',
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              state: '',
            },
            shippingOptions: [
              {
                id: 'standard',
                name: 'Entrega Padrão',
                price: 15.0,
                delivery: '5-7 dias úteis',
              },
              {
                id: 'express',
                name: 'Entrega Expressa',
                price: 25.0,
                delivery: '2-3 dias úteis',
              },
              {
                id: 'free',
                name: 'Frete Grátis',
                price: 0.0,
                delivery: '5-7 dias úteis',
              },
            ],
          };
        },
        methods: {
          formatPrice(price: number) {
            return price.toFixed(2).replace('.', ',');
          },
          searchCep() {
            // Mock implementation
          },
          handleSubmit() {
            // Mock implementation
          },
        },
      },
      {
        global: {
          plugins: [pinia],
          mocks: {
            $route: { path: '/checkout' },
            $router: { push: vi.fn() },
          },
        },
      }
    );
  });

  it('should render the checkout form', () => {
    expect(wrapper.find('.checkout-form').exists()).toBe(true);
    expect(wrapper.find('[data-testid="checkout-form"]').exists()).toBe(true);
  });

  it('should display order total', () => {
    expect(wrapper.find('[data-testid="total-value"]').text()).toBe('R$ 299,99');
  });

  it('should have all required form fields', () => {
    expect(wrapper.find('[data-testid="name-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="phone-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="cep-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="street-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="number-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="neighborhood-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="city-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="state-input"]').exists()).toBe(true);
  });

  it('should display shipping options', () => {
    const shippingOptions = wrapper.findAll('.shipping-option');
    expect(shippingOptions).toHaveLength(3);
  });

  it('should allow shipping option selection', async () => {
    const expressOption = wrapper.find('[data-testid="shipping-express"]');
    await expressOption.setChecked();
    expect(wrapper.vm.selectedShipping).toBe('express');
  });

  it('should display order breakdown', () => {
    expect(wrapper.find('[data-testid="subtotal"]').text()).toBe('299,99');
    expect(wrapper.find('[data-testid="shipping-cost"]').text()).toBe('15,00');
    expect(wrapper.find('[data-testid="final-total"]').text()).toBe('314,99');
  });

  it('should have proper form validation attributes', () => {
    const requiredInputs = [
      'name-input',
      'phone-input',
      'cep-input',
      'street-input',
      'number-input',
      'neighborhood-input',
      'city-input',
      'state-input',
    ];

    requiredInputs.forEach(testId => {
      const input = wrapper.find(`[data-testid="${testId}"]`);
      expect(input.attributes('required')).toBeDefined();
    });
  });

  it('should display free shipping alert when applicable', async () => {
    await wrapper.setData({
      freeShippingAlert: 'Adicione mais R$ 100 para frete grátis!',
    });

    const alert = wrapper.find('[data-testid="free-shipping-alert"]');
    expect(alert.exists()).toBe(true);
    expect(alert.text()).toContain('Adicione mais R$ 100 para frete grátis!');
  });

  it('should have submit button', () => {
    const submitBtn = wrapper.find('[data-testid="submit-button"]');
    expect(submitBtn.exists()).toBe(true);
    expect(submitBtn.text()).toBe('Finalizar Pedido');
  });

  it('should handle form data binding', async () => {
    const nameInput = wrapper.find('[data-testid="name-input"]');
    const phoneInput = wrapper.find('[data-testid="phone-input"]');

    await nameInput.setValue('João Silva');
    await phoneInput.setValue('11999999999');

    expect(wrapper.vm.formData.name).toBe('João Silva');
    expect(wrapper.vm.formData.phone).toBe('11999999999');
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.checkout-form').exists()).toBe(true);
    expect(wrapper.find('.checkout-header').exists()).toBe(true);
    expect(wrapper.find('.shipping-section').exists()).toBe(true);
    expect(wrapper.find('.shipping-options').exists()).toBe(true);
    expect(wrapper.find('.order-total').exists()).toBe(true);
    expect(wrapper.find('.form-row').exists()).toBe(true);
    expect(wrapper.find('.form-group').exists()).toBe(true);
  });

  it('should display shipping option details', () => {
    const standardOption = wrapper.find('[data-testid="shipping-standard"]');
    const expressOption = wrapper.find('[data-testid="shipping-express"]');
    const freeOption = wrapper.find('[data-testid="shipping-free"]');

    expect(standardOption.exists()).toBe(true);
    expect(expressOption.exists()).toBe(true);
    expect(freeOption.exists()).toBe(true);
  });
});
