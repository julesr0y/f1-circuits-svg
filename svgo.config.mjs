export default {
  js2svg: {
    indent: 4,
    pretty: true,
  },
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // avoid removing the viewBox attribute (important for scaling)
          convertStyleToAttrs: false, // avoid converting styles to attributes
          cleanupNumericValues: false, // avoid converting numeric values to shorter forms (e.g., 0.5 to .5)
          removeXMLNS: false, // avoid removing the xmlns attribute (important for SVGs to be valid)
        },
      },
    },
    // disable plugins that cause issues with the SVGs
    {
        name: 'cleanupListOfValues',
        active: false
    }
  ],
};