export class Orderbase {
	hstorderid: string;
	orderstatus: string;
	remarks: string;
	creationdate: string;
	updationdate: string;
	ponumber: string;
	ordertype:string;
	locationid: number;
	productcatalogueid: number;
	productcataloguegroup: number;
	billingstartdate: string;
	billingstatus: string;
  orderstate:string;
  isstartpaketactive:string;
  startpaketcatalogue:number;
  stratpaketname:string;
  isconnection:string;
  bouwtype:number;
}
export class Order {
    id:string;
    orderattributevalue: string;
    orderattribute: string;
    orderbasef: Orderbase;
  }

export class Orderattributevalue {
	id: string;
	productattributevalue: string;
	productattribute: string;
}

  export class Orderattribute {
    id: string;
    attributename: string;
    productcatalogueid: string;
  }

  export class OrderStatusUpdate {
    id: string;
	orderstatus: string;
	productid:number;
  orderdata: any;
  }