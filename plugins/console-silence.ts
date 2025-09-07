export default defineNuxtPlugin(() => {
  if (process.env.NODE_ENV === 'production') {
    // Silencia logs não essenciais em produção
    console.log = () => {};
    console.info = () => {};
    console.debug = () => {};
    console.warn = () => {};
  }
});


