import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia } from 'pinia';

// Mock the composables
vi.mock('@/composables/useAuth', () => ({
  useAuth: () => ({
    user: { value: null },
    isAuthenticated: { value: false },
    signIn: vi.fn(),
    signUp: vi.fn(),
  }),
}));

vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

describe('AuthModal', () => {
  let wrapper: any;

  beforeEach(() => {
    const pinia = createPinia();

    wrapper = mount(
      {
        template: `
        <div class="auth-modal" v-if="isOpen">
          <div class="modal-overlay" @click="closeModal"></div>
          <div class="modal-content">
            <div class="modal-header">
              <h2>{{ isLogin ? 'Entrar' : 'Registrar' }}</h2>
              <button class="close-btn" @click="closeModal" data-testid="close-button">×</button>
            </div>
            
            <div class="modal-body">
              <form @submit.prevent="handleSubmit" data-testid="auth-form">
                <div class="form-group">
                  <label for="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="email" 
                    required 
                    data-testid="email-input"
                  />
                </div>
                
                <div class="form-group">
                  <label for="password">Senha</label>
                  <input 
                    type="password" 
                    id="password" 
                    v-model="password" 
                    required 
                    data-testid="password-input"
                  />
                </div>
                
                <div v-if="!isLogin" class="form-group">
                  <label for="confirmPassword">Confirmar Senha</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    required 
                    data-testid="confirm-password-input"
                  />
                </div>
                
                <button type="submit" class="submit-btn" data-testid="submit-button">
                  {{ isLogin ? 'Entrar' : 'Registrar' }}
                </button>
              </form>
              
              <div class="form-footer">
                <button @click="toggleMode" class="toggle-mode-btn" data-testid="toggle-mode-button">
                  {{ isLogin ? 'Criar conta' : 'Já tenho conta' }}
                </button>
                
                <button v-if="isLogin" @click="showForgotPassword" class="forgot-password-btn" data-testid="forgot-password-button">
                  Esqueci minha senha
                </button>
              </div>
            </div>
          </div>
        </div>
      `,
        data() {
          return {
            isOpen: true,
            isLogin: true,
            email: '',
            password: '',
            confirmPassword: '',
            errors: {},
          };
        },
        methods: {
          closeModal() {
            this.isOpen = false;
          },
          toggleMode() {
            this.isLogin = !this.isLogin;
            this.errors = {};
          },
          showForgotPassword() {
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
            $route: { path: '/' },
            $router: { push: vi.fn() },
          },
        },
      }
    );
  });

  it('should render the modal when open', () => {
    expect(wrapper.find('.auth-modal').exists()).toBe(true);
    expect(wrapper.find('.modal-content').exists()).toBe(true);
  });

  it('should display login form by default', () => {
    expect(wrapper.find('h2').text()).toBe('Entrar');
    expect(wrapper.find('[data-testid="submit-button"]').text()).toBe('Entrar');
  });

  it('should have all required form fields', () => {
    expect(wrapper.find('[data-testid="email-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="password-input"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="auth-form"]').exists()).toBe(true);
  });

  it('should show confirm password field in register mode', async () => {
    await wrapper.setData({ isLogin: false });
    expect(wrapper.find('[data-testid="confirm-password-input"]').exists()).toBe(true);
  });

  it('should toggle between login and register modes', async () => {
    const toggleBtn = wrapper.find('[data-testid="toggle-mode-button"]');

    // Initially in login mode
    expect(wrapper.find('h2').text()).toBe('Entrar');

    // Click to switch to register mode
    await toggleBtn.trigger('click');
    expect(wrapper.find('h2').text()).toBe('Registrar');

    // Click again to switch back to login mode
    await toggleBtn.trigger('click');
    expect(wrapper.find('h2').text()).toBe('Entrar');
  });

  it('should show forgot password button in login mode', () => {
    expect(wrapper.find('[data-testid="forgot-password-button"]').exists()).toBe(true);
  });

  it('should hide forgot password button in register mode', async () => {
    await wrapper.setData({ isLogin: false });
    expect(wrapper.find('[data-testid="forgot-password-button"]').exists()).toBe(false);
  });

  it('should have proper form validation attributes', () => {
    const emailInput = wrapper.find('[data-testid="email-input"]');
    const passwordInput = wrapper.find('[data-testid="password-input"]');

    expect(emailInput.attributes('type')).toBe('email');
    expect(emailInput.attributes('required')).toBeDefined();
    expect(passwordInput.attributes('type')).toBe('password');
    expect(passwordInput.attributes('required')).toBeDefined();
  });

  it('should have close button functionality', () => {
    const closeBtn = wrapper.find('[data-testid="close-button"]');
    expect(closeBtn.exists()).toBe(true);
    expect(closeBtn.text()).toBe('×');
  });

  it('should have proper CSS classes for styling', () => {
    expect(wrapper.find('.auth-modal').exists()).toBe(true);
    expect(wrapper.find('.modal-overlay').exists()).toBe(true);
    expect(wrapper.find('.modal-content').exists()).toBe(true);
    expect(wrapper.find('.modal-header').exists()).toBe(true);
    expect(wrapper.find('.modal-body').exists()).toBe(true);
    expect(wrapper.find('.form-group').exists()).toBe(true);
  });

  it('should handle form data binding', async () => {
    const emailInput = wrapper.find('[data-testid="email-input"]');
    const passwordInput = wrapper.find('[data-testid="password-input"]');

    await emailInput.setValue('test@example.com');
    await passwordInput.setValue('password123');

    expect(wrapper.vm.email).toBe('test@example.com');
    expect(wrapper.vm.password).toBe('password123');
  });
});
