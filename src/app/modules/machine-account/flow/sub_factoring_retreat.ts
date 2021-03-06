/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：退款流程
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1          2020-01-19
 * **********************************************************************
 */
import 'rxjs/add/observable/of';
import { XnService } from '../../../services/xn.service';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../../../services/loading.service';
import * as lodashall from 'lodash';
import { IFlowCustom } from './flow-custom';

export class SubFactoringRetreat implements IFlowCustom {
    constructor(private xn: XnService, private loading: LoadingService) {
    }

    preShow(): Observable<any> {
        return Observable.of(null);
    }

    postShow(svrConfig: any): Observable<any> {
        return Observable.of(null);
    }

    postGetSvrConfig(svrConfig: any): void {
    }
    afterSubmitandGettip(svrConfig: any) {}

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
            return Observable.of(null);

    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: `《${this.xn.user.orgName}》的退单申请`
        };
    }
}
