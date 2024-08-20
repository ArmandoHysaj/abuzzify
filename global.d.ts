
declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
  }
  
  declare module "*.png" {
    const value: {
      src: string;
      height: number;
      width: number;
    };
    export default value;
  }
  
  declare module '*.js' {
    const value: any;
    export default value;
  }
  
 // global.d.ts
interface GoogleFC {
  callbackQueue: any[];
  controlledMessagingFunction: (message: any) => Promise<void>;
  showRevocationMessage?: () => void; 
}

interface Window {
  googlefc: GoogleFC;
}
