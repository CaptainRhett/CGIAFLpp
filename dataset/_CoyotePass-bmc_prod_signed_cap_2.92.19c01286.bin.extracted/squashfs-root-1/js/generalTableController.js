"use strict";
var mRowSelected;
var mRowSelectable;

document.writeln("<script type='text/javascript' src='../js/general_table.js'></script>");

function GetSelectedRow() {
    "use strict";
	return mRowSelected;
}

function GetSelectedRowIndex() {
    "use strict";
	var result = 0;
	//console.log("mRowSelected:" + mRowSelected);
	if(mRowSelected != null) {
		result = mRowSelected.rowIndex;
	}
	return result;
}

function GetSelectedRowCellInnerHTML(cell_idx) {
    "use strict";
	var row = GetSelectedRow();
	var result = null;
	if(row != null && row.cells.length > cell_idx) {
		result = row.cells[cell_idx].innerHTML;
	}
	return result;
}

function SetRowSelectEnable(enable) {
    "use strict";
     mRowSelectable = enable;
}

function GetTableElement() {
    "use strict";
	return GTC.getElement('table',document);
}
