import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: false },
  css: ["@/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ["shadcn-nuxt", "@nuxtjs/google-fonts"],
  shadcn:{
    prefix: '',
    componentDir: './components/ui'
  },
  googleFonts:{
    families:{
      Roboto: true,
      'Josefin Sans': true,
      Lato: [100, 300],
      Raleway: {
        wght: [100, 400],
        ital: [100]
      },
      Inter: '200..700',
      'Crimson Pro' : {
        wght: '200..900',
        ital:'200..700'
      }
    }
  }
});