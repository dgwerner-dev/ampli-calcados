<template>
  <div class="relative">
    <!-- Input field -->
    <div class="relative">
      <input
        :id="id"
        :value="displayValue"
        type="text"
        :placeholder="placeholder"
        readonly
        @click="toggleCalendar"
        @focus="toggleCalendar"
        class="w-full px-4 py-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 cursor-pointer"
        :class="{ 'border-coral-soft bg-coral-50': isOpen }"
      />
      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
        <svg
          class="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <!-- Calendar dropdown -->
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-2xl border border-gray-200 p-4"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <div class="flex items-center space-x-2">
          <select
            v-model="currentMonth"
            @change="updateCalendar"
            class="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none"
          >
            <option v-for="(month, index) in months" :key="index" :value="index">
              {{ month }}
            </option>
          </select>
          <select
            v-model="currentYear"
            @change="updateCalendar"
            class="text-sm font-semibold text-gray-900 bg-transparent border-none focus:ring-0 focus:outline-none"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
        
        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Week days -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div
          v-for="day in weekDays"
          :key="day"
          class="text-xs font-medium text-gray-500 text-center py-2"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="date in calendarDates"
          :key="date.key"
          @click="selectDate(date)"
          :disabled="!date.isCurrentMonth || date.isDisabled"
          class="relative p-2 text-sm rounded-lg transition-all duration-200 hover:bg-coral-50 focus:outline-none focus:ring-2 focus:ring-coral-soft disabled:opacity-30 disabled:cursor-not-allowed"
          :class="{
            'text-gray-400': !date.isCurrentMonth,
            'text-gray-900': date.isCurrentMonth && !date.isSelected && !date.isToday,
            'bg-coral-soft text-white hover:bg-coral-dark': date.isSelected,
            'bg-coral-100 text-coral-800 font-semibold': date.isToday && !date.isSelected,
            'bg-red-50 text-red-600': date.isPast
          }"
        >
          {{ date.day }}
          <div
            v-if="date.isToday && !date.isSelected"
            class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full"
          ></div>
        </button>
      </div>

      <!-- Time picker (if datetime) -->
      <div v-if="includeTime" class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Hora</label>
            <input
              v-model="selectedTime"
              type="time"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 text-sm"
            />
          </div>
          <div class="flex-1">
            <label class="block text-xs font-medium text-gray-700 mb-1">Minuto</label>
            <select
              v-model="selectedMinute"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-coral-soft focus:border-coral-soft transition-all duration-200 text-sm"
            >
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="mt-4 pt-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <button
            @click="selectToday"
            class="text-sm text-coral-600 hover:text-coral-800 font-medium transition-colors"
          >
            Hoje
          </button>
          <button
            @click="clearDate"
            class="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Date],
    default: null,
  },
  id: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Selecione uma data',
  },
  includeTime: {
    type: Boolean,
    default: false,
  },
  minDate: {
    type: Date,
    default: null,
  },
  maxDate: {
    type: Date,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

// State
const isOpen = ref(false);
const currentDate = ref(new Date());
const selectedTime = ref('12:00');
const selectedMinute = ref('00');

// Computed
const currentMonth = computed({
  get: () => currentDate.value.getMonth(),
  set: (value) => {
    currentDate.value = new Date(currentDate.value.getFullYear(), value, 1);
  }
});

const currentYear = computed({
  get: () => currentDate.value.getFullYear(),
  set: (value) => {
    currentDate.value = new Date(value, currentDate.value.getMonth(), 1);
  }
});

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    years.push(i);
  }
  return years;
});

const displayValue = computed(() => {
  if (!props.modelValue) return '';
  
  const date = new Date(props.modelValue);
  if (isNaN(date.getTime())) return '';
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  if (props.includeTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  
  return `${day}/${month}/${year}`;
});

const calendarDates = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const isCurrentMonth = date.getMonth() === month;
    const isToday = date.getTime() === today.getTime();
    const isSelected = props.modelValue && new Date(props.modelValue).toDateString() === date.toDateString();
    const isPast = date < today;
    const isDisabled = props.disabled || (props.minDate && date < props.minDate) || (props.maxDate && date > props.maxDate);
    
    dates.push({
      key: date.getTime(),
      day: date.getDate(),
      date: date,
      isCurrentMonth,
      isToday,
      isSelected,
      isPast,
      isDisabled
    });
  }
  
  return dates;
});

// Methods
const toggleCalendar = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const updateCalendar = () => {
  // Trigger reactivity
  currentDate.value = new Date(currentYear.value, currentMonth.value, 1);
};

const previousMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
};

const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
};

const selectDate = (date) => {
  if (date.isDisabled) return;
  
  let selectedDate = new Date(date.date);
  
  if (props.includeTime) {
    const [hours, minutes] = selectedTime.value.split(':');
    selectedDate.setHours(parseInt(hours), parseInt(selectedMinute.value), 0, 0);
  } else {
    selectedDate.setHours(12, 0, 0, 0);
  }
  
  emit('update:modelValue', selectedDate.toISOString());
  isOpen.value = false;
};

const selectToday = () => {
  const today = new Date();
  if (props.includeTime) {
    const [hours, minutes] = selectedTime.value.split(':');
    today.setHours(parseInt(hours), parseInt(selectedMinute.value), 0, 0);
  } else {
    today.setHours(12, 0, 0, 0);
  }
  
  emit('update:modelValue', today.toISOString());
  isOpen.value = false;
};

const clearDate = () => {
  emit('update:modelValue', null);
  isOpen.value = false;
};

// Close calendar when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    isOpen.value = false;
  }
};

// Lifecycle
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for modelValue changes to update current date
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const date = new Date(newValue);
    if (!isNaN(date.getTime())) {
      currentDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
      
      if (props.includeTime) {
        selectedTime.value = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        selectedMinute.value = date.getMinutes().toString().padStart(2, '0');
      }
    }
  }
}, { immediate: true });
</script>
