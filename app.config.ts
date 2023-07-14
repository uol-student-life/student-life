export default defineAppConfig({
  // https://ui.nuxtlabs.com/getting-started/theming
  ui: {
    primary: "amber", // amber our primary maybe??
    gray: "stone",
    // this is for the toast notifications
    notifications: {
      position: "bottom-0 right-0",
    },
    // Not all colors are made available:
    // https://ui.nuxtlabs.com/getting-started/theming#colors
    // Needed this to get success, warning and error colours
    // to work.
    safelistColors: ["red", "yellow", "green"],
  },
});
