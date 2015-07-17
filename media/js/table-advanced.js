var TableAdvanced = function () {

    var initTable1 = function() {

        /* Formating function for row details */
        function fnFormatDetails ( oTable, nTr )
        {
            var aData = oTable.fnGetData( nTr );
            var sOut = '<div id="add-section" class="form-horizontal"><div class="controls" style="margin-left:0;"><label class="control-label" style="width:60px;">备注：</label></div><div><label class="control-label" style="width:460px;text-align: left;">'+aData[3]+'</label></div></div>';
            // var table = '<table id="add-item" width="100%">'+
            //                  '<tr class="form-horizontal"><td class="controls"><label class="control-label" style="width:60px;">价格：</label></td><td><input type="text" class="span1"></td>'+
            //                                 '<td class="control-group"><label class="control-label" style="width:60px;">级别：</label></td><td><div class="controls" style="margin-left:0;">'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option1"></span></div>'+
            //                                 '原厂件'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option2"></span></div>'+
            //                                 '品牌件'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span><input type="radio" name="optionsRadios1" value="option3"></span></div>'+
            //                                 '拆车件'+
            //                                 '</label>'+
            //                                 '</div></td>'+
            //                                 '<td class="control-group"><label class="control-label" style="width:60px;">质保：</label></td><td><div class="controls" style="margin-left:0;">'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option1"></span></div>'+
            //                                 '无质保'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option2"></span></div>'+
            //                                 '一个月'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span><input type="radio" name="optionsRadios1" value="option3"></span></div>'+
            //                                 '三个月'+
            //                                 '</label>'+
            //                                 '</div></td>'+
            //                                 '<td class="control-group"><label class="control-label" style="width:60px;">到货：</label></td><td><div class="controls" style="margin-left:0;">'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option1"></span></div>'+
            //                                 '现货'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option2"></span></div>'+
            //                                 '一天'+
            //                                 '</label>'+
            //                                 '<label class="radio">'+
            //                                 '<div class="radio"><span><input type="radio" name="optionsRadios1" value="option3"></span></div>'+
            //                                 '两天'+
            //                                 '</label>'+
            //                                 '</div></td>'+
            //                             '</tr></table>';
            return sOut;
        }

        /*
         * Insert a 'details' column to the table
         */
        var nCloneTh = document.createElement( 'th' );
        var nCloneTd = document.createElement( 'td' );
        nCloneTd.innerHTML = '<a class="btn mini green row-details"><i class="icon-bullhorn"></i> 报价</a>';
// <a href="#" class="btn mini red"><i class="icon-trash"></i> Delete Item</a>
        $('#sample_1 thead tr').each( function () {
            jQuery(nCloneTh).appendTo(this);
            //this.insertBefore( nCloneTh, this.childNodes[0] );
        } );

        $('#sample_1 tbody tr').each( function () {
            jQuery(nCloneTd.cloneNode( true )).appendTo(this);
            //this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
        } );

        /*
         * Initialse DataTables, with no sorting on the 'details' column
         */
        var oTable = $('#sample_1').dataTable( {
            "aoColumnDefs": [
                {"bSortable": false, "aTargets": [ 0,3,5,7] }
            ],
            "aaSorting": [[1, 'asc']],
             "aLengthMenu": [
                [10, 20, -1],
                [10, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 10,
        });

        jQuery('#sample_1_wrapper .dataTables_filter input').addClass("m-wrap small"); // modify table search input
        jQuery('#sample_1_wrapper .dataTables_length select').addClass("m-wrap small"); // modify table per page dropdown
        jQuery('#sample_1_wrapper .dataTables_length select').select2(); // initialzie select2 dropdown

        /* Add event listener for opening and closing details
         */
        $('#add-item label').on('click', function () {
            console.log("label");
            $(this).parent().find("span").removeClass('checked');
            $(this).find("span").addclass("checked");
        });

        /* Add event listener for opening and closing details
         * Note that the indicator for showing which row is open is not controlled by DataTables,
         * rather it is done here
         */
        $('#sample_1').on('click', ' tbody td .row-details', function () {
            var nTr = $(this).parents('tr')[0];
            if ( oTable.fnIsOpen(nTr) )
            {
                /* This row is already open - close it */
                //$(this).addClass("icon-plus-sign").removeClass("row-details-open");
                oTable.fnClose( nTr );
            }
            else
            {
                /* Open this row */
                //$(this).addClass("icon-minus-sign").removeClass("row-details-close");
                oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
                var table = '<table id="add-item" width="100%">'+
                                 '<tr class="form-horizontal"><td class="controls"><label class="control-label" style="width:60px;">价格：</label></td><td><input type="text" class="span1"></td>'+
                                                '<td class="control-group"><label class="control-label" style="width:60px;">级别：</label></td><td><div class="controls" style="margin-left:0;">'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option1"></span></div>'+
                                                '原厂件'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios1" value="option2"></span></div>'+
                                                '品牌件'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span><input type="radio" name="optionsRadios1" value="option3"></span></div>'+
                                                '拆车件'+
                                                '</label>'+
                                                '</div></td>'+
                                                '<td class="control-group"><label class="control-label" style="width:60px;">质保：</label></td><td><div class="controls" style="margin-left:0;">'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios2" value="option1"></span></div>'+
                                                '无质保'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios2" value="option2"></span></div>'+
                                                '一个月'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span><input type="radio" name="optionsRadios2" value="option3"></span></div>'+
                                                '三个月'+
                                                '</label>'+
                                                '</div></td>'+
                                                '<td class="control-group"><label class="control-label" style="width:60px;">到货：</label></td><td><div class="controls" style="margin-left:0;">'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios3" value="option1"></span></div>'+
                                                '现货'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span class=""><input type="radio" name="optionsRadios3" value="option2"></span></div>'+
                                                '一天'+
                                                '</label>'+
                                                '<label class="radio">'+
                                                '<div class="radio"><span><input type="radio" name="optionsRadios3" value="option3"></span></div>'+
                                                '两天'+
                                                '</label>'+
                                                '</div></td>'+
                                            '</tr></table>';
                jQuery(table).appendTo($('#add-section'));
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().dataTable) {
                return;
            }
            initTable1();
        }
    };
}();