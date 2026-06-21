export default {
  base: "/Breezil-Packets/",
  title: "@breezil/packet-defs",
  description:
    "Minecraft 1.8.9 packet type definitions and shared protocol interfaces.",
  cleanUrls: true,
  lastUpdated: true,
  head: [["link", { rel: "icon", href: "/Breezil-Packets/logo.png" }]],
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API", link: "/api/" },
      {
        text: "npm",
        link: "https://www.npmjs.com/package/@breezil/packet-defs",
      },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [{ text: "Getting Started", link: "/guide/getting-started" }],
      },
      { text: "Reference", items: [{ text: "API", link: "/api/" }] },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/Breezil/Breezil-Packets" },
      { icon: "discord", link: "https://discord.gg/wYs3cnsYeX" },
    ],
    search: { provider: "local" },
    editLink: {
      pattern:
        "https://github.com/Breezil/Breezil-Packets/edit/main/docs/:path",
    },
    footer: {
      message: "Released under the MIT License.",
      copyright: "Built with 💙 by Breezil",
    },
  },
};

