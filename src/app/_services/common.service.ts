import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { AuthorizationService } from '../_services/authorization.service';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
};

export class Section {
    sectionname: string;
    sectionfieldssetting: JSON;
}

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    constructor(private _authorisationservice: AuthorizationService,) { }
    
    tabSubSectionList: any[] = [];
    navLinks: any;
    
    getSectionList(tabname : string) : any[] {
        this._authorisationservice.getPageAuthorisationSettings(tabname).subscribe(data => {
            this.navLinks = data;
            for (let navlink of this.navLinks) {
                let customObj = new Section();
                customObj.sectionname = navlink.tabsectionname;
                customObj.sectionfieldssetting = JSON.parse(navlink.tabsectionfieldsauthorisation);
                this.tabSubSectionList.push(customObj);
            }
        });
        return this.tabSubSectionList;
    }

    getfieldpropertyvalue(tabsubsectionlist, sectionname, fieldname, propertyname) {
        for (let section of tabsubsectionlist) {
            if (section.sectionname == sectionname) {
                for (let field of section.sectionfieldssetting) {
                    if (field.name == fieldname) {
                        for (let property of field.property) {
                            if (property.name == propertyname) {
                                return property.value;
                            }
                        }
                    }
                }
            }
        }
        return '';
    }

    showDivForUserRole(tabsubsectionlist, sectionname) {
        for (let section of tabsubsectionlist) {
            if (section.sectionname == sectionname) {
                return true;
            }
        }
        return false;
    }
}