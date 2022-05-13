export function autoBind(_: any, _2: string, descriptor: PropertyDescriptor): any  {
       const method = descriptor.value;
       const ajtDescriptor: PropertyDescriptor = {
              configurable: true,
              get() {
                     const bound = method.bind(this)
                     return bound;
              }
       } 
       return ajtDescriptor;
}