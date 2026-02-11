import { FontFamily } from "./FontFamily";

export const TYPE_CONTENT = {
  "module-image": {
    type: "module-image",
    label: "Imagen",
    icon: "image",
    outerStyle: {},
    preStyle: {
      padding: '0px',
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {},
    content: {
      src: '',
      alt: `Tu imagen`,
      name: '',
      width: '50%',
    },
  },
  
  "module-video": {
    type: "module-video",
    label: "Video",
    icon: "video",
    outerStyle: {},
    preStyle: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {},
    content: {
      src: '',
      alt: `Tu video`,
      width: '100%',
      url: '',
      iconType: 'roundSolid', // roundOutline
      iconColor: 'claro', // oscuro
      iconSize: '65px',
    },
  },

  "module-gif": {
    type: "module-gif",
    label: "Gif",
    icon: "gif",
    outerStyle: {},
    preStyle: {
      paddingTop: '0px',
      paddingRight: '0px',
      paddingBottom: '0px',
      paddingLeft: '0px',
      width: '100%',
      textAlign: 'center',
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {
      borderRadius: '0px',
    },
    content: {
      src: '',
      alt: `Tu gif`,
      width: '100%',
    },
  },

  "module-heading": {
    type: "module-heading",
    label: "Título",
    icon: "title",
    outerStyle: {},
    preStyle: {
      width: '100%',
      textAlign: 'center',
      padding: '0px',      
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {
      textAlign: 'center',
      color: '#000000',
      FontFamily: `Arial, "Helvetica Neue", Helvetica, sans-serif`,
      lineHeight: '120%',
      letterSpacing: '1px',
      fontWeight: '700',
      width: '100%',
    },
    content: {
      type: 'h2',
      text: `<span>Coloque aquí su título</span>`,
    },
  },

  "module-paragraph": {
    type: "module-heading",
    label: "Párrafo",
    icon: "paragraph",
    outerStyle: {},
    preStyle: {
      width: '100%',
      textAlign: 'center',
      padding: '0px',      
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {
      textAlign: 'left',
      fontSize: '16px',
      color: '#000000',
      lineHeight: '120%',
      letterSpacing: '1px',
      fontWeight: '400',
      width: '100%',
      fontFamily: `Arial, "Helvetica Neue", Helvetica, sans-serif`,
    },
    content: {
      type: 'p',
      text: `<span>Coloque aquí su párrafo</span>`,
    },
  },

  "module-list": {
    type: "module-list",
    label: "Lista",
    icon: "list",
    outerStyle: {},
    preStyle: {
      width: '100%',
      textAlign: 'left',
      padding: '0px',      
      backgroundColor: 'transparent',
      backgroundImage: 'none',
      backgroundPosition: 'left top',
      backgroundRepeat: 'no-repeat',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '0px',
    },
    style: {
      color: '#000000',
      fontSize: '16px',
      FontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
      lineHeight: '120%',
      letterSpacing: '1px',
      fontWeight: '400',
      padding: '0px',
      width: '100%',
      listStyleType: "disc",
      fontFamily: `Arial, "Helvetica Neue", Helvetica, sans-serif`,
    },
    content: {
      type: 'ul',
      text: '<li>Tu primer elemento de la lista</li>',
    }
  },

  "module-button": {
    type: "module-button",
    label: "Botón",
    icon: "button",
    outerStyle: {
      width: '100%',
      paddingTop: '10px',
      paddingRight: '10px',
      paddingBottom: '10px',
      paddingLeft: '10px',
      textAlign: 'center',
    },
    preStyle: {
      fontFamily: 'inherit',
      fontWeight: '400',
      backgroundColor: '#7747FF',
      borderRadius: '4px',
      borderWidth: '0px',
      borderStyle: 'solid',
      borderColor: 'transparent',      
      color: '#FFFFFF',
      lineHeight: '2',
      letterSpacing: 'normal',
      paddingTop: '5px',
      paddingRight: '20px',
      paddingBottom: '5px',
      paddingLeft: '20px',
      width: 'auto',
      maxWidth: '100%',
      direction: 'ltr',
      display: 'inline-bloc',
      textAlign: 'center',
      margin: '0 auto',
    },
    style: {
      fontFamily: 'inherit',
      fontWeight: '400',
      color: '#FFFFFF',
      lineHeight: '2',
      letterSpacing: '0',
      direction: 'ltr',
      textAlign: 'center',
      marginBottom: '0',
    },
    content: {
      text: 'Botón',
      type: 'web',
      feature: {
        href: '#',
        target: '_blank'
      },
    }
  },

  "module-table": {
    type: "module-table",
    label: "Tabla",
    icon: "table",
    activeHeads: true,
    preStyle: {
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      backgroundColor: 'transparent',
    },
    outerStyle: {
      width: '100%',
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      textAlign: 'center',
    },
    style: {
      direction: 'ltr',
      backgroundColor: 'transparent',
      fontFamily: 'inherit',
      fontWeight: '400',
      color: '#101112',
      textAlign: 'left',
      letterSpacing: '0px',
      width: '100%',
      height: '100',
      borderCollapse: 'collapse',
      tableLayout: 'fixed',
    },
    content: {
      headStyle: {
        backgroundColor: '#F2F2F2',
        color: '#101112',
        padding: '10px',
        fontSize: '14px',
        lineHeight: '120%',
        textAlign: 'center',
        direction: 'ltr;',
        fontFamily: 'inherit',
        letterSpacing: '0px',
        fontWeight: '700',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#DDDDDD',
      },
      colStyle: {
        color: '#101112',
        fontFamily: 'inherit',
        fontSize: '14px',
        padding: '10px',
        lineHeight: '120%',
        textAlign: 'center',
        fontWeight: '400',
        letterSpacing: '0px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#DDDDDD',
      },
      heads: [
        {
          cols: ['Añadir título', '', '']
        }
      ],
      rows: [
        {
          cols: ['Añadir texto', '', '']
        },
        {
          cols: ['', '', '']
        },
        {
          cols: ['', '', '']
        },
      ]
    },
  },

  "module-divider": {
    type: "module-divider",
    label: "Dividir",
    icon: "divider",
    preStyle: {
      paddingTop: '10px',
      paddingRight: '10px',
      paddingBottom: '10px',
      paddingLeft: '10px',
      lineHeight: '0',
      textAlign: 'center',
      width: '100%',
    },
    outerStyle: {},
    style: {
      borderTopStyle: 'solid',
      borderTopColor: '#DDDDDD',
      borderTopWidth: '2px',
      lineHeight: '0',
      width: '100%',
      margin: '0 auto',
    },
    content: {
      text: '&nbsp;',
    }

  },

  "module-spacer": {
    type: "module-spacer",
    label: "Espaciado",
    icon: "spacer",
    preStyle: {
      width: '100%',
    },
    style: {
      display: 'block',
      height: '60px',
    },
    content: {
      text: '&nbsp;',
    }
  },

  "module-social": {
    type: "module-social",
    label: "Sociales",
    icon: "social",
    preStyle: {      
      paddingTop: '0',
      paddingRight: '0',
      paddingBottom: '0',
      paddingLeft: '0',
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'center',
    },
    style: {
      textAlign: "center",
      padding: "10px",
    },
    content: {
      iconSpacing: '2.5px',
      type: 'Colors',
      social: [
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/facebook-logo-colored.png",
          alt: "Facebook",
          href: "https://www.facebook.com/",
        },
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/instagram-logo-colored.png",
          alt: "Instagram",
          href: "https://instagram.com/",
        },
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/x-logo-colored.png",
          alt: "Twitter",
          href: "https://twitter.com/",
        },
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/linkedin-logo-colored.png",
          alt: "Linkedin",
          href: "https://www.linkedin.com/",
        },
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/youtube-logo-colored.png",
          alt: "Youtube",
          href: "https://www.youtube.com/",
        },
        {
          src: "https://erxivmd.stripocdn.email/content/assets/img/social-icons/logo-colored/tiktok-logo-colored.png",
          alt: "TikTok",
          href: "https://www.tiktok.com/",
        },
      ]
    },
  },

  "module-html": {
    type: "module-html",
    label: "HTML",
    icon: "html",
    outerStyle: {},
    preStyle: {
      width: '100%',
    },
    style: {
      padding: '0',
      fontSize: '16px',
    },
    content: {
      html: '<div style="text-align: center;">Aquí tu bloque HTML</div>'
    }
  }

  
  // 👉 agrega más modules aquí
  
};

export function getTypeContent(type) {
  return TYPE_CONTENT[type] ?? null;
}