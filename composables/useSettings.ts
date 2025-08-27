export const useSettings = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getAllSettings = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/settings');
      return response.settings;
    } catch (err: any) {
      error.value = err.message || 'Erro ao buscar configurações';
      console.error('Erro ao buscar configurações:', err);
      return {};
    } finally {
      loading.value = false;
    }
  };

  const getSetting = async (key: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/settings/${key}`);
      return response;
    } catch (err: any) {
      error.value = err.message || "Erro ao buscar configuração";
      console.error("Erro ao buscar configuração:", err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateSetting = async (key: string, value: any, description?: string) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch(`/api/settings/${key}`, {
        method: "PUT",
        body: {
          value,
          description,
        },
      });
      return response;
    } catch (err: any) {
      error.value = err.message || "Erro ao atualizar configuração";
      console.error("Erro ao atualizar configuração:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getFreeShippingAlert = async () => {
    const setting = await getSetting("free_shipping_alert");
    return setting?.value === "true";
  };

  const updateFreeShippingAlert = async (enabled: boolean) => {
    return await updateSetting(
      "free_shipping_alert",
      enabled,
      "Alerta de frete grátis ativo/inativo"
    );
  };

  return {
    loading: readonly(loading),
    error: readonly(error),
    getAllSettings,
    getSetting,
    updateSetting,
    getFreeShippingAlert,
    updateFreeShippingAlert,
  };
};
