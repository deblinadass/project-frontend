import { Injectable } from '@angular/core';
import { ButtonsModel } from '../../_models/buton.model';
import { Observable, throwError } from 'rxjs';
import { NotFoundError } from 'src/app/_helpers/common/errors/not-found-error';
import { AppError } from 'src/app/_helpers/common/errors/app-error';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthorizationService } from '../authorization.service';
import { AuthorizationModel } from 'src/app/_models/authorization.model';


@Injectable({
  providedIn: 'root'
})

export class ButtonUtilsService {

    public buttonModel = new ButtonsModel();
    private buttonList: any;


    constructor(private auhtorizationService: AuthorizationService) {
    }

    getAuthButtons(authorizationModel: AuthorizationModel) {

        this.resetButtonModel();
        this.auhtorizationService.getButtonList(authorizationModel).subscribe(

          response => {
              this.buttonList = response;
              if (response) {
                for (let i = 0; i <= this.buttonList.length; i++) {

                  if (this.buttonList[i] === 'greed') {
                    this.buttonModel.greed = true;
                  }

                  if (this.buttonList[i] === 'ongma') {
                    this.buttonModel.ongma = true;
                  }
                  if (this.buttonList[i] === 'sceaf') {
                    this.buttonModel.sceaf = true;
                  }
                  if (this.buttonList[i] === 'ver') {
                    this.buttonModel.ver = true;
                  }
                  if (this.buttonList[i] === 'ok') {
                    this.buttonModel.ok = true;
                  }
                  if (this.buttonList[i] === 'okn') {
                    this.buttonModel.okn = true;
                  }
                  if (this.buttonList[i] === 'toev') {
                    this.buttonModel.toev = true;
                  }
                  if (this.buttonList[i] === 'verwi') {
                    this.buttonModel.verwi = true;
                  }
                  if (this.buttonList[i] === 'sbni') {
                    this.buttonModel.sbni = true;
                  }
                  if (this.buttonList[i] === 'awo') {
                    this.buttonModel.awo = true;
                  }
                  if (this.buttonList[i] === 'kan') {
                    this.buttonModel.kan = true;
                  }
                  if (this.buttonList[i] === 'inp') {
                    this.buttonModel.inp = true;
                  }
                  if (this.buttonList[i] === 'num') {
                    this.buttonModel.num = true;
                  }
                  if (this.buttonList[i] === 'sog') {
                    this.buttonModel.sog = true;
                  }
                }
              }
          }, (error: AppError) => {
            if (error instanceof NotFoundError) {
            } else {
              throw error;
            }
          });
        return this.buttonModel;
    }


resetButtonModel() {
    this.buttonModel.greed = false;
    this.buttonModel.ok = false;
    this.buttonModel.okn = false;
    this.buttonModel.ongma = false;
    this.buttonModel.sceaf = false;
    this.buttonModel.ver = false;
    this.buttonModel.toev = false;
    this.buttonModel.verwi = false;
    this.buttonModel.sbni = false;
    this.buttonModel.awo = false;
    this.buttonModel.kan = false;
    this.buttonModel.inp = false;
    this.buttonModel.num = false;
    this.buttonModel.sog = false;
  }

  getAdminButton() {
    this.buttonModel.greed = true;
    this.buttonModel.ok = true;
    this.buttonModel.okn = true;
    this.buttonModel.ongma = true;
    this.buttonModel.sceaf = true;
    this.buttonModel.ver = true;
    this.buttonModel.toev = true;
    this.buttonModel.verwi = true;
    this.buttonModel.sbni = true;
    this.buttonModel.awo = true;
    this.buttonModel.kan = true;
    this.buttonModel.inp = true;
    this.buttonModel.num = true;
    this.buttonModel.sog = true;

    return this.buttonModel;
  }
}
