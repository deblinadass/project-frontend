export class Digitenne {
    id:string;
    productattributevalue: string;
    productattribute: string;
    productinstallbasef: Installbase;
  }

  export class Digitenneattributevalue {
    id: string;
    productattributevalue: string;
    productattribute: string;
  }

  export class Digitenneattribute {
    id: string;
    attributename: string;
    productcatalogue: string;
  }

  export class Installbase {
      productcatalogue: number;
      location:number;
  }