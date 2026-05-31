const ImageConfig = {
  defaultLogo: "https://picsum.photos/id/1/80/80",
  defaultSlide: "https://picsum.photos/id/0/1600/900",

  categoryImages: {
    "Gaming & Entertainment": {
      logo: "https://picsum.photos/id/104/80/80",
      slide: "https://picsum.photos/id/104/1600/900"
    },
    Design: {
      logo: "https://picsum.photos/id/26/80/80",
      slide: "https://picsum.photos/id/26/1600/900"
    },
    "CAD/3D": {
      logo: "https://picsum.photos/id/169/80/80",
      slide: "https://picsum.photos/id/169/1600/900"
    },
    "Video Editing": {
      logo: "https://picsum.photos/id/10/80/80",
      slide: "https://picsum.photos/id/10/1600/900"
    },
    SaaS: {
      logo: "https://picsum.photos/id/20/80/80",
      slide: "https://picsum.photos/id/20/1600/900"
    },
    Marketing: {
      logo: "https://picsum.photos/id/153/80/80",
      slide: "https://picsum.photos/id/153/1600/900"
    },
    "E-commerce": {
      logo: "https://picsum.photos/id/13/80/80",
      slide: "https://picsum.photos/id/13/1600/900"
    },
    Travel: {
      logo: "https://picsum.photos/id/15/80/80",
      slide: "https://picsum.photos/id/15/1600/900"
    },
    VPN: {
      logo: "https://picsum.photos/id/46/80/80",
      slide: "https://picsum.photos/id/46/1600/900"
    }
  },

  getProgramImage(programName, category) {
    const programSpecific = {
      "Epic Games": "https://picsum.photos/id/104/80/80",
      Canva: "https://picsum.photos/id/26/80/80",
      "Adobe Creative Cloud": "https://picsum.photos/id/20/80/80",
      Shopify: "https://picsum.photos/id/13/80/80",
      NordVPN: "https://picsum.photos/id/46/80/80",
      "Booking.com": "https://picsum.photos/id/15/80/80"
    };

    return programSpecific[programName] ||
      this.categoryImages[category]?.logo ||
      this.defaultLogo;
  },

  slideshowImages: [
    "https://picsum.photos/id/104/1600/900",
    "https://picsum.photos/id/26/1600/900",
    "https://picsum.photos/id/20/1600/900",
    "https://picsum.photos/id/29/1600/900",
    "https://picsum.photos/id/0/1600/900"
  ]
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = ImageConfig;
}

console.log("Images.js loaded - image configuration ready");
