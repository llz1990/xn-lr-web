import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { XnInputOptions } from '../../../../../../public/form/xn-input.options';
import { DateCommunicateService } from '../../../../../../services/date-communicate.service';
import { XnFormUtils } from '../../../../../../common/xn-form-utils';
import { SelectOptions } from '../../../../../../config/select-options';
import { DynamicForm } from '../../../../../../common/dynamic-form/dynamic.decorators';
import { XnUtils } from '../../../../../../common/xn-utils';
import { JsonTransForm } from '../../../../../../public/pipe/xn-json.pipe';


declare let $: any;
declare const moment: any;

@Component({
    templateUrl: './loan-date.component.html',
    styles: [
        `.enable-input {
            background-color: #ffffff
        }

        .input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }

        .input-group > .bg {
            background-color: #eee;
            opacity: 1;
        }
        .enable-input {
            background-color: #ffffff
        }.input-group-addon {
            border-bottom-right-radius: 3px;
            border-top-right-radius: 3px;
        }.item-control input {
            background: none;
        }.date {
            width: 100%
        }.date i {
            position: absolute;
            top: 11px;
            right: 10px;
            opacity: 0.5;
            cursor: pointer;
        }

        `
    ]
})
@DynamicForm({ type: 'dragon-loandate', formModule: 'dragon-input' })

export class LoanDateComponent implements OnInit, OnDestroy {

    @Input() row: any;
    @Input() form: FormGroup;
    @ViewChild('configDate') configDate: ElementRef;
    position: string = 'down';
    myClass = '';
    myClass2 = 'input-group-addon';
    alert = '';
    ctrl: AbstractControl;
    ischeck: string;
    selectArrary: any[];
    xnOptions: XnInputOptions;

    input: any;

    constructor(private er: ElementRef, private dateCommunicateService: DateCommunicateService) {
    }

    ngOnInit() {
        if (!this.row.placeholder) {
            this.row.placeholder = '';
        }
        if (this.row.options) {
            let opts = JsonTransForm(this.row.options);
            this.position = opts.position ? opts.position : 'down';
        }
        this.ctrl = this.form.get(this.row.name);
        this.selectArrary = SelectOptions.get('accountReceipts');

        // 日期组件的默认配置在AppComponent里配置

        const ctrlValue = this.ctrl.value ? this.ctrl.value : '';

        if (ctrlValue === '') {
            this.ischeck = '-1';
        } else {
            const value = JSON.parse(ctrlValue);
            this.ischeck = `${value.isPriorityLoanDate}`;
        }
        this.initDate(ctrlValue);

        // 初始化时间控件
        this.calcAlertClass();
        this.xnOptions = new XnInputOptions(this.row, this.form, this.ctrl, this.er);
    }

    ngOnDestroy() {
        if (this.input) {
            this.input.off();
        }
    }

    onBlur1() {
        if (this.ischeck === '0') {
            this.initDate(''); // 初始化时间控件
        } else if (this.ischeck === '-1') {
            this.configDate.nativeElement.value = '';
            this.ctrl.setValue('');
            this.initDate('');
        } else {
            this.initDate(1);
        }
    }

    calcAlertClass(): void {
        this.myClass = (this.ctrl.disabled ? '' : 'enable-input ') + XnFormUtils.getClass(this.ctrl);
        this.myClass2 = 'input-group-addon ' + this.myClass;
        this.alert = XnFormUtils.buildValidatorErrorString(this.ctrl);
    }
    private initDate(ctrlValue) {
        let priorityLoanDateStart: any;
        let priorityLoanDateEnd: any;
        let isPriorityLoanDate: any;
        if (ctrlValue === '' || +this.ischeck <= 0) {
            this.configDate.nativeElement.value = '';
            this.ctrl.setValue(JSON.stringify({ 'isPriorityLoanDate': +this.ischeck }));
            return;
        } else {

            if (!XnUtils.isEmptyObject(JSON.parse(ctrlValue))) {
                priorityLoanDateStart = JSON.parse(ctrlValue).priorityLoanDateStart;
                priorityLoanDateEnd = JSON.parse(ctrlValue).priorityLoanDateEnd;
                isPriorityLoanDate = 1;
            } else {
                const times = {
                    priorityLoanDateStart: moment().startOf('day').format('x'),
                    priorityLoanDateEnd: moment().endOf('day').format('x'),
                    isPriorityLoanDate: 1,
                };
                this.ctrl.setValue(JSON.stringify(times));
            }


        }
        $(this.configDate.nativeElement).daterangepicker({
            startDate: priorityLoanDateStart
                && moment.unix(priorityLoanDateStart / 1000) || moment(new Date()).valueOf(), // 初始化时间兼容后退时间
            endDate: priorityLoanDateEnd && moment.unix(priorityLoanDateEnd / 1000) || moment(new Date()).valueOf(),
            opens: 'right',
            drops: this.position,
            alwaysShowCalendars: true,
            ranges: {
                '今天': [moment(), moment()],
                '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                '近7天': [moment().subtract(7, 'days'), moment()],
                '近30天': [moment().subtract(30, 'days'), moment()],
                '近90天': [moment().subtract(90, 'days'), moment()],
                '近180天': [moment().subtract(180, 'days'), moment()],
                '近365天': [moment().subtract(365, 'days'), moment()],
                '这个月': [moment().startOf('month'), moment().endOf('month')],
                '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            },
            locale: {
                customRangeLabel: '自定义日期',
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                format: 'YYYY-MM-DD',
                weekLabel: '周',
                daysOfWeek: ['日', '一', '二', '三', '四', '五', '六'],
                monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            }
        }, (start, end, label) => {
            const times = {
                priorityLoanDateStart: start.format('x'),
                priorityLoanDateEnd: end.format('x'),
                isPriorityLoanDate: 1,
            };
            this.toValue(times);
        });
    }
    toValue(times) {
        if (!this.configDate.nativeElement.value) {
            this.ctrl.setValue(0);
        } else {
            this.ctrl.setValue(JSON.stringify(times));
        }
    }
}
