import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders} from '@angular/common/http';
import { UserModel } from '../_models/user.model';
import {environment} from '../../environments/environment';
import { catchError, tap  } from 'rxjs/operators';
import { HandleHttpErrorService } from './shared/handle-http-error.service';
import { isUndefined } from 'util';
import { UserForm } from '../_models/user.form.model';
import { RoleInfoModel } from '../_models/role-info.model';
import { RoleDetails } from '../_models/role-details.model';
import { AuthorizationModel } from '../_models/authorization.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  private baseUrl: string;
  constructor(private http: HttpClient) {
    this.baseUrl = environment.hstloginserviceurl;
  }


  getUserMenu(userName: string) {
    let params = new HttpParams();
    if (!isUndefined(userName)) {
      params = isUndefined(userName) || (userName == null) ? params : params.append('userName', userName);
    }
    return this.http.get(this.baseUrl + 'getMenuSubmenu', {params});
}

getAuditUserDetails(userModel: UserModel) {
  let params = new HttpParams();
  if (!isUndefined(userModel)) {
      params = isUndefined(userModel.username) || (userModel.username == null) ? params : params.append('userName', userModel.username);
     // params = isUndefined(userModel.email) || (userModel.email == null) ? params : params.append('emailId', userModel.email);

    }
  return this.http.get(this.baseUrl + 'getUserAuditDetails', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getUserList(userModel: UserModel) {

  let params = new HttpParams();
  if (!isUndefined(userModel)) {
      params = isUndefined(userModel.username) || (userModel.username == null) ? params : params.append('userName', userModel.username);
     // params = isUndefined(userModel.email) || (userModel.email == null) ? params : params.append('emailId', userModel.email);

    }
  return this.http.get(this.baseUrl + 'getUserDetails', {params}).pipe(
      catchError(HandleHttpErrorService.handleError)
      );

  }


  getRoles(roleName: string) {
    let params = new HttpParams();
    if (!isUndefined(roleName)) {
      params = isUndefined(roleName) || (roleName == null) ? params : params.append('roleName', roleName );
    }
    return this.http.get(this.baseUrl + 'getRoleDetails', {params}).pipe(
      catchError(HandleHttpErrorService.handleError)
      );
}


getAuditRoleDetails(roleName: string) {
  let params = new HttpParams();
  if (!isUndefined(roleName)) {
    params = isUndefined(roleName) || (roleName == null) ? params : params.append('roleName', roleName );
  }
  return this.http.get(this.baseUrl + 'getRoleAuditDetails', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

addRoles(userModel: UserForm) {

  return this.http.post(this.baseUrl + 'createUserRole', userModel, {responseType: 'text'}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

modifyUserRoles(userModel: UserForm) {

  return this.http.put(this.baseUrl + 'updateUserRole', userModel, {responseType: 'text'}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

deleteUser(userName: string) {

  let params = new HttpParams();
  if (!isUndefined(userName)) {
    params = isUndefined(userName) || (userName == null) ? params : params.append('userName', userName );
  }
  return this.http.delete(this.baseUrl + 'deleteUser/' + userName, {responseType: 'text'}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getUserRoleDetails(userName: string) {

  let params = new HttpParams();
  if (!isUndefined(userName)) {
    params = isUndefined(userName) || (userName == null) ? params : params.append('userName', userName );
  }
  return this.http.get(this.baseUrl + 'getUserRoleDetails', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}


getPermissionList(roleInfo: RoleInfoModel) {

  let params = new HttpParams();
  if (!isUndefined(roleInfo)) {
    params = isUndefined(roleInfo.appName) || (roleInfo.appName == null) ? params : params.append('menuName', roleInfo.appName );
    params = isUndefined(roleInfo.rescName) || (roleInfo.rescName == null) ? params : params.append('resourceName', roleInfo.rescName );
  }
  return this.http.get(this.baseUrl + 'getUserPermissions', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getMenuResources(menuName: string) {

  let params = new HttpParams();
  if (!isUndefined(menuName)) {
    params = isUndefined(menuName) || (menuName == null) ? params : params.append('menuName', menuName);
  }
  return this.http.get(this.baseUrl + 'getUserResources', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

createRole(roleDetails: RoleDetails) {

  return this.http.post(this.baseUrl + 'createRolesAndPermissions', roleDetails, {responseType: 'text'}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}


getAllMenuNames() {
  return this.http.get(this.baseUrl + 'getUserMenu').pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

updateRole(roleDetails: RoleDetails) {

  return this.http.put(this.baseUrl + 'updateRolesAndPermissions', roleDetails, {responseType: 'text'}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getAssignedResources(roleId: string) {

  let params = new HttpParams();
  if (!isUndefined(roleId)) {
    params = isUndefined(roleId) || (roleId == null) ? params : params.append('roleId', roleId);
  }
  return this.http.get(this.baseUrl + 'getRolesAndPermissions', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getButtonList(authorizationModel: AuthorizationModel) {

  let params = new HttpParams();

  if (!isUndefined(authorizationModel)) {
    // tslint:disable-next-line:max-line-length
    params = isUndefined(authorizationModel.userName) || (authorizationModel.userName == null) ? params : params.append('userName', authorizationModel.userName);
    // tslint:disable-next-line:max-line-length
    params = isUndefined(authorizationModel.screenName) || (authorizationModel.screenName == null) ? params : params.append('screenName', authorizationModel.screenName);
    // tslint:disable-next-line:max-line-length
    params = isUndefined(authorizationModel.rescName) || (authorizationModel.rescName == null) ? params : params.append('resourceName', authorizationModel.rescName);
  }
  return this.http.get(this.baseUrl + 'getButtons', {params}).pipe(
    catchError(HandleHttpErrorService.handleError)
    );
}

getPageAuthorisationSettings(page: string) {
    return this.http.get(`${this.baseUrl}getauthorisations/${page}/`, httpOptions).
      pipe(
        tap(),
        catchError(HandleHttpErrorService.handleError)
      );
  }
}
