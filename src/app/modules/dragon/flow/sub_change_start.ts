/*
 * Copyright(c) 2017-2019, 北京希为科技有限公司
 * Beijing Xiwei Technology Co., Ltd.
 * All rights reserved.
 *
 * @file：SupplierUploadInformationFlow
 * @summary：上传付确替换文件
 * @version: 1.0
 * **********************************************************************
 * revision             author            reason             date
 * 1.0                 wangqing          增加功能1         2019-09-20
 * **********************************************************************
 */
import 'rxjs/add/observable/of';
import { XnService } from '../../../services/xn.service';
import { Observable } from 'rxjs/Observable';
import { LoadingService } from '../../../services/loading.service';
import { IFlowCustom } from './flow-custom';
import * as lodashall from 'lodash';

export class SubChangeStart implements IFlowCustom {
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
    afterSubmitandGettip(svrConfig: any) {
        if (svrConfig.procedure.procedureId === '@begin') {
            this.xn.msgBox.open(false, '提交成功！\n 下一步请客户经理复核人在【首页-待办任务】中完成【复核】的待办任务。');
        }
    }

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        // if (svrConfig.procedure.procedureId === '@begin') {
        //     console.info(formValue);
        //     let alert = '';
        //     let mainlist = JSON.parse(formValue.personList);
        //     let isOk = lodashall.some(mainlist, ['pdfProjectFiles', '']); // 判断文件是否存在
        //     mainlist.forEach(x => {
        //         if (formValue.headquarters === '深圳市龙光控股有限公司') {
        //             alert = '此交易列表缺少《付款确认书（总部致保理商）》或《付款确认书（总部致券商）》';
        //         }
        //         if (isOk || JSON.parse(x.pdfProjectFiles).length !== 2) {
        //             this.xn.msgBox.open(false, alert);
        //             return Observable.of({ action: 'stop' });
        //         } else {
        //         }
        //     });
        //     return Observable.of(null);

        // } else {
            return Observable.of(null);

      //  }
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            titleName: '流程标题',
            def: '变更发行'
        };
    }
}
