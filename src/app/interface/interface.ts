
import { MatTableDataSource, MatTable } from '@angular/material/table';
export interface TimeBusinessElement {
    change_date: string;
    business_model: string;
    hybrid_setting: string;
    note: string;
    moderator: string;
  }

  export interface EditTimeBusinessElement {
    change_date1: string;
    business_model1: string;
    hybrid_setting1: string;
    note1: string;
    moderator1: string;
  }

export interface IMultiservice{
    link: string;
    chainId: string;
    linegroupId: string;
    ssid: string;
    subnetMask: string;
    multiserviceType: string;
}

export interface IIssueFunnel{
    characteristic: string;
    startDate: string;
    scheduleDate: string;
    installProvider: string;
    locationName: string;
    type: string;
    urgency: string;
    status: string;
    shortDescription: string;
    moderator: string;
    action: string;
}
export interface IDataDump{
  oracleNumber: string;
  partySiteNumber: string;
  siteNumber: string;
  name: string;
  value: string;
  hotspots: string;
  oracle: string;
 
}
export interface ICountry {
id: number;
name: string;
}
export interface IExport {
  id: number;
  name: string;
}

export interface IType {
id: number;
name: string;
} 

export interface IAccountManager {
id: number;
name: string;
} 
export interface IServiceAgreement {
id: number;
name: string;
} 
export interface IStatus{
id: number;
name: string;
}
export interface IChain{
id: number;
name: string;
}

export interface IAgreement {
  id: string;
  name: string;
 }

 export interface IRevenue {
  header_context: string;
  last30d: string;
  thisyear: string;
  last365d: string;
 }
 
 
 export interface Audit {
  id:string;
  action: string;
  update_date: Date;
  type: string;
  product_type: string;
  updated_by: string;
  location_id: string;
  comment:string;
  productauditlog?: Modification[] | MatTableDataSource<Modification>;
}

 export interface BouwAudit {
  id:string;
  action: string;
  update_date: Date;
  type: string;
  product_type: string;
  updated_by: string;
  location_id: string;
  comment:string;
  orderauditlog?: Modification[] | MatTableDataSource<Modification>;
}


export interface TicketAudit {
  id:string;
  action: string;
  update_date: Date;
  location_type: string;
  product_type: string;
  updated_by: string;
  customer_id: string;
  parentcustomer_id: string;
  ticketid: number;
  comment:string;
  locationauditlog?: Modification[] | MatTableDataSource<Modification>;
}

export interface MKTorderAudit {
  id:string;
  action: string;
  update_date: Date;
  location_type: string;
  product_type: string;
  updated_by: string;
  customer_id: string;
  parentcustomer_id: string;
  hstorderid: number;
  comment:string;
  locationauditlog?: Modification[] | MatTableDataSource<Modification>;
}


 export interface LocationAudit {
  id:string;
  action: string;
  update_date: Date;
  product_type: string;
  updated_by: string;
  location_id: string;
  comment:string;
  locationauditlog?: Modification[] | MatTableDataSource<Modification>;
}

export interface Modification {
  field_name: string;
  old_value: string;
  new_value: string;
  productauditlog: string;
}
export interface Addons {
  ZTVAddOn: string;
  ZTVAddOnsQty: string;
  ZTVAddOnsPrice: string;
  ZTVAddOnTotalAmount: string;
}
export interface AuditDataSource {
  date: string;
  action: string;
  type: string;
  username: string;
  productauditlog?: MatTableDataSource<Modification>;
}
 
export interface Customer{
	customerid: number;
	customername: string;
	housenumber: string;
	housenumberaddition: string;
	streetname: string;
	city: string;
	country: string;
}

