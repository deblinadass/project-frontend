export class Orderbase {
	hstorderid: string;
	orderstatus: string;
	remarks: string;
	ponumber: string;
	creationdate: string;
	updationdate: string;
	ordertype:string;
	customerremarks:string;
	locationid: number;
	productcatalogueid: number;
	productcataloguegroup: number;
	billingstartdate: string;
	billingstatus: string;
	ordertrackcode:string;
	orderstate:string;
	  
	
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
	//productid:number;
  }