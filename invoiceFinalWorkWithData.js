  //START OF PART ONE & TWO
	  let start = params?.user_peek_start_date || moment().startOf("month").unix()
    let end =  params?.user_peek_last_date || moment().endOf("day").unix()
    
    //total amount of money for partial payment
    let partialPaymentSum = 0;
    //paid amount of money from partial payment 2.1
    let paidPartialPayment = 0;
    
    // total invoice sum amount 4.1
    let totalSum = 0;
    
    //invoice that have been paid
    let paidInvoices = [];

    //var for storing number of invoices in period 1.1-5
    data = {
        sent_invoices: 0,
        cancelled_invoices: 0,
        paid_invoices: 0,
        released_invoices: 0,
        part_paid_invoices: 0,
    }
    
    //filter invoices by type and time
    all_invoices = appwidget_invoices_list.$options.list_origin.filter(item => {
    
        let invoice_cond = item.field_5 == 'invoice' && item.field_3 != 'draft' && item.field_3 != 'reissued'
        let date_cond = item.creation_datetime_unix > moment(start).unix() && item.creation_datetime_unix < moment(end).unix(); 
        let employee_cond = !zfun.creatorCheckList.length ? true : zfun.creatorCheckList.indexOf(item.field_10_display) != -1 ? true : false
        
        return (invoice_cond && date_cond && employee_cond)
    });
    
    
    //get last status change of invoice
    all_invoices.forEach(item => {
        // last action made with invoice 
        item.lastAction = {};
        item.lastAction.time = 0;
        item.lastAction.type = "";
            
        for( i in item.field_19.history ) {
            //&& Number(item.field_19.history[i].time) > moment(start).unix() && Number(item.field_19.history[i].time) <  moment(end).unix()
            if( Number(item.field_19.history[i].time) > item.lastAction.time ){
                item.lastAction.time = Number(item.field_19.history[i].time);
                item.lastAction.type = item.field_19.history[i].type;
            } else if( item.field_19.history[i].type == "part_paid" ){
               paidPartialPayment += Number(item.field_19.history[i].transaction_amount)
           }
        }
    });
    
    all_invoices.forEach(item => {
        // types of actions that are done by user witnin the peeriod but invoice was created before the period
        item.actionInPeriod = {}
        item.actionInPeriod.time = 0;
        item.actionInPeriod.type = "";
        
        for( i in item.field_19.history ){
    
            if( Number(item.field_19.history[i].time) > moment(start).unix() && Number(item.field_19.history[i].time) < moment(end).unix() ){
                item.actionInPeriod.time = Number(item.field_19.history[i].time);
                item.actionInPeriod.type = item.field_19.history[i].type;
            }
        }
    });
    
    zfun.totalInvoicesInPeriod = 0;
    zfun.invoiceforAverage = 0;
    for( i in all_invoices ) {
        if( all_invoices[i].lastAction.type == "cancelled" ){
            data.cancelled_invoices++;
            totalSum += Number(all_invoices[i].field_468)
            zfun.totalInoicesInPeriod++
            zfun.invoiceforAverage++
        } else if( all_invoices[i].lastAction.type == "sent"){
            data.sent_invoices++;
            totalSum += Number(all_invoices[i].field_468)
            zfun.totalInoicesInPeriod++
            zfun.invoiceforAverage++
        } else if( all_invoices[i].lastAction.type == "part_paid" || all_invoices[i].lastAction.type == 'TRANSACTION_part_paid' ){
            data.part_paid_invoices++;
            partialPaymentSum += Number(all_invoices[i].field_468);
            totalSum += Number(all_invoices[i].field_468)
            zfun.totalInoicesInPeriod++
            zfun.invoiceforAverage++
        } else if( all_invoices[i].lastAction.type == "paid" || all_invoices[i].lastAction.type == "TRANSACTION_paid" ){
            data.paid_invoices++;
            totalSum += Number(all_invoices[i].field_468);
            paidInvoices.push(all_invoices[i]);
            zfun.totalInoicesInPeriod++
            zfun.invoiceforAverage++
        } else if ( all_invoices[i].lastAction.type == "released"){
            data.released_invoices++;
            zfun.totalInoicesInPeriod++;
        }
    }
    
    let partialPaymentInvoices = all_invoices.filter(item => {
        return item.field_3 == "part_paid";
    })
    
    zfun.partPaidInvoicesInPeriod = partialPaymentInvoices.length;
    
    partialPaymentInvoices.forEach(item => {
        for( i in item.field_19.history ){
            if( item.field_19.history[i].type == "part_paid" ) {
                paidPartialPayment += item.field_19.history[i].amount;
            }
        }
    })
    
     // END OF PART ONE & TWO 


    // START OF PART THREE 
    // var for storing invoices created before the given period of time
    let beforePeriodInvoices = appwidget_invoices_list.$options.list_origin.filter(item => {
        let invoice_cond = item.field_5 == 'invoice' && item.field_3 != 'draft' && item.field_3 != 'reissued';
        let date_cond = item.creation_datetime_unix < moment(start).unix() || item.creation_datetime_unix > moment(end).unix();
        let employee_cond = !zfun.creatorCheckList.length ? true : zfun.creatorCheckList.indexOf(item.field_10_display) != -1 ? true : false
        
        return ( invoice_cond && date_cond && employee_cond);
    });
    
    zfun.beforePeriodInvoicesInPeriod = beforePeriodInvoices.length;

    // var for storing count of actions made in period in invoices created created before the given time period 
    beforePeriodData = {
        sent_invoices: 0,
        part_paid_invoices: 0,
        paid_invoices: 0,
        cancelled_invoices: 0,
    }
    
    beforePeriodInvoices.forEach(item => {
        // types of actions that are done by user witnin the period but invoice was created before the period
        item.actionInPeriod = {}
        item.actionInPeriod.time = 0;
        item.actionInPeriod.type = "";
        
        for( i in item.field_19.history ){
    
            if( Number(item.field_19.history[i].time) > moment(start).unix() && Number(item.field_19.history[i].time) < moment(end).unix() ){
                item.actionInPeriod.time = Number(item.field_19.history[i].time);
                item.actionInPeriod.type = item.field_19.history[i].type;
            }
        }
    });
    
    beforePeriodInvoices.forEach(item => {
        if( item.actionInPeriod.type == "cancelled" ) {
            beforePeriodData.cancelled_invoices++;
        } else if( item.actionInPeriod.type == "sent" ) {
            beforePeriodData.sent_invoices++
        } else if( item.actionInPeriod.type == "part_paid" ){
            beforePeriodData.part_paid_invoices++;
        } else if( item.actionInPeriod.type == "paid" || item.actionInPeriod.type == "TRANSACTION_paid" ) {
            beforePeriodData.paid_invoices++;
        }
    });

    // END OF PART THREE
    
    
    // PART FORU START 
    
    // amount sum in draft invoices (4.6)
    zfun.draftSum = 0;
    
    // average arithmetic value of invoice sum 4.1
    zfun.averageArithmetic = Math.floor(totalSum/zfun.invoiceforAverage);
    
    // amount of view of invoices 4.2 
   $.get('/owners/analytics?jsonFilter[or][][action_name]=invoice_viewed', 
        ( ans ) => {
             //var to count amount of veiws for users invoices created within the period of time 4.2
            zfun.invoiceViewCounter = 0;
            
            all_invoices.forEach(item => {
                for( i in ans.rows ) {
                    let viewID = JSON.parse(ans.rows[i].f[4].v).profile_id;
                    if( item.profile_id == viewID ){
                        zfun.invoiceViewCounter++;
                    }
                }
            })
    
    //count diff between invoice release and paid dates 
    paidInvoices.forEach(item => {
        item.releaseDate = 0;
        
        for( i in item.field_19.history ) {
            if( item.field_19.history[i].type == "released"){
                let date = Number(item.field_19.history[i].time);
                item.releaseDate = moment(date*1000).format("YYYY MM DD");
            }
            
        }
        let properActionTime = moment(item.actionInPeriod.time *1000).format("YYYY MM DD");
        item.diffData = moment(properActionTime).diff(item.releaseDate, "days"); 
    });
    
    
    let dayCounter = 0;
    for( i in paidInvoices ){
        dayCounter += paidInvoices[i].diffData;
    }
    
    // average day diff 4.4
    zfun.dayDiffAvg = (dayCounter/paidInvoices.length).toFixed(1);

    
    // list of draft invoice created witnin the period 4.3
    zfun.draftInvoices = appwidget_invoices_list.$options.list_origin.filter(item => {
        let invoice_cond = item.field_5 == 'invoice' && item.field_3 == 'draft';
        let date_cond = item.creation_datetime_unix > moment(start).unix() && item.creation_datetime_unix < moment(end).unix(); 
        let employee_cond = !zfun.creatorCheckList.length ? true : zfun.creatorCheckList.indexOf(item.field_10_display) != -1 ? true : false
        
        return (invoice_cond && date_cond && employee_cond)
    });
    
    
    // 4.6
    zfun.draftInvoices.forEach(item => {
        zfun.draftSum += Number(item.field_468);
    })
    
    // average amount of views per one invoice 4.5
    zfun.invoiceViewPerInvoice = (zfun.invoiceViewCounter/zfun.invoiceforAverage).toFixed(1);
    
    
            
        // // unpaid amount of money from partial paymeny 2.2
        // unpaidPartialPayment = paidPartialPayment - paidPartialPayment;
            
        let dataFinal = {
            pie1Data : {},
            pie2Data : {},
            pie3Data : {},
            bar1Data : {},
            bar2Data : {},
        };
        
           dataFinal.pie1Data.released_invoices = data.released_invoices;
           dataFinal.pie1Data.sent_invoices = data.sent_invoices;
           dataFinal.pie1Data.cancelled_invoices = data.cancelled_invoices;
           dataFinal.pie1Data.part_paid_invoices = data.part_paid_invoices; 
           dataFinal.pie1Data.paid_invoices = data.paid_invoices;
         //   zfun.pie1Data = [ data.released_invoices, data.sent_invoices, data.cancelled_invoices, data.part_paid_invoices, data.paid_invoices ];
           dataFinal.pie2Data.paidPartialPayment = paidPartialPayment;
           dataFinal.pie2Data.unpaidPartialPayment = Math.floor(partialPaymentSum - paidPartialPayment);
         //   zfun.pie2Data = [ paidPartialPayment, unpaidPartialPayment ];
           dataFinal.pie3Data.sent_invoices = beforePeriodData.sent_invoices;
           dataFinal.pie3Data.part_paid_invoices = beforePeriodData.part_paid_invoices;
           dataFinal.pie3Data.paid_invoices = beforePeriodData.paid_invoices;
           dataFinal.pie3Data.cancelled_invoices = beforePeriodData.cancelled_invoices;
           
            dataFinal.bar1Data.created_invoices = all_invoices.length;
            dataFinal.bar1Data.released_invoices = data.released_invoices;
            dataFinal.bar1Data.sent_invoices = data.sent_invoices;
            dataFinal.bar1Data.part_paid_invoices = data.part_paid_invoices;
            dataFinal.bar1Data.paid_invoices = data.paid_invoices;
            dataFinal.bar1Data.cancelled_invoices = data.cancelled_invoices;
            
            dataFinal.bar2Data.sent_invoices = beforePeriodData.sent_invoices
            dataFinal.bar2Data.part_paid_invoices = beforePeriodData.part_paid_invoices;
            dataFinal.bar2Data.paid_invoices = beforePeriodData.paid_invoices;
            dataFinal.bar2Data.cancelled_invoices = beforePeriodData.cancelled_invoices
           
            params.callback(dataFinal);
            
            
        });

    // PART FOUR END
