import {IFlowCustom} from '../../../flow.custom';
import {XnService} from '../../../../../../services/xn.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {FinancingFactoringVankeModalComponent} from '../../../../../../public/modal/financing-factoring-vanke-modal.component';
import XnFlowUtils from '../../../../../../common/xn-flow-utils';
import {XnUtils} from '../../../../../../common/xn-utils';
import {LoadingService} from '../../../../../../services/loading.service';

/**
 *  定向收款模式-保理商签约
 */
export class FinancingFactoring11Flow implements IFlowCustom {

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

    preSubmit(svrConfig: any, formValue: any): Observable<any> {
        if (svrConfig.procedure.procedureId !== 'review') {
            return Observable.of(null);
        }

        const params: any = {
            flowId: svrConfig.flow.flowId,
            procedureId: svrConfig.procedure.procedureId,
            recordId: svrConfig.record && svrConfig.record.recordId || '',  // 重复同意时会有recordId，此时后台就不要新生成recordId了
            title: formValue.title,
            memo: formValue.memo,
            checkers: XnFlowUtils.buildSubmitCheckers(svrConfig.checkers, formValue)
        };

        console.log('preSubmit', params);
        XnUtils.checkLoading(this);
        return this.xn.api.post('/record/record?method=pre_submit', params)
            .map(json => {
                console.log(json, 'pre_submit');
                json.data.flowId = 'financing_factoring11';
                const contracts = json.data;
                contracts.forEach(element => {
                    if (!element['config']) {
                        element['config'] = {
                            text: ''
                        };
                    }
                });
                contracts.forEach(x => {
                    if (x.label === '国内有追索权商业保理合同') {
                        x['config']['text'] = '乙方（保理商）数字签名';
                    } else if (x.label === '安心账户（应收账款资金）托管协议（三方）' || x.label === '委托开户通知书') {
                        x['config']['text'] = '乙方（电子签章、数字签名）';
                    } else if (x.label === '托管指令授权书') {
                        x['config']['text'] = '乙方（公章）';
                    } else {
                        x['config']['text'] = '（盖章）';
                    }
                });
                return {
                    action: 'modal',
                    modal: FinancingFactoringVankeModalComponent,
                    params: contracts
                };
            });
    }

    getTitleConfig(): any {
        return {
            hideTitle: true,
            def: `《${this.xn.user.orgName}》的交易申请`
        };
    }
}
