Table.js
============

Table(options)

options:
	caption (String / Html) : show caption on the top of the table
	columns (Array) : each column option
		name (String) : the attrib name of the row model
		type (String) : the type of column, can be normal / input / button / etc.
		hide (Bool) : hide or not the column
		title (String) : if not offered. the name of the column will be used for the table head.
	render (Function(model, $td)) : if render function offered. discard neither column type nor other property except hide option, use custom render function and use custom event listener. 

events:
	buttonClick(columnModel, rowModel) : triggered when button was clicked.
	others due to the row render function...
